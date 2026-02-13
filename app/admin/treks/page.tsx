'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/_components/auth/ProtectedRoute';
interface TrekAdminListItem {
  id: string;
  title: string;
  location: string;
  durationDays: number;
  price: number;
  difficulty: 'easy' | 'moderate' | 'hard';
  imageUrl?: string;
  thumbnailUrl?: string;
  isActive: boolean;
}

function AdminTreksPage() {
  const [treks, setTreks] = useState<TrekAdminListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTreks();
  }, []);

  const fetchTreks = async () => {
    try {
      setIsLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('/api/admin/trek-packages', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch treks: ${response.statusText}`);
      }
      
      const data = await response.json();
      const mapped: TrekAdminListItem[] = (data.packages || []).map((trek: any) => ({
        id: trek._id || trek.id,
        title: trek.title || trek.name,
        location: trek.location,
        durationDays: trek.durationDays || trek.duration,
        price: trek.price,
        difficulty: trek.difficulty,
        imageUrl: trek.imageUrl || trek.image,
        thumbnailUrl: trek.thumbnailUrl || trek.image,
        isActive: trek.isActive,
      }));
      setTreks(mapped);
    } catch (error: any) {
      console.error('Error fetching treks:', error);
      if (error.name === 'AbortError') {
        console.error('Request timed out');
      }
      setTreks([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trek package?')) return;

    try {
      const response = await fetch(`/api/admin/trek-packages/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        alert('Trek package deleted successfully');
        fetchTreks();
      } else {
        alert('Failed to delete trek package');
      }
    } catch (error) {
      console.error('Error deleting trek:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trek Packages Management</h1>
            <p className="text-gray-600 mt-2">Manage all trek packages</p>
          </div>
          <Link
            href="/admin/treks/create"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            + Add New Trek
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trek Package
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {treks.map((trek) => (
                    <tr key={trek.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {trek.thumbnailUrl || trek.imageUrl ? (
                              <img
                                src={trek.thumbnailUrl || trek.imageUrl}
                                alt={trek.title}
                                className="h-12 w-12 rounded object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded bg-green-100 flex items-center justify-center text-xs font-semibold text-green-600">
                                TRK
                              </div>
                            )}}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{trek.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {trek.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {trek.durationDays} days
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        ${trek.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
                          ${trek.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                            trek.difficulty === 'moderate' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {trek.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${trek.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {trek.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          href={`/admin/treks/${trek.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/treks/${trek.id}/edit`}
                          className="text-green-600 hover:text-green-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(trek.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!isLoading && treks.length === 0 && (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg mb-4">No trek packages found</p>
            <Link
              href="/admin/treks/create"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Create First Trek Package
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminTreksPageWrapper() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminTreksPage />
    </ProtectedRoute>
  );
}
