'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/_components/auth/ProtectedRoute';
import { getAuthHeaders } from '@/lib/auth';

function CreateGuidePage() {
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState<string | null>(null);

    // Helper to get full URL if needed
    // Always use backend's port (5050) and the path from imageUrl/thumbnailUrl
    // Only prepend http://localhost:5050/ if not already present
    // Use imageUrl/thumbnailUrl from API response only.
    // If not starting with http, prepend http://localhost:5050/
    const getFullUrl = (url: string | null) => {
      if (!url) return null;
      if (url.startsWith('http')) return url;
      return `http://localhost:5050/${url.replace(/^\/+/, '')}`;
    };
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    bio: '',
    experienceYears: '',
    languages: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0] || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('phoneNumber', formData.phoneNumber);
      submitData.append('bio', formData.bio);
      submitData.append('experienceYears', formData.experienceYears);
      
      // Convert languages string to array
      const languagesArray = formData.languages
        .split(',')
        .map(lang => lang.trim())
        .filter(lang => lang.length > 0);
      submitData.append('languages', languagesArray.join(', '));

      if (imageFile) {
        submitData.append('guideImage', imageFile);
      }

      const headers = getAuthHeaders();
      const response = await fetch('http://localhost:5050/api/guides', {
        method: 'POST',
        headers,
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        // Use imageUrl/thumbnailUrl from API response as src
        if (data.data) {
          setUploadedImageUrl(getFullUrl(data.data.imageUrl || null));
          setUploadedThumbnailUrl(getFullUrl(data.data.thumbnailUrl || null));
        }
        alert('Guide created successfully!');
        setTimeout(() => router.push('/admin/guides'), 1500);
      } else {
        alert(data.message || 'Failed to create guide');
      }
    } catch (error) {
      console.error('Error creating guide:', error);
      alert('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Guide</h1>
          <p className="text-gray-600 mt-2">Add a new trekking guide to the system</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {(uploadedImageUrl || uploadedThumbnailUrl) && (
            <div className="flex flex-col items-center mb-6">
              <span className="text-green-600 font-semibold mb-2">Image uploaded successfully!</span>
              {uploadedImageUrl && (
                <img
                  src={uploadedImageUrl}
                  alt="Guide"
                  className="w-40 h-40 object-cover rounded-full shadow mb-2"
                />
              )}
              {uploadedThumbnailUrl && (
                <img
                  src={uploadedThumbnailUrl}
                  alt="Guide Thumbnail"
                  className="w-24 h-24 object-cover rounded-full shadow border border-gray-200"
                />
              )}
            </div>
          )}
          {/* Personal Information */}
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

          {/* Bio */}
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

          {/* Languages */}
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

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1]"
            />
            <p className="text-sm text-gray-500 mt-1">Upload a profile picture of the guide</p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#45D1C1] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#3BC1B1] transition-colors disabled:bg-gray-400"
            >
              {isLoading ? 'Creating...' : 'Create Guide'}
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

export default function CreateGuidePageWrapper() {
  return (
    <ProtectedRoute requireAdmin>
      <CreateGuidePage />
    </ProtectedRoute>
  );
}
