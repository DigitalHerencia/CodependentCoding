import { PageHero } from "@/components/blocks/page-hero"
import { OnboardingForm } from "@/features/onboarding/onboarding-form"

export function OnboardingFeature() {
  return (
    <div className="grid gap-8">
      <PageHero
        eyebrow="Onboarding"
        title="Create your workspace."
        description="Your first organization establishes the local tenant and authorization boundary."
      />
      <OnboardingForm />
    </div>
  )
}
