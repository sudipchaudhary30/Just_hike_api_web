'use client';

import React from 'react';
import Link from 'next/link';

interface BookingListItemData {
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

interface BookingListItemProps {
  booking: BookingListItemData;
  onCancel: (bookingId: string) => void;
}

export default function BookingListItem({ booking, onCancel }: BookingListItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="md:flex">
        {/* Trek Image */}
        <div className="md:w-1/4">
          {booking.trek.thumbnailUrl || booking.trek.imageUrl ? (
            <img
              src={booking.trek.thumbnailUrl || booking.trek.imageUrl}
              alt={booking.trek.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">TREK</span>
            </div>
          )}
        </div>

        {/* Booking Details */}
        <div className="md:w-3/4 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {booking.trek.title}
              </h2>
              <p className="text-gray-600">
                {booking.trek.location} • {booking.trek.durationDays} days
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(
                booking.status
              )}`}
            >
              {booking.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="font-semibold text-gray-900">
                {new Date(booking.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Travelers</p>
              <p className="font-semibold text-gray-900">{booking.participants} people</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Price</p>
              <p className="font-semibold text-green-600 text-xl">Rs {booking.totalPrice}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Link
              href={`/treks/${booking.trek.id}`}
              className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
            >
              View Trek Details
            </Link>
            {booking.status === 'pending' || booking.status === 'confirmed' ? (
              <button
                onClick={() => onCancel(booking.id)}
                className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                Cancel Booking
              </button>
            ) : null}
          </div>

          <div className="mt-4 text-xs text-gray-500">
            Booked on {new Date(booking.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
