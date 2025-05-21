import { Post } from "../types/Post"
import http from "./http"

export const getPosts = async (userId: number): Promise<Post[]> => {
    const response = await http.get<Post[]>(`/posts/${userId}`);
    return response.data;
}