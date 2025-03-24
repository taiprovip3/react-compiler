import { Column, Entity, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Authority {
    @PrimaryGeneratedColumn()
    id: Number;
    @Column({ unique: true })
    authority: string;
    @ManyToMany(() => User, (user) => user.authorities)
    users: User[];
}