import { PageHero } from "@/components/blocks/page-hero"
import { marketingContent } from "@/content/marketing"

export default function ContactPage() {
  return (
    <PageHero
      eyebrow="Contact"
      title="Talk with our team."
      description={`Reach us at ${marketingContent.contactEmail}.`}
    />
  )
}
