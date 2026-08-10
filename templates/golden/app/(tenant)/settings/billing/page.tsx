import { BillingSettingsFeature } from "@/features/billing/billing-settings-feature"
import { loadedVibesCapabilities } from "@/content/loadedvibes"
import { notFound } from "next/navigation"

export default function BillingSettingsPage() {
  if (!loadedVibesCapabilities.billing) notFound()
  return <BillingSettingsFeature />
}
