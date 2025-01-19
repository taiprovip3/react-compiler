import http from "./http"

export const login: any = async (username: string, password: string) => {
    const response = await http.post('/auth/login', {username, password});
    return response.data;
}

export const register: any = async (username: string, password: string) => {
    const response = await http.post('/auth/register', {username, password});
    return response.data;
}