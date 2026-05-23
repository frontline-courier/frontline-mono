import { cn } from '../../lib/utils'

type SpinnerProps = {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-5 w-5 border-2',
  lg: 'h-8 w-8 border-[3px]',
}

export function Spinner({ className, size = 'md' }: SpinnerProps) {
  return (
    <span
      className={cn(
        'inline-block animate-spin rounded-full border-slate-200 border-t-slate-900',
        sizeClasses[size],
        className
      )}
      aria-hidden="true"
    />
  )
}