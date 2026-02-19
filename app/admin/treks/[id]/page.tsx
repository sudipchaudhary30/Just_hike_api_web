'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ProtectedRoute from '@/_components/auth/ProtectedRoute';
import { getAuthHeaders } from '@/lib/auth';

interface TrekDetail {
  id: string;
  title: string;
  description?: string;
  location?: string;
  durationDays?: number;
  difficulty?: 'easy' | 'moderate' | 'hard' | string;
  price?: number;
  maxGroupSize?: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  isActive?: boolean;
}

function AdminTrekDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [trek, setTrek] = useState<TrekDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setIsLoading(true);
        setError('');
        const headers = getAuthHeaders();
        const response = await fetch(`/api/admin/trek-packages/${id}`, {
          headers,
          credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || 'Failed to load trek package');
        }
        const pkg = data.package || {};
        setTrek({
          id: pkg.id || pkg._id || id,
          title: pkg.title || pkg.name || 'Untitled Trek',
          description: pkg.description || '',
          location: pkg.location || '',
          durationDays: pkg.durationDays || pkg.duration || 0,
          difficulty: pkg.difficulty || 'moderate',
          price: pkg.price || 0,
          maxGroupSize: pkg.maxGroupSize || 0,
          imageUrl: pkg.imageUrl || pkg.image || pkg.thumbnailUrl,
          thumbnailUrl: pkg.thumbnailUrl || pkg.imageUrl || pkg.image,
          isActive: pkg.isActive ?? true,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load trek');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20 text-gray-600">Loading trek details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-red-600 font-semibold mb-4">{error}</p>
            <Link href="/admin/treks" className="text-[#45D1C1] hover:text-[#3BC1B1] font-semibold">
              Back to Treks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!trek) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{trek.title}</h1>
            <p className="text-gray-600 mt-2">Trek package details</p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/admin/treks/${trek.id}/edit`}
              className="bg-[#45D1C1] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#3BC1B1]"
            >
              Edit
            </Link>
            <Link
              href="/admin/treks"
              className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:border-[#45D1C1] hover:text-[#45D1C1]"
            >
              Back
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="h-64 bg-gray-100">
            {trek.imageUrl || trek.thumbnailUrl ? (
              <img
                src={trek.imageUrl || trek.thumbnailUrl}
                alt={trek.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-semibold">
                No Image
              </div>
            )}
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Location</div>
                <div className="text-gray-900 font-semibold">{trek.location || '—'}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Duration</div>
                <div className="text-gray-900 font-semibold">{trek.durationDays || 0} days</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Difficulty</div>
                <div className="text-gray-900 font-semibold capitalize">{trek.difficulty || '—'}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Price</div>
                <div className="text-gray-900 font-semibold">Rs {trek.price || 0}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Max Group Size</div>
                <div className="text-gray-900 font-semibold">{trek.maxGroupSize || 0}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Status</div>
                <div className="text-gray-900 font-semibold">{trek.isActive ? 'Active' : 'Inactive'}</div>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Description</div>
              <p className="text-gray-700 leading-relaxed">
                {trek.description || 'No description available.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminTrekDetailPageWrapper() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminTrekDetailPage />
    </ProtectedRoute>
  );
}
