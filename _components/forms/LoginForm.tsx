// File: _components/forms/LoginForm.tsx
'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError('')
    try {
      // TODO: Implement your Google OAuth logic here
      console.log('Google login clicked')
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (err) {
      setError('Google login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe })
      })

      if (!response.ok) throw new Error('Login failed')
      
      const data = await response.json()
      console.log('Login successful:', data)
      // TODO: Redirect to dashboard
      
    } catch (err) {
      setError('Invalid email or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Google Sign In Button - matching design */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-normal text-gray-700"
        aria-label="Continue with Google"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-gray-500">or</span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600" role="alert">
          {error}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Input - borderless style */}
        <div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:border-teal-400 focus:ring-0 outline-none transition-colors placeholder:text-gray-500 text-gray-900"
            disabled={isLoading}
            autoComplete="email"
            required
          />
        </div>

        {/* Password Input - borderless style */}
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-0 py-3 pr-10 border-0 border-b border-gray-300 focus:border-teal-400 focus:ring-0 outline-none transition-colors placeholder:text-gray-500 text-gray-900"
            disabled={isLoading}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-teal-400 border-gray-300 rounded focus:ring-teal-400"
            />
            <span className="text-sm text-gray-700">Remember me</span>
          </label>
          <a 
            href="/forgot-password" 
            className="text-sm text-teal-400 hover:text-teal-500"
          >
            Forget Password?
          </a>
        </div>

        {/* Submit Button - rounded pill style matching design */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-teal-400 hover:bg-teal-500 text-white font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      {/* Sign Up Link */}
      <div className="text-center text-sm text-gray-700 pt-2">
        Don't have an account yet?{' '}
        <a 
          href="/signup" 
          className="text-teal-400 hover:text-teal-500 font-medium"
        >
          Create account
        </a>
      </div>
    </div>
  )
}