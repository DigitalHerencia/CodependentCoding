export const loadedVibesProduct = {
  name: "Next Stack",
  description: "A focused SaaS product built with Loaded Vibes.",
} as const

export type LoadedVibesDesign = {
  theme: "obsidian" | "paper" | "electric"
  radius: "compact" | "medium" | "rounded"
  density: "compact" | "comfortable"
  navigation: "sidebar" | "topbar"
  mode: "light" | "dark" | "system"
}

export const loadedVibesDesign: LoadedVibesDesign = {
  theme: "obsidian",
  radius: "medium",
  density: "comfortable",
  navigation: "sidebar",
  mode: "system",
}

export const loadedVibesCapabilities = {
  marketing: false,
  sampleDomain: false,
  stripeConnect: false,
} as const
