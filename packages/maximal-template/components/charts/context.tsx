"use client";

import * as React from "react";
import type { ChartContextProps } from "@/types/chartTypes";

export const ChartContext = React.createContext<ChartContextProps | null>(null);

export function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}
