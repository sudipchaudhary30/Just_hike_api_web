import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: string;
    [key: string]: any;
  };
}

/**
 * Middleware to check if the user is authenticated and has admin role
 * @param request - The incoming request
 * @returns The user object if authenticated and admin, otherwise throws an error
 */
export async function requireAdmin(request: NextRequest): Promise<any> {
  try {
    // Try to get token from multiple sources
    let token = '';
    
    // 1. Check Authorization header first (Bearer token)
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove "Bearer " prefix
      console.log('[requireAdmin] Token found in Authorization header');
    }
    
    // 2. Fall back to cookies
    if (!token) {
      const cookieStore = cookies();
      token = cookieStore.get('auth_token')?.value || '';
      if (token) {
        console.log('[requireAdmin] Token found in cookies');
      }
    }
    
    if (!token) {
      console.error('[requireAdmin] No token found in headers or cookies');
      return {
        error: 'Unauthorized: No authentication token found',
        status: 401
      };
    }

    // Decode and verify the token (fallback to cookie user_data if needed)
    let user = await verifyToken(token);
    if (!user) {
      const cookieStore = cookies();
      const userData = cookieStore.get('user_data')?.value;
      if (userData) {
        try {
          user = JSON.parse(userData);
        } catch {
          user = null;
        }
      }
    }

    if (!user) {
      return {
        error: 'Unauthorized: Invalid token',
        status: 401
      };
    }

    // Check if user has admin role
    if (user.role !== 'admin') {
      return {
        error: 'Forbidden: Admin access required',
        status: 403
      };
    }

    return { user };
  } catch (error: any) {
    console.error('[requireAdmin] Error:', error.message);
    return {
      error: error.message || 'Authentication failed',
      status: 401
    };
  }
}

/**
 * Verify JWT token and return user data
 * Replace this with your actual JWT verification logic
 */
async function verifyToken(token: string): Promise<any> {
  try {
    // This is a placeholder. You should implement your actual JWT verification here
    // For example, using jsonwebtoken library:
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // return decoded;

    // Decode JWT payload (base64url) without verification for now
    const parts = token.split('.');
    if (parts.length < 2) {
      return null;
    }

    const payload = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const padded = payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, '=');
    const decodedJson = Buffer.from(padded, 'base64').toString('utf-8');
    const decoded = JSON.parse(decodedJson);

    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Middleware to check if the user is authenticated (for non-admin routes)
 * @param request - The incoming request
 * @returns The user object if authenticated, otherwise throws an error
 */
export async function requireAuth(request: NextRequest): Promise<any> {
  try {
    // Try to get token from multiple sources
    let token = '';
    
    // 1. Check Authorization header first (Bearer token)
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove "Bearer " prefix
      console.log('[requireAuth] Token found in Authorization header');
    }
    
    // 2. Fall back to cookies
    if (!token) {
      const cookieStore = cookies();
      token = cookieStore.get('auth_token')?.value || '';
      if (token) {
        console.log('[requireAuth] Token found in cookies');
      }
    }
    
    if (!token) {
      console.error('[requireAuth] No token found in headers or cookies');
      return {
        error: 'Unauthorized: No authentication token found',
        status: 401
      };
    }

    let user = await verifyToken(token);
    if (!user) {
      const cookieStore = cookies();
      const userData = cookieStore.get('user_data')?.value;
      if (userData) {
        try {
          user = JSON.parse(userData);
        } catch {
          user = null;
        }
      }
    }

    if (!user) {
      return {
        error: 'Unauthorized: Invalid token',
        status: 401
      };
    }

    return { user };
  } catch (error: any) {
    return {
      error: error.message || 'Authentication failed',
      status: 401
    };
  }
}
