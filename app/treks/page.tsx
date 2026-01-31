'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TrekListItem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  durationDays: number;
  price: number;
  location: string;
  maxGroupSize: number;
  imageUrl?: string;
  thumbnailUrl?: string;
}

export default function TreksPage() {
  const [packages, setPackages] = useState<TrekListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  useEffect(() => {
    fetchPackages();
  }, [selectedDifficulty]);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
      const url = `${API_BASE_URL}/api/treks${selectedDifficulty ? `?difficulty=${selectedDifficulty}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      const mapped: TrekListItem[] = (data.data || []).map((trek: any) => ({
        id: trek._id,
        title: trek.title,
        description: trek.description,
        difficulty: trek.difficulty,
        durationDays: trek.durationDays,
        price: trek.price,
        location: trek.location,
        maxGroupSize: trek.maxGroupSize,
        imageUrl: trek.imageUrl,
        thumbnailUrl: trek.thumbnailUrl,
      }));
      setPackages(mapped);
    } catch (error) {
      console.error('Error fetching treks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: 'bg-green-100 text-green-800 border-green-300',
      moderate: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      hard: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Trek Packages</h1>
          <p className="text-xl text-green-100">Discover amazing trekking adventures across the Himalayas</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Levels</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600"></div>
              </div>
              <p className="mt-4 text-gray-600 font-medium">Loading amazing treks...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Trek Grid - Modern Design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <Link href={`/treks/${pkg.id}`} key={pkg.id}>
                  <div className="group h-full bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-gray-100">
                    {/* Trek Image */}
                    <div className="relative h-64 overflow-hidden bg-gray-200">
                      {pkg.thumbnailUrl || pkg.imageUrl ? (
                        <img
                          src={pkg.thumbnailUrl || pkg.imageUrl}
                          alt={pkg.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                          <span className="text-white text-6xl">🏔️</span>
                        </div>
                      )}
                      
                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md ${getDifficultyColor(pkg.difficulty)} border border-white/20`}>
                          {pkg.difficulty.toUpperCase()}
                        </span>
                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-gray-900">
                          {pkg.durationDays}D
                        </span>
                      </div>
                    </div>

                    {/* Trek Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                        {pkg.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {pkg.description}
                      </p>

                      {/* Quick Info */}
                      <div className="space-y-2.5 mb-5 pb-5 border-b border-gray-100">
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                          <span className="text-lg">📍</span>
                          <span className="font-medium">{pkg.location}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                          <span className="text-lg">👥</span>
                          <span className="font-medium">Max {pkg.maxGroupSize} people</span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-2xl font-bold text-green-600">${pkg.price}</span>
                          <span className="text-xs text-gray-500 font-medium">per person</span>
                        </div>
                        <button className="px-4 py-2.5 bg-green-500 text-white rounded-lg font-semibold text-sm hover:bg-green-600 transition-all duration-300 shadow hover:shadow-lg">
                          Explore →
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {packages.length === 0 && (
              <div className="text-center py-20 bg-white rounded-lg shadow">
                <p className="text-gray-500 text-lg mb-4">No trek packages found</p>
                <Link
                  href="/treks"
                  className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Try Again
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
