import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";

@Entity()
export class PostImage {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    imageUrl: string;
    @Column()
    description: string;
    @ManyToOne(() => Post, (post) => post.postImages)
    @JoinColumn({ name: 'post_id' })
    post: Post;
}