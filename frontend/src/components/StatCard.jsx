import { cn } from '../lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

export function StatCard({ 
  title, 
  value, 
  icon: Icon,
  trend,
  trendValue,
  subtitle,
  color = 'primary',
  className,
  ...props 
}) {
  const colorStyles = {
    primary: 'from-primary-500 to-primary-600',
    purple: 'from-purple-500 to-purple-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
    blue: 'from-blue-500 to-blue-600',
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-white rounded-large p-6 shadow-card hover:shadow-hover transition-all duration-300 group',
        className
      )}
      {...props}
    >
      {/* Background Icon */}
      {Icon && (
        <div className={cn(
          'absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform',
          colorStyles[color]
        )}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      )}

      <div className="relative">
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        
        {(trend || subtitle) && (
          <div className="flex items-center gap-2 mt-2">
            {trend && (
              <span className={cn(
                'flex items-center gap-1 text-sm font-medium',
                trend === 'up' ? 'text-emerald-600' : 'text-red-600'
              )}>
                {trend === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {trendValue}
              </span>
            )}
            {subtitle && (
              <span className="text-sm text-gray-500">{subtitle}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
