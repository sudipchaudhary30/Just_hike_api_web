'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/_components/auth/ProtectedRoute';
import Card from '@/_components/ui/Card';
import Button from '@/_components/ui/Button';
import FormInput from '@/_components/forms/FormInput';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';

interface UserEditFormData {
  name: string;
  email: string;
  role: 'user' | 'admin';
  phoneNumber?: string;
  image?: FileList;
}

export default function AdminUserEditPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<UserEditFormData>();

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const headers: HeadersInit = {};
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/admin/users/${userId}`, {
        headers,
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch user');
      }

      // Set form values from the user object
      const user = result.user;
      reset({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
        phoneNumber: user.phoneNumber || '',
      });

      if (user.profilePicture) {
        setPreviewImage(user.profilePicture);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch user');
      console.error('Fetch user error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Watch for image changes
  const imageFile = watch('image');
  if (imageFile && imageFile[0]) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(imageFile[0]);
  }

  const onSubmit = async (data: UserEditFormData) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('role', data.role);
      
      if (data.phoneNumber) {
        formData.append('phoneNumber', data.phoneNumber);
      }
      
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      }

      const headers: HeadersInit = {};
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers,
        body: formData,
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update user');
      }

      toast.success('User updated successfully!');
      router.push(`/admin/users/${userId}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user');
      console.error('Update user error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading user details...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link 
              href={`/admin/users/${userId}`}
              className="text-green-600 hover:text-green-700 flex items-center mb-4"
            >
              ← Back to User Details
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
            <p className="mt-2 text-gray-600">
              User ID: <span className="font-mono text-sm">{userId}</span>
            </p>
          </div>

          <Card>
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
                      <span className="text-3xl text-gray-500 font-bold">U</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Change Photo
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
                  label="Phone Number"
                  name="phoneNumber"
                  type="tel"
                  register={register}
                  error={errors.phoneNumber}
                  placeholder="+1 (555) 123-4567"
                />

                <div>
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
                  onClick={() => router.push(`/admin/users/${userId}`)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update User'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
