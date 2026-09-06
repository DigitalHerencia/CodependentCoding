import { HeroSection } from "@/components/blocks/hero-section";
import { FAQAccordion } from "@/components/blocks/faq-section";
import { faqCopy } from "@/content/faq";
import Image from "next/image";

export function FAQPageTemplate() {
  return (
    <section>
      <Image
        src="/seperator.png"
        alt={faqCopy.separatorAlt}
        width={1200}
        height={400}
        className="h-auto w-full bg-background"
      />
      <HeroSection.Centered
        title={faqCopy.title}
        titleHighlight={faqCopy.titleHighlight}
        className="mt-8"
      />
      <FAQAccordion items={faqCopy.items} className="mb-20" />
      <Image
        src="/seperator.png"
        alt={faqCopy.separatorAlt}
        width={1200}
        height={400}
        className="h-auto w-full bg-background"
      />
    </section>
  );
}
