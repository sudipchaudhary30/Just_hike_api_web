import { ButtonProps } from '@/types'

export default function Button({ 
  children, 
  type = 'button', 
  variant = 'primary',
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    secondary: 'bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500',
    ghost: 'bg-transparent text-green-600 hover:bg-green-50 focus:ring-green-500',
  }

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}