'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string
  showValue?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    { className, value, indicatorClassName, showValue, size = 'md', ...props },
    ref
  ) => {
    const sizes = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    }

    return (
      <div className="w-full">
        <ProgressPrimitive.Root
          ref={ref}
          className={cn(
            'relative w-full overflow-hidden rounded-full bg-secondary',
            sizes[size],
            className
          )}
          {...props}
        >
          <ProgressPrimitive.Indicator
            className={cn(
              'h-full w-full flex-1 bg-primary transition-all duration-500 ease-out',
              indicatorClassName
            )}
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
          />
        </ProgressPrimitive.Root>
        {showValue && (
          <div className="mt-1 text-right">
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(value || 0)}%
            </span>
          </div>
        )}
      </div>
    )
  }
)
Progress.displayName = ProgressPrimitive.Root.displayName

// Circular Progress Ring
interface ProgressRingProps {
  value: number
  size?: number
  strokeWidth?: number
  className?: string
  children?: React.ReactNode
  showValue?: boolean
  color?: string
}

function ProgressRing({
  value,
  size = 120,
  strokeWidth = 8,
  className,
  children,
  showValue = true,
  color = 'stroke-primary',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        className="progress-ring"
        width={size}
        height={size}
      >
        <circle
          className="text-muted stroke-current"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn('progress-ring__circle', color)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showValue && (
          <span className="text-2xl font-bold">{Math.round(value)}%</span>
        ))}
      </div>
    </div>
  )
}

// Course Progress Card
interface CourseProgressProps {
  courseName: string
  progress: number
  completedLessons: number
  totalLessons: number
  lastAccessed?: string
  thumbnail?: string
  className?: string
}

function CourseProgress({
  courseName,
  progress,
  completedLessons,
  totalLessons,
  lastAccessed,
  thumbnail,
  className,
}: CourseProgressProps) {
  return (
    <div className={cn('flex gap-4 p-4 rounded-lg border bg-card', className)}>
      {thumbnail && (
        <div className="h-16 w-24 flex-shrink-0 rounded-md overflow-hidden">
          <img
            src={thumbnail}
            alt={courseName}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium line-clamp-1">{courseName}</h4>
        <p className="text-sm text-muted-foreground mb-2">
          {completedLessons} of {totalLessons} lessons completed
        </p>
        <Progress value={progress} size="sm" />
      </div>
      <div className="flex items-center">
        <span className="text-sm font-medium">{Math.round(progress)}%</span>
      </div>
    </div>
  )
}

// Stats Progress
interface StatsProgressProps {
  label: string
  value: number
  max: number
  unit?: string
  color?: 'primary' | 'success' | 'warning' | 'destructive'
  className?: string
}

function StatsProgress({
  label,
  value,
  max,
  unit,
  color = 'primary',
  className,
}: StatsProgressProps) {
  const percentage = (value / max) * 100
  const colorClasses = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    destructive: 'bg-destructive',
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {value}
          {unit && <span className="text-muted-foreground"> {unit}</span>}
        </span>
      </div>
      <Progress
        value={percentage}
        indicatorClassName={colorClasses[color]}
        size="sm"
      />
    </div>
  )
}

export { Progress, ProgressRing, CourseProgress, StatsProgress }
