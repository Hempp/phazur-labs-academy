'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, Search, X } from 'lucide-react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showPasswordToggle?: boolean
  showClearButton?: boolean
  onClear?: () => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      showPasswordToggle,
      showClearButton,
      onClear,
      disabled,
      id,
      value,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const inputId = id || React.useId()
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    const hasValue = value !== undefined && value !== ''

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-muted-foreground">{leftIcon}</span>
            </div>
          )}
          <input
            id={inputId}
            type={inputType}
            value={value}
            className={cn(
              'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon && 'pl-10',
              (rightIcon || showPasswordToggle || (showClearButton && hasValue)) && 'pr-10',
              error && 'border-destructive focus-visible:ring-destructive',
              className
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          />
          {(rightIcon || showPasswordToggle || (showClearButton && hasValue)) && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {showPasswordToggle && isPassword && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              )}
              {showClearButton && hasValue && !showPasswordToggle && (
                <button
                  type="button"
                  onClick={onClear}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {rightIcon && !showPasswordToggle && !showClearButton && (
                <span className="text-muted-foreground">{rightIcon}</span>
              )}
            </div>
          )}
        </div>
        {(error || hint) && (
          <p
            className={cn(
              'text-xs',
              error ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {error || hint}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

// Search Input variant
export interface SearchInputProps
  extends Omit<InputProps, 'leftIcon' | 'type'> {
  onSearch?: (value: string) => void
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch((e.target as HTMLInputElement).value)
      }
    }

    return (
      <Input
        ref={ref}
        type="search"
        leftIcon={<Search className="h-4 w-4" />}
        showClearButton
        onKeyDown={handleKeyDown}
        className={className}
        {...props}
      />
    )
  }
)
SearchInput.displayName = 'SearchInput'

export { Input, SearchInput }
