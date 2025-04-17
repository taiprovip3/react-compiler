import { ChangePasswordDto } from '../dto/change-password.dto';
import { Address } from '../types/Address';
import { User } from '../types/User';
import http from './http';

export const changePassword = async (changePasswordDto: ChangePasswordDto) => {
  const response = await http.patch('/users/change-password', changePasswordDto);
  return response.data;
}

export const getUserData = async (userId: number): Promise<User> => {
  const response = await http.get(`/users/${userId}`);
  return response.data;
};