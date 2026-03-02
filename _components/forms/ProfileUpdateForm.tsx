'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/_components/auth/AuthProvider';
import { toast } from 'react-hot-toast';
import Button from '@/_components/ui/Button';
import FormInput from '@/_components/forms/FormInput';
import { useForm } from 'react-hook-form';
import { getAuthHeaders, getAuthToken } from '@/lib/auth';

interface ProfileFormData {
  name: string;
  email: string;
  phoneNumber?: string;
}

export default function ProfileUpdateForm() {
  const { user, updateUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewImageFallback, setPreviewImageFallback] = useState<string | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    },
  });

  const getImageUrls = (url?: string | null) => {
    if (!url) return { primary: null as string | null, fallback: null as string | null };
    const normalizedUrl = url.trim().replace(/\\/g, '/');
    const doubleBase = `${API_BASE_URL}/${API_BASE_URL}`;
    const uploadsIndex = normalizedUrl.indexOf('/uploads/');

    if (normalizedUrl.startsWith(doubleBase)) {
      return { primary: normalizedUrl.replace(`${API_BASE_URL}/`, ''), fallback: null };
    }

    if (normalizedUrl.startsWith('http://') || normalizedUrl.startsWith('https://')) {
      return { primary: normalizedUrl, fallback: null };
    }

    if (normalizedUrl.startsWith('/public/uploads/')) {
      return {
        primary: `${API_BASE_URL}${normalizedUrl.replace('/public', '')}`,
        fallback: normalizedUrl.replace('/public', ''),
      };
    }

    if (normalizedUrl.startsWith('/uploads/')) {
      return { primary: `${API_BASE_URL}${normalizedUrl}`, fallback: normalizedUrl };
    }

    if (normalizedUrl.startsWith('uploads/')) {
      return { primary: `${API_BASE_URL}/${normalizedUrl}`, fallback: `/${normalizedUrl}` };
    }

    if (uploadsIndex !== -1) {
      return {
        primary: `${API_BASE_URL}${normalizedUrl.slice(uploadsIndex)}`,
        fallback: normalizedUrl.slice(uploadsIndex),
      };
    }

    return {
      primary: `${API_BASE_URL}/${normalizedUrl.replace(/^\/+/, '')}`,
      fallback: `/${normalizedUrl.replace(/^\/+/, '')}`,
    };
  };

  useEffect(() => {
    const existingImage = user?.profilePicture || user?.image;
    if (existingImage) {
      const { primary, fallback } = getImageUrls(existingImage);
      setPreviewImage(primary);
      setPreviewImageFallback(fallback);
      return;
    }
    setPreviewImage(null);
    setPreviewImageFallback(null);
  }, [user?.profilePicture, user?.image]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedImage(file);

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
      setPreviewImageFallback(null);
      return;
    }

    const { primary, fallback } = getImageUrls(user?.profilePicture || user?.image);
    setPreviewImage(primary);
    setPreviewImageFallback(fallback);
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user?.id) return;
    const idIsValid = /^[a-fA-F0-9]{24}$/.test(user.id);
    if (!idIsValid) {
      toast.error('Session is invalid. Please log in again.');
      return;
    }

    try {
      setIsSubmitting(true);

      // Get auth token
      const token = getAuthToken();
      
      if (!token) {
        console.error('[ProfileUpdateForm] Token not found');
        toast.error('Authentication token not found. Please login again.');
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append('name', data.name || '');
      formData.append('email', data.email || '');
      formData.append('phoneNumber', data.phoneNumber || '');

      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const headers = { ...getAuthHeaders(token) };
      const response = await fetch(`/api/auth/${user.id}`, {
        method: 'PUT',
        body: formData,
        headers: headers,
      });

      const contentType = response.headers.get('content-type') || '';
      let result: any = null;
      if (contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Failed to update profile: ${text || 'Unexpected response'}`);
      }

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to update profile');
      }

      const updatedUser = result.user || result.data || result.data?.user || result;

      if (updatedUser && !updatedUser.image && updatedUser.profilePicture) {
        updatedUser.image = updatedUser.profilePicture;
      }

      if (updatedUser?.profilePicture) {
        const { primary, fallback } = getImageUrls(updatedUser.profilePicture);
        setPreviewImage(primary);
        setPreviewImageFallback(fallback);
      }
      setSelectedImage(null);

      updateUser(updatedUser);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
        {previewImage ? (
          <img
            src={previewImage}
            alt="Profile preview"
            className="w-24 h-24 rounded-full object-cover border-2 border-[#45D1C1]"
            onError={(e) => {
              if (previewImageFallback && e.currentTarget.src !== previewImageFallback) {
                e.currentTarget.src = previewImageFallback;
                setPreviewImage(previewImageFallback);
                setPreviewImageFallback(null);
              }
            }}
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-semibold">
            {(user?.name?.[0] || 'U').toUpperCase()}
          </div>
        )}

        <div className="w-full max-w-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#45D1C1]/10 file:text-[#2a9f93] hover:file:bg-[#45D1C1]/20"
          />
          <p className="mt-1 text-xs text-gray-500">JPG, PNG, GIF, or WEBP up to 5MB</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <FormInput
          label="Full Name"
          name="name"
          type="text"
          register={register}
          error={errors.name}
          placeholder="name"
        />

        <FormInput
          label="Email Address"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          placeholder="example@example.com"
        />

        <FormInput
          label="Phone Number"
          name="phoneNumber"
          type="tel"
          register={register}
          error={errors.phoneNumber}
          placeholder="+1 (555) 123-4567"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="w-full md:w-auto"
        >
          {isSubmitting ? 'Updating...' : 'Update Profile'}
        </Button>
      </div>
    </form>
  );
}
