import { loadedVibesCapabilities } from "@/content/loadedvibes"

export const publicNavigation = [
  ...(loadedVibesCapabilities.marketing
    ? [
        { href: "/pricing", label: "Pricing" },
        { href: "/faq", label: "FAQ" },
      ]
    : []),
  { href: "/contact", label: "Contact" },
] as const

export const applicationNavigation = [
  { href: "/dashboard", label: "Dashboard" },
  ...(loadedVibesCapabilities.sampleDomain
    ? [{ href: "/projects", label: "Projects" }]
    : []),
  ...(loadedVibesCapabilities.invitations
    ? [{ href: "/team", label: "Team" }]
    : []),
  { href: "/uploads", label: "Media" },
  { href: "/maps", label: "Maps" },
  { href: "/ai", label: "AI" },
  { href: "/settings", label: "Settings" },
] as const
