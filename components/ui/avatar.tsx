'use client'

import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn, getInitials, getAvatarColor } from '@/lib/utils'

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  }
>(({ className, size = 'md', ...props }, ref) => {
  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
    '2xl': 'h-20 w-20 text-xl',
  }

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full',
        sizes[size],
        className
      )}
      {...props}
    />
  )
})
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full object-cover', className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted font-medium',
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

// User Avatar with automatic fallback
interface UserAvatarProps {
  user?: {
    name?: string | null
    email?: string | null
    avatar_url?: string | null
  }
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  showStatus?: boolean
  status?: 'online' | 'offline' | 'away' | 'busy'
}

function UserAvatar({
  user,
  size = 'md',
  className,
  showStatus,
  status = 'offline',
}: UserAvatarProps) {
  const name = user?.name || user?.email || 'User'
  const initials = getInitials(name)
  const colorClass = getAvatarColor(name)

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  }

  const statusSizes = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-3.5 w-3.5',
    '2xl': 'h-4 w-4',
  }

  return (
    <div className={cn('relative inline-block', className)}>
      <Avatar size={size}>
        <AvatarImage src={user?.avatar_url || undefined} alt={name} />
        <AvatarFallback className={cn(colorClass, 'text-white')}>
          {initials}
        </AvatarFallback>
      </Avatar>
      {showStatus && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-background',
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  )
}

// Avatar Group
interface AvatarGroupProps {
  users: Array<{
    id: string
    name?: string | null
    email?: string | null
    avatar_url?: string | null
  }>
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

function AvatarGroup({ users, max = 4, size = 'md', className }: AvatarGroupProps) {
  const visibleUsers = users.slice(0, max)
  const remainingCount = users.length - max

  const overlapSizes = {
    xs: '-ml-2',
    sm: '-ml-2',
    md: '-ml-3',
    lg: '-ml-4',
  }

  return (
    <div className={cn('flex items-center', className)}>
      {visibleUsers.map((user, index) => (
        <div
          key={user.id}
          className={cn(
            'relative ring-2 ring-background rounded-full',
            index > 0 && overlapSizes[size]
          )}
          style={{ zIndex: visibleUsers.length - index }}
        >
          <UserAvatar user={user} size={size} />
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            'relative ring-2 ring-background rounded-full',
            overlapSizes[size]
          )}
          style={{ zIndex: 0 }}
        >
          <Avatar size={size}>
            <AvatarFallback className="bg-muted text-muted-foreground">
              +{remainingCount}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  )
}

export { Avatar, AvatarImage, AvatarFallback, UserAvatar, AvatarGroup }
