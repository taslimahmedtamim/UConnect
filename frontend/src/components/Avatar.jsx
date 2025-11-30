import { cn } from '../lib/utils'

export function Avatar({ 
  src, 
  alt = 'Avatar', 
  size = 'md',
  online = false,
  role,
  className,
  ...props 
}) {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24',
  }

  const roleBadgeColors = {
    student: 'bg-primary-500',
    teacher: 'bg-purple-500',
    recruiter: 'bg-emerald-500',
  }

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'
  }

  return (
    <div className={cn('relative inline-block', className)} {...props}>
      <div className={cn(
        'rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-semibold ring-2 ring-white',
        sizes[size]
      )}>
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <span className="text-sm">{getInitials(alt)}</span>
        )}
      </div>
      
      {online && (
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
      )}
      
      {role && (
        <span className={cn(
          'absolute -bottom-1 -right-1 block h-4 w-4 rounded-full ring-2 ring-white',
          roleBadgeColors[role.toLowerCase()] || 'bg-gray-500'
        )} title={role} />
      )}
    </div>
  )
}

export function AvatarGroup({ avatars = [], max = 4, size = 'md' }) {
  const displayAvatars = avatars.slice(0, max)
  const remaining = avatars.length - max

  return (
    <div className="flex -space-x-2">
      {displayAvatars.map((avatar, idx) => (
        <Avatar
          key={idx}
          src={avatar.src}
          alt={avatar.alt || avatar.name}
          size={size}
          className="transition-transform hover:scale-110 hover:z-10"
        />
      ))}
      {remaining > 0 && (
        <div className={cn(
          'rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium ring-2 ring-white',
          size === 'sm' && 'w-8 h-8 text-xs',
          size === 'md' && 'w-10 h-10 text-sm',
          size === 'lg' && 'w-12 h-12 text-base'
        )}>
          +{remaining}
        </div>
      )}
    </div>
  )
}
