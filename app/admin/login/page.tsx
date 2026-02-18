'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#45D1C1]/10 to-transparent rounded-full -mr-48 -mt-48 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#45D1C1]/10 to-transparent rounded-full -ml-48 -mb-48 blur-3xl"></div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 md:p-10 border border-gray-100 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/Assets/Images/logo_justhike.png"
              alt="JustHike"
              width={160}
              height={64}
              className="h-12 w-auto"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Access</h1>
          <p className="text-gray-600 text-sm mt-2">Secure management panel</p>
        </div>

        {/* Credentials Info */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl p-4 mb-8">
          <p className="text-sm text-blue-900 font-medium">
            Use your backend admin credentials to log in.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" action="#" method="post">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1] focus:border-transparent outline-none transition-all bg-white font-medium"
              placeholder="admin@example.com"
              disabled={isLoading}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1] focus:border-transparent outline-none transition-all bg-white pr-10 font-medium"
                placeholder="••••••••"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#45D1C1] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-8"
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
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <a 
            href="/" 
            className="text-sm text-gray-600 hover:text-[#45D1C1] font-medium transition-colors"
          >
            ← Back to Home
          </a>
        </div>

        {/* Info Banner */}
        <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-700 leading-relaxed">
            🔒 Admin access is validated securely by your backend authentication system.
          </p>
        </div>
      </div>
    </div>
  );
}
