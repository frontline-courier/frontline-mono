import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold', {
  variants: {
    variant: {
      neutral: 'border-slate-200 bg-slate-100 text-slate-700',
      info: 'border-sky-200 bg-sky-50 text-sky-700',
      success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      warning: 'border-amber-200 bg-amber-50 text-amber-700',
      error: 'border-red-200 bg-red-50 text-red-700',
      outline: 'border-slate-300 bg-white text-slate-700',
    },
  },
  defaultVariants: {
    variant: 'neutral',
  },
})

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />
}