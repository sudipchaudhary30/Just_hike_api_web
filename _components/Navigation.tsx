// _components/ui/Navigation.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation(): JSX.Element {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'text-[#45D1C1] font-semibold' : 'text-black';
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO - Keep original font (not Open Sans) */}
        <Link 
          href="/" 
          className="text-2xl font-bold text-black flex-shrink-0 hover:text-[#45D1C1] transition-colors"
        >
          JustHike
        </Link>
        
        {/* NAV LINKS - Evenly Spaced with Open Sans font */}
        <div className="flex items-center justify-center flex-1 mx-12">
          <div className="flex items-center space-x-12 font-['Open_Sans']">
            {/* Home */}
            <Link 
              href="/" 
              className={`${isActive('/')} hover:text-[#45D1C1] transition-colors px-2 font-medium`}
            >
              Home
            </Link>
            
            {/* About */}
            <Link 
              href="/about" 
              className={`${isActive('/about')} hover:text-[#45D1C1] transition-colors px-2 font-medium`}
            >
              About Us
            </Link>
            
            {/* Package - Simple Link (No dropdown) */}
            <Link 
              href="/packages" 
              className={`${isActive('/packages')} hover:text-[#45D1C1] transition-colors px-2 font-medium`}
            >
              Package
            </Link>

            {/* Explore - Simple Link (No dropdown) */}
            <Link 
              href="/explore" 
              className={`${isActive('/explore')} hover:text-[#45D1C1] transition-colors px-2 font-medium`}
            >
              Explore
            </Link>

            {/* Blog - Simple Link (No dropdown) */}
            <Link 
              href="/blog" 
              className={`${isActive('/blog')} hover:text-[#45D1C1] transition-colors px-2 font-medium`}
            >
              Blog
            </Link>
          </div>
        </div>
        
        {/* AUTH BUTTONS - Open Sans font */}
        <div className="flex items-center space-x-6 flex-shrink-0 font-['Open_Sans']">
          <Link 
            href="/auth/register" 
            className="text-black hover:text-[#45D1C1] font-medium transition-colors px-4 py-2"
          >
            Sign Up
          </Link>
          <Link 
            href="/auth/login" 
            className="bg-[#45D1C1] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#3bbfaf] transition-colors"
          >
            Login
          </Link>
        </div>
        
      </div>
    </nav>
  );
}