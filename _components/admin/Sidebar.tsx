'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/_components/auth/AuthProvider';
import {
  BookOpen,
  Calendar,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Mountain,
  Settings,
  Users,
} from 'lucide-react';

interface SidebarProps {
  logoUrl?: string;
  assetLogoPath?: string;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export default function Sidebar({
  logoUrl,
  assetLogoPath = '/Assets/Images/logo_justhike.png',
  collapsed,
  onCollapsedChange,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isCollapsed = collapsed ?? internalCollapsed;
  const activeLogoSrc = logoUrl || assetLogoPath;
  const adminName = user?.name || 'Admin User';
  const adminInitial = adminName.charAt(0).toUpperCase();
  const adminImage = user?.profilePicture;

  const setCollapsedState = (nextCollapsed: boolean) => {
    if (collapsed === undefined) {
      setInternalCollapsed(nextCollapsed);
    }
    onCollapsedChange?.(nextCollapsed);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsedState(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const menuItems = isAuthenticated && user?.role === 'admin'
    ? [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Mountain, label: 'Trek Packages', path: '/admin/treks' },
        { icon: Calendar, label: 'Bookings', path: '/admin/bookings' },
        { icon: Users, label: 'Guides', path: '/admin/guides' },
        { icon: FileText, label: 'Blog', path: '/admin/blog' },
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: Settings, label: 'Profile', path: '/user/profile' },
      ]
    : [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Mountain, label: 'Trek Packages', path: '/treks' },
        { icon: FileText, label: 'Blog', path: '/blog' },
        { icon: BookOpen, label: 'About Us', path: '/about' },
        ...(isAuthenticated
          ? [
              { icon: Calendar, label: 'My Bookings', path: '/user/bookings' },
              { icon: Settings, label: 'Settings', path: '/settings' },
            ]
          : []),
      ];

  return (
    <>
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setCollapsedState(true)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 overflow-hidden bg-white text-gray-800 transition-all duration-300 z-30 border-r-2 border-gray-100 flex flex-col ${
          isCollapsed ? 'w-24' : 'w-72'
        }`}
        style={{ height: '100vh', minHeight: '100vh' }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="p-6 border-b-2 border-gray-100 flex items-center justify-between flex-shrink-0">
          <Link href="/" className="flex items-center justify-center flex-1">
            <img
              src={'/Assets/Images/logo_justhike.png'}
              alt="Just Hike Logo"
              className="w-28 h-12 rounded-xl object-contain"
            />
          </Link>
          <button
            onClick={() => setCollapsedState(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-teal-600 flex-shrink-0"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-hidden">
          {!isCollapsed && (
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
                  ? 'bg-[#45D1C1] text-white'
                  : 'text-gray-600 hover:bg-teal-50 hover:text-[#45D1C1]'
              }`}
              title={isCollapsed ? item.label : ''}
              aria-current={isActive(item.path) ? 'page' : undefined}
            >
              <span className={`text-xl flex-shrink-0 transition-transform group-hover:scale-110 ${
                isCollapsed ? 'mx-auto' : ''
              }`}>
                <item.icon className="w-5 h-5" aria-hidden="true" />
              </span>
              {!isCollapsed && (
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

        <div className="mt-auto p-4 border-t-2 border-gray-100 space-y-3 flex-shrink-0">
          {isAuthenticated && user?.role === 'admin' && (
            <div className="flex flex-col items-center gap-2 rounded-xl bg-teal-50 border border-teal-100 p-3">
              {adminImage ? (
                <img
                  src={adminImage}
                  alt={adminName}
                  className="h-12 w-12 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-teal-600 text-white flex items-center justify-center font-semibold text-xs">
                  {adminInitial}
                </div>
              )}
              <p className="text-xs font-semibold text-gray-600">Admin</p>
              {!isCollapsed && (
                <p className="text-sm font-semibold text-gray-900 truncate max-w-[8rem] text-center">
                  {adminName}
                </p>
              )}
            </div>
          )}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-white rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 bg-[#45D1C1] hover:bg-[#3BC1B1]"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
