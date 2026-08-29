import { PageHero } from "@/components/blocks/page-hero"
import { getAdminBilling } from "@/lib/fetchers/adminFetchers"

export async function AdminBillingFeature() {
  const subscriptions = await getAdminBilling()
  return (
    <div className="grid gap-8">
      <PageHero
        eyebrow="Application administration"
        title="Billing"
        description="Synchronized subscription state from the application database; provider secrets remain outside this surface."
      />
      <div className="grid gap-3">
        {subscriptions.map((subscription) => (
          <article key={subscription.id} className="grid gap-1 border bg-card p-4 md:grid-cols-3">
            <div>
              <p className="font-medium">{subscription.organizationName}</p>
              <p className="text-sm text-muted-foreground">{subscription.organizationSlug}</p>
            </div>
            <p className="text-sm">Status: {subscription.status}</p>
            <p className="text-sm">
              {subscription.cancelAtPeriodEnd ? "Cancels at period end" : "Renews"}
            </p>
          </article>
        ))}
        {subscriptions.length === 0 ? (
          <p className="text-muted-foreground">No subscriptions recorded.</p>
        ) : null}
      </div>
    </div>
  )
}
