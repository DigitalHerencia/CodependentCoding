import { PageHero } from "@/components/blocks/page-hero"
import { InferenceFormClient } from "@/features/ai/inference-form-client"

export function InferenceFeature() {
  return (
    <div className="grid gap-8">
      <PageHero
        eyebrow="AI"
        title="Use a model through a stable application boundary."
        description="Hugging Face provider objects and credentials remain server-only."
      />
      <InferenceFormClient />
    </div>
  )
}
