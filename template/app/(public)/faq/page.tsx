import { FAQTwoColumns } from "@/components/blocks/faq-section";
import { HeroSection } from "@/components/blocks/hero-section";

export default function Page() {
  return (
    <>
      <HeroSection.Minimal
        title="Frequently asked questions"
        description="How the maximal application, recipes, and protected capabilities fit together."
      />
      <FAQTwoColumns
        title="Architecture and access"
        items={[
          {
            question: "Do I need to sign in to explore?",
            answer:
              "No. Seeded demonstration surfaces are browsable while signed out.",
          },
          {
            question: "Can signed-out visitors change data?",
            answer:
              "No. Protected writes retain authentication, authorization, scope, and validation checks.",
          },
          {
            question: "Is each recipe a separate application?",
            answer:
              "No. Every recipe is a coherent subset of one maximal application.",
          },
          {
            question: "Are providers required to browse the demo?",
            answer:
              "No. Optional integrations report their configuration state without breaking unrelated routes.",
          },
        ]}
      />
    </>
  );
}
