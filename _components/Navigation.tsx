'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavItem } from '@/types'

export default function Navigation() {
  const pathname = usePathname()
  
  const navItems: NavItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Login', href: '/login' },
    { name: 'Register', href: '/register' },
    { name: 'Dashboard', href: '/auth/dashboard' },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600" />
              <span className="text-xl font-bold text-gray-900">Just Hike</span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-green-600'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}