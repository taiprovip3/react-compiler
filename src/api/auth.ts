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