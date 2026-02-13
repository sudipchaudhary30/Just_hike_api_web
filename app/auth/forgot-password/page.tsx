'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/_components/ui/Button';
import Card from '@/_components/ui/Card';
import FormInput from '@/_components/forms/FormInput';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Mail } from 'lucide-react';

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>();

  const email = watch('email');

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch('http://localhost:5050/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send reset email');
      }

      setIsSubmitted(true);
      toast.success(result.message || 'Reset email sent successfully!');
      
      // In development, log the reset link
      if (result.resetLink) {
        console.log('Reset Link:', result.resetLink);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
      console.error('Forgot password error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-green-100 rounded-lg">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Check Your Email</h2>
            <p className="text-gray-600">
              We've sent a password reset link to <span className="font-semibold">{email}</span>
            </p>
            <p className="text-sm text-gray-500 pt-4">
              The link will expire in 1 hour. If you don't see it, check your spam folder.
            </p>
            <div className="pt-6">
              <Link href="/auth/login">
                <Button variant="primary" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Forgot Password?</h1>
            <p className="mt-2 text-gray-600 text-sm">
              Enter your email address to receive a password reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              label="Email Address *"
              name="email"
              type="email"
              register={register}
              error={errors.email}
              placeholder="you@example.com"
              required
            />

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full mt-6"
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
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
