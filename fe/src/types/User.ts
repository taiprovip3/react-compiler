import { Authority } from "./Authority";
import { Profile } from "./Profiles";
import { Token } from "./Token";

export interface User {
    id: number;
    username: string;
    email?: string;
    isEmailVerified: boolean;
    password: string;
    tokens: Token[];
    isDisabled: boolean;
    enabled: boolean;
    authorities: Authority[];
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;
    accountNonLocked: boolean;
    profile: Profile;
}