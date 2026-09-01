import * as React from "react";
import { cn } from "@/lib/utils";

import type {
  MarqueeItemProps,
  MarqueeProps,
  MarqueeSeparatorProps,
} from "@/types/commonTypes";

const speedClasses = {
  slow: "animate-marquee-slow",
  normal: "animate-marquee",
  fast: "animate-marquee-fast",
};

const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  (
    {
      className,
      children,
      direction = "left",
      speed = "normal",
      pauseOnHover = true,
      bordered = true,
      repeat = 4,
      ...props
    },
    ref,
  ) => {
    // Use the speed-based class for both directions so `speed` is always
    // honored; flip to a right-scroll via animation-direction (the dedicated
    // *-reverse speed classes were never defined in the CSS).
    const animationClass = speedClasses[speed];
    const animationDirection = direction === "right" ? "reverse" : undefined;

    return (
      <div
        ref={ref}
        className={cn(
          "flex overflow-hidden",
          bordered && "border-3 border-foreground bg-background",
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "marquee-content flex shrink-0 items-center gap-8 py-3",
            animationClass,
            pauseOnHover && "hover:[animation-play-state:paused]",
          )}
          style={{ animationDirection }}
        >
          {Array.from({ length: repeat }).map((_, i) => (
            <React.Fragment key={i}>{children}</React.Fragment>
          ))}
        </div>
        <div
          className={cn(
            "marquee-content flex shrink-0 items-center gap-8 py-3",
            animationClass,
            pauseOnHover && "hover:[animation-play-state:paused]",
          )}
          style={{ animationDirection }}
          aria-hidden="true"
        >
          {Array.from({ length: repeat }).map((_, i) => (
            <React.Fragment key={i}>{children}</React.Fragment>
          ))}
        </div>
      </div>
    );
  },
);
Marquee.displayName = "Marquee";

const MarqueeItem = React.forwardRef<HTMLSpanElement, MarqueeItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 whitespace-nowrap px-4 text-lg font-bold uppercase tracking-wide",
          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);
MarqueeItem.displayName = "MarqueeItem";

const MarqueeSeparator = React.forwardRef<
  HTMLSpanElement,
  MarqueeSeparatorProps
>(({ className, children = "/", ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn("text-2xl font-black text-muted-foreground", className)}
      {...props}
    >
      {children}
    </span>
  );
});
MarqueeSeparator.displayName = "MarqueeSeparator";

export { Marquee, MarqueeItem, MarqueeSeparator };
