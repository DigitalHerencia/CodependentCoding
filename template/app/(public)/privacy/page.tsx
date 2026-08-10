import { PageHero } from "@/components/blocks/page-hero"

export default function PrivacyPage() {
  return (
    <div className="grid gap-6">
      <PageHero
        eyebrow="Legal"
        title="Privacy"
        description="Replace this white-label policy with counsel-approved product terms before launch."
      />
      <p className="text-muted-foreground">
        The application template does not make legal or compliance decisions for your product.
      </p>
    </div>
  )
}
