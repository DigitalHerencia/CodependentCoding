import { PaymentSuccessFeature } from "@/features/billing/payment-success-feature"
import { loadedVibesCapabilities } from "@/content/loadedvibes"
import { notFound } from "next/navigation"

export default function BillingSettingsPage() {
  if (!loadedVibesCapabilities.billing) notFound()
  return <PaymentSuccessFeature />
}
