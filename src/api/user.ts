import { Profile } from '../types/Profiles';
import http from './http';

export const getUserProfile = async (): Promise<Profile> => {
  const response = await http.get('/profiles/');
  return response.data;
};

export const updateUserProfile = async (data: { name: string; email: string }) => {
  const response = await http.put('/profiles/', data);
  return response.data;
};