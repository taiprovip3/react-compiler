import {
  BadRequestException,
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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Authority)
    private authorityRepository: Repository<Authority>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
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
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
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

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    let profile = user.profile;

    if (!user.profile) {
      console.info(`User ${user.username} has no profile yet. Created one..!`);
      profile = this.profileRepository.create({
        user: user,
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
}
