import { PageHero } from "@/components/blocks/page-hero"

export default function TermsPage() {
  return (
    <div className="grid gap-6">
      <PageHero
        eyebrow="Legal"
        title="Terms"
        description="Replace this white-label policy with counsel-approved product terms before launch."
      />
      <p className="text-muted-foreground">
        Provider setup and product policies remain owner-controlled.
      </p>
    </div>
  )
}
