import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth-service/auth.module';
import { Post } from 'src/entities/post.entity';
import { UserModule } from 'src/user-service/user.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostImage } from 'src/entities/post.image.entity';
import { MinioService } from 'src/core/minio/minio.service';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post, PostImage]),
        MulterModule.register({
            storage: multer.memoryStorage(),
        }),
        UserModule,
        AuthModule
    ],
    controllers: [PostController],
    providers: [PostService, MinioService],
    exports: [PostService],
})
export class PostModule {}