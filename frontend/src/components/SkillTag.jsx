import { cn } from '../lib/utils'
import { X } from 'lucide-react'

export function SkillTag({ 
  skill, 
  level = 0, 
  showLevel = false,
  onRemove,
  variant = 'default',
  className,
  ...props 
}) {
  const levelColors = {
    1: 'bg-red-100 text-red-700 border-red-200',
    2: 'bg-orange-100 text-orange-700 border-orange-200',
    3: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    4: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    5: 'bg-primary-100 text-primary-700 border-primary-200',
  }

  const variants = {
    default: 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200',
    primary: 'bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100',
    outlined: 'bg-white text-gray-700 border-gray-300 hover:border-gray-400',
  }

  const levelLabels = {
    1: 'Beginner',
    2: 'Elementary',
    3: 'Intermediate',
    4: 'Advanced',
    5: 'Expert',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
        showLevel && level ? levelColors[level] : variants[variant],
        onRemove && 'pr-1',
        className
      )}
      {...props}
    >
      {skill}
      {showLevel && level > 0 && (
        <span className="flex items-center">
          <span className="w-px h-3 bg-current opacity-30 mx-1" />
          <span className="text-xs opacity-75">{levelLabels[level]}</span>
        </span>
      )}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 p-0.5 rounded-full hover:bg-black/10 transition-colors"
          aria-label={`Remove ${skill}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  )
}

export function SkillTagInput({ 
  skills = [], 
  onAdd, 
  onRemove,
  placeholder = "Add skill...",
  className 
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault()
      onAdd?.(e.target.value.trim())
      e.target.value = ''
    }
  }

  return (
    <div className={cn('flex flex-wrap gap-2 p-3 border rounded-lg bg-white', className)}>
      {skills.map((skill, idx) => (
        <SkillTag
          key={idx}
          skill={typeof skill === 'string' ? skill : skill.name}
          level={typeof skill === 'object' ? skill.level : undefined}
          showLevel={typeof skill === 'object'}
          onRemove={() => onRemove?.(idx)}
        />
      ))}
      <input
        type="text"
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        className="flex-1 min-w-[120px] outline-none text-sm"
      />
    </div>
  )
}
