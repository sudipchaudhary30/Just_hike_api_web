'use server';

import { login, register } from '@/lib/api/auth';
import { cookies } from 'next/headers';

export async function handleLogin(formData: any) {
  try {
    const res = await login(formData);
    
    if (res.success && res.token) {
      // Store in cookies (reference approach)
      const cookieStore = await cookies();
      cookieStore.set('auth_token', res.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
      
      // Store user data
      cookieStore.set('user_data', JSON.stringify(res.data), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
       
      });
      
      return {
        success: true,
        data: res.data,
        message: 'Login successful'
      };
    }
    
    return { success: false, message: res.message || 'Login failed' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Login failed' };
  }
}

export async function handleRegister(registrationData: any) {
  try {
    const res = await register(registrationData);
    
    if (res.success && res.token) {
      // Store cookies on registration too
      const cookieStore = await cookies();
      cookieStore.set('auth_token', res.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      });
      
      cookieStore.set('user_data', JSON.stringify(res.data), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      });
      
      return {
        success: true,
        data: res.data,
        message: 'Registration successful'
      };
    }
    
    return { success: false, message: res.message || 'Registration failed' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Registration failed' };
  }
}