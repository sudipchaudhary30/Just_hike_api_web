'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/_components/auth/ProtectedRoute';
import { getAuthHeaders } from '@/lib/auth';

function CreateTrekPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    aboutPackage: '',
    location: '',
    durationDays: '',
    difficulty: 'moderate',
    price: '',
    maxGroupSize: '',
    isActive: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
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
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value.toString());
      });

      if (imageFile) {
        submitData.append('trekImage', imageFile);
      }

      const headers = getAuthHeaders();
      const response = await fetch('http://localhost:5050/api/treks', {
        method: 'POST',
        headers,
        body: submitData,
        // If your backend is on a different domain, you may need to add credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        alert('Trek package created successfully!');
        router.push('/admin/treks');
      } else {
        alert(data.message || 'Failed to create trek package');
      }
    } catch (error) {
      console.error('Error creating trek:', error);
      alert('An error occurred');
    } finally {
      setIsLoading(false);
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

            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-[#45D1C1] to-[#3BC1B1] rounded mr-3"></div>
              Additional Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="mt-6">
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                About Package *
              </label>
              <textarea
                name="aboutPackage"
                value={formData.aboutPackage}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Write a short overview of the package..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1] focus:border-transparent transition-all duration-300 font-medium"
              />
            </div>

            <div className="mt-6">
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
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Trek Image *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1] focus:border-transparent transition-all duration-300 font-medium file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#45D1C1] file:text-white file:font-semibold"
            />
            <p className="text-sm text-gray-500 mt-2">High-quality trek image for the catalog</p>
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
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] text-white py-4 px-6 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:bg-gray-400 disabled:transform-none"
            >
              {isLoading ? 'Creating Trek...' : 'Create Trek Package'}
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
