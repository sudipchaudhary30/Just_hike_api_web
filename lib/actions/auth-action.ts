"use server"
 
import { login, register } from "../api/auth";
import { setUserData, setAuthToken } from "../cookie";
import {
    requestPasswordResetApi,
    resetPasswordApi,
    sendVerificationEmailApi,
    verifyEmailApi,
    getUsersApi,
    getUserDetailApi,
    createUserApi,
    updateUserApi,
    deleteUserApi
} from "../api/auth.service";
 
 
export const handleRegister = async(fromData: any) => {
    try{
        //handle data from component from
        const result =  await register(fromData);
        //handle how to send data back to component
        if(result.success){
            return{
                success: true,
                message: "Registration successful",
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Registration failed"
        }
    }catch(err: Error | any){
        return {
            success: false, message: err.message || "Registration failed"
        }
    }
}
 
 
export const handleLogin = async(fromData: any) => {
    try{
        //handle data from component from
        console.log('handleLogin called with:', fromData);
        const result =  await login(fromData);
        console.log('Login API response:', result);
        
        //handle how to send data back to component
        if(result.success){
            console.log('Setting auth cookies...');
            await setAuthToken(result.token)
            await setUserData(result.data)
           
            return{
                success: true,
                message: "Login successful",
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Login failed"
        }
    }catch(err: Error | any){
        console.error('handleLogin error:', err);
        return {
            success: false, message: err.message || "Login failed"
        }
    }
}

// Password Reset Server Actions
export const handleRequestPasswordReset = async (email: string) => {
    try {
        const response = await requestPasswordResetApi(email);
        if (response.success || response.message) {
            return {
                success: true,
                message: response.message || 'Password reset email sent successfully'
            };
        }
        return { success: false, message: response.message || 'Request password reset failed' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Request password reset failed' };
    }
};

export const handleResetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await resetPasswordApi(token, newPassword);
        if (response.success || response.message) {
            return {
                success: true,
                message: response.message || 'Password has been reset successfully'
            };
        }
        return { success: false, message: response.message || 'Reset password failed' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Reset password failed' };
    }
};

// Email Verification Server Actions
export const handleSendVerificationEmail = async (email: string) => {
    try {
        const response = await sendVerificationEmailApi(email);
        if (response.success || response.message) {
            return {
                success: true,
                message: response.message || 'Verification email sent successfully'
            };
        }
        return { success: false, message: response.message || 'Send verification email failed' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Send verification email failed' };
    }
};

export const handleVerifyEmail = async (token: string, email: string) => {
    try {
        const response = await verifyEmailApi(token, email);
        if (response.success || response.message) {
            return {
                success: true,
                message: response.message || 'Email verified successfully'
            };
        }
        return { success: false, message: response.message || 'Email verification failed' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Email verification failed' };
    }
};

// User Management Server Actions
export const handleGetUsers = async (page: number = 1, limit: number = 10, search?: string, role?: string) => {
    try {
        const response = await getUsersApi(page, limit, search, role);
        if (response.success || response.users) {
            return {
                success: true,
                data: response
            };
        }
        return { success: false, message: response.message || 'Fetch users failed' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Fetch users failed' };
    }
};

export const handleGetUserDetail = async (id: string) => {
    try {
        const response = await getUserDetailApi(id);
        if (response.success || response.user) {
            return {
                success: true,
                data: response
            };
        }
        return { success: false, message: response.message || 'Fetch user detail failed' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Fetch user detail failed' };
    }
};

export const handleCreateUser = async (userData: FormData) => {
    try {
        const response = await createUserApi(userData);
        if (response.success || response.user) {
            return {
                success: true,
                message: response.message || 'User created successfully',
                data: response
            };
        }
        return { success: false, message: response.message || 'Create user failed' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Create user failed' };
    }
};

export const handleUpdateUser = async (id: string, userData: FormData) => {
    try {
        const response = await updateUserApi(id, userData);
        if (response.success || response.user) {
            return {
                success: true,
                message: response.message || 'User updated successfully',
                data: response
            };
        }
        return { success: false, message: response.message || 'Update user failed' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Update user failed' };
    }
};

export const handleDeleteUser = async (id: string) => {
    try {
        const response = await deleteUserApi(id);
        if (response.success || response.message) {
            return {
                success: true,
                message: response.message || 'User deleted successfully'
            };
        }
        return { success: false, message: response.message || 'Delete user failed' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Delete user failed' };
    }
};
 