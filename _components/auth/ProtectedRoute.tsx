'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/_components/auth/AuthProvider';
import { toast } from 'react-hot-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast.error('Please login to access this page');
        router.push('/auth/login');
      } else if (requireAdmin && user?.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.');
        router.push('/admin/login');
      }
    }
  }, [isAuthenticated, isLoading, user, requireAdmin, router]);

  // Add timeout fallback in case loading takes too long
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.error('[ProtectedRoute] Loading timeout - forcing check');
        if (!isAuthenticated) {
          router.push('/auth/login');
        }
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}
