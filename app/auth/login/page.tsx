import LoginForm from '@/_components/forms/LoginForm'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-[#45D1C1] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-[#3BC1B1] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Left Side - Image (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-8">
        <div className="relative w-full h-full max-w-md">
          <div className="absolute inset-0 bg-gradient-to-br from-[#45D1C1]/30 to-[#3BC1B1]/20 rounded-2xl opacity-20 blur-xl"></div>
          <Image
            src="/Assets/Images/login_signup.png"
            alt="Mountain hiking adventure with prayer flags"
            fill
            className="object-cover rounded-2xl shadow-2xl"
            priority
            sizes="40vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent rounded-2xl"></div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 md:p-10 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-slate-400">Sign in to continue your adventure</p>
            </div>

            {/* Form */}
            <LoginForm />

            {/* Footer */}
            <div className="mt-8 pt-8 border-t border-slate-700/50 text-center">
              <p className="text-slate-400">
                Don't have an account?{' '}
                <a href="/auth/register" className="text-[#45D1C1] hover:text-[#3BC1B1] font-semibold transition-colors">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}

export const metadata = {
  title: 'Login - Just Hike',
  description: 'Sign in to your Just Hike account and start your adventure',
}