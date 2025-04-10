import { UpdateUserProfile } from '../dto/update-profile.dto';
import { Profile } from '../types/Profiles';
import { User } from '../types/User';
import http from './http';

export const getUserData = async (userId: number): Promise<User> => {
  const response = await http.get(`/users/${userId}`);
  return response.data;
};

export const getUserProfile = async (): Promise<Profile> => {
  const response = await http.get('/users/profile');
  return response.data;
};

export const updateUserProfile = async (userId: number, data: UpdateUserProfile) => {
  const response = await http.patch(`/users/profile/${userId}`, data);
  return response.data;
};