import type * as React from "react";
import type { VariantProps } from "class-variance-authority";

import type { badgeVariants } from "@/components/ui/badge";
import type { kbdVariants } from "@/components/ui/kbd";

export interface OrganizationDTO {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  timezone: string;
  locale: string;
  defaultCurrency: string;
  memberCount: number;
}

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof kbdVariants> {}

export interface KbdComboProps extends Omit<KbdProps, "children"> {
  keys: string[];
  separator?: React.ReactNode;
}

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: "left" | "right";
  speed?: "slow" | "normal" | "fast";
  pauseOnHover?: boolean;
  bordered?: boolean;
  repeat?: number;
}

export interface MarqueeItemProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export interface MarqueeSeparatorProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}
