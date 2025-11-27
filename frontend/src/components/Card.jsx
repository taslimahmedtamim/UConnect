import { cn } from '../lib/utils'

export function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'bg-[#0f1520] border border-white/10 rounded-lg p-6',
        'shadow-sm',
        'transition-all duration-200',
        hover && 'hover:border-white/20 hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={cn('text-lg font-semibold text-white', className)}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className }) {
  return (
    <p className={cn('text-sm text-gray-400 mt-1', className)}>
      {children}
    </p>
  )
}

export function CardContent({ children, className }) {
  return (
    <div className={cn(className)}>
      {children}
    </div>
  )
}


