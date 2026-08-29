import { PageHero } from "@/components/blocks/page-hero"
import { getAdminWebhooks } from "@/lib/fetchers/adminFetchers"

export async function AdminWebhooksFeature() {
  const webhooks = await getAdminWebhooks()
  return (
    <div className="grid gap-8">
      <PageHero
        eyebrow="Application administration"
        title="Webhooks"
        description="Recent provider processing state and bounded failure details from the idempotency ledger."
      />
      <div className="grid gap-3">
        {webhooks.map((webhook) => (
          <article key={webhook.id} className="grid gap-1 border bg-card p-4 md:grid-cols-3">
            <div>
              <p className="font-medium">{webhook.provider}</p>
              <p className="text-sm text-muted-foreground">{webhook.eventType}</p>
            </div>
            <p className="text-sm">
              {webhook.status} · attempt {webhook.attemptCount}
            </p>
            <p className="text-sm text-muted-foreground">
              {webhook.processingError ?? "No processing error"}
            </p>
          </article>
        ))}
        {webhooks.length === 0 ? (
          <p className="text-muted-foreground">No webhooks recorded.</p>
        ) : null}
      </div>
    </div>
  )
}
