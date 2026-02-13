'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Button from '@/_components/ui/Button';
import FormInput from '@/_components/forms/FormInput';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { getAuthHeaders, getAuthToken } from '@/lib/auth';

interface UserCreateFormData {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  phoneNumber?: string;
  image?: FileList;
}

export default function UserCreateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const router = useRouter();
  const API_BASE_URL = '';

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<UserCreateFormData>({
    defaultValues: {
      role: 'user',
    },
  });

  // Watch for image changes
  const imageFile = watch('image');
  if (imageFile && imageFile[0]) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(imageFile[0]);
  }

  const onSubmit = async (data: UserCreateFormData) => {
    try {
      setIsSubmitting(true);

      // Get auth token
      const token = getAuthToken();
      
      if (!token) {
        console.error('[UserCreateForm] Token not found');
        toast.error('Authentication token not found. Please login again.');
        setIsSubmitting(false);
        return;
      }

      // Always use FormData as per requirement (even without image)
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('role', data.role);
      
      if (data.phoneNumber) {
        formData.append('phoneNumber', data.phoneNumber);
      }
      
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      }

      const headers = getAuthHeaders(token);
      console.log('[UserCreateForm] Sending request with headers:', headers);

      const response = await fetch(`/api/auth/user`, {
        method: 'POST',
        body: formData,
        headers: headers,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create user');
      }

      toast.success('User created successfully!');
      reset();
      setPreviewImage(null);
      router.push('/admin/users');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create user');
      console.error('User creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Profile Image */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-green-600"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-green-600">
              <span className="text-sm font-semibold text-gray-500">USR</span>
            </div>
          )}
        </div>
        <div>
          <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Upload Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              {...register('image')}
            />
          </label>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid md:grid-cols-2 gap-6">
        <FormInput
          label="Full Name *"
          name="name"
          type="text"
          register={register}
          error={errors.name}
          placeholder="Name"
          required
        />

        <FormInput
          label="Email Address *"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          placeholder="user@example.com"
          required
        />

        <FormInput
          label="Password *"
          name="password"
          type="password"
          register={register}
          error={errors.password}
          placeholder="••••••••"
          required
        />

        <FormInput
          label="Phone Number"
          name="phoneNumber"
          type="tel"
          register={register}
          error={errors.phoneNumber}
          placeholder="+1 (555) 123-4567"
        />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role *
          </label>
          <select
            {...register('role', { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">Role is required</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/admin/users')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create User'}
        </Button>
      </div>
    </form>
  );
}
