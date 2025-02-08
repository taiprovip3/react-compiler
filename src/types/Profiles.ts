import { Address } from "./Address";
import { User } from "./User";

export interface Profile {
    id: number;
    fullName?: string;
    phoneNumber?: string;
    phoneCode: string;
    gender?: string;
    dateOfBirth?: string;
    balance: number;
    createdAt: string;
    updatedAt: string;
    defaultAddress?: string;
    avatar: string;
    addresses: Address[];
    user: User;
}