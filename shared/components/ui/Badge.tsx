import { cn } from '@/shared/utils/cn'

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[var(--color-cream-dark)] text-[var(--color-muted)]',
  success: 'bg-green-50 text-green-700 ring-1 ring-green-200',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  danger:  'bg-red-50 text-[var(--color-primary)] ring-1 ring-red-200',
  info:    'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
}

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
      variantClasses[variant],
      className,
    )}>
      {children}
    </span>
  )
}
