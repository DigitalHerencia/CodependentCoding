import { HeroSection } from "@/components/blocks/hero-section";
import { FAQAccordion } from "@/components/blocks/faq-section";
import { CTASimple } from "@/components/blocks/cta-section";
import { faqCopy } from "@/content/public-pages";
export function FAQPageTemplate() {
  return (
    <>
      <HeroSection.Centered
        badge="FAQ"
        title="Frequently Asked"
        titleHighlight="Questions"
        description={faqCopy.introduction}
      />
      <FAQAccordion items={faqCopy.items} className="pt-0" />
      <CTASimple
        title="Still have questions?"
        description="Excellent.
The architecture probably has a file for that."
        primaryAction={{ label: "VIEW THE FEATURES", href: "/features" }}
        secondaryAction={{ label: "SIGN IN", href: "/sign-in" }}
      />
    </>
  );
}
