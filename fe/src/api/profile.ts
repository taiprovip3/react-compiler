import { UpdateUserProfile } from "../dto/update-profile.dto";
import { Profile } from "../types/Profiles";
import http from "./http";

export const getUserProfile = async (userId: number): Promise<Profile> => {
    const response = await http.get(`/profiles/${userId}`);
    return response.data;
};
  
export const updateUserProfile = async (userId: number, updateUserProfile: UpdateUserProfile) => {
    const response = await http.patch(`/profiles/${userId}`, updateUserProfile);
    return response.data;
};
  
export const uploadAvatar = async (formData: FormData) => {
    return await http.post('/profiles/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}