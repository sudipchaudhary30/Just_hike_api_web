'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/_components/auth/ProtectedRoute';
import { Users, Mountain, Calendar, BookOpen, Zap } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalTreks: number;
  totalBookings: number;
  totalGuides: number;
  totalBlogPosts: number;
}

function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalTreks: 0,
    totalBookings: 0,
    totalGuides: 0,
    totalBlogPosts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
      const token = localStorage.getItem('auth_token');
      const authHeaders: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

      // Fetch users with timeout
      const fetchWithTimeout = (url: string, options: any, timeout = 5000) => {
        return Promise.race([
          fetch(url, options),
          new Promise<Response>((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), timeout)
          )
        ]);
      };

      // Fetch users (required)
      let usersData: any = { users: [] };
      try {
        const usersRes = await fetchWithTimeout('/api/admin/users', {
          headers: { ...authHeaders, 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (usersRes.ok) {
          usersData = await usersRes.json();
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }

      // Fetch other stats (optional - don't block on failures)
      const fetchOptionalStats = async () => {
        const results = await Promise.allSettled([
          fetchWithTimeout(`${API_BASE_URL}/api/treks`, { headers: authHeaders }).then(r => r.json()).catch(() => ({ data: [] })),
          fetchWithTimeout(`${API_BASE_URL}/api/guides`, { headers: authHeaders }).then(r => r.json()).catch(() => ({ data: [] })),
          fetchWithTimeout(`${API_BASE_URL}/api/blogs/admin/all`, { headers: authHeaders }).then(r => r.json()).catch(() => ({ data: [] })),
          fetchWithTimeout(`${API_BASE_URL}/api/bookings/admin/all`, { headers: authHeaders }).then(r => r.json()).catch(() => ({ data: [] })),
        ]);

        return {
          treksData: results[0].status === 'fulfilled' ? results[0].value : { data: [] },
          guidesData: results[1].status === 'fulfilled' ? results[1].value : { data: [] },
          blogData: results[2].status === 'fulfilled' ? results[2].value : { data: [] },
          bookingsData: results[3].status === 'fulfilled' ? results[3].value : { data: [] },
        };
      };

      const { treksData, guidesData, blogData, bookingsData } = await fetchOptionalStats();

      setStats({
        totalUsers: usersData.users?.length || 0,
        totalTreks: treksData.data?.length || 0,
        totalGuides: guidesData.data?.length || 0,
        totalBlogPosts: blogData.data?.length || 0,
        totalBookings: bookingsData.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Set default stats on error
      setStats({
        totalUsers: 0,
        totalTreks: 0,
        totalBookings: 0,
        totalGuides: 0,
        totalBlogPosts: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-flex animate-spin h-12 w-12 text-[#45D1C1] mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) => (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:border-[#45D1C1]/20 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-3">{label}</p>
          <p className="text-4xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-4 rounded-xl ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const QuickActionButton = ({ href, icon: Icon, title, description }: { href: string; icon: any; title: string; description: string }) => (
    <Link
      href={href}
      className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-[#45D1C1] hover:shadow-xl hover:bg-gradient-to-br hover:from-white hover:to-[#45D1C1]/5 transition-all duration-300"
    >
      <div className="p-4 bg-gradient-to-br from-[#45D1C1] to-[#3BC1B1] rounded-xl w-fit mb-4 group-hover:scale-125 transition-transform duration-300 shadow-lg">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-bold text-gray-900 mb-1 text-lg">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6 md:p-8">
      {/* Premium Header */}
      <div className="mb-12">
        <div className="inline-block px-3 py-1 bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] rounded-full text-white text-xs font-semibold uppercase tracking-wide mb-4">
          Admin Control Panel
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-600 text-lg max-w-2xl">Manage your trekking platform efficiently with real-time insights and quick access to all key features</p>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.totalUsers}
          color="bg-[#45D1C1]"
        />
        <StatCard
          icon={Mountain}
          label="Trek Packages"
          value={stats.totalTreks}
          color="bg-[#45D1C1]"
        />
        <StatCard
          icon={Calendar}
          label="Bookings"
          value={stats.totalBookings}
          color="bg-[#45D1C1]"
        />
        <StatCard
          icon={BookOpen}
          label="Blog Posts"
          value={stats.totalBlogPosts}
          color="bg-[#45D1C1]"
        />
        <StatCard
          icon={Zap}
          label="Active Guides"
          value={stats.totalGuides}
          color="bg-[#45D1C1]"
        />
      </div>

      {/* Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Quick Stats Box */}
        <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Platform Overview</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Booking Rate</span>
              <span className="font-bold text-[#45D1C1]">85%</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-gray-600 font-medium">User Growth</span>
              <span className="font-bold text-green-600">+12%</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-gray-600 font-medium">Active Users</span>
              <span className="font-bold text-green-600">{stats.totalUsers}</span>
            </div>
          </div>
        </div>

        {/* Featured Info */}
        <div className="bg-[#45D1C1] rounded-xl p-8 text-white shadow-lg">
          <h2 className="text-lg font-bold mb-2">Today's Activity</h2>
          <p className="text-white/90 text-sm mb-6">Keep track of today's bookings and user registrations</p>
          <div className="flex gap-8">
            <div>
              <p className="text-3xl font-bold">12</p>
              <p className="text-sm text-white/80 mt-1">New Bookings</p>
            </div>
            <div>
              <p className="text-3xl font-bold">8</p>
              <p className="text-sm text-white/80 mt-1">New Users</p>
            </div>
          </div>
        </div>

        {/* Support Box */}
        <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Need Assistance?</h2>
          <p className="text-gray-600 text-sm mb-6">Explore comprehensive guides and documentation for all features</p>
          <button className="w-full bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] hover:shadow-lg text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
            View Documentation
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionButton
            href="/admin/treks/create"
            icon={Mountain}
            title="Add Trek"
            description="Create a new trek package"
          />
          <QuickActionButton
            href="/admin/guides/create"
            icon={Users}
            title="Add Guide"
            description="Register a new guide"
          />
          <QuickActionButton
            href="/admin/blog/create"
            icon={BookOpen}
            title="Write Blog"
            description="Create a blog post"
          />
          <QuickActionButton
            href="/admin/users/create"
            icon={Zap}
            title="Add User"
            description="Create a user account"
          />
        </div>
      </div>

      {/* Management Links */}
      <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center mb-8">
          <div className="w-2 h-8 bg-gradient-to-b from-[#45D1C1] to-[#3BC1B1] rounded-full mr-3"></div>
          <h2 className="text-2xl font-bold text-gray-900">Management Panels</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/treks"
            className="group p-6 border border-gray-200 rounded-xl hover:border-[#45D1C1] hover:bg-gradient-to-br hover:from-white hover:to-[#45D1C1]/5 hover:shadow-lg transition-all duration-300"
          >
            <p className="font-bold text-gray-900 group-hover:text-[#45D1C1]">Trek Packages</p>
            <p className="text-sm text-gray-600 mt-1">View & manage all treks</p>
          </Link>
          <Link
            href="/admin/guides"
            className="group p-6 border border-gray-200 rounded-xl hover:border-[#45D1C1] hover:bg-gradient-to-br hover:from-white hover:to-[#45D1C1]/5 hover:shadow-lg transition-all duration-300"
          >
            <p className="font-bold text-gray-900 group-hover:text-[#45D1C1]">Guides</p>
            <p className="text-sm text-gray-600 mt-1">Manage trekking guides</p>
          </Link>
          <Link
            href="/admin/blog"
            className="group p-6 border border-gray-200 rounded-xl hover:border-[#45D1C1] hover:bg-gradient-to-br hover:from-white hover:to-[#45D1C1]/5 hover:shadow-lg transition-all duration-300"
          >
            <p className="font-bold text-gray-900 group-hover:text-[#45D1C1]">Blog Posts</p>
            <p className="text-sm text-gray-600 mt-1">View & create blog posts</p>
          </Link>
          <Link
            href="/admin/bookings"
            className="group p-6 border border-gray-200 rounded-xl hover:border-[#45D1C1] hover:bg-gradient-to-br hover:from-white hover:to-[#45D1C1]/5 hover:shadow-lg transition-all duration-300"
          >
            <p className="font-bold text-gray-900 group-hover:text-[#45D1C1]">Bookings</p>
            <p className="text-sm text-gray-600 mt-1">View all bookings</p>
          </Link>
          <Link
            href="/admin/users"
            className="group p-6 border border-gray-200 rounded-xl hover:border-[#45D1C1] hover:bg-gradient-to-br hover:from-white hover:to-[#45D1C1]/5 hover:shadow-lg transition-all duration-300"
          >
            <p className="font-bold text-gray-900 group-hover:text-[#45D1C1]">Users</p>
            <p className="text-sm text-gray-600 mt-1">Manage user accounts</p>
          </Link>
          <Link
            href="/admin/email-verification"
            className="p-4 border border-gray-200 rounded-lg hover:border-[#45D1C1] hover:bg-slate-50 transition-all"
          >
            <p className="font-semibold text-gray-900">Email Verification</p>
            <p className="text-sm text-gray-600 mt-1">Verify user emails</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPageWrapper() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminDashboardPage />
    </ProtectedRoute>
  );
}