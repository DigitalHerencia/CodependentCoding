import type * as React from "react";
import type { CHART_PALETTES, THEMES } from "@/lib/constants/chartConstants";

// ---------------------------------------------------------------------------
// Chart annotation vocabulary (shared, unified across React/Recharts and
// Vue/echarts — identical shape so the same annotation objects author in both).
// ---------------------------------------------------------------------------

export interface ChartReferenceLineSpec {
  axis: "x" | "y";
  value: number | string;
  label?: string;
  color?: string;
  dash?: boolean;
}

export interface ChartCalloutSpec {
  x: number | string;
  y: number;
  text: string;
  placement?: "top" | "right" | "bottom" | "left";
}

export interface ChartArrowSpec {
  from: { x: number | string; y: number };
  to: { x: number | string; y: number };
  label?: string;
}

export type ChartAnnotation =
  | ({ kind: "referenceLine" } & ChartReferenceLineSpec)
  | ({ kind: "callout" } & ChartCalloutSpec)
  | ({ kind: "arrow" } & ChartArrowSpec);

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

export type ChartContextProps = {
  config: ChartConfig;
};

export type ChartPalette = keyof typeof CHART_PALETTES;
