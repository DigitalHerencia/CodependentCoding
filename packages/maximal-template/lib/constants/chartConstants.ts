// Format: { THEME_NAME: CSS_SELECTOR }
export const THEMES = { light: "", dark: ".dark" } as const;

// Neubrutalism color palettes for charts
export const CHART_PALETTES = {
  bold: [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
    "hsl(var(--accent))",
    "hsl(var(--success))",
    "hsl(var(--warning))",
    "hsl(var(--info))",
  ],
  vibrant: [
    "hsl(0 84% 60%)", // Coral red
    "hsl(174 62% 50%)", // Teal
    "hsl(49 100% 60%)", // Yellow
    "hsl(280 65% 60%)", // Purple
    "hsl(145 63% 49%)", // Green
    "hsl(212 100% 60%)", // Blue
  ],
  pastel: [
    "hsl(0 84% 75%)", // Light coral
    "hsl(174 62% 70%)", // Light teal
    "hsl(49 100% 75%)", // Light yellow
    "hsl(280 65% 75%)", // Light purple
    "hsl(145 63% 70%)", // Light green
    "hsl(212 100% 75%)", // Light blue
  ],
  monochrome: [
    "hsl(var(--foreground))",
    "hsl(var(--foreground) / 0.8)",
    "hsl(var(--foreground) / 0.6)",
    "hsl(var(--foreground) / 0.4)",
    "hsl(var(--foreground) / 0.2)",
    "hsl(var(--foreground) / 0.1)",
  ],
} as const;
