import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth-service/auth.module';
import { Post } from 'src/entities/post.entity';
import { UserModule } from 'src/user-service/user.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
    imports: [TypeOrmModule.forFeature([Post]), UserModule, AuthModule],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService],
})
export class PostModule {}