'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/_components/auth/ProtectedRoute';
import { getAuthHeaders } from '@/lib/auth';

function EditGuidePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const guideId = params?.id;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    bio: '',
    experienceYears: '',
    languages: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchGuide = async () => {
      if (!guideId) return;

      setIsFetching(true);
      try {
        const headers = getAuthHeaders();
        const response = await fetch(`/api/admin/guides/${guideId}`, {
          method: 'GET',
          headers,
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.error || 'Failed to load guide details');
          router.push('/admin/guides');
          return;
        }

        const guide = data.guide || {};
        setFormData({
          name: guide.name || '',
          email: guide.email || '',
          phoneNumber: guide.phoneNumber || '',
          bio: guide.bio || '',
          experienceYears: guide.experienceYears ? String(guide.experienceYears) : '',
          languages: Array.isArray(guide.languages) ? guide.languages.join(', ') : '',
        });
      } catch (error) {
        console.error('Error loading guide:', error);
        alert('Failed to load guide details');
        router.push('/admin/guides');
      } finally {
        setIsFetching(false);
      }
    };

    fetchGuide();
  }, [guideId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0] || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guideId) return;

    setIsLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('phoneNumber', formData.phoneNumber);
      submitData.append('bio', formData.bio);
      submitData.append('experienceYears', formData.experienceYears);

      const languagesArray = formData.languages
        .split(',')
        .map((lang) => lang.trim())
        .filter((lang) => lang.length > 0);
      submitData.append('languages', languagesArray.join(', '));

      if (imageFile) {
        submitData.append('image', imageFile);
      }

      const headers = getAuthHeaders();
      const response = await fetch(`/api/admin/guides/${guideId}`, {
        method: 'PUT',
        headers,
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        alert('Guide updated successfully!');
        router.push('/admin/guides');
      } else {
        alert(data.error || data.message || 'Failed to update guide');
      }
    } catch (error) {
      console.error('Error updating guide:', error);
      alert('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          Loading guide details...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Guide</h1>
          <p className="text-gray-600 mt-2">Update trekking guide details</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1]"
                placeholder="Enter guide's full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1]"
                placeholder="guide@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1]"
                placeholder="+977 **********"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience *
              </label>
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1]"
                placeholder="5"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio / About *
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1]"
              placeholder="Write a brief bio about the guide"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Languages (comma-separated) *
            </label>
            <input
              type="text"
              name="languages"
              value={formData.languages}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1]"
              placeholder="English, Hindi, Spanish"
            />
            <p className="text-sm text-gray-500 mt-1">Enter multiple languages separated by commas</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1]"
            />
            <p className="text-sm text-gray-500 mt-1">Upload a new image only if you want to replace the current one</p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#45D1C1] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#3BC1B1] transition-colors disabled:bg-gray-400"
            >
              {isLoading ? 'Updating...' : 'Update Guide'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditGuidePageWrapper() {
  return (
    <ProtectedRoute requireAdmin>
      <EditGuidePage />
    </ProtectedRoute>
  );
}
