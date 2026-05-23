import * as React from 'react'
import { cn } from '../../lib/utils'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, hasError = false, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-xl border bg-white px-3 py-2 pr-10 text-sm text-slate-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50',
        hasError ? 'border-red-300 focus-visible:ring-red-200' : 'border-slate-200 hover:border-slate-300',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
)

Select.displayName = 'Select'

export { Select }