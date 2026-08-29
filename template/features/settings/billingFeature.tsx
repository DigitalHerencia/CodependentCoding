import { PricingSection } from "@/components/blocks/pricing-sections";

export function BillingFeature() {
  return (
    <PricingSection
      title="Workspace billing"
      subtitle="Billing authorization is enforced by the invoicing and provider boundaries."
      tiers={[
        {
          name: "Current workspace",
          price: "Managed",
          description:
            "Review subscription state and invoices for the active organization.",
          features: [
            "Organization scoped",
            "Billing role aware",
            "Audited changes",
          ],
          cta: "View invoices",
          ctaHref: "/invoices",
          featured: true,
        },
      ]}
    />
  );
}
