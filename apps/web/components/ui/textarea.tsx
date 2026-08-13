import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-24 w-full resize-y border border-signal-border bg-background-strong px-3 py-2 font-body text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-foreground/45 focus-visible:border-signal focus-visible:shadow-[0_0_0_1px_var(--signal),0_0_1rem_var(--signal-soft)] disabled:cursor-not-allowed disabled:opacity-45',
      className,
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export { Textarea };
