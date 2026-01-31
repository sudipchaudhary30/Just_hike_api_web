'use client';

import React from 'react';

interface BookingFormData {
  participants: number;
  startDate: string;
}

interface BookingFormProps {
  formData: BookingFormData;
  maxGroupSize: number;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function BookingForm({
  formData,
  maxGroupSize,
  isLoading,
  onChange,
  onSubmit,
}: BookingFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Number of People */}
      <div>
        <label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-2">
          Number of People *
        </label>
        <input
          type="number"
          id="participants"
          name="participants"
          min="1"
          max={maxGroupSize}
          value={formData.participants}
          onChange={onChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">Maximum {maxGroupSize} people per booking</p>
      </div>

      {/* Start Date */}
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Start Date *
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          min={new Date().toISOString().split('T')[0]}
          value={formData.startDate}
          onChange={onChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Terms & Conditions */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <label className="flex items-start">
          <input
            type="checkbox"
            required
            className="mt-1 mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">
            I agree to the terms and conditions, cancellation policy, and acknowledge that I am physically fit for this trek.
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Confirm Booking'}
      </button>
    </form>
  );
}
