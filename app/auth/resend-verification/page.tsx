'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/_components/ui/Button';
import Card from '@/_components/ui/Card';
import FormInput from '@/_components/forms/FormInput';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Mail, CheckCircle } from 'lucide-react';
import { handleSendVerificationEmail } from '@/lib/actions/auth-action';

interface ResendVerificationFormData {
  email: string;
}

export default function ResendVerificationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResendVerificationFormData>();

  const email = watch('email');

  const onSubmit = async (data: ResendVerificationFormData) => {
    try {
      setIsSubmitting(true);
      const result = await handleSendVerificationEmail(data.email);

      if (result.success) {
        setIsSubmitted(true);
        toast.success(result.message);
      } else {
        toast.error(result.message || 'Failed to send verification email');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send verification email');
      console.error('Resend verification error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <div className="text-center space-y-4">
            <div className="text-5xl mb-4">✉</div>
            <h2 className="text-2xl font-bold text-gray-900">Link Sent</h2>
            <p className="text-gray-600 text-sm">
              We've sent a verification link to {email}
            </p>
            <p className="text-xs text-gray-500 pt-4">
              The link expires in 1 hour. Check your spam folder if you don't see it.
            </p>
            <p className="text-sm text-gray-500 pt-4">
              Click the link in the email to verify your account. The link will expire in 1 hour.
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
            <h1 className="text-3xl font-bold text-gray-900">Verify Email</h1>
            <p className="mt-2 text-gray-600 text-sm">
              Enter your email to receive a verification link.
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
              className="w-full"
            >
              {isSubmitting ? 'Sending...' : 'Send Verification Email'}
            </Button>
          </form>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Already verified?{' '}
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
