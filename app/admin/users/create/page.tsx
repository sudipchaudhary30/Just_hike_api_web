import ProtectedRoute from '@/_components/auth/ProtectedRoute';
import Card from '@/_components/ui/Card';
import UserCreateForm from '@/_components/forms/UserCreateForm';
import Link from 'next/link';

export default function AdminUsersCreatePage() {
  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link 
              href="/admin/users" 
              className="text-green-600 hover:text-green-700 flex items-center mb-4"
            >
              ← Back to Users
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Create New User</h1>
            <p className="mt-2 text-gray-600">
              Add a new user to the system
            </p>
          </div>

          <Card>
            <UserCreateForm />
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
