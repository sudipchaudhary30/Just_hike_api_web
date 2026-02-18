import LoginForm from '@/_components/forms/LoginForm'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-3 md:p-6">
      <div className="w-full max-w-7xl bg-white overflow-hidden border border-gray-200">
        <div className="grid lg:grid-cols-2 min-h-[88vh]">
          <div className="relative hidden lg:block">
            <Image
              src="/Assets/Images/login_signup.png"
              alt="Mountain hiking adventure with prayer flags"
              fill
              className="object-cover"
              priority
              sizes="50vw"
              quality={95}
            />
          </div>

          <div className="bg-white flex items-center justify-center px-8 py-10 md:px-14">
            <div className="w-full max-w-md">
              <div className="mb-10">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome Back</h1>
                <p className="text-gray-600 text-lg">Continue with Google or Enter Login Details</p>
              </div>

              <LoginForm />

              <div className="mt-8 text-center text-lg text-gray-800">
                <span>Don’t have an account yet? </span>
                <Link href="/auth/register" className="text-[#45D1C1] hover:text-[#3BC1B1] font-medium">
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Login - Just Hike',
  description: 'Sign in to your Just Hike account and start your adventure',
}