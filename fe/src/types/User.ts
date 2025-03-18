import { Authority } from "./Authority";
import { Token } from "./Token";

export interface User {
    id: number;
    username: string;
    email?: string;
    tokens: Token[];
    isDisabled: boolean;
    enabled: boolean;
    authorities: Authority[];
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;
    accountNonLocked: boolean;
}