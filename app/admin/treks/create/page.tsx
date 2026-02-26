'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/_components/auth/ProtectedRoute';
import { getAuthHeaders } from '@/lib/auth';


interface TrekCreateFormData {
  title: string;
  overview: string;
  description: string;
  itinerary: string;
  location: string;
  durationDays: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  price: string;
  maxGroupSize: string;
  isActive: boolean;
}

function CreateTrekPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState<string | null>(null);

  // Always use backend's domain/port for images.
  // If imageUrl/thumbnailUrl is a relative path, prepend http://localhost:5050/
  const getFullUrl = (url: string | null) => {
    if (!url) return null;
    // If url is already a relative path, return as is
    if (url.startsWith('/')) return url;
    // If url is absolute, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return url;
  };
  const [formData, setFormData] = useState<TrekCreateFormData>({
    title: '',
    overview: '',
    description: '',
    itinerary: '',
    location: '',
    durationDays: '',
    difficulty: 'moderate',
    price: '',
    maxGroupSize: '',
    isActive: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0] || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value.toString());
      });
      if (imageFile) {
        submitData.append('trekImage', imageFile);
      }
      // Get JWT token from localStorage
      // Try to get token from localStorage or sessionStorage
      let token = null;
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('token') || sessionStorage.getItem('token');
      }
      if (!token) {
        alert('No JWT token found. Please log in again.');
        setIsSaving(false);
        return;
      }
      console.log('JWT token used for create:', token);
      const response = await fetch('http://localhost:5050/api/treks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData,
      });
      console.log('Create trek response status:', response.status);
      const data = await response.json();
      console.log('Backend response:', data); // Inspect backend response for image URL property
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to create trek package');
      }
      // Always use imageUrl and thumbnailUrl from API response (raw)
      if (data.data) {
        setUploadedImageUrl(data.data.imageUrl || null);
        setUploadedThumbnailUrl(data.data.thumbnailUrl || null);
      } else {
        setUploadedImageUrl(null);
        setUploadedThumbnailUrl(null);
      }
      alert('Trek package created successfully!');
      setTimeout(() => router.push('/admin/treks'), 2000);
    } catch (error: any) {
      alert(error.message || 'Failed to create trek package');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-block px-3 py-1 bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] rounded-full text-white text-xs font-semibold uppercase tracking-wide mb-4">
            Create New
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Trek Package</h1>
          <p className="text-gray-600 mt-2 text-lg">Add a new trekking adventure to your catalog</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10 space-y-8">
          {(uploadedImageUrl || uploadedThumbnailUrl) && (
            <div className="flex flex-col items-center mb-6">
              <span className="text-green-600 font-semibold mb-2">Image uploaded successfully!</span>
              {uploadedImageUrl && (
                <img
                  src={getFullUrl(uploadedImageUrl) ?? undefined}
                  alt="Trek Image"
                  className="w-64 h-40 object-cover rounded shadow mb-2"
                />
              )}
              {uploadedThumbnailUrl && (
                <img
                  src={getFullUrl(uploadedThumbnailUrl) ?? undefined}
                  alt="Trek Thumbnail"
                  className="w-32 h-20 object-cover rounded shadow border border-gray-200"
                />
              )}
            </div>
          )}
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-[#45D1C1] to-[#3BC1B1] rounded mr-3"></div>
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Trek Name *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Mount Everest Base Camp Trek"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1] focus:border-transparent transition-all duration-300 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Himalayas, Nepal"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1] focus:border-transparent transition-all duration-300 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Duration (days) *
                </label>
                <input
                  type="number"
                  name="durationDays"
                  value={formData.durationDays}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="e.g., 14"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1] focus:border-transparent transition-all duration-300 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Difficulty *
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1] focus:border-transparent transition-all duration-300 font-medium"
                >
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Price (Rs) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="e.g., 2500"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1] focus:border-transparent transition-all duration-300 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Max Group Size *
                </label>
                <input
                  type="number"
                  name="maxGroupSize"
                  value={formData.maxGroupSize}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="e.g., 15"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1] focus:border-transparent transition-all duration-300 font-medium"
                />
              </div>
            </div>
            {/* End of grid for basic info */}
          </div>
            {/* Overview */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-[#45D1C1] to-[#3BC1B1] rounded mr-3"></div>
                Overview
              </h2>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Overview *
              </label>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Write a brief overview of this trek package..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1] focus:border-transparent transition-all duration-300 font-medium"
              />
            </div>
            {/* Description and Itinerary */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-[#45D1C1] to-[#3BC1B1] rounded mr-3"></div>
              Additional Details
            </h2>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Provide a comprehensive description of the trek..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1] focus:border-transparent transition-all duration-300 font-medium"
            />
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide mt-6">
              Itinerary *
            </label>
            <textarea
              name="itinerary"
              value={formData.itinerary}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Day 1: Arrival and briefing\nDay 2: Trek to base camp\n..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1] focus:border-transparent transition-all duration-300 font-medium"
            />
          </div>
          {/* Images */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Trek Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1] focus:border-transparent transition-all duration-300 font-medium file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#45D1C1] file:text-white file:font-semibold"
            />
            <p className="text-sm text-gray-500 mt-2">Upload an image for this trek</p>
          </div>
          {/* Active Status */}
          <div className="bg-gradient-to-r from-[#45D1C1]/5 to-[#3BC1B1]/5 rounded-xl p-6 border border-[#45D1C1]/20">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="mr-3 h-5 w-5 text-[#45D1C1] focus:ring-[#45D1C1] border-gray-300 rounded"
              />
              <span className="font-bold text-gray-900">Active (visible to users)</span>
            </label>
            <p className="text-sm text-gray-600 mt-2 ml-8">Enable this trek for immediate booking</p>
          </div>
          {/* Submit Button */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] text-white py-4 px-6 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:bg-gray-400 disabled:transform-none"
            >
              {isSaving ? 'Creating Trek...' : 'Create Trek Package'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-[#45D1C1] hover:text-[#45D1C1] hover:bg-[#45D1C1]/5 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CreateTrekPageWrapper() {
  return (
    <ProtectedRoute requireAdmin>
      <CreateTrekPage />
    </ProtectedRoute>
  );
}
