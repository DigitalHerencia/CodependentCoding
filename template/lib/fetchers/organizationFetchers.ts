import "server-only"

import { unstable_noStore as noStore } from "next/cache"

import { loadedVibesCapabilities } from "@/content/loadedvibes"
import { requireTenantContext } from "@/lib/auth/session"
import { assertCapability } from "@/lib/authz/assertions"
import { mapOrganizationSettingsDTO, mapTeamMemberDTO } from "@/lib/db/dto/organization.mappers"
import { organizationSettingsSelect, teamMemberSelect } from "@/lib/db/selects/organization.selects"
import { withTenantContext } from "@/lib/db/withTenantContext"
import { getOptionalEnv } from "@/lib/env"
import type { IntegrationReadinessDTO } from "@/types/organizationTypes"

export async function getOrganizationSettings() {
  noStore()
  const context = await requireTenantContext()
  assertCapability(context, "organization.read")
  const organization = await withTenantContext(context.organization.id, (tx) =>
    tx.organization.findUniqueOrThrow({
      where: { id: context.organization.id },
      select: organizationSettingsSelect,
    })
  )
  return mapOrganizationSettingsDTO(organization)
}

export async function getTeamMembers() {
  noStore()
  const context = await requireTenantContext()
  assertCapability(context, "membership.read")
  const members = await withTenantContext(context.organization.id, (tx) =>
    tx.membership.findMany({
      where: { organizationId: context.organization.id },
      orderBy: [{ role: "asc" }, { createdAt: "asc" }],
      select: teamMemberSelect,
    })
  )
  return members.map((member) => mapTeamMemberDTO(member, context.localUser.id))
}

function configured(...names: string[]): boolean {
  return names.every((name) => Boolean(getOptionalEnv(name)))
}

export async function getIntegrationReadiness(): Promise<IntegrationReadinessDTO[]> {
  noStore()
  const context = await requireTenantContext()
  assertCapability(context, "organization.read")
  return [
    {
      id: "clerk",
      label: "Clerk",
      configured: configured("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "CLERK_SECRET_KEY"),
      purpose: "Authentication and account identity",
    },
    ...(loadedVibesCapabilities.billing
      ? [
          {
            id: "stripe",
            label: "Stripe Billing",
            configured: configured(
              "STRIPE_SECRET_KEY",
              "STRIPE_WEBHOOK_SECRET",
              "STRIPE_RECURRING_PRICE_ID"
            ),
            purpose: "Subscriptions and customer billing",
          },
        ]
      : []),
    ...(loadedVibesCapabilities.stripeConnect
      ? [
          {
            id: "stripe-connect",
            label: "Stripe Connect",
            configured: configured("STRIPE_SECRET_KEY", "STRIPE_CONNECT_WEBHOOK_SECRET"),
            purpose: "Connected accounts and platform payments",
          },
        ]
      : []),
    {
      id: "cloudinary",
      label: "Cloudinary",
      configured: configured(
        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET"
      ),
      purpose: "Media upload and delivery",
    },
    {
      id: "hugging-face",
      label: "Hugging Face",
      configured: configured("HUGGINGFACE_TOKEN"),
      purpose: "Server-side inference",
    },
    {
      id: "mapbox",
      label: "Mapbox",
      configured: configured("MAPBOX_ACCESS_TOKEN", "NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN"),
      purpose: "Geocoding, directions, and maps",
    },
  ]
}
