import { CHART_PALETTES } from "@/lib/constants/chartConstants";
import type { ChartConfig, ChartPalette } from "@/types/chartTypes";

// Helper to get colors from a palette
export function getChartColor(palette: ChartPalette, index: number): string {
  const colors = CHART_PALETTES[palette];
  const color = colors[index % colors.length];
  if (color === undefined) {
    throw new RangeError("Chart color index must be a non-negative integer.");
  }
  return color;
}

// Generate ChartConfig from palette
export function createChartConfig(
  keys: string[],
  labels: string[],
  palette: ChartPalette = "bold",
): ChartConfig {
  const config: ChartConfig = {};
  keys.forEach((key, index) => {
    config[key] = {
      label: labels[index] || key,
      color: getChartColor(palette, index),
    };
  });
  return config;
}
