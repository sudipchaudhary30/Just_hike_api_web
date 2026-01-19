import axios from './axios';
import { API } from './endpoints';

export const login = async (loginData: any) => {
  try {
    const response = await axios.post(API.AUTH.LOGIN, loginData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Login failed'
    );
  }
};

export const register = async (registrationData: any) => {
  try {
    const response = await axios.post(API.AUTH.REGISTER, registrationData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Registration failed'
    );
  }
};