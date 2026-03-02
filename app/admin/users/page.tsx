import ProtectedRoute from '@/_components/auth/ProtectedRoute';
import UserTable from '@/_components/admin/UserTable';
import Link from 'next/link';

export default function AdminUsersPage() {
  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="inline-block px-3 py-1 bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] rounded-full text-white text-xs font-semibold uppercase tracking-wide mb-4">
              Management
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Users</h1>
                <p className="text-gray-600 mt-2 text-lg">Create, review, and manage all user accounts</p>
              </div>
              <Link
                href="/admin/users/create"
                className="bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                ＋ New User
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
            <UserTable />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
