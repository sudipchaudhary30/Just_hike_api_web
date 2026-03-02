'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { getAuthHeaders } from '@/lib/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
  profilePicture?: string | null;
  createdAt: string;
}

interface UserTableProps {
  initialUsers?: User[];
}

export default function UserTable({ initialUsers = [] }: UserTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';

  const getFullImageUrl = (url?: string | null) => {
    if (!url) return null;
    const normalizedUrl = url.trim().replace(/\\/g, '/');
    const doubleBase = `${API_BASE_URL}/${API_BASE_URL}`;
    const uploadsIndex = normalizedUrl.indexOf('/uploads/');

    if (normalizedUrl.startsWith(doubleBase)) {
      return normalizedUrl.replace(`${API_BASE_URL}/`, '');
    }

    if (normalizedUrl.startsWith('http://') || normalizedUrl.startsWith('https://')) {
      return normalizedUrl;
    }

    if (normalizedUrl.startsWith('/public/uploads/')) {
      return `${API_BASE_URL}${normalizedUrl.replace('/public', '')}`;
    }

    if (normalizedUrl.startsWith('/uploads/')) {
      return `${API_BASE_URL}${normalizedUrl}`;
    }

    if (normalizedUrl.startsWith('uploads/')) {
      return `${API_BASE_URL}/${normalizedUrl}`;
    }

    if (uploadsIndex !== -1) {
      return `${API_BASE_URL}${normalizedUrl.slice(uploadsIndex)}`;
    }

    return `${API_BASE_URL}/${normalizedUrl.replace(/^\/+/, '')}`;
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page: number) => {
    try {
      setIsLoading(true);
      const headers = getAuthHeaders();
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`/api/admin/users?page=${page}&limit=10`, {
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        credentials: 'include',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch users');
      }

      setUsers(result.users);
      setTotalPages(result.pagination.totalPages);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        toast.error('Request timed out. Please try again.');
      } else {
        toast.error(error.message || 'Failed to fetch users');
      }
      console.error('Fetch users error:', error);
      setUsers([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const headers = getAuthHeaders();
      
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete user');
      }

      toast.success('User deleted successfully!');
      fetchUsers(currentPage);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
      console.error('Delete user error:', error);
    }
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="text-center">
          <div className="inline-flex animate-spin h-16 w-16 text-[#45D1C1] mb-4">
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-lg font-medium">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.image || user.profilePicture ? (
                        <img
                          src={getFullImageUrl(user.image || user.profilePicture) || undefined}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-[#45D1C1] flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </div>
                    </div>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => router.push(`/admin/users/${user.id}`)}
                      className="inline-block px-3 py-1 bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] text-white rounded font-semibold hover:opacity-90 transition mr-2"
                    >
                      View
                    </button>
                    <button
                      onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                      className="inline-block px-3 py-1 bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] text-white rounded font-semibold hover:opacity-90 transition mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="inline-block px-3 py-1 bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] text-white rounded font-semibold hover:opacity-90 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
