import { PageHero } from "@/components/blocks/page-hero"

const providerWebhooks = [
  "/api/clerk/webhooks",
  "/api/stripe/webhooks",
  "/api/stripe/connect/webhooks",
  "/api/cloudinary/webhooks",
] as const

export function DeveloperSettingsFeature() {
  return (
    <div className="grid gap-8">
      <PageHero
        eyebrow="Settings"
        title="Developer"
        description="Stable application boundaries for local extension and provider configuration."
      />
      <section className="grid max-w-2xl gap-4 border bg-card p-6">
        <h2 className="text-lg font-semibold">Provider webhook endpoints</h2>
        <ul className="grid gap-2 font-mono text-sm">
          {providerWebhooks.map((webhook) => (
            <li key={webhook}>{webhook}</li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          Configure secrets through environment variables; this surface never reads or renders them.
        </p>
      </section>
    </div>
  )
}
