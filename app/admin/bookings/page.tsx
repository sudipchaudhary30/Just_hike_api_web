'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import ProtectedRoute from '@/_components/auth/ProtectedRoute';

interface BookingAdminItem {
  id: string;
  userName: string;
  userEmail: string;
  trekTitle: string;
  trekId?: string;
  bookingDate: string;
  numberOfPeople: number;
  totalAmount: number;
  status: 'pending' | 'booked' | 'cancel';
  createdAt: string;
}

const ITEMS_PER_PAGE = 10;

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

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeStatus = (value: unknown): 'pending' | 'booked' | 'cancel' => {
  const statusValue = String(value || '').toLowerCase();
  if (statusValue === 'booked' || statusValue === 'confirmed' || statusValue === 'completed') return 'booked';
  if (statusValue === 'cancel' || statusValue === 'cancelled') return 'cancel';
  return 'pending';
};

const getStatusClassName = (status: BookingAdminItem['status']) => {
  if (status === 'booked') return 'bg-green-100 text-green-800';
  if (status === 'cancel') return 'bg-red-100 text-red-800';
  return 'bg-yellow-100 text-yellow-800';
};

const getBackendStatusCandidates = (status: BookingAdminItem['status']) => {
  if (status === 'booked') return 'confirmed';
  if (status === 'cancel') return 'cancelled';
  return 'pending';
};

const mapBooking = (booking: any): BookingAdminItem | null => {
  const id = String(booking?._id || booking?.id || '').trim();
  if (!id) return null;

  const trekObj = booking?.trek || booking?.trekPackage || booking?.trekPackageId;
  const trekTitle =
    trekObj?.title ||
    trekObj?.name ||
    booking?.trekTitle ||
    booking?.packageTitle ||
    booking?.trekName ||
    'Unknown Trek';

  const bookingDate =
    booking?.bookingDate ||
    booking?.startDate ||
    booking?.start_date ||
    booking?.date ||
    booking?.createdAt ||
    '';

  return {
    id,
    userName: booking?.user?.name || booking?.userName || booking?.name || 'Unknown',
    userEmail: booking?.user?.email || booking?.userEmail || booking?.email || 'N/A',
    trekTitle,
    trekId: trekObj?._id || trekObj?.id || booking?.trekId || booking?.trekPackageId,
    bookingDate,
    numberOfPeople: toNumber(booking?.numberOfPeople ?? booking?.participants ?? booking?.people ?? booking?.noOfPeople),
    totalAmount: toNumber(booking?.totalAmount ?? booking?.totalPrice ?? booking?.amount ?? booking?.price),
    status: normalizeStatus(booking?.status),
    createdAt: booking?.createdAt || '',
  };
};

function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingAdminItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(bookings.length / ITEMS_PER_PAGE));
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [bookings.length, currentPage]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
      const token = localStorage.getItem('auth_token');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${API_BASE_URL}/api/bookings/admin/all`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.statusText}`);
      }
      
      const data = await response.json();
      const bookingList = data?.data || data?.bookings || data?.results || [];
      const mapped: BookingAdminItem[] = Array.isArray(bookingList)
        ? bookingList.map(mapBooking).filter((item: BookingAdminItem | null): item is BookingAdminItem => !!item)
        : [];

      mapped.sort((a, b) => {
        const aTime = new Date(a.createdAt || a.bookingDate).getTime();
        const bTime = new Date(b.createdAt || b.bookingDate).getTime();
        return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
      });

      setBookings(mapped);
      setCurrentPage(1);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      if (error.name === 'AbortError') {
        console.error('Request timed out');
      }
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: BookingAdminItem['status']) => {
    const previousBookings = bookings;
    setBookings((prev) => prev.map((booking) => (booking.id === id ? { ...booking, status: newStatus } : booking)));

    const loadingToastId = toast.loading('Updating booking status...');

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          status: getBackendStatusCandidates(newStatus),
          bookingStatus: getBackendStatusCandidates(newStatus),
        }),
      });

      if (!response.ok) {
        let responseMessage = '';
        try {
          const errorData = await response.json();
          responseMessage = errorData?.message || errorData?.error || '';
        } catch {
          responseMessage = response.statusText || '';
        }
        throw new Error(responseMessage || `Status update failed (${response.status})`);
      }

      toast.success('Booking status updated', { id: loadingToastId });
      fetchBookings();
    } catch (error) {
      setBookings(previousBookings);
      toast.error('Failed to update booking status', { id: loadingToastId });
      console.error('Error updating booking:', error);
    }
  };

  const handleDeleteBooking = (id: string) => {
    setConfirmDeleteId(id);
  };

  const confirmDeleteBooking = async () => {
    if (!confirmDeleteId) return;
    const previousBookings = bookings;
    setBookings((prev) => prev.filter((booking) => booking.id !== confirmDeleteId));
    setIsDeleting(true);

    const loadingToastId = toast.loading('Deleting booking...');

    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`/api/bookings/${confirmDeleteId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        let responseMessage = '';
        try {
          const errorData = await response.json();
          responseMessage = errorData?.message || errorData?.error || '';
        } catch {
          responseMessage = response.statusText || '';
        }
        throw new Error(responseMessage || `Delete failed (${response.status})`);
      }

      toast.success('Booking deleted successfully', { id: loadingToastId });
      setConfirmDeleteId(null);
    } catch (error) {
      setBookings(previousBookings);
      toast.error('Failed to delete booking', { id: loadingToastId });
      console.error('Error deleting booking:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(bookings.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleBookings = bookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const selectedBookingForDelete = confirmDeleteId
    ? bookings.find((booking) => booking.id === confirmDeleteId)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-block px-3 py-1 bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] rounded-full text-white text-xs font-semibold uppercase tracking-wide mb-4">
            Management
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600 mt-2 text-lg">Manage all trek bookings and reservations</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="inline-flex animate-spin h-16 w-16 text-[#45D1C1] mb-4">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">Loading bookings...</p>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
            <p className="text-gray-500 text-lg font-medium">No bookings found</p>
            <p className="text-gray-400 mt-2">Bookings will appear here once users make reservations</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trek
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      People
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visibleBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.userName}</div>
                        <div className="text-sm text-gray-500">{booking.userEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.trekTitle || 'Unknown Trek'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {getValidDateLabel(booking.bookingDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.numberOfPeople || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getAmountLabel(booking.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusUpdate(booking.id, e.target.value as BookingAdminItem['status'])}
                          className={`text-sm font-semibold px-3 py-1 rounded-full ${getStatusClassName(booking.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="booked">Booked</option>
                          <option value="cancel">Cancel</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/admin/bookings/${booking.id}`}
                            className="inline-block px-3 py-1 bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] text-white rounded font-semibold hover:opacity-90 transition"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="inline-block px-3 py-1 bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] text-white rounded font-semibold hover:opacity-90 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
              <p className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, bookings.length)} of {bookings.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => {
                if (!isDeleting) setConfirmDeleteId(null);
              }}
            />

            <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
              <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] rounded-full text-white text-xs font-semibold uppercase tracking-wide mb-4">
                Confirm Action
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete booking?</h3>
              <p className="text-gray-600 mb-6">
                This action cannot be undone.
                {selectedBookingForDelete ? (
                  <>
                    {' '}You are deleting booking for{' '}
                    <span className="font-semibold text-gray-800">{selectedBookingForDelete.trekTitle}</span>
                    {' '}({selectedBookingForDelete.userName}).
                  </>
                ) : null}
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteBooking}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] hover:opacity-90 disabled:opacity-60"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WrappedAdminBookingsPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminBookingsPage />
    </ProtectedRoute>
  );
}
