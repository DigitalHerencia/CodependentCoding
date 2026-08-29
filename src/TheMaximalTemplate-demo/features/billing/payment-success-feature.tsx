import { PageHero } from "@/components/blocks/page-hero"
import { Alert } from "@/components/ui/alert"
import { hasCoreEntitlement } from "@/lib/fetchers/billingFetchers"

export async function PaymentSuccessFeature() {
  const active = await hasCoreEntitlement()
  return (
    <div className="grid gap-8">
      <PageHero
        eyebrow="Billing"
        title={active ? "Subscription active" : "Payment is being reconciled"}
        description="The synchronized application billing state is authoritative; this page never treats a query parameter as payment proof."
      />
      <Alert>
        <p className="font-semibold text-foreground">
          {active ? "Entitlement available" : "Confirmation pending"}
        </p>
        <p>
          {active
            ? "Your organization has the core entitlement."
            : "Stripe webhooks will update this surface when provider truth is reconciled."}
        </p>
      </Alert>
    </div>
  )
}
