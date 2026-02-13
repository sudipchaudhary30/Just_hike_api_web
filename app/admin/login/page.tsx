'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const normalizedEmail = formData.email.trim().toLowerCase();
      const normalizedPassword = formData.password;
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password: normalizedPassword,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      let data: any = null;
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Login failed: ${text || 'Unexpected response from server'}`);
      }

      if (data?.success === false) {
        throw new Error(data.message || 'Login failed');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const userData = data?.data || data?.user;
      const token = data?.token;

      if (!userData || !token) {
        throw new Error('Login failed: missing user data or token');
      }

      if (userData?.role !== 'admin') {
        throw new Error('Access denied. Admin only.');
      }

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(userData));

      await fetch('/api/auth/set-cookies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          userData,
        }),
      });

      toast.success('Welcome Admin!');

      // Don't set loading to false before redirect
      router.push('/admin/dashboard');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      setIsLoading(false); // Only set false on error
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow w-full max-w-md p-8 border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
            <Lock className="w-6 h-6 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
          <p className="text-gray-600 text-sm mt-2">Secure admin panel</p>
        </div>

        {/* Credentials Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            Use your backend admin credentials to log in.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" action="#" method="post">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white"
              placeholder="admin@example.com"
              disabled={isLoading}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white pr-10"
                placeholder="••••••••"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Authenticating...
              </span>
            ) : (
              'Enter Admin Panel'
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <a 
            href="/" 
            className="text-sm text-gray-600 hover:text-green-600 transition-colors"
          >
            ← Back to Home
          </a>
        </div>

        {/* Info Banner */}
        <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-700">
            Admin access is validated by your backend authentication.
          </p>
        </div>
      </div>
    </div>
  );
}
