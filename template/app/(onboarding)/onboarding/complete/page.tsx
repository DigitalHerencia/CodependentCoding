import Link from "next/link"
import { PageHero } from "@/components/blocks/page-hero"
import { Button } from "@/components/ui/button"

export default function OnboardingCompletePage() {
  return (
    <div className="grid gap-6">
      <PageHero
        eyebrow="Onboarding"
        title="Workspace ready."
        description="Continue into the authenticated application."
      />
      <Button asChild>
        <Link href="/dashboard">Open dashboard</Link>
      </Button>
    </div>
  )
}
