import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    fullname: string;
    @Column({ name: "phone_number" })
    phoneNumber: string;
    @Column({ name: "country_code", default: "+84" })
    countryCode: string;
    @Column({ type: "text" })
    address: string;
    @ManyToOne(() => Profile, (profile) => profile.addresses, {onDelete: "CASCADE"})
    @JoinColumn({ name: "profile_id" })
    profile: Profile;
}