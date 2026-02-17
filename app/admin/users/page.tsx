import ProtectedRoute from '@/_components/auth/ProtectedRoute';
import UserTable from '@/_components/admin/UserTable';
import Button from '@/_components/ui/Button';
import Link from 'next/link';

export default function AdminUsersPage() {
  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-sm shadow-sm p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">Admin Panel</p>
                <h1 className="text-3xl font-bold text-gray-900 mt-1">User Management</h1>
                <p className="mt-2 text-gray-600">
                  Create, review, and manage all user accounts from one place.
                </p>
              </div>
              <Link href="/admin/users/create">
                <Button variant="primary">
                  + Create User
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-gray-500">Scope</p>
              <p className="mt-2 text-sm font-semibold text-gray-900">All Registered Users</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-gray-500">Actions</p>
              <p className="mt-2 text-sm font-semibold text-gray-900">View, Edit, Delete</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-gray-500">Access</p>
              <p className="mt-2 text-sm font-semibold text-gray-900">Admin Only</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
            <UserTable />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
