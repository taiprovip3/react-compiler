import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { CategoryType } from "src/enums/category.enum";
import { PostImage } from "./post.image.entity";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    title: string;
    @Column({ type: 'text' })
    description: string;
    @Column({ type: 'enum', enum: CategoryType, nullable: true })
    category: CategoryType;
    @Column({ name: 'thumbnail_url' })
    thumbnailUrl: string;
    images: string[];
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;
    @Column({ name: 'views_count' })
    viewsCount: number;
    @Column({ name: 'is_active', default: true })
    isActive: boolean;
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
    @ManyToOne(() => User, (user) => user.posts, { eager: true })
    @JoinColumn({ name: 'user_id' })
    owner: User;
    @OneToMany(() => PostImage, (postImage) => postImage.post)
    postImages: PostImage[];
}