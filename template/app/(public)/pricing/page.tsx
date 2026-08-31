import { FAQTwoColumns } from "@/components/blocks/faq-sections";
import { PricingSection } from "@/components/blocks/pricing-sections";

const tiers = [
  {
    name: "Foundation",
    price: "$0",
    period: "project",
    description: "Evaluate the canonical architecture locally.",
    features: ["Shared application core", "One recipe", "Local development"],
    cta: "Explore dashboard",
    ctaHref: "/dashboard",
  },
  {
    name: "Product",
    price: "$49",
    period: "month",
    description: "Configure a focused SaaS application from the superset.",
    features: ["All recipes", "Tenant boundaries", "Provider selections"],
    cta: "Inspect CRM",
    ctaHref: "/crm/contacts",
    featured: true,
  },
  {
    name: "Team",
    price: "$149",
    period: "month",
    description: "Shared delivery for multiple products and collaborators.",
    features: ["Team workspaces", "Reusable definitions", "Priority support"],
    cta: "Contact us",
    ctaHref: "/contact",
  },
];

export default function Page() {
  return (
    <>
      <PricingSection
        title="Pricing without architecture tax"
        subtitle="Choose an operating tier; the application contracts stay intact."
        tiers={tiers}
      />
      <FAQTwoColumns
        title="Pricing questions"
        items={[
          {
            question: "Does each recipe become a separate application?",
            answer:
              "No. Recipes select coherent slices from one maximal implementation.",
          },
          {
            question: "Are provider charges included?",
            answer:
              "Provider usage is billed by each selected provider and remains explicit.",
          },
        ]}
      />
    </>
  );
}
