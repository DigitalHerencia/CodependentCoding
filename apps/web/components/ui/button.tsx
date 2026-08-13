import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap border font-body text-xs font-bold uppercase tracking-[0.08em] transition-[background-color,border-color,box-shadow,color,transform] duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'border-signal bg-signal text-foreground shadow-[0_0_1.25rem_var(--signal-soft)] hover:scale-[1.02]',
        outline:
          'border-signal-border bg-background-strong text-foreground hover:scale-[1.02] hover:border-signal hover:shadow-[0_0_1.1rem_var(--signal-soft)]',
        ghost:
          'border-transparent bg-transparent text-foreground hover:border-signal-border hover:bg-background-strong',
        link: 'border-transparent bg-transparent p-0 text-foreground underline-offset-4 hover:text-signal hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-[0.68rem]',
        lg: 'h-11 px-5 text-sm',
        icon: 'size-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : 'button';

    return (
      <Component
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
