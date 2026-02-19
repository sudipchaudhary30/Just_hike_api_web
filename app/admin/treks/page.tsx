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
  createdAt?: string;
  updatedAt?: string;
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
        createdAt: trek.createdAt,
        updatedAt: trek.updatedAt,
      }));
      const sorted = mapped.sort((a, b) => {
        const aTime = a.updatedAt || a.createdAt || '';
        const bTime = b.updatedAt || b.createdAt || '';
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });
      setTreks(sorted);
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-block px-3 py-1 bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] rounded-full text-white text-xs font-semibold uppercase tracking-wide mb-4">
            Management
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Trek Packages</h1>
              <p className="text-gray-600 mt-2 text-lg">Create, edit, and manage all trekking packages</p>
            </div>
            <Link
              href="/admin/treks/create"
              className="bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              ＋ New Trek
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="inline-flex animate-spin h-16 w-16 text-[#45D1C1] mb-4">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">Loading trek packages...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
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
                            )}
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
                        Rs {trek.price}
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
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-[#45D1C1] hover:bg-[#3BC1B1]"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/treks/${trek.id}/edit`}
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-[#45D1C1] hover:bg-[#3BC1B1]"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(trek.id)}
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-[#45D1C1] hover:bg-[#3BC1B1]"
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
              className="inline-block bg-[#45D1C1] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#3BC1B1] transition-colors"
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
