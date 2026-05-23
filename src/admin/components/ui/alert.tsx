import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const alertVariants = cva('rounded-2xl border px-4 py-3 text-sm shadow-sm', {
  variants: {
    variant: {
      default: 'border-slate-200 bg-white text-slate-700',
      error: 'border-red-200 bg-red-50 text-red-700',
      info: 'border-sky-200 bg-sky-50 text-sky-700',
      success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      warning: 'border-amber-200 bg-amber-50 text-amber-700',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

type AlertProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>

export function Alert({ className, variant, ...props }: AlertProps) {
  return <div className={cn(alertVariants({ variant, className }))} {...props} />
}