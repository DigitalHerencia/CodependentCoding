import { HeroSection } from "@/components/blocks/hero-section";
import { FAQAccordion } from "@/components/blocks/faq-section";
import { faqCopy } from "@/content/public-pages";
import Image from "next/image";

export function FAQPageTemplate() {
  return (
    <section>
      <Image
        src="/seperator.png"
        alt="Caution"
        width={1200}
        height={400}
        className="h-auto w-full bg-background"
      />
      <HeroSection.Centered
        title="Frequently Asked"
        titleHighlight="Questions"
        className="mt-8"
      />
      <FAQAccordion items={faqCopy.items} className="mb-28" />
      <Image
        src="/seperator.png"
        alt="Caution"
        width={1200}
        height={400}
        className="h-auto w-full bg-background"
      />
    </section>
  );
}
