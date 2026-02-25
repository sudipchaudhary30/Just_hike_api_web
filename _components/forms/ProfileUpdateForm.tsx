'use client';

import { useState } from 'react';
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
  // image?: FileList;
}

export default function ProfileUpdateForm() {
  const { user, updateUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    },
  });

  // Image upload logic removed

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

      // Only send JSON, no image upload
      const headers = { ...getAuthHeaders(token), 'Content-Type': 'application/json' };
      const response = await fetch(`/api/auth/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
        }),
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

      // Map image field if backend returns profilePicture
      if (updatedUser && !updatedUser.image && updatedUser.profilePicture) {
        updatedUser.image = updatedUser.profilePicture;
      }

      // Image upload logic removed

      // Update local user state
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
      {/* Profile Image upload removed. Only profile info fields remain. */}

      {/* Form Fields */}
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
