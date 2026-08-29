'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center border border-signal-border bg-background-strong outline-none transition-[background-color,border-color,box-shadow] duration-150 focus-visible:border-signal focus-visible:shadow-[0_0_0_1px_var(--signal),0_0_0.9rem_var(--signal-soft)] disabled:cursor-not-allowed disabled:opacity-45 data-[state=checked]:border-signal data-[state=checked]:bg-signal',
      className,
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb className="pointer-events-none block size-3.5 translate-x-0.5 bg-foreground transition-transform duration-150 data-[state=checked]:translate-x-[1.125rem]" />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };
