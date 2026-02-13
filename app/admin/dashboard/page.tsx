'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/_components/auth/ProtectedRoute';
import Sidebar from '@/_components/admin/Sidebar';
import { useRouter } from 'next/navigation';

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
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardStats();
    const savedLogo = localStorage.getItem('admin_logo');
    if (savedLogo) setLogoUrl(savedLogo);
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

  const handleQuickAction = (action: string) => {
    router.push(action);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full animate-spin"></div>
          <div className="absolute inset-2 bg-white rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar logoUrl={logoUrl} />

      {/* Main Content */}
      <div className="ml-64 min-h-screen p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center gap-4">
            <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400">
              <option>10-06-2021</option>
            </select>
            <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400">
              <option>10-12-2025</option>
            </select>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Treks */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">TRK</span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800 mb-1">{stats.totalTreks}+</p>
              <p className="text-gray-500 text-sm">Total Trek Packages</p>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-orange-600">BKG</span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800 mb-1">{stats.totalBookings}</p>
              <p className="text-gray-500 text-sm">Total Bookings</p>
            </div>
          </div>

          {/* Total Users */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-purple-600">USR</span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800 mb-1">{stats.totalUsers}</p>
              <p className="text-gray-500 text-sm">Registered Users</p>
            </div>
          </div>

          {/* Active Guides */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-teal-600">GDE</span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800 mb-1">{stats.totalGuides}</p>
              <p className="text-gray-500 text-sm">Active Guides</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Reports Chart - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border-2 border-teal-400">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">Reports</h2>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            <div className="h-80 flex items-center justify-center text-gray-400">
              {/* Placeholder for chart */}
              <div className="text-center">
                <p className="text-sm">Activity Chart</p>
                <p className="text-xs mt-2">Trek bookings and user activity over time</p>
              </div>
            </div>
          </div>

          {/* Analytics Donut Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">Analytics</h2>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col items-center justify-center py-8">
              {/* Donut Chart Placeholder */}
              <div className="relative w-48 h-48 mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="80" fill="none" stroke="#FBBF24" strokeWidth="24" strokeDasharray="440 502" />
                  <circle cx="96" cy="96" r="80" fill="none" stroke="#EF4444" strokeWidth="24" strokeDasharray="62 502" strokeDashoffset="-440" />
                  <circle cx="96" cy="96" r="80" fill="none" stroke="#14B8A6" strokeWidth="24" strokeDasharray="290 502" strokeDashoffset="-502" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-4xl font-bold text-gray-800">80%</p>
                  <p className="text-sm text-gray-500">Completion</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
                  <span className="text-gray-600">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-600">Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-gray-600">Cancelled</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">Recent Bookings</h2>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase">Tracking no</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase">Package</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase">Price</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase">Trek</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-4 px-2 text-sm text-gray-700">#876364</td>
                    <td className="py-4 px-2 text-sm text-gray-700">Poon Hill</td>
                    <td className="py-4 px-2 text-sm text-gray-700">Rs 25,000</td>
                    <td className="py-4 px-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">B1</span>
                    </td>
                    <td className="py-4 px-2 text-sm font-semibold text-gray-800">Rs 25,500</td>
                  </tr>
                  <tr className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-4 px-2 text-sm text-gray-700">#874368</td>
                    <td className="py-4 px-2 text-sm text-gray-700">Mt Everest Base</td>
                    <td className="py-4 px-2 text-sm text-gray-700">Rs 48,000</td>
                    <td className="py-4 px-2">
                      <span className="px-3 py-1 bg-teal-100 text-teal-600 rounded-full text-xs font-medium">G3</span>
                    </td>
                    <td className="py-4 px-2 text-sm font-semibold text-gray-800">Rs 49,000</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-4 px-2 text-sm text-gray-700">#876412</td>
                    <td className="py-4 px-2 text-sm text-gray-700">Ruby Valley</td>
                    <td className="py-4 px-2 text-sm text-gray-700">Rs 42,000</td>
                    <td className="py-4 px-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">11</span>
                    </td>
                    <td className="py-4 px-2 text-sm font-semibold text-gray-800">Rs 43,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Booked Package */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">Top Booked Packages</h2>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              {/* Package Item */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex-shrink-0"></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">Poon Hill Trek</h3>
                  <div className="flex items-center gap-1 mb-1">
                    <span className=\"text-yellow-400\">5/5</span>
                  </div>
                  <p className="text-sm font-bold text-gray-800">Rs 25,000</p>
                </div>
              </div>

              {/* Package Item */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-xl flex-shrink-0"></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">Mt Everest Base Camp</h3>
                  <div className="flex items-center gap-1 mb-1">
                    <span className=\"text-yellow-400\">5/5</span>
                  </div>
                  <p className="text-sm font-bold text-gray-800">Rs 49,000</p>
                </div>
              </div>

              {/* Package Item */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex-shrink-0"></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">Annapurna Circuit</h3>
                  <div className="flex items-center gap-1 mb-1">
                    <span className=\"text-yellow-400\">5/5</span>
                  </div>
                  <p className="text-sm font-bold text-gray-800">Rs 38,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => handleQuickAction('/admin/treks/create')}
              className="group bg-white hover:bg-teal-50 border-2 border-gray-100 hover:border-teal-400 rounded-xl p-6 transition-all duration-300 text-left shadow-sm"
            >
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">+</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Add Trek</h3>
              <p className="text-sm text-gray-500">Create new trek package</p>
            </button>

            <button
              onClick={() => handleQuickAction('/admin/guides/create')}
              className="group bg-white hover:bg-blue-50 border-2 border-gray-100 hover:border-blue-400 rounded-xl p-6 transition-all duration-300 text-left shadow-sm"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold">G</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Add Guide</h3>
              <p className="text-sm text-gray-500">Register new guide</p>
            </button>

            <button
              onClick={() => handleQuickAction('/admin/blog/create')}
              className="group bg-white hover:bg-purple-50 border-2 border-gray-100 hover:border-purple-400 rounded-xl p-6 transition-all duration-300 text-left shadow-sm"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold">B</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Write Blog</h3>
              <p className="text-sm text-gray-500">Create blog post</p>
            </button>

            <button
              onClick={() => handleQuickAction('/admin/users/create')}
              className="group bg-white hover:bg-orange-50 border-2 border-gray-100 hover:border-orange-400 rounded-xl p-6 transition-all duration-300 text-left shadow-sm"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold">U</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Add User</h3>
              <p className="text-sm text-gray-500">Create user account</p>
            </button>
          </div>
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