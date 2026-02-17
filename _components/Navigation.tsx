'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './auth/AuthProvider';

export default function Navigation(): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (pathname?.startsWith('/admin')) {
    return <></>;
  }

  const isActive = (path: string) => {
    return pathname === path ? 'text-[#45D1C1] font-semibold' : 'text-black';
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO */}
        <Link 
          href="/" 
          className="flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <img 
            src="/Assets/Images/logo_justhike.png" 
            alt="JustHike" 
            className="h-16 w-auto"
          />
        </Link>
        
        {/* NAV LINKS */}
        <div className="flex items-center justify-center flex-1 mx-12">
          <div className="flex items-center space-x-8 font-['Open_Sans']">
            {/* Home */}
            <Link 
              href="/" 
              className={`${isActive('/')} hover:text-[#45D1C1] transition-colors px-2 font-medium`}
            >
              Home
            </Link>
            
            {/* Treks */}
            <Link 
              href="/treks" 
              className={`${isActive('/treks')} hover:text-[#45D1C1] transition-colors px-2 font-medium`}
            >
              Trek Packages
            </Link>
            
            {/* Blog */}
            <Link 
              href="/blog" 
              className={`${isActive('/blog')} hover:text-[#45D1C1] transition-colors px-2 font-medium`}
            >
              Blog
            </Link>

            {/* Admin Menu - Only for Admin Users */}
            {isAuthenticated && user?.role === 'admin' && (
              <div className="relative group">
                <button className="hover:text-[#45D1C1] transition-colors px-2 font-medium flex items-center">
                  Admin
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link href="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100 rounded-t-lg">
                    Dashboard
                  </Link>
                  <Link href="/admin/treks" className="block px-4 py-2 hover:bg-gray-100">
                    Manage Treks
                  </Link>
                  <Link href="/admin/guides" className="block px-4 py-2 hover:bg-gray-100">
                    Manage Guides
                  </Link>
                  <Link href="/admin/blog" className="block px-4 py-2 hover:bg-gray-100">
                    Manage Blog
                  </Link>
                  <Link href="/admin/users" className="block px-4 py-2 hover:bg-gray-100">
                    Manage Users
                  </Link>
                  <Link href="/admin/email-verification" className="block px-4 py-2 hover:bg-gray-100 rounded-b-lg">
                    Email Verification
                  </Link>
                </div>
              </div>
            )}

            {/* Direct Admin Login Link - Development Only
            {!isAuthenticated && (
              <Link 
                href="/admin/login" 
                className="text-gray-500 hover:text-green-600 transition-colors px-2 font-medium text-sm"
              >
                Admin
              </Link>
            )} */}
            
            {/* About */}
            <Link 
              href="/about" 
              className={`${isActive('/about')} hover:text-[#45D1C1] transition-colors px-2 font-medium`}
            >
              About Us
            </Link>
          </div>
        </div>
        
        {/* AUTH BUTTONS */}
        <div className="flex items-center space-x-4 font-['Open_Sans']">
          {isAuthenticated ? (
            <>
              {/* User Bookings Link - For Logged in Users */}
              <Link
                href="/user/bookings"
                className="text-black hover:text-[#45D1C1] transition-colors px-3 py-2 font-medium"
              >
                My Bookings
              </Link>

              {/* User Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-[#45D1C1] text-white px-4 py-2 rounded-lg hover:bg-[#3BC1B1] transition-colors"
                >
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user?.name || 'User'}
                      className="w-8 h-8 rounded-full object-cover border border-white"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-white text-[#45D1C1] rounded-full flex items-center justify-center font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="font-medium">{user?.name || 'User'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                    <Link
                      href="/user/profile"
                      className="block px-4 py-2 hover:bg-gray-100 rounded-t-lg"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/user/bookings"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Bookings
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        href="/admin/dashboard"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 rounded-b-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Login Button */}
              <Link 
                href="/auth/login" 
                className="text-black hover:text-[#45D1C1] transition-colors px-4 py-2 font-medium"
              >
                Login
              </Link>
              
              {/* Get Started Button */}
              <Link 
                href="/auth/register" 
                className="bg-[#45D1C1] text-white px-6 py-2 rounded-lg hover:bg-[#3BC1B1] transition-colors font-medium"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}