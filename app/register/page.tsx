// File: app/register/page.tsx
import RegisterForm from '@/_components/forms/RegisterForm'
import Image from 'next/image'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image (same as login) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <Image
          src="/Assets/Images/login_signup.png"
          alt="Mountain hiking adventure"
          fill
          className="object-cover object-center"
          priority
          sizes="50vw"
          quality={85}
        />
        
        {/* Gradient Overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent">
          {/* Optional text overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Start Your Adventure</h2>
            <p className="text-lg opacity-90">
              Join thousands of hikers exploring breathtaking trails
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Just<span className="text-[#45D1C1]">Hike</span>
            </h1>
            <p className="text-gray-600">Your hiking adventure companion</p>
          </div>

          {/* Header section */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Create Account 🚀
            </h1>
            <p className="mt-2 text-gray-600">
              Join our community of adventure seekers
            </p>
          </div>
          
          {/* Register Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
            <RegisterForm />
          </div>
          
          {/* Benefits - similar to login page */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              By creating an account, you agree to our{' '}
              <a 
                href="/terms" 
                className="text-[#45D1C1] hover:text-[#3bbfaf] font-medium transition-colors"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a 
                href="/privacy" 
                className="text-[#45D1C1] hover:text-[#3bbfaf] font-medium transition-colors"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Sign Up - Just Hike',
  description: 'Create your Just Hike account to start exploring trails',
}