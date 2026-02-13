import axiosInstance from './axios';
import { API } from './endpoints';

// Password Reset APIs
export const requestPasswordResetApi = async (email: string) => {
    try {
        const response = await axiosInstance.post(API.AUTH.REQUEST_PASSWORD_RESET, { email });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Request password reset failed' };
    }
};

export const resetPasswordApi = async (token: string, email: string, password: string, confirmPassword: string) => {
    try {
        const response = await axiosInstance.post(API.AUTH.RESET_PASSWORD(token), { 
            token,
            email, 
            password,
            confirmPassword
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Reset password failed' };
    }
};

// Email Verification APIs
export const sendVerificationEmailApi = async (email: string) => {
    try {
        const response = await axiosInstance.post(API.AUTH.SEND_VERIFICATION_EMAIL, { email });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Send verification email failed' };
    }
};

export const verifyEmailApi = async (token: string, email: string) => {
    try {
        const response = await axiosInstance.post(API.AUTH.VERIFY_EMAIL(token), { email });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Email verification failed' };
    }
};

// User Management APIs
export const getUsersApi = async (page: number = 1, limit: number = 10, search?: string, role?: string) => {
    try {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (search) params.append('search', search);
        if (role) params.append('role', role);
        
        const response = await axiosInstance.get(`${API.ADMIN.USERS}?${params.toString()}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Fetch users failed' };
    }
};

export const getUserDetailApi = async (id: string) => {
    try {
        const response = await axiosInstance.get(API.ADMIN.USER_DETAIL(id));
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Fetch user detail failed' };
    }
};

export const createUserApi = async (userData: FormData) => {
    try {
        const response = await axiosInstance.post(API.ADMIN.USER_CREATE, userData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Create user failed' };
    }
};

export const updateUserApi = async (id: string, userData: FormData) => {
    try {
        const response = await axiosInstance.put(API.ADMIN.USER_UPDATE(id), userData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Update user failed' };
    }
};

export const deleteUserApi = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API.ADMIN.USER_DELETE(id));
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Delete user failed' };
    }
};
