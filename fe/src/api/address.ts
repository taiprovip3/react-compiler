import { Address } from "../types/Address";
import http from "./http";

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