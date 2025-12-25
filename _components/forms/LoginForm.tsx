'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData } from '@/lib/validation'
import FormInput from './FormInput'
import Button from '../ui/Button'

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    console.log('Login data:', data)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Login successful! Redirecting to dashboard...')
    window.location.href = '/auth/dashboard'
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormInput
        label="Email Address"
        type="email"
        name="email"
        register={register}
        error={errors.email}
        placeholder="you@example.com"
      />

      <FormInput
        label="Password"
        type="password"
        name="password"
        register={register}
        error={errors.password}
        placeholder="Enter your password"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            {...register('rememberMe')}
            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
            Remember me
          </label>
        </div>
        
        <a href="/forgot-password" className="text-sm text-green-600 hover:text-green-700">
          Forgot password?
        </a>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>

      <div className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <a href="/register" className="font-semibold text-green-600 hover:text-green-700">
          Sign up
        </a>
      </div>
    </form>
  )
}