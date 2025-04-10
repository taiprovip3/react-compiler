import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Token } from './token.entity';
import { Authority } from './authority.entity';
import { Exclude } from 'class-transformer';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  username: string;
  @Column({ unique: true, nullable: true })
  email: string;
  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;
  @Column()
  @Exclude()
  password: string;
  @OneToMany(() => Token, (token) => token.user, { cascade: true })
  tokens: Token[];
  @Column({ name: 'is_disabled', default: false })
  isDisabled: boolean;
  @ManyToMany(() => Authority, (authority) => authority.users, { eager: true })
  @JoinTable({
    name: 'users_authorities',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'authority_id', referencedColumnName: 'id' },
  })
  authorities: Authority[];
  @Column({ name: 'account_non_expired', default: true })
  accountNonExpired: boolean;
  @Column({ name: 'credentials_non_expired', default: true })
  credentialsNonExpired: boolean;
  @Column({ name: 'account_non_locked', default: true })
  accountNonLocked: boolean;
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;
}
