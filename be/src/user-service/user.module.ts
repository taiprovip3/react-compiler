import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { Authority } from 'src/entities/authority.entity';
import { Profile } from 'src/entities/profile.entity';
import { MinioService } from 'src/core/minio/minio.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Authority, Profile])],
  controllers: [UserController],
  providers: [UserService, MinioService],
  exports: [UserService],
})
export class UserModule {}
