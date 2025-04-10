// common.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MinioService } from './minio/minio.service';

@Module({
  imports: [ConfigModule], // <-- Quan trọng!
  providers: [MinioService],
  exports: [MinioService],
})
export class CoreModule {}
