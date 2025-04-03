import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { User } from './user.entity';

export enum GenderType {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Others',
}

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  fullname: string;
  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;
  @Column({ name: 'phone_code', default: '+84' })
  phoneCode: string;
  @Column({ type: 'enum', enum: GenderType })
  gender: GenderType;
  @Column({ name: 'date_of_birth', type: 'timestamp', nullable: true })
  dateOfBirth: Date;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;
  @Column({ name: 'default_address', type: 'text', nullable: true })
  defaultAddress: string;
  @Column({
    default:
      'https://img.icons8.com/?size=100&id=81139&format=png&color=000000',
  })
  avatar: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Address, (address) => address.profile, { cascade: true })
  addresses: Address[];
  @OneToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
