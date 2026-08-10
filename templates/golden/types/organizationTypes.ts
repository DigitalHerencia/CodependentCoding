import type { OrganizationRole } from "@/types/authzTypes"

export type OrganizationSettingsDTO = {
  id: string
  name: string
  slug: string
  status: "active" | "suspended"
}

export type TeamMemberDTO = {
  id: string
  displayName: string
  email: string | null
  role: OrganizationRole
  joinedAt: string
  isCurrentUser: boolean
}

export type IntegrationReadinessDTO = {
  id: "clerk" | "stripe" | "stripe-connect" | "cloudinary" | "hugging-face" | "mapbox"
  label: string
  configured: boolean
  purpose: string
}
