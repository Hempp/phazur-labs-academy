'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground',
        primary:
          'border-transparent bg-indigo-500 text-white',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
        success:
          'border-transparent bg-success/10 text-success',
        warning:
          'border-transparent bg-warning/10 text-warning',
        info:
          'border-transparent bg-info/10 text-info',
        new:
          'border-transparent bg-gradient-to-r from-amber-500 to-orange-500 text-white',
        popular:
          'border-transparent bg-gradient-to-r from-pink-500 to-rose-500 text-white',
        featured:
          'border-transparent bg-gradient-to-r from-violet-500 to-purple-500 text-white',
        beginner:
          'border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        intermediate:
          'border-transparent bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        advanced:
          'border-transparent bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-[10px]',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
  removable?: boolean
  onRemove?: () => void
}

function Badge({
  className,
  variant,
  size,
  icon,
  removable,
  onRemove,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 -mr-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
        >
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

// Level Badge
interface LevelBadgeProps {
  level: 'beginner' | 'intermediate' | 'advanced' | 'all-levels'
  className?: string
}

function LevelBadge({ level, className }: LevelBadgeProps) {
  const labels: Record<string, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    'all-levels': 'All Levels',
  }

  const variants: Record<string, 'beginner' | 'intermediate' | 'advanced' | 'secondary'> = {
    beginner: 'beginner',
    intermediate: 'intermediate',
    advanced: 'advanced',
    'all-levels': 'secondary',
  }

  return (
    <Badge variant={variants[level]} className={className}>
      {labels[level]}
    </Badge>
  )
}

// Status Badge
interface StatusBadgeProps {
  status: 'draft' | 'published' | 'archived' | 'pending' | 'active' | 'completed'
  className?: string
}

function StatusBadge({ status, className }: StatusBadgeProps) {
  const config: Record<string, { label: string; variant: 'warning' | 'success' | 'secondary' | 'info' | 'default' }> = {
    draft: { label: 'Draft', variant: 'warning' },
    published: { label: 'Published', variant: 'success' },
    archived: { label: 'Archived', variant: 'secondary' },
    pending: { label: 'Pending', variant: 'info' },
    active: { label: 'Active', variant: 'success' },
    completed: { label: 'Completed', variant: 'default' },
  }

  const { label, variant } = config[status]

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  )
}

export { Badge, badgeVariants, LevelBadge, StatusBadge }
