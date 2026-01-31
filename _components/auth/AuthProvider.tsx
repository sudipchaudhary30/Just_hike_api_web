'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  profilePicture?: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Try to get user from localStorage
      const storedUser = localStorage.getItem('user_data');
      const storedToken = localStorage.getItem('auth_token');
      
      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);

        // Basic validation for user id (MongoDB ObjectId: 24 hex chars)
        const idIsValid = typeof parsedUser?.id === 'string' && /^[a-fA-F0-9]{24}$/.test(parsedUser.id);

        if (!idIsValid) {
          localStorage.removeItem('user_data');
          localStorage.removeItem('auth_token');
          setUser(null);
        } else {
          // Validate token (you might want to add actual validation)
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      // Clear invalid data
      localStorage.removeItem('user_data');
      localStorage.removeItem('auth_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const contentType = response.headers.get('content-type') || '';
      let data: any = null;
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Login failed: ${text || 'Unexpected response from server'}`);
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store user data and token
      setUser(data.data);
      const token = data.token;
      
      // Store in localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(data.data));
      
      console.log('[Auth] Login successful - Token stored:', token.substring(0, 20) + '...');
      
      // Set cookies via API
      await fetch('/api/auth/set-cookies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: data.token,
          userData: data.data
        }),
      });

      toast.success('Welcome back!');
      return true;
      
    } catch (error: any) {
      console.error('[Auth] Login failed:', error);
      toast.error(error.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
      
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const contentType = response.headers.get('content-type') || '';
      let data: any = null;
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Registration failed: ${text || 'Unexpected response from server'}`);
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store user data
      setUser(data.data);
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.data));
      
      // Set cookies via API
      await fetch('/api/auth/set-cookies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: data.token,
          userData: data.data
        }),
      });

      toast.success('Account created successfully!');
      return true;
      
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      
      // Clear state
      setUser(null);
      
      // Clear cookies via API
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
    
    // Update localStorage
    if (user) {
      const updatedUser = { ...user, ...userData };
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}