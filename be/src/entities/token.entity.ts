import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum TokenType {
  ACCESS = 'Access Token',
  REFRESH = 'Refresh Token',
}

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'enum', enum: TokenType })
  type: TokenType;
  @Column({ type: 'text' })
  value: string;
  @CreateDateColumn({ name: 'expiry_date', type: 'timestamp', nullable: true })
  expiryDate: Date;
  @Column({ type: 'boolean', default: false })
  disabled: boolean;
  @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
