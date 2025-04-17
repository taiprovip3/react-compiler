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
import { Profile } from 'src/entities/profile.entity';
import { AuthService } from 'src/auth-service/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Authority)
    private authorityRepository: Repository<Authority>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findById(userId: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });
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

    // 1. So sánh mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new BadRequestException('Mật khẩu hiện tại không đúng');

    // 2. Không cho phép dùng lại mật khẩu hiện tại
    const isSameAsCurrent = await bcrypt.compare(newPassword, user.password);
    if (isSameAsCurrent) {
      throw new BadRequestException('Mật khẩu phải khác với mật khẩu hiện tại');
    }

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
}
