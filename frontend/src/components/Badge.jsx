import { cn } from '../lib/utils'

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className,
  ...props 
}) {
  const variants = {
    default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    primary: 'bg-primary-100 text-primary-700 hover:bg-primary-200',
    purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    success: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
    warning: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
    danger: 'bg-red-100 text-red-700 hover:bg-red-200',
    bronze: 'bg-gradient-to-r from-amber-600 to-amber-800 text-white shadow-md',
    silver: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-md',
    gold: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-md',
    platinum: 'bg-gradient-to-r from-blue-400 to-purple-600 text-white shadow-md',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export function UScoreBadge({ score = 0, size = 'lg' }) {
  const getTier = (score) => {
    if (score >= 900) return { variant: 'platinum', label: 'Platinum' }
    if (score >= 750) return { variant: 'gold', label: 'Gold' }
    if (score >= 500) return { variant: 'silver', label: 'Silver' }
    return { variant: 'bronze', label: 'Bronze' }
  }

  const tier = getTier(score)

  return (
    <div className="flex flex-col items-center gap-1">
      <Badge variant={tier.variant} size={size} className="font-bold">
        U-Score: {score}
      </Badge>
      <span className="text-xs text-gray-500">{tier.label} Tier</span>
    </div>
  )
}
