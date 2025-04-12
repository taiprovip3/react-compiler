import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { Authority } from 'src/entities/authority.entity';
import { Profile } from 'src/entities/profile.entity';
import { MinioService } from 'src/core/minio/minio.service';
import { AuthService } from 'src/auth-service/auth.service';
import { AuthModule } from 'src/auth-service/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Authority, Profile]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, MinioService],
  exports: [UserService],
})
export class UserModule {}
