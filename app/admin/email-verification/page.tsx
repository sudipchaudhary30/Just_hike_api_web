'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/_components/auth/ProtectedRoute';
import Card from '@/_components/ui/Card';
import Button from '@/_components/ui/Button';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { getAuthHeaders } from '@/lib/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
}

export default function AdminEmailVerificationPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, filter]);

  const fetchUsers = async (page: number) => {
    try {
      setIsLoading(true);
      const headers = getAuthHeaders();
      
      let url = `/api/admin/users?page=${page}&limit=10`;
      if (filter === 'verified') {
        url += '&verified=true';
      } else if (filter === 'unverified') {
        url += '&verified=false';
      }

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch users');
      }

      // Filter users based on verification status (client-side filtering for now)
      let filteredUsers = result.users;
      if (filter === 'verified') {
        filteredUsers = result.users.filter((u: User) => u.emailVerified);
      } else if (filter === 'unverified') {
        filteredUsers = result.users.filter((u: User) => !u.emailVerified);
      }

      setUsers(filteredUsers);
      setTotalPages(result.pagination.totalPages);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch users');
      console.error('Fetch users error:', error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async (email: string) => {
    try {
      const response = await fetch('/api/auth/send-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send verification email');
      }

      toast.success('Verification email sent!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send verification email');
      console.error('Resend verification error:', error);
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link 
              href="/admin/dashboard" 
              className="text-green-600 hover:text-green-700 flex items-center mb-4"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Email Verification Management</h1>
            <p className="mt-2 text-gray-600">
              Manage user email verification status
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex gap-3">
            <button
              onClick={() => {
                setFilter('all');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-green-600'
              }`}
            >
              All Users
            </button>
            <button
              onClick={() => {
                setFilter('verified');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'verified'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-green-600'
              }`}
            >
              Verified
            </button>
            <button
              onClick={() => {
                setFilter('unverified');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'unverified'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-green-600'
              }`}
            >
              Unverified
            </button>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
                <p className="mt-4 text-gray-600">Loading users...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Verification Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.role === 'admin'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.emailVerified
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {user.emailVerified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            {!user.emailVerified && (
                              <button
                                onClick={() => handleResendVerification(user.email)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Resend
                              </button>
                            )}
                            <Link
                              href={`/admin/users/${user.id}`}
                              className="text-green-600 hover:text-green-900"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-6">
                  <Button
                    variant="secondary"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
