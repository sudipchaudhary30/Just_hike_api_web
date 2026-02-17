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
    primary: 'bg-[#45D1C1] text-white hover:bg-[#3BC1B1] focus:ring-[#45D1C1]',
    secondary: 'bg-white border-2 border-[#45D1C1] text-[#45D1C1] hover:bg-teal-50 focus:ring-[#45D1C1]',
    ghost: 'bg-transparent text-[#45D1C1] hover:bg-teal-50 focus:ring-[#45D1C1]',
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