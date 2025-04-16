import { UpdateUserProfile } from '../dto/update-profile.dto';
import { Address } from '../types/Address';
import { Profile } from '../types/Profiles';
import { User } from '../types/User';
import http from './http';

export const getUserData = async (userId: number): Promise<User> => {
  const response = await http.get(`/users/${userId}`);
  return response.data;
};

export const getUserProfile = async (userId: number): Promise<Profile> => {
  const response = await http.get(`/users/profile/${userId}`);
  return response.data;
};

export const updateUserProfile = async (userId: number, updateUserProfile: UpdateUserProfile) => {
  const response = await http.patch(`/users/profile/${userId}`, updateUserProfile);
  return response.data;
};

export const uploadAvatar = async (formData: FormData) => {
  return await http.post('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export const getUserAddesses = async () => {
  const response = await http.get('/addresses/my');
  return response.data;
}

export const createAddress = async (address: Address) => {
  const response = await http.post('/addresses', address);
  return response.data;
}

export const updateAddress = async (addressId: number, address: Address) => {
  const response = await http.put(`/addresses/${addressId}`, address);
  return response.data;
}

export const deleteAddress = async (addressId: number) => {
  const response = await http.delete(`/addresses/${addressId}`);
  return response.data;
}