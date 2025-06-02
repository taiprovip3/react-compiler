import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MinioService } from "src/core/minio/minio.service";
import { Post } from "src/entities/post.entity";
import { PostImage } from "src/entities/post.image.entity";
import { Repository } from "typeorm";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(PostImage)
        private readonly postImageRepository: Repository<PostImage>,
        private readonly minioService: MinioService,
    ) {}

    async getUserPosts(userId: number): Promise<Post[]> {
        return this.postRepository.find({
            where: {
                owner: {
                    id: userId,
                }
            },
            relations: ['postImages'],
            order: {
                createdAt: 'DESC', // Sắp xếp mới nhất lên đầu (hoặc 'ASC' để ngược lại)
            }
        });
    }

    async updatePost(postId: number, updateDto: Partial<Post>): Promise<Post> {
        const post = await this.postRepository.findOne({ where: { id: postId } });
        if (!post) {
        throw new NotFoundException('Post not found');
        }

        Object.assign(post, updateDto);
        return this.postRepository.save(post);
    }

    async deletePost(postId: number): Promise<{ message: string }> {
        const result = await this.postRepository.delete(postId);
        if (result.affected === 0) {
        throw new NotFoundException('Post not found');
        }

        return { message: 'Post deleted successfully' };
    }

    async uploadThumbnailImage(postId: number, oldThumbnailUrl: string, file: Express.Multer.File): Promise<Post | null> {
        if (oldThumbnailUrl) {
            await this.minioService.deletePostImage(oldThumbnailUrl);
        }

        const newUrl = await this.minioService.uploadPostImage(file);
        await this.postRepository.update(postId, { thumbnailUrl: newUrl });

        return this.postRepository.findOne({ where: { id: postId } });
    }

    async uploadSubImages(postId: number, files: Express.Multer.File[]): Promise<PostImage[]> {
        const urls = await this.minioService.uploadMultipleFiles(files);

        const entities = urls.map((url, index) =>
            this.postImageRepository.create({
                post: { id: postId },
                description: `Sub image ${index + 1}`,
                imageUrl: url,
            }),
        );

        return await this.postImageRepository.save(entities);
    }
}