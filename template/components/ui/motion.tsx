"use client";

/* eslint-disable react-refresh/only-export-components */
/**
 * BoldKit Motion — React adapter (L3).
 *
 * Thin wrapper around @boldkit/motion-core. Adds React lifecycle wiring
 * to the framework-agnostic primitives. The Vue adapter mirrors this
 * surface 1:1 so apps can switch frameworks without re-learning the API.
 *
 * Requires `motion.css` (L2 recipes) to be loaded. If you're using
 * BoldKit's globals.css, the recipes are already included.
 */
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  observeReveal,
  staggerChildren,
  triggerAnimation,
  startViewTransition,
  prefersReducedMotion,
  type PageTransition,
} from "@/lib/utils/motionCore";

import type {
  MotionProps,
  RevealProps,
  StaggerProps,
} from "@/types/commonTypes";

// ──────────────────────────────────────────────────────────────────
// <Reveal> — scroll-triggered entrance
// ──────────────────────────────────────────────────────────────────

export const Reveal = React.forwardRef<HTMLDivElement, RevealProps>(
  (
    {
      direction = "up",
      rootMargin,
      threshold,
      once,
      delay,
      as,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const innerRef = React.useRef<HTMLDivElement | null>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

    React.useEffect(() => {
      const el = innerRef.current;
      if (!el) return;
      return observeReveal(el, { rootMargin, threshold, once, delay });
    }, [rootMargin, threshold, once, delay]);

    const Tag = (as ?? "div") as React.ElementType;
    return (
      <Tag
        ref={innerRef}
        className={cn("bk-reveal", `bk-reveal-${direction}`, className)}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);
Reveal.displayName = "Reveal";

// ──────────────────────────────────────────────────────────────────
// <Motion> — declarative recipe composition
// ──────────────────────────────────────────────────────────────────

export const Motion = React.forwardRef<HTMLElement, MotionProps>(
  ({ as, press, stamp, pulse, className, children, ...rest }, ref) => {
    const Tag = (as ?? "div") as React.ElementType;
    return (
      <Tag
        ref={ref}
        className={cn(
          press && "bk-press",
          stamp && "bk-stamp-in",
          pulse && "bk-pulse-shadow",
          className,
        )}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);
Motion.displayName = "Motion";

// ──────────────────────────────────────────────────────────────────
// <Stagger> — sequence children entrance
// ──────────────────────────────────────────────────────────────────

export const Stagger = React.forwardRef<HTMLDivElement, StaggerProps>(
  (
    { delay, initialDelay, selector, as, className, children, ...rest },
    ref,
  ) => {
    const innerRef = React.useRef<HTMLDivElement | null>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

    React.useEffect(() => {
      const el = innerRef.current;
      if (!el) return;
      return staggerChildren(el, { delay, initialDelay, selector });
    }, [delay, initialDelay, selector]);

    const Tag = (as ?? "div") as React.ElementType;
    return (
      <Tag ref={innerRef} className={className} {...rest}>
        {children}
      </Tag>
    );
  },
);
Stagger.displayName = "Stagger";

// ──────────────────────────────────────────────────────────────────
// useShake — imperative shake-on-error
// ──────────────────────────────────────────────────────────────────

/**
 * Returns a function that shakes a given element (e.g. an invalid input).
 *
 *   const shake = useShake()
 *   shake(inputRef.current)
 */
export function useShake() {
  return React.useCallback(async (el: Element | null) => {
    if (!el) return;
    await triggerAnimation(el, "bk-shake-x");
  }, []);
}

// ──────────────────────────────────────────────────────────────────
// useViewTransition — wraps document.startViewTransition
// ──────────────────────────────────────────────────────────────────

/**
 * Returns a function that runs `callback` inside a view transition where
 * supported. Falls back to invoking the callback directly. Always safe to call.
 */
export function useViewTransition() {
  return React.useCallback(
    (callback: () => void | Promise<void>, recipe?: PageTransition) => {
      return startViewTransition(callback, recipe);
    },
    [],
  );
}

// Re-export the core helper so consumers don't need a second import
export { prefersReducedMotion };
