'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/_components/ui/Button';
import Card from '@/_components/ui/Card';
import { toast } from 'react-hot-toast';
import { handleVerifyEmail } from '@/lib/actions/auth-action';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token && email) {
      verifyEmail();
    } else {
      setError('Invalid or missing verification token');
      setIsVerifying(false);
    }
  }, [token, email]);

  const verifyEmail = async () => {
    try {
      setIsVerifying(true);
      const result = await handleVerifyEmail(token!, email!);

      if (result.success) {
        setIsSuccess(true);
        toast.success(result.message);
        setTimeout(() => router.push('/auth/login'), 3000);
      } else {
        setError(result.message || 'Failed to verify email');
        toast.error(result.message || 'Failed to verify email');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to verify email');
      toast.error(error.message || 'Failed to verify email');
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <div className="text-center space-y-4">
            <Loader className="w-12 h-12 animate-spin text-green-600 mx-auto" />
            <p className="text-gray-600">Verifying your email...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Email Verified!</h2>
            <p className="text-gray-600">
              Your email has been successfully verified. Redirecting to login...
            </p>
            <div className="pt-4">
              <Link href="/auth/login">
                <Button variant="primary" className="w-full">
                  Go to Login
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
          <p className="text-gray-600">
            {error || 'Unable to verify your email. The link may have expired.'}
          </p>
          <div className="pt-4 space-y-3">
            <Link href="/auth/register">
              <Button variant="primary" className="w-full">
                Back to Registration
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="secondary" className="w-full">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
