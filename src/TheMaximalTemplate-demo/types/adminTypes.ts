export type AdminUserDTO = {
  id: string
  displayName: string
  email: string | null
  status: "active" | "disabled"
  isApplicationAdmin: boolean
  createdAt: string
}

export type AdminOrganizationDTO = {
  id: string
  name: string
  slug: string
  status: "active" | "suspended"
  memberCount: number
  projectCount: number
  createdAt: string
}

export type AdminBillingDTO = {
  id: string
  organizationName: string
  organizationSlug: string
  status: string
  priceId: string
  cancelAtPeriodEnd: boolean
  currentPeriodEnd: string | null
  updatedAt: string
}

export type AdminWebhookDTO = {
  id: string
  provider: string
  eventType: string
  status: string
  attemptCount: number
  receivedAt: string
  processedAt: string | null
  processingError: string | null
}
