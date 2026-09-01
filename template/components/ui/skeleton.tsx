/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

import type { SkeletonProps } from "@/types/commonTypes";

const skeletonVariants = cva("bg-muted border-2 border-foreground/20", {
  variants: {
    variant: {
      /** Soft opacity breathe. The pre-v3.5 default. */
      pulse: "animate-pulse",
      /** Hard on/off — no interpolated fade. */
      stamp: "bk-skeleton-stamp",
      /** Marching cells on a stepped loop. */
      blocks: "bk-skeleton-blocks",
      /** A hard bar sweeping across the block. */
      scan: "bk-skeleton-scan",
      /** No motion at all. */
      none: "",
    },
  },
  defaultVariants: {
    variant: "pulse",
  },
});

function Skeleton({ className, variant, ...props }: SkeletonProps) {
  return (
    <div
      // ponytail: decorative placeholder — hidden from AT. Announce loading on
      // the container instead (aria-busy / role="status"), not per-skeleton.
      aria-hidden="true"
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Skeleton, skeletonVariants };
