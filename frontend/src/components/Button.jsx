import { cn } from '../lib/utils'

export function Button({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className, 
  ...props 
}) {
  const variants = {
    default: 'bg-brand-strong text-white hover:bg-brand hover:shadow-md transition-all',
    ghost: 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white',
    outline: 'border border-white/20 text-gray-300 hover:bg-white/5 hover:border-white/30 hover:text-white',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all',
        'focus:outline-none focus:ring-2 focus:ring-brand-strong focus:ring-offset-2 focus:ring-offset-[#0c141f]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}


