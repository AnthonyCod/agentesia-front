import { forwardRef } from 'react'
import { cn } from '@/shared/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'rounded-lg border px-3.5 py-2.5 text-sm transition-all duration-150 outline-none placeholder:text-[var(--color-muted)] disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20'
              : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15',
            className,
          )}
          style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-ink)' }}
          {...props}
        />
        {error      && <p className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>{error}</p>}
        {helperText && !error && <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{helperText}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'
