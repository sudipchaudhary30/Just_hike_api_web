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
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';

  const getFullUrl = (url?: string | null) => {
    if (!url) return undefined;
    const normalizedUrl = url.trim().replace(/\\/g, '/');
    const doubleBase = `${API_BASE_URL}/${API_BASE_URL}`;
    const uploadsIndex = normalizedUrl.indexOf('/uploads/');

    if (normalizedUrl.startsWith(doubleBase)) {
      return normalizedUrl.replace(`${API_BASE_URL}/`, '');
    }

    if (normalizedUrl.startsWith('http://') || normalizedUrl.startsWith('https://')) {
      return normalizedUrl;
    }

    if (normalizedUrl.startsWith('/uploads/')) {
      return `${API_BASE_URL}${normalizedUrl}`;
    }

    if (normalizedUrl.startsWith('uploads/')) {
      return `${API_BASE_URL}/${normalizedUrl}`;
    }

    if (uploadsIndex !== -1) {
      return `${API_BASE_URL}${normalizedUrl.slice(uploadsIndex)}`;
    }

    return `${API_BASE_URL}/${normalizedUrl.replace(/^\/+/, '')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="group h-full bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col">
      <div className="relative h-52 overflow-hidden bg-gray-200">
        {booking.trek.thumbnailUrl || booking.trek.imageUrl ? (
          <img
            src={getFullUrl(booking.trek.thumbnailUrl || booking.trek.imageUrl)}
            alt={booking.trek.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#45D1C1] to-[#3BC1B1] flex items-center justify-center">
            <span className="text-white text-sm font-bold">TREK</span>
          </div>
        )}

        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border border-white/20 capitalize ${getStatusColor(booking.status)}`}>
            {booking.status}
          </span>
          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-gray-900">
            {booking.trek.durationDays}D
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#45D1C1] transition-colors">
          {booking.trek.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4">{booking.trek.location}</p>

        <div className="space-y-2.5 mb-4 pb-4 border-b border-gray-100 text-sm">
          <div className="flex justify-between text-gray-700">
            <span>Start Date</span>
            <span className="font-semibold">{new Date(booking.startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Travelers</span>
            <span className="font-semibold">{booking.participants}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Booked On</span>
            <span className="font-semibold">{new Date(booking.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[#45D1C1]">Rs {booking.totalPrice}</span>
              <span className="text-xs text-gray-500 font-medium">total amount</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/treks/${booking.trek.id}`}
              className="px-4 py-2 bg-[#45D1C1] text-white rounded-lg font-semibold text-sm hover:bg-[#3BC1B1] transition-colors"
            >
              View Trek
            </Link>
            {(booking.status === 'pending' || booking.status === 'confirmed') && (
              <button
                onClick={() => onCancel(booking.id)}
                className="px-4 py-2 border border-red-600 text-red-600 rounded-lg font-semibold text-sm hover:bg-red-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
