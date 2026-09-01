import type * as React from "react";
import type { VariantProps } from "class-variance-authority";

import type { badgeVariants } from "@/components/ui/badge";
import type { kbdVariants } from "@/components/ui/kbd";
import type { skeletonVariants } from "@/components/ui/skeleton";
import type { stepVariants } from "@/components/ui/stepper";
import type {
  timelineConnectorVariants,
  timelineDotVariants,
} from "@/components/ui/timeline";
import type { RevealOptions, StaggerOptions } from "@/lib/utils/motionCore";

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

export type RevealDirection = "up" | "down" | "left" | "right";

export interface RevealProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    Omit<RevealOptions, "rootMargin"> {
  direction?: RevealDirection;
  rootMargin?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export interface MotionProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof React.JSX.IntrinsicElements;
  press?: boolean;
  stamp?: boolean;
  pulse?: boolean;
}

export interface StaggerProps
  extends React.HTMLAttributes<HTMLDivElement>, StaggerOptions {
  as?: keyof React.JSX.IntrinsicElements;
}

export interface SkeletonProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

export interface StepperContextValue {
  activeStep: number;
  setActiveStep: (step: number) => void;
  totalSteps: number;
  orientation: "horizontal" | "vertical";
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  activeStep?: number;
  onStepChange?: (step: number) => void;
  orientation?: "horizontal" | "vertical";
}

export type StepperListProps = React.HTMLAttributes<HTMLDivElement>;

export interface StepperItemContextValue {
  index: number;
  triggerId: string;
}

export interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
}

export interface StepperTriggerProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof stepVariants> {
  showStepNumber?: boolean;
}

export type StepperSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

export interface StepperContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
}

export interface StepperActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onComplete?: () => void;
  prevLabel?: string;
  nextLabel?: string;
  completeLabel?: string;
}

export interface TimelineContextValue {
  orientation: "vertical" | "horizontal";
}

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal";
}

export interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: "completed" | "current" | "upcoming";
}

export interface TimelineDotProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineDotVariants> {}

export interface TimelineConnectorProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof timelineConnectorVariants>, "orientation"> {}
