export const loadedVibesProduct = {
  name: "Next Stack",
  description: "A focused product for teams who need clear, useful software.",
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
  organizations: true,
  invitations: true,
  rbac: true,
  billing: true,
  onboarding: true,
  admin: true,
  marketing: true,
  sampleDomain: true,
  stripeConnect: true,
  uploads: true,
  ai: true,
  maps: true,
} as const
