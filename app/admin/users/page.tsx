import ProtectedRoute from '@/_components/auth/ProtectedRoute';
import UserTable from '@/_components/admin/UserTable';
import Button from '@/_components/ui/Button';
import Link from 'next/link';

export default function AdminUsersPage() {
  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="mt-2 text-gray-600">
                Manage all users in the system
              </p>
            </div>
            <Link href="/admin/users/create">
              <Button variant="primary">
                + Create User
              </Button>
            </Link>
          </div>

          <UserTable />
        </div>
      </div>
    </ProtectedRoute>
  );
}
