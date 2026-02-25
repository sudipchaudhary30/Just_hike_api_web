"use client";

import { useState, useEffect } from 'react';
import { MapPin, Clock, Users, IndianRupee } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/_components/auth/AuthProvider';
import { toast } from 'react-hot-toast';

interface TrekDetail {
  id: string;
  title: string;
  overview?: string;
  description: string;
  itinerary?: string;
  difficulty: "easy" | "moderate" | "hard";
  durationDays: number;
  price: number;
  location: string;
  maxGroupSize: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  imageFileName?: string;
}

export default function TrekDetailPage() {
    // Always use backend's domain/port for images.
    // If imageUrl/thumbnailUrl is a relative path, prepend http://localhost:5050/
    const getFullUrl = (url: string | undefined | null) => {
      if (!url) return undefined;
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      return `http://localhost:5050/${url.replace(/^\/+/, '')}`;
    };

    // Helper to get the best image for thumbnail (prefer thumbnail, fallback to main image)
    const getThumbnailUrl = () => {
      if (trek?.thumbnailUrl) return getFullUrl(trek.thumbnailUrl);
      if (trek?.imageUrl) return getFullUrl(trek.imageUrl);
      return undefined;
    };
    // Helper to get the best image for main (prefer main, fallback to thumbnail)
    const getMainImageUrl = () => {
      if (trek?.imageUrl) return getFullUrl(trek.imageUrl);
      if (trek?.thumbnailUrl) return getFullUrl(trek.thumbnailUrl);
      return undefined;
    };
  const [trekImage, setTrekImage] = useState<File | null>(null);
  const [userImage, setUserImage] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const params = useParams();
  const trekId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [trek, setTrek] = useState<TrekDetail | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchTrekDetails();
    // eslint-disable-next-line
  }, [trekId]);

  const fetchTrekDetails = async () => {
    try {
      setIsLoading(true);
      if (!trekId) {
        setTrek(null);
        return;
      }
      console.log('Fetching trek details for ID:', trekId);
      // Get JWT token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const response = await fetch(`${API_BASE_URL}/api/treks/${trekId}`,
        token
          ? { headers: { 'Authorization': `Bearer ${token}` } }
          : undefined
      );
      const data = await response.json();
      console.log('API Response:', data);
      // The data structure might be different - let's check all possibilities
      const trekData = data.data || data.package || data;
      console.log('Trek data extracted:', trekData);
      if (trekData) {
        // Check all possible field names for the image
        let imageUrl = trekData.imageUrl || trekData.imageurl || trekData.image_url || trekData.image;
        // If we have imageFileName but no imageUrl, construct it
        if (!imageUrl && trekData.imageFileName) {
          imageUrl = `${API_BASE_URL}/uploads/treks/${trekData.imageFileName}`;
        }
        // Also check for thumbnail
        let thumbnailUrl = trekData.thumbnailUrl || trekData.thumbnailurl || trekData.thumbnail_url || trekData.thumbnail;
        if (thumbnailUrl && !thumbnailUrl.startsWith('http')) {
          thumbnailUrl = `${API_BASE_URL}${thumbnailUrl}`;
        }
        console.log('Final Image URL to use:', imageUrl);
        console.log('Final Thumbnail URL to use:', thumbnailUrl);
        setTrek({
          id: trekData._id || trekData.id,
          title: trekData.title || trekData.name,
          overview: trekData.overview || '',
          description: trekData.description || '',
          itinerary: trekData.itinerary || '',
          difficulty: trekData.difficulty,
          durationDays: trekData.durationDays || trekData.duration,
          price: trekData.price,
          location: trekData.location,
          maxGroupSize: trekData.maxGroupSize,
          imageUrl,
          thumbnailUrl,
          imageFileName: trekData.imageFileName || '',
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

  const handleTrekImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrekImage(e.target.files?.[0] || null);
  };
  
  const handleTrekImageUpload = async () => {
    if (!trekImage) return;
    const formData = new FormData();
    formData.append('trekImage', trekImage);
    setUploadStatus('Uploading trek image...');
    const res = await fetch(`${API_BASE_URL}/api/treks/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.imageUrl) {
      setUploadStatus('Trek image uploaded! URL: ' + data.imageUrl);
    } else {
      setUploadStatus('Trek upload failed: ' + (data.error || 'Unknown error'));
    }
  };

  const handleUserImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserImage(e.target.files?.[0] || null);
  };
  
  const handleUserImageUpload = async () => {
    if (!userImage) return;
    const formData = new FormData();
    formData.append('userImage', userImage);
    setUploadStatus('Uploading user image...');
    const res = await fetch(`${API_BASE_URL}/api/users/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.imageUrl) {
      setUploadStatus('User image uploaded! URL: ' + data.imageUrl);
    } else {
      setUploadStatus('User upload failed: ' + (data.error || 'Unknown error'));
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

  const handleImageError = () => {
    console.error('Image failed to load:', trek?.imageUrl);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', trek?.imageUrl);
    setImageError(false);
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
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Image */}
        <div className="relative h-96 md:h-[500px]">
          {getMainImageUrl() && !imageError ? (
            <img
              src={getMainImageUrl()}
              alt={trek.title}
              className="w-full h-full object-cover"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <span className="text-white text-2xl font-semibold">
                {imageError ? 'Image failed to load' : trek.title}
              </span>
            </div>
          )}
          {/* Thumbnail preview: only show if different from main image */}
          {getThumbnailUrl() && getThumbnailUrl() !== getMainImageUrl() ? (
            <div className="flex justify-center mt-4">
              <img
                src={getThumbnailUrl()}
                alt={trek.title + ' thumbnail'}
                className="h-24 w-24 rounded object-cover border border-gray-200"
              />
            </div>
          ) : null}
          
          {/* Overlay text */}
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                {trek.title}
              </h1>
              <div className="flex flex-wrap gap-3">
                <span className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 ${getDifficultyColor(trek.difficulty)}`}>
                  {trek.difficulty.charAt(0).toUpperCase() + trek.difficulty.slice(1)}
                </span>
                <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm font-semibold backdrop-blur-sm border border-white/30">
                  {trek.durationDays} Days
                </span>
                <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm font-semibold backdrop-blur-sm border border-white/30">
                  {trek.location}
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
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <MapPin className="text-green-600 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold">{trek.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Clock className="text-green-600 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-semibold">{trek.durationDays} days</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Users className="text-green-600 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Max Group Size</p>
                      <p className="font-semibold">{trek.maxGroupSize} people</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <IndianRupee className="text-green-600 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-semibold flex items-center"><IndianRupee className="w-4 h-4 mr-1 inline-block" />{trek.price}/person</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {trek.description && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{trek.description}</p>
                </div>
              )}

              {/* Itinerary */}
              {trek.itinerary && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Itinerary</h2>
                  <div className="space-y-4">
                    {trek.itinerary
                      .split('\n')
                      .map((line: string) => line.trim())
                      .filter(Boolean)
                      .map((line: string, idx: number) => (
                        <div key={idx} className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-bold">{idx + 1}</span>
                            </div>
                          </div>
                          <div className="flex-grow pt-1">
                            <p className="text-gray-700">{line}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                <div className="mb-6 flex items-center gap-2">
                  <span className="text-3xl font-bold text-green-600 flex items-center"><IndianRupee className="w-7 h-7 mr-2 inline-block" />{trek.price}</span>
                  <span className="text-gray-500">/person</span>
                </div>
                
                <button
                  onClick={handleBookNow}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-4"
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
                    <span className="font-semibold capitalize">{trek.difficulty}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Max Group</span>
                    <span className="font-semibold">{trek.maxGroupSize} people</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Location</span>
                    <span className="font-semibold">{trek.location}</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Free Cancellation</span>
                    <br />
                    <span className="text-xs">Up to 7 days before departure</span>
                  </p>
                </div>

                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Secure Booking</span>
                    <br />
                    <span className="text-xs">Pay safely online or via bank transfer</span>
                  </p>
                </div>
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
              You'll be redirected to the booking page to complete your reservation for {trek.title}.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push(`/bookings/create?trekId=${trek.id}`)}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Continue
              </button>
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}