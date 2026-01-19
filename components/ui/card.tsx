'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'elevated' | 'bordered' | 'ghost'
    hoverable?: boolean
  }
>(({ className, variant = 'default', hoverable = false, ...props }, ref) => {
  const variants = {
    default: 'bg-card text-card-foreground shadow-card',
    elevated: 'bg-card text-card-foreground shadow-lg',
    bordered: 'bg-card text-card-foreground border-2',
    ghost: 'bg-transparent',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border',
        variants[variant],
        hoverable && 'card-hover cursor-pointer',
        className
      )}
      {...props}
    />
  )
})
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

// Course Card Component
interface CourseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  thumbnail?: string
  title: string
  instructor?: string
  rating?: number
  totalRatings?: number
  price?: number
  salePrice?: number
  currency?: string
  isFree?: boolean
  isBestseller?: boolean
  isNew?: boolean
  progress?: number
  duration?: string
  lessons?: number
}

const CourseCard = React.forwardRef<HTMLDivElement, CourseCardProps>(
  (
    {
      className,
      thumbnail,
      title,
      instructor,
      rating,
      totalRatings,
      price,
      salePrice,
      currency = 'USD',
      isFree,
      isBestseller,
      isNew,
      progress,
      duration,
      lessons,
      ...props
    },
    ref
  ) => {
    const formatPrice = (p: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
      }).format(p)
    }

    return (
      <Card
        ref={ref}
        className={cn('course-card overflow-hidden', className)}
        hoverable
        {...props}
      >
        <div className="relative aspect-video overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="course-card-image h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5" />
          )}
          {(isBestseller || isNew) && (
            <div className="absolute left-3 top-3">
              <span
                className={cn(
                  'px-2 py-1 text-xs font-medium rounded-md',
                  isBestseller && 'badge-popular',
                  isNew && 'badge-new'
                )}
              >
                {isBestseller ? 'Bestseller' : 'New'}
              </span>
            </div>
          )}
          {progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-2 mb-1">{title}</h3>
          {instructor && (
            <p className="text-sm text-muted-foreground mb-2">{instructor}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
            {duration && <span>{duration}</span>}
            {lessons && <span>{lessons} lessons</span>}
          </div>

          {rating !== undefined && (
            <div className="flex items-center gap-1 mb-2">
              <span className="font-bold text-amber-500">{rating.toFixed(1)}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={cn(
                      'h-4 w-4',
                      star <= Math.round(rating)
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-gray-300'
                    )}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {totalRatings && (
                <span className="text-muted-foreground">({totalRatings.toLocaleString()})</span>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            {isFree ? (
              <span className="font-bold text-success">Free</span>
            ) : (
              <>
                {salePrice !== undefined && salePrice < (price || 0) ? (
                  <>
                    <span className="font-bold">{formatPrice(salePrice)}</span>
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(price || 0)}
                    </span>
                  </>
                ) : (
                  price !== undefined && (
                    <span className="font-bold">{formatPrice(price)}</span>
                  )
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)
CourseCard.displayName = 'CourseCard'

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CourseCard,
}
