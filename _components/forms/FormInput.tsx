'use client'

import { FormInputProps } from '@/types'

export default function FormInput({
  label,
  type = 'text',
  name,
  register,
  error,
  ...props
}: FormInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        id={name}
        {...register(name)}
        className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
        }`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error.message}</p>
      )}
    </div>
  )
}