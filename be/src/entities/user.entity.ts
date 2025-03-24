import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Token } from "./token.entity";
import { Authority } from "./authority.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ unique: true })
    username: string;
    @Column({ unique: true })
    email: string;
    @OneToMany(() => Token, (token) => token.user, { cascade: true })
    tokens: Token[];
    @Column({ name: "is_disabled", default: false })
    isDisabled: boolean;
    @ManyToMany(() => Authority, (authority) => authority.users, { eager: true })
    @JoinTable({
        name: "users_authorities",
        joinColumn: { name: "user_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "authority_id", referencedColumnName: "id" },
    })
    authorities: Authority[];
    @Column({ name: "account_non_expired", default: true })
    accountNonExpired: boolean;
    @Column({ name: "credentials_non_expired", default: true })
    credentialsNonExpired: boolean;
    @Column({ name: "account_non_locked", default: true })
    accountNonLocked: boolean;
    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    createdAt: Date;
    @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
    updatedAt: Date;
}