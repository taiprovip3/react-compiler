import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const http = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
    timeout: 10000,
});

http.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('Server return 401-Unauthorized!'); // Tự xử lý khi không được phép (401)
        }
        return Promise.reject(error);
    }
);

export default http;