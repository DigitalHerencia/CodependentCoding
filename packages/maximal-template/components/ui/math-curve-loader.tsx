"use client";

import type { LoaderCurveKey } from "@/types/uiTypes";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utilites/utils";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import {
  prefersReducedMotion,
  onReducedMotionChange,
} from "@/lib/utilites/motion-core";
import {
  buildPath,
  getPoint,
  getAngle,
  getDetailScale,
  getCurvePulseDuration,
} from "@/lib/utilites/math-curves";

const mathCurveLoaderVariants = cva("", {
  variants: {
    size: {
      xs: "h-6 w-6",
      sm: "h-8 w-8",
      md: "h-12 w-12",
      lg: "h-16 w-16",
      xl: "h-24 w-24",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const SPEED_DURATION: Record<"slow" | "normal" | "fast", number> = {
  slow: 9000,
  normal: 5500,
  fast: 3000,
};

export interface MathCurveLoaderProps
  extends
    React.SVGAttributes<SVGSVGElement>,
    VariantProps<typeof mathCurveLoaderVariants> {
  curve?: LoaderCurveKey;
  speed?: "slow" | "normal" | "fast";
  trackColor?: string;
  headColor?: string;
  strokeWidth?: number;
  headSize?: number;
}

const MathCurveLoader = React.forwardRef<SVGSVGElement, MathCurveLoaderProps>(
  (
    {
      className,
      size,
      curve = "rose",
      speed = "normal",
      trackColor,
      headColor,
      strokeWidth = 4,
      headSize = 8,
      "aria-label": ariaLabel = "Loading",
      ...props
    },
    ref,
  ) => {
    const pathRef = React.useRef<SVGPathElement>(null);
    const rectRef = React.useRef<SVGRectElement>(null);
    const rafRef = React.useRef<number>(0);
    const startTimeRef = React.useRef<number>(performance.now());

    const durationMs = SPEED_DURATION[speed] ?? SPEED_DURATION.normal;

    // Rebuild static track path when curve changes
    const trackPath = React.useMemo(() => buildPath(curve, 1.0), [curve]);

    React.useEffect(() => {
      startTimeRef.current = performance.now();

      // Draw one frame. Separated from scheduling so reduced motion can render
      // a static frame without starting the loop.
      const draw = () => {
        const now = performance.now();
        const elapsed = (now - startTimeRef.current) % durationMs;
        const progress = elapsed / durationMs;
        const detailScale = getDetailScale(now, getCurvePulseDuration(curve));

        const { x, y } = getPoint(curve, progress, detailScale);
        const angle = getAngle(curve, progress, detailScale);

        // Update track path with breathing detail scale
        if (pathRef.current) {
          pathRef.current.setAttribute("d", buildPath(curve, detailScale));
        }

        // Update head rect position and rotation
        if (rectRef.current) {
          const cx = x;
          const cy = y;
          rectRef.current.setAttribute("x", String(cx - headSize / 2));
          rectRef.current.setAttribute("y", String(cy - headSize / 2));
          rectRef.current.setAttribute(
            "transform",
            `rotate(${angle} ${cx} ${cy})`,
          );
        }
      };

      const tick = () => {
        draw();
        rafRef.current = requestAnimationFrame(tick);
      };

      // A CSS media query can't stop a loop that mutates SVG attributes, so
      // the reduced-motion preference has to be consulted here. Paint one
      // static frame and stop; re-subscribing means flipping the OS setting
      // mid-session starts or stops the loop without a remount.
      const start = () => {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
        if (prefersReducedMotion()) {
          draw();
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      };

      start();
      const unsubscribe = onReducedMotionChange(start);

      return () => {
        unsubscribe();
        cancelAnimationFrame(rafRef.current);
      };
    }, [curve, speed, durationMs, headSize]);

    const resolvedTrackStroke = trackColor ?? "currentColor";
    const resolvedHeadFill = headColor ?? "hsl(var(--primary))";

    return (
      <ErrorBoundary>
        <svg
          ref={ref}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          role="status"
          aria-label={ariaLabel}
          className={cn(mathCurveLoaderVariants({ size }), "group", className)}
          {...props}
        >
          {/* Track layer */}
          <path
            ref={pathRef}
            d={trackPath}
            fill="none"
            stroke={resolvedTrackStroke}
            strokeWidth={strokeWidth}
            strokeOpacity={0.2}
            strokeLinecap="square"
            strokeLinejoin="miter"
            className="transition-[stroke-opacity] duration-200 group-hover:[stroke-opacity:0.4]"
          />
          {/* Head square */}
          <rect
            ref={rectRef}
            width={headSize}
            height={headSize}
            x={50 - headSize / 2}
            y={50 - headSize / 2}
            fill={resolvedHeadFill}
            stroke="currentColor"
            strokeWidth={1.5}
          />
        </svg>
      </ErrorBoundary>
    );
  },
);
MathCurveLoader.displayName = "MathCurveLoader";

export { MathCurveLoader, mathCurveLoaderVariants };
