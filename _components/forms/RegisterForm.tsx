'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterFormData } from '@/lib/validation'
import FormInput from './FormInput'
import Button from '../ui/Button'

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    console.log('Registration data:', data)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Registration successful! Redirecting to login...')
    window.location.href = '/login'
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormInput
        label="Full Name"
        type="text"
        name="name"
        register={register}
        error={errors.name}
        placeholder="Your Name"
      />

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
        placeholder="At least 6 characters with uppercase and number"
      />

      <FormInput
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        register={register}
        error={errors.confirmPassword}
        placeholder="Re-enter your password"
      />

      <div className="space-y-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms"
            {...register('terms')}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
            I agree to the{' '}
            <a href="/terms" className="text-green-600 hover:text-green-700">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-green-600 hover:text-green-700">
              Privacy Policy
            </a>
          </label>
        </div>
        {errors.terms && (
          <p className="text-sm text-red-600">{errors.terms.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </Button>

      <div className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="font-semibold text-green-600 hover:text-green-700">
          Sign in
        </a>
      </div>
    </form>
  )
}