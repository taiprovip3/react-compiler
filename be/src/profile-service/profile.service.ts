import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth-service/auth.service';
import { MinioService } from 'src/core/minio/minio.service';
import { Profile } from 'src/entities/profile.entity';
import { UpdateProfileDto } from 'src/user-service/dto/update-profile.dto';
import { UserService } from 'src/user-service/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly minioService: MinioService,
  ) {}

  async getProfile(userId: number): Promise<Profile> {
    return this.userService.getProfile(userId);
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.userService.findById(userId);
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
      await this.userService.save(user);
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
    profile.defaultAddress =
      updateProfileDto.defaultAddress ?? profile.defaultAddress;
    profile.user = user;
    await this.profileRepository.save(profile);
    return {
      message: 'Cập nhật hồ sơ thành công',
      profile,
    };
  }

  async updateAvatar(userId: number, avatarUrl: string): Promise<void> {
    const user = await this.userService.findById(userId);
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

  async uploadAvatar(userId: number, file: Express.Multer.File) {
    const avatarUrl = await this.minioService.uploadAvatar(file);
    await this.updateAvatar(userId, avatarUrl);
    return {
      message: 'Cập nhật avatar thành công',
      avatar_url: avatarUrl,
    };
  }
}
