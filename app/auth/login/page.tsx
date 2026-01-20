import LoginForm from '@/_components/forms/LoginForm'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/Assets/Images/login_signup.png"
          alt="Mountain hiking adventure with prayer flags"
          fill
          className="object-cover object-center"
          priority
          sizes="50vw"
          quality={90}
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-6 sm:p-8">
        <LoginForm />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Login - Just Hike',
  description: 'Sign in to your Just Hike account and start your adventure',
}