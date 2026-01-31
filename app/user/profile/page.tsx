import ProtectedRoute from '@/_components/auth/ProtectedRoute';
import Card from '@/_components/ui/Card';
import ProfileUpdateForm from '@/_components/forms/ProfileUpdateForm';

export default function UserProfilePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-2 text-gray-600">
              Update your personal information and profile picture
            </p>
          </div>

          <Card>
            <ProfileUpdateForm />
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
