import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center border px-2 py-0.5 font-body text-[0.62rem] font-bold uppercase tracking-[0.1em]',
  {
    variants: {
      variant: {
        default:
          'border-signal bg-signal text-foreground shadow-[0_0_0.75rem_var(--signal-soft)]',
        outline: 'border-signal-border bg-background-strong text-foreground',
        muted: 'border-signal-border bg-background text-foreground/65',
      },
    },
    defaultVariants: {
      variant: 'outline',
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
