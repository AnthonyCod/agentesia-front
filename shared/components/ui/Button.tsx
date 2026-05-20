'use client'
import { forwardRef } from 'react'
import { cn } from '@/shared/utils/cn'
import { Spinner } from './Spinner'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] focus-visible:ring-[var(--color-primary)]',
  secondary: 'bg-[var(--color-cream)] text-[var(--color-ink)] border border-[var(--color-border)] hover:bg-[var(--color-cream-dark)] focus-visible:ring-[var(--color-border)]',
  ghost:     'bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-cream)] focus-visible:ring-[var(--color-border)]',
  danger:    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', loading, className, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  ),
)
Button.displayName = 'Button'
