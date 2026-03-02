'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/_components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BookingListItem from '@/_components/bookings/BookingListItem';
import ProtectedRoute from '@/_components/auth/ProtectedRoute';
import { toast } from 'react-hot-toast';

interface Booking {
  id: string;
  trek: {
    id: string;
    title: string;
    imageUrl?: string;
    thumbnailUrl?: string;
    durationDays: number;
    location: string;
  };
  startDate: string;
  participants: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export default function UserBookingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await response.json();
      const mapped: Booking[] = (data.data || []).map((booking: any) => ({
        id: booking._id,
        trek: {
          id: booking.trek?._id || '',
          title: booking.trek?.title || 'Unknown Trek',
          imageUrl: booking.trek?.imageUrl,
          thumbnailUrl: booking.trek?.thumbnailUrl,
          durationDays: booking.trek?.durationDays || 0,
          location: booking.trek?.location || '—',
        },
        startDate: booking.startDate,
        participants: booking.participants,
        totalPrice: booking.totalPrice,
        status: booking.status,
        createdAt: booking.createdAt,
      }));
      const sorted = mapped.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });
      setBookings(sorted);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        toast.success('Booking cancelled successfully');
        fetchBookings();
      } else {
        toast.error('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('An error occurred');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-1">View and manage your trek bookings</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-md p-10 text-center">
              <div className="text-5xl mb-4 font-bold">TREK</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-600 mb-6">Start your adventure by booking a trek!</p>
              <Link
                href="/treks"
                className="inline-block bg-[#45D1C1] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#3BC1B1] transition-colors"
              >
                Browse Treks
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => (
                <BookingListItem key={booking.id} booking={booking} onCancel={handleCancelBooking} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
