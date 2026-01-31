'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/_components/auth/ProtectedRoute';
import Card from '@/_components/ui/Card';
import Button from '@/_components/ui/Button';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/users/${userId}`, {
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch user');
      }

      setUser(result.user);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch user');
      console.error('Fetch user error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete user');
      }

      toast.success('User deleted successfully!');
      router.push('/admin/users');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
      console.error('Delete user error:', error);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading user details...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!user) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">User not found</p>
            <Link href="/admin/users">
              <Button variant="primary" className="mt-4">
                Back to Users
              </Button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link 
              href="/admin/users" 
              className="text-green-600 hover:text-green-700 flex items-center mb-4"
            >
              ← Back to Users
            </Link>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
                <p className="mt-2 text-gray-600">
                  User ID: <span className="font-mono text-sm">{userId}</span>
                </p>
              </div>
              <div className="flex space-x-3">
                <Link href={`/admin/users/${userId}/edit`}>
                  <Button variant="primary">
                    Edit User
                  </Button>
                </Link>
                <Button variant="secondary" onClick={handleDelete}>
                  Delete User
                </Button>
              </div>
            </div>
          </div>

          <Card>
            <div className="space-y-6">
              {/* Profile Image */}
              <div className="flex justify-center">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-green-600"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-green-600 flex items-center justify-center text-white text-4xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* User Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Full Name
                  </label>
                  <p className="text-lg text-gray-900">{user.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email Address
                  </label>
                  <p className="text-lg text-gray-900">{user.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Role
                  </label>
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                {user.phoneNumber && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Phone Number
                    </label>
                    <p className="text-lg text-gray-900">{user.phoneNumber}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Created At
                  </label>
                  <p className="text-lg text-gray-900">
                    {new Date(user.createdAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Last Updated
                  </label>
                  <p className="text-lg text-gray-900">
                    {new Date(user.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
