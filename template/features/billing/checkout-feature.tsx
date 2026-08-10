import { PageHero } from "@/components/blocks/page-hero"
import { Button } from "@/components/ui/button"
import { createCheckoutRedirectAction } from "@/lib/actions/billingActions"

export function CheckoutFeature() {
  return (
    <div className="grid gap-6">
      <PageHero
        eyebrow="Billing"
        title="Choose the plan configured for this product."
        description="Checkout creation is authorized and delegated to Stripe through a server workflow."
      />
      <form action={createCheckoutRedirectAction}>
        <Button>Continue to checkout</Button>
      </form>
    </div>
  )
}
