import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth-service/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/decorators/roles.decorator';
import { UpdateProfileDto } from 'src/user-service/dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { MinioService } from 'src/core/minio/minio.service';

@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly minioService: MinioService,
  ) {}

  @Get(':id')
  @Roles('ROLE_USER')
  getProfile(@Param('id') id: string) {
    const userId = Number(id);
    return this.profileService.getProfile(userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = Number(id);
    return this.profileService.updateProfile(userId, updateProfileDto);
  }

  @Post('avatar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/,
        })
        .addMaxSizeValidator({ maxSize: 2 * 1024 * 1024 }) // 2MB
        .build({ fileIsRequired: true }),
    )
    file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    const userId = user.id;
    return this.profileService.uploadAvatar(userId, file);
  }
}
