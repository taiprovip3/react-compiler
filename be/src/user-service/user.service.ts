import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Authority } from 'src/entities/authority.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from 'src/entities/profile.entity';
import { MinioService } from 'src/core/minio/minio.service';
import { AuthService } from 'src/auth-service/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Authority)
    private authorityRepository: Repository<Authority>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    private minioService: MinioService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findById(userId: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id: userId });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = new User();
    user.username = createUserDto.username;
    user.password = hashedPassword;
    user.email = createUserDto.email ?? '';
    const authority = await this.authorityRepository.findOne({
      where: { authority: 'ROLE_USER' },
    });
    user.authorities = authority ? [authority] : [];
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
  }

  async findOneByEmailVerificationToken(token: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { emailVerificationToken: token },
    });
  }

  async verifyUserEmail(user: User): Promise<User> {
    user.isEmailVerified = true;
    user.emailVerificationToken = '';
    return await this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    // Hàm tào lao, làm gì có TH nào update mà chỉ update những field trong updateUserDto.
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async save(user: User) {
    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const { currentPassword, newPassword, confirmNewPassword } = dto;

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('Mật khẩu mới không trùng khớp');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('Người dùng không tồn tại');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new BadRequestException('Mật khẩu hiện tại không đúng');

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await this.userRepository.save(user);

    return { message: 'Đổi mật khẩu thành công' };
  }

  async getProfile(userId: number): Promise<Profile> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return user.profile;
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // TH1: ko sendVerification + giữ nguyên email - ko làm gì cả
    // TH2: ko sendVerification + change email -> tiến hành update mail *
    // TH3: sendVerification + giữ nguyên email -> tiến hành sendmail
    // TH4: sendVerification + change email -> tiến hành update mail + sendmail *
    // TH5: isVerification = true; -> ko làm gì cả
    if (user.isEmailVerified) {
      // ko làm gì cả
    }
    if (!user.isEmailVerified && updateProfileDto.email !== user.email) {
      // Nếu account chưa verified email và user đổi email so với trước đó
      user.email = updateProfileDto.email ?? user.email;
      await this.userRepository.save(user);
      if (updateProfileDto.sendVerification) {
        // Nếu user muốn verify email
        // send email verification function here...
        console.log(
          `1. We sent an email verification to ${updateProfileDto.email}. Please check!`,
        );
        this.authService.sendEmailVerification(userId, user.email);
      }
    } else {
      // Nếu account chưa verify và email ko change -> nhưng check verify
      if (updateProfileDto.sendVerification) {
        // Nếu user muốn verify email
        // send email verification function here...
        console.log(
          `2. We sent an email verification to ${updateProfileDto.email}. Please check!`,
        );
        this.authService.sendEmailVerification(userId, user.email);
      }
    }

    let profile = user.profile;
    if (!user.profile) {
      profile = this.profileRepository.create({
        balance: 0, // hoặc để mặc định trong entity
      });
    }

    profile.fullname = updateProfileDto.fullname ?? profile.fullname;
    profile.phoneNumber = updateProfileDto.phoneNumber ?? profile.phoneNumber;
    profile.gender = updateProfileDto.gender ?? profile.gender;
    profile.dateOfBirth = updateProfileDto.dateOfBirth
      ? new Date(updateProfileDto.dateOfBirth)
      : profile.dateOfBirth;

    await this.profileRepository.save(profile);
    return {
      message: 'Cập nhật hồ sơ thành công',
      profile,
    };
  }

  async updateAvatar(userId: number, avatarUrl: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user) throw new NotFoundException('User không tồn tại!');

    let profile = user.profile;
    if (!profile) {
      profile = this.profileRepository.create({ user });
    } else {
      if (profile.avatar && !profile.avatar.includes('icons8.com')) {
        await this.minioService.deleteAvatarByUrl(profile.avatar);
      }
    }

    profile.avatar = avatarUrl;
    await this.profileRepository.save(profile);
  }
}
