export interface LoginResponse {
    isLogged: boolean;
    role: "USER" | "ADMIN" | "MANAGER";
    accessToken: string;
    refreshToken: string;
}