import RegisterForm from '@/_components/forms/RegisterForm'
import Card from '@/_components/ui/Card'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Join Just Hike</h1>
            <p className="mt-2 text-gray-600">Create your free account to start hiking</p>
          </div>
          
          <Card>
            <RegisterForm />
          </Card>
          
          <div className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-green-600 hover:text-green-700">
              Sign in here
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}