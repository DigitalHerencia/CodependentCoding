import { PageHero } from "@/components/blocks/page-hero"
import { getIntegrationReadiness } from "@/lib/fetchers/organizationFetchers"

export async function IntegrationSettingsFeature() {
  const integrations = await getIntegrationReadiness()
  return (
    <div className="grid gap-8">
      <PageHero
        eyebrow="Settings"
        title="Integrations"
        description="Configuration readiness is reported without returning or rendering provider secrets."
      />
      <div className="grid gap-3 md:grid-cols-2">
        {integrations.map((integration) => (
          <article key={integration.id} className="border bg-card p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">{integration.label}</h2>
              <span className={integration.configured ? "text-primary" : "text-muted-foreground"}>
                {integration.configured ? "Configured" : "Setup required"}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{integration.purpose}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
