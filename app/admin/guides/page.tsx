'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/_components/auth/ProtectedRoute';

interface GuideAdminItem {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  bio: string;
  experienceYears: number;
  languages: string[];
  imageUrl?: string;
}

function AdminGuidesPage() {
  const [guides, setGuides] = useState<GuideAdminItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setIsLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
      const token = localStorage.getItem('auth_token');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${API_BASE_URL}/api/guides`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch guides: ${response.statusText}`);
      }
      
      const data = await response.json();
      const mapped: GuideAdminItem[] = (data.data || []).map((guide: any) => ({
        id: guide._id,
        name: guide.name,
        email: guide.email,
        phoneNumber: guide.phoneNumber,
        bio: guide.bio,
        experienceYears: guide.experienceYears,
        languages: guide.languages || [],
        imageUrl: guide.imageUrl,
      }));
      setGuides(mapped);
    } catch (error: any) {
      console.error('Error fetching guides:', error);
      if (error.name === 'AbortError') {
        console.error('Request timed out');
      }
      setGuides([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this guide?')) return;

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/api/guides/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        alert('Guide deleted successfully');
        fetchGuides();
      } else {
        alert('Failed to delete guide');
      }
    } catch (error) {
      console.error('Error deleting guide:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Guides Management</h1>
            <p className="text-gray-600 mt-2">Manage trekking guides</p>
          </div>
          <Link
            href="/admin/guides/create"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            + Add New Guide
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <div key={guide.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Guide Image */}
                <div className="relative h-48">
                  {guide.imageUrl ? (
                    <img
                      src={guide.imageUrl}
                      alt={guide.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">USR</span>
                    </div>
                  )}
                </div>

                {/* Guide Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{guide.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{guide.bio}</p>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center text-gray-700">
                      <span className="font-medium mr-2">Email:</span>
                      <span>{guide.email}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="font-medium mr-2">Phone:</span>
                      <span>{guide.phoneNumber}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="font-medium mr-2">Exp:</span>
                      <span>{guide.experienceYears} years of experience</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="font-medium mr-2">Lang:</span>
                      <span>{guide.languages.join(', ')}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/admin/guides/${guide.id}/edit`}
                      className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(guide.id)}
                      className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && guides.length === 0 && (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg mb-4">No guides found</p>
            <Link
              href="/admin/guides/create"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Create First Guide
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminGuidesPageWrapper() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminGuidesPage />
    </ProtectedRoute>
  );
}
