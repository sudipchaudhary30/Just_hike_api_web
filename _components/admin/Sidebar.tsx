'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/_components/auth/AuthProvider';
import { LayoutDashboard, Mountain, Calendar, Users, BookOpen, FileText, Settings, LogOut, LogIn, Zap, Home } from 'lucide-react';

interface SidebarProps {
  logoUrl?: string;
}

export default function Sidebar({ logoUrl }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Check for mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push('/');
  };

  // Dynamic menu based on user role with better organization
  const menuItems = isAuthenticated && user?.role === 'admin' 
    ? [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard', color: 'teal' },
        { icon: Mountain, label: 'Trek Packages', path: '/admin/treks', color: 'blue' },
        { icon: Calendar, label: 'Bookings', path: '/admin/bookings', color: 'purple' },
        { icon: Users, label: 'Guides', path: '/admin/guides', color: 'orange' },
        { icon: FileText, label: 'Blog', path: '/admin/blog', color: 'cyan' },
        { icon: Users, label: 'Users', path: '/admin/users', color: 'pink' },
        { icon: Settings, label: 'Profile', path: '/user/profile', color: 'gray' },
      ]
    : [
        { icon: Home, label: 'Home', path: '/', color: 'teal' },
        { icon: Mountain, label: 'Trek Packages', path: '/treks', color: 'blue' },
        { icon: FileText, label: 'Blog', path: '/blog', color: 'cyan' },
        { icon: BookOpen, label: 'About Us', path: '/about', color: 'purple' },
        ...(isAuthenticated ? [
          { icon: Calendar, label: 'My Bookings', path: '/user/bookings', color: 'orange' },
          { icon: Settings, label: 'Settings', path: '/settings', color: 'gray' }
        ] : []),
      ];

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && !collapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-screen bg-white text-gray-800 transition-all duration-300 z-30 border-r-2 border-gray-100 shadow-lg flex flex-col ${
          collapsed ? 'w-20' : 'w-64'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header with Logo */}
        <div className="p-6 border-b-2 border-gray-100 flex items-center justify-between flex-shrink-0">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-3 flex-1 group">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="Just Hike Logo" 
                  className="w-10 h-10 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-shadow" 
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-md group-hover:shadow-lg transition-shadow">
                  JH
                </div>
              )}
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Just Hike
                </span>
                <p className="text-xs text-gray-500 font-medium">
                  {isAuthenticated && user?.role === 'admin' ? 'Admin Panel' : 'Explorer'}
                </p>
              </div>
            </Link>
          )}
          {collapsed && (
            <Link 
              href="/" 
              className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-md mx-auto hover:shadow-lg transition-shadow"
              aria-label="Just Hike Home"
            >
              JH
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-teal-600 flex-shrink-0"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg 
              className={`w-5 h-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>



        {/* Navigation Menu */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {!collapsed && (
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-2">
              {isAuthenticated && user?.role === 'admin' ? 'Admin Menu' : 'Main Menu'}
            </p>
          )}
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30'
                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 hover:text-teal-700'
              }`}
              title={collapsed ? item.label : ''}
              aria-current={isActive(item.path) ? 'page' : undefined}
            >
              <span className={`text-xl flex-shrink-0 transition-transform group-hover:scale-110 ${
                collapsed ? 'mx-auto' : ''
              }`}>
                <item.icon className="w-5 h-5" aria-hidden="true" />
              </span>
              {!collapsed && (
                <>
                  <span className="font-semibold text-sm">{item.label}</span>
                  {isActive(item.path) && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t-2 border-gray-100 space-y-3 flex-shrink-0">
          {!collapsed && isAuthenticated && user?.role === 'admin' && (
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true"></div>
                <p className="text-xs font-bold text-gray-700">System Status</p>
              </div>
              <p className="text-xs text-gray-600">All services operational</p>
            </div>
          )}

          {!collapsed && (
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex items-center justify-between">
                <span>Version</span>
                <span className="font-semibold text-teal-600">2.0.0</span>
              </div>
            </div>
          )}

          {/* Auth Buttons */}
          {isAuthenticated ? (
            <button 
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
              {!collapsed && <span>Logout</span>}
            </button>
          ) : (
            <>
              {!collapsed ? (
                <div className="space-y-2">
                  <Link
                    href="/auth/login"
                    className="w-full px-4 py-2 border border-green-500 text-green-600 rounded-lg text-sm font-semibold hover:bg-green-50 transition-all flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/auth/register"
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Get Started</span>
                  </Link>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center justify-center"
                  title="Login"
                  aria-label="Login"
                >
                  <LogIn className="w-5 h-5" />
                </Link>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
}

