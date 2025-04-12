import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { GetUser } from 'src/decorators/get-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from 'src/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from 'src/core/minio/minio.service';
import { JwtAuthGuard } from 'src/auth-service/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth-service/guards/roles.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly minioService: MinioService,
  ) {}

  @Get('admin')
  @Roles('ROLE_ADMIN')
  getAdminData() {
    return { message: 'This is admin data' };
  }

  @Get('profile/:id')
  @Roles('ROLE_USER')
  getProfile(@Param('id') id: string) {
    const userId = Number(id);
    return this.userService.getProfile(userId);
  }

  @Patch('profile/:id')
  @UseGuards(AuthGuard('jwt'))
  updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    console.log('updateProfileDto=', updateProfileDto);
    const userId = Number(id);
    return this.userService.updateProfile(userId, updateProfileDto);
  }

  @Patch('change-password')
  @UseGuards(AuthGuard('jwt'))
  changePassword(
    @GetUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(user.id, changePasswordDto);
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
    const avatarUrl = await this.minioService.uploadAvatar(file);
    await this.userService.updateAvatar(user.id, avatarUrl);
    return {
      message: 'Cập nhật avatar thành công',
      avatar: avatarUrl,
    };
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
