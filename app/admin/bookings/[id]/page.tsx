'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ProtectedRoute from '@/_components/auth/ProtectedRoute';

interface BookingDetail {
  id: string;
  userName: string;
  userEmail: string;
  trekTitle: string;
  bookingDate: string;
  numberOfPeople: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  specialRequests?: string;
}

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeStatus = (value: unknown): 'pending' | 'confirmed' | 'cancelled' | 'completed' => {
  if (value === 'confirmed' || value === 'cancelled' || value === 'completed') return value;
  return 'pending';
};

const getValidDateLabel = (dateValue: string | undefined) => {
  if (!dateValue) return '—';
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return '—';
  return parsed.toLocaleDateString();
};

const getAmountLabel = (amount: number) => {
  if (!Number.isFinite(amount) || amount <= 0) return 'Rs 0';
  return `Rs ${amount.toLocaleString('en-IN')}`;
};

const mapBookingDetail = (booking: any): BookingDetail | null => {
  const id = String(booking?._id || booking?.id || '').trim();
  if (!id) return null;

  const trekObj = booking?.trek || booking?.trekPackage || booking?.trekPackageId;
  const bookingDate = booking?.bookingDate || booking?.startDate || booking?.start_date || booking?.date || booking?.createdAt || '';

  return {
    id,
    userName: booking?.user?.name || booking?.userName || booking?.name || 'Unknown',
    userEmail: booking?.user?.email || booking?.userEmail || booking?.email || 'N/A',
    trekTitle: trekObj?.title || trekObj?.name || booking?.trekTitle || booking?.packageTitle || booking?.trekName || 'Unknown Trek',
    bookingDate,
    numberOfPeople: toNumber(booking?.numberOfPeople ?? booking?.participants ?? booking?.people ?? booking?.noOfPeople),
    totalAmount: toNumber(booking?.totalAmount ?? booking?.totalPrice ?? booking?.amount ?? booking?.price),
    status: normalizeStatus(booking?.status),
    createdAt: booking?.createdAt || '',
    specialRequests: booking?.specialRequests || booking?.notes || '',
  };
};

function AdminBookingDetailPage() {
  const params = useParams();
  const bookingId = useMemo(() => (Array.isArray(params.id) ? params.id[0] : params.id), [params.id]);

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookingDetail = async () => {
      if (!bookingId) return;

      try {
        setIsLoading(true);
        setError('');

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
        const token = localStorage.getItem('auth_token');
        const headers = {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        let response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, { headers });

        if (!response.ok) {
          response = await fetch(`${API_BASE_URL}/api/bookings/admin/all`, { headers });
          if (!response.ok) {
            throw new Error('Failed to load booking details');
          }

          const fallbackData = await response.json();
          const fallbackList = fallbackData?.data || fallbackData?.bookings || fallbackData?.results || [];
          const found = Array.isArray(fallbackList)
            ? fallbackList.find((entry: any) => String(entry?._id || entry?.id) === String(bookingId))
            : null;

          const mappedFromList = mapBookingDetail(found);
          if (!mappedFromList) {
            throw new Error('Booking not found');
          }

          setBooking(mappedFromList);
          return;
        }

        const data = await response.json();
        const raw = data?.booking || data?.data || data;
        const mapped = mapBookingDetail(raw);

        if (!mapped) {
          throw new Error('Booking not found');
        }

        setBooking(mapped);
      } catch (err: any) {
        setError(err?.message || 'Failed to load booking details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetail();
  }, [bookingId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
            <p className="text-gray-600 mt-2">Review booking information</p>
          </div>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#45D1C1] hover:bg-[#3BC1B1] transition-colors"
          >
            Back to Bookings
          </Link>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl shadow-md p-10 border border-gray-100 text-center text-gray-600">Loading booking details...</div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-md p-10 border border-gray-100 text-center">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        ) : booking ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">User</p>
                <p className="text-gray-900 font-semibold">{booking.userName}</p>
                <p className="text-gray-600 text-sm">{booking.userEmail}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Trek</p>
                <p className="text-gray-900 font-semibold">{booking.trekTitle}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Booking Date</p>
                <p className="text-gray-900 font-semibold">{getValidDateLabel(booking.bookingDate)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Status</p>
                <p className="text-gray-900 font-semibold capitalize">{booking.status}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Number of People</p>
                <p className="text-gray-900 font-semibold">{booking.numberOfPeople || 0}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Amount</p>
                <p className="text-gray-900 font-semibold">{getAmountLabel(booking.totalAmount)}</p>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Special Requests</p>
              <p className="text-gray-800">{booking.specialRequests || '—'}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-10 border border-gray-100 text-center text-gray-600">Booking not found</div>
        )}
      </div>
    </div>
  );
}

export default function WrappedAdminBookingDetailPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminBookingDetailPage />
    </ProtectedRoute>
  );
}
