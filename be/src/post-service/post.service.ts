import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "src/entities/post.entity";
import { Repository } from "typeorm";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
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
}