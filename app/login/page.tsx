import LoginForm from '@/_components/forms/LoginForm'
import Card from '@/_components/ui/Card'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-gray-600">Sign in to your Just Hike account</p>
          </div>
          
          <Card>
            <LoginForm />
          </Card>
          
          <div className="mt-8 text-center text-sm text-gray-600">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-green-600 hover:text-green-700">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-green-600 hover:text-green-700">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}