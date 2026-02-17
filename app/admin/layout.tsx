'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/_components/admin/Sidebar';
import ProtectedRoute from '@/_components/auth/ProtectedRoute';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const savedLogo = localStorage.getItem('admin_logo');
    if (savedLogo) {
      setLogoUrl(savedLogo);
    }
  }, []);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="relative min-h-screen bg-gray-50">
        <Sidebar
          logoUrl={logoUrl}
          assetLogoPath="/Assets/Images/admin-logo.png"
          collapsed={isSidebarCollapsed}
          onCollapsedChange={setIsSidebarCollapsed}
        />
        <main
          className={`min-h-screen transition-all duration-300 ${
            isSidebarCollapsed ? 'ml-24' : 'ml-72'
          }`}
        >
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
