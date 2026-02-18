'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/_components/auth/AuthProvider';
import { toast } from 'react-hot-toast';

interface TrekDetail {
  id: string;
  title: string;
  overview?: string;
  description: string;
  itinerary?: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  durationDays: number;
  price: number;
  location: string;
  maxGroupSize: number;
  imageUrl?: string;
  thumbnailUrl?: string;
}

export default function TrekDetailPage() {
  const params = useParams();
  const trekId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [trek, setTrek] = useState<TrekDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchTrekDetails();
  }, [trekId]);

  const fetchTrekDetails = async () => {
    try {
      setIsLoading(true);
      if (!trekId) {
        setTrek(null);
        return;
      }
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
      const response = await fetch(`${API_BASE_URL}/api/treks/${trekId}`);
      const data = await response.json();
      const t = data.data;
      if (t) {
        setTrek({
          id: t._id,
          title: t.title,
          overview: t.overview || '',
          description: t.description,
          itinerary: t.itinerary || '',
          difficulty: t.difficulty,
          durationDays: t.durationDays,
          price: t.price,
          location: t.location,
          maxGroupSize: t.maxGroupSize,
          imageUrl: t.imageUrl,
          thumbnailUrl: t.thumbnailUrl,
        });
      } else {
        setTrek(null);
      }
    } catch (error) {
      console.error('Error fetching trek details:', error);
      toast.error('Failed to load trek details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a trek');
      router.push('/auth/login');
      return;
    }
    setShowBookingModal(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: 'bg-green-100 text-green-800 border-green-300',
      moderate: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      hard: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!trek) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Trek package not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96 md:h-[500px]">
        {trek.imageUrl || trek.thumbnailUrl ? (
          <img
            src={trek.imageUrl || trek.thumbnailUrl}
            alt={trek.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <span className="text-white text-2xl font-semibold">TREK</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{trek.title}</h1>
            <div className="flex flex-wrap gap-3">
              <span className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 ${getDifficultyColor(trek.difficulty)}`}>
                {trek.difficulty}
              </span>
              <span className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg text-sm font-semibold backdrop-blur-sm">
                {trek.durationDays} Days
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">{trek.overview || trek.description}</p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center">
                  <span className="text-lg mr-3">▼</span>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold">{trek.location}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3 font-bold">D</span>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-semibold">{trek.durationDays} days</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3 font-bold">P</span>
                  <div>
                    <p className="text-sm text-gray-500">Max Group Size</p>
                    <p className="font-semibold">{trek.maxGroupSize} people</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{trek.description}</p>
            </div>

            {/* Itinerary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Itinerary</h2>
              {trek.itinerary ? (
                <ul className="space-y-2 text-gray-700">
                  {trek.itinerary
                    .split('\n')
                    .map((line: string) => line.trim())
                    .filter(Boolean)
                    .map((line: string, idx: number) => (
                      <li key={idx} className="flex gap-3">
                        <span className="text-[#45D1C1] font-bold">•</span>
                        <span>{line}</span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-gray-700">No itinerary provided.</p>
              )}
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <div className="mb-6">
                <span className="text-3xl font-bold text-[#45D1C1]">${trek.price}</span>
                <span className="text-gray-500">/person</span>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full bg-[#45D1C1] text-white py-3 rounded-lg font-semibold hover:bg-[#3BC1B1] transition-colors mb-4"
              >
                Book Now
              </button>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">{trek.durationDays} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Difficulty</span>
                  <span className="font-semibold">{trek.difficulty}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Max Group</span>
                  <span className="font-semibold">{trek.maxGroupSize} people</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Free Cancellation</strong> up to 7 days before departure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-2xl font-bold mb-4">Book This Trek</h3>
            <p className="text-gray-600 mb-4">
              You'll be redirected to the booking page to complete your reservation.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push(`/bookings/create?trekId=${trek.id}`)}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Continue
              </button>
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
