import { cn } from '@/shared/utils/cn'

interface CardProps {
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export function Card({ className, style, children }: CardProps) {
  return (
    <div className={cn('rounded-xl border bg-white shadow-sm', className)}
      style={{ borderColor: 'var(--color-border)', ...style }}>
      {children}
    </div>
  )
}

export function CardHeader({ className, children }: CardProps) {
  return (
    <div className={cn('flex flex-col space-y-1 p-5 pb-3', className)}>
      {children}
    </div>
  )
}

export function CardContent({ className, children }: CardProps) {
  return (
    <div className={cn('p-5 pt-0', className)}>
      {children}
    </div>
  )
}
