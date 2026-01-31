'use client';

import React from 'react';

interface BookingSummaryTrek {
  title: string;
  durationDays: number;
  difficulty: string;
  location: string;
  price: number;
  imageUrl?: string;
  thumbnailUrl?: string;
}

interface BookingSummaryCardProps {
  trek: BookingSummaryTrek;
  participants: number;
  totalPrice: number;
}

export default function BookingSummaryCard({ trek, participants, totalPrice }: BookingSummaryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h2>

      {/* Trek Image */}
      <div className="mb-4 rounded-lg overflow-hidden">
        {trek.thumbnailUrl || trek.imageUrl ? (
          <img
            src={trek.thumbnailUrl || trek.imageUrl}
            alt={trek.title}
            className="w-full h-40 object-cover"
          />
        ) : (
          <div className="w-full h-40 bg-gradient-to-r from-green-400 to-green-600"></div>
        )}
      </div>

      {/* Trek Details */}
      <h3 className="font-semibold text-gray-900 mb-2">{trek.title}</h3>
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex justify-between">
          <span>Duration:</span>
          <span className="font-medium">{trek.durationDays} days</span>
        </div>
        <div className="flex justify-between">
          <span>Difficulty:</span>
          <span className="font-medium capitalize">{trek.difficulty}</span>
        </div>
        <div className="flex justify-between">
          <span>Location:</span>
          <span className="font-medium">{trek.location}</span>
        </div>
      </div>

      <div className="border-t pt-4 mb-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Price per person:</span>
            <span className="font-medium">${trek.price}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Number of people:</span>
            <span className="font-medium">{participants}</span>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
          <span className="text-2xl font-bold text-green-600">${totalPrice}</span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <p className="text-xs text-green-800">
          🛡️ <strong>Cancellation Policy:</strong> Free cancellation up to 7 days before the trek. 50% refund 3-7 days before. No refund within 3 days.
        </p>
      </div>
    </div>
  );
}
