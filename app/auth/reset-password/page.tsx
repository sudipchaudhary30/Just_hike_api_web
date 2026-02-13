'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/_components/ui/Button';
import Card from '@/_components/ui/Card';
import FormInput from '@/_components/forms/FormInput';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { AlertCircle, Loader } from 'lucide-react';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    mode: 'onBlur',
  });

  const password = watch('password');

  useEffect(() => {
    // Validate token is present
    if (!token || !email) {
      toast.error('Invalid or missing reset token');
      setTimeout(() => router.push('/auth/forgot-password'), 2000);
    }
    setIsValidating(false);
  }, [token, email, router]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setIsSubmitting(true);
      // Call backend API directly
      const response = await fetch('http://localhost:5050/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          newPassword: data.password,
        }),
        credentials: 'include',
      });

      const result = await response.json();
      console.log('Reset password response:', { status: response.status, body: result });

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to reset password');
      }

      toast.success('Password reset successfully!');
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Invalid Reset Link</h2>
            <p className="text-gray-600">
              This reset link is invalid or has expired. Please request a new one.
            </p>
            <Link href="/auth/forgot-password">
              <Button variant="primary" className="w-full">
                Request New Link
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
            <p className="mt-2 text-gray-600 text-sm">
              Enter your new password. Choose a strong password for your security.
            </p>
          </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              label="New Password *"
              type="password"
              name="password"
              register={register}
              error={errors.password}
              placeholder="••••••••"
            />

            <FormInput
              label="Confirm Password *"
              type="password"
              name="confirmPassword"
              register={register}
              error={errors.confirmPassword}
              placeholder="••••••••"
            />

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </Button>
            </form>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Remember your password?{' '}
              <Link href="/auth/login" className="text-green-600 hover:text-green-700 font-semibold">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
