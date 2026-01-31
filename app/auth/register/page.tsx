// File: app/register/page.tsx
import RegisterForm from '@/_components/forms/RegisterForm'
import Image from 'next/image'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-white relative overflow-hidden">

      {/* Left Side - Image (same as login) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-10 bg-slate-50">
        <div className="relative w-full h-full max-w-lg">
          <Image
            src="/Assets/Images/login_signup.png"
            alt="Mountain hiking adventure"
            fill
            className="object-cover rounded-2xl shadow-xl"
            priority
            sizes="40vw"
            quality={85}
          />
          
          {/* Gradient Overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-2xl">
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Start Your Adventure</h2>
              <p className="text-base opacity-90">
                Join thousands of hikers exploring breathtaking trails
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-10 shadow-xl">
            {/* Header section */}
            <div className="mb-8 text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                Hi, Get Started Now 👋
              </h1>
              <p className="text-slate-500">
                Enter details to create your JustHike account
              </p>
            </div>
            
            {/* Register Form */}
            <RegisterForm />
            
            {/* Login Link */}
            <div className="mt-8 pt-8 border-t border-slate-200 text-center">
              <p className="text-slate-500">
                Already have an account?{' '}
                <a href="/auth/login" className="text-teal-500 hover:text-teal-600 font-semibold transition-colors">
                  Sign in
                </a>
              </p>
            </div>

            {/* Terms */}
            <div className="mt-6 text-center text-xs text-slate-400">
              <p>
                By creating an account, you agree to our{' '}
                <a 
                  href="/terms" 
                  className="text-teal-500 hover:text-teal-600 transition-colors"
                >
                  Terms
                </a>{' '}
                and{' '}
                <a 
                  href="/privacy" 
                  className="text-teal-500 hover:text-teal-600 transition-colors"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
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