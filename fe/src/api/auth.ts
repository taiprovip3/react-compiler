import { LoginResponse } from "../types/LoginResponse";
import { RegisterResponse } from "../types/RegisterResponse";
import http from "./http"



export const login = async (username: string, password: string): Promise<LoginResponse> => {
    const response = await http.post<LoginResponse>('/auth/login', {username, password});
    return response.data;
}

export const register = async (username: string, password: string): Promise<RegisterResponse> => {
    const response = await http.post<RegisterResponse>('/auth/register', {username, password});
    return response.data;
}

export const logout = async (): Promise<any> => {
    const response = await http.post('/auth/logout');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userId');
    console.log(response.data);
    return response.data;
}

export const verifyEmailToken = async (token: string) => {
    await http.get(`/auth/verify-email?token=${token}`);
}