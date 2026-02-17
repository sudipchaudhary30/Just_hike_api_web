'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/_components/auth/ProtectedRoute';
import Card from '@/_components/ui/Card';
import ProfileUpdateForm from '@/_components/forms/ProfileUpdateForm';
import { useAuth } from '@/_components/auth/AuthProvider';

export default function UserProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.role === 'admin';
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    const savedLogo = localStorage.getItem('admin_logo');
    if (savedLogo) {
      setLogoUrl(savedLogo);
    }
  }, [isAdmin]);

  const content = (
    <div className="bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-2 text-gray-600">
              Update your personal information and profile picture
            </p>
          </div>
          <Link
            href={isAdmin ? '/admin/dashboard' : '/dashboard'}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#45D1C1] hover:bg-[#3BC1B1] transition-colors"
          >
            Back
          </Link>
        </div>

        <Card>
          <ProfileUpdateForm />
        </Card>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {content}
      </div>
    </ProtectedRoute>
  );
}
