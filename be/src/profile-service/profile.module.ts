import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserModule } from 'src/user-service/user.module';
import { AuthModule } from 'src/auth-service/auth.module';
import { MinioService } from 'src/core/minio/minio.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), UserModule, AuthModule],
  controllers: [ProfileController],
  providers: [ProfileService, MinioService],
  exports: [ProfileService],
})
export class ProfileModule {}
