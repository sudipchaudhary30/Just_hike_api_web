'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/_components/auth/AuthProvider';
import Link from 'next/link';
import BookingForm from '@/_components/bookings/BookingForm';
import BookingSummaryCard from '@/_components/bookings/BookingSummaryCard';

interface TrekDetails {
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

export default function CreateBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const trekId = searchParams.get('trekId');

  const [trek, setTrek] = useState<TrekDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    participants: 1,
    startDate: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (trekId) {
      fetchTrekDetails();
    }
  }, [trekId, user]);

  const fetchTrekDetails = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
      const response = await fetch(`${API_BASE_URL}/api/treks/${trekId}`);
      const data = await response.json();
      const t = data.data;
      if (t) {
        setTrek({
          id: t._id,
          title: t.title,
          description: t.description,
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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!trekId) {
        alert('Missing trek selection');
        return;
      }
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          trekId,
          startDate: new Date(formData.startDate).toISOString(),
          participants: Number(formData.participants),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Booking created successfully!');
        router.push('/user/bookings');
      } else {
        alert(data.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('An error occurred while creating the booking');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'participants' ? Number(value) : value,
    });
  };

  const calculateTotalPrice = () => {
    if (!trek) return 0;
    return trek.price * formData.participants;
  };

  if (!trek) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href={`/treks/${trekId}`} className="text-green-600 hover:text-green-700">
            ← Back to Trek Details
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Complete Your Booking</h1>

              <BookingForm
                formData={formData}
                maxGroupSize={trek.maxGroupSize}
                isLoading={isLoading}
                onChange={handleChange}
                onSubmit={handleSubmit}
              />
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <BookingSummaryCard
              trek={trek}
              participants={formData.participants}
              totalPrice={calculateTotalPrice()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
