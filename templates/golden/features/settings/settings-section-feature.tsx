import { PageHero } from "@/components/blocks/page-hero"

export function SettingsSectionFeature({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="grid gap-8">
      <PageHero eyebrow="Settings" title={title} description={description} />
      <div className="border bg-card p-6 text-sm text-muted-foreground">
        This semantic surface is ready for the product-specific controls that belong to it.
      </div>
    </div>
  )
}
