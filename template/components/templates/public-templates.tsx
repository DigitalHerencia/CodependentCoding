// Why: Templates: pure presentation for the public marketing and legal pages, composed from blocks and content/.
import { HeroSection } from "@/components/blocks/hero-section";
import { FAQAccordion } from "@/components/blocks/faq-section";
import { faqCopy } from "@/content/faq";
import Image from "next/image";
import { FeatureContentGrid } from "@/components/blocks/feature-grid";
import { TestimonialsGrid } from "@/components/blocks/testimonials";
import { CTASimple } from "@/components/blocks/cta-section";
import { landingCopy, pipelineCards } from "@/content/landing";
import { LegalDocumentSection } from "@/components/blocks/legal-document-section";
import { privacyCopy } from "@/content/privacy";
import { termsCopy } from "@/content/terms";

export function FAQPageTemplate() {
  return (
    <section>
      <Image
        src="/separator.png"
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
        src="/separator.png"
        alt={faqCopy.separatorAlt}
        width={1200}
        height={400}
        className="h-auto w-full bg-background"
      />
    </section>
  );
}

export function LandingPageTemplate() {
  return (
    <section>
      <Image
        src="/separator.png"
        alt={landingCopy.separatorAlt}
        width={1200}
        height={400}
        className="h-auto w-full bg-background"
      />
      <HeroSection.Centered
        title={landingCopy.title}
        titleHighlight={landingCopy.titleHighlight}
        description={landingCopy.description}
        className="y-space-8 mt-12 mb-12 bg-background text-foreground"
        primaryAction={landingCopy.primaryAction}
        secondaryAction={landingCopy.secondaryAction}
      />
      <Image
        src="/logo-cloud.png"
        alt={landingCopy.integrationsAlt}
        width={1200}
        height={200}
        className="h-auto w-full"
      />
      <FeatureContentGrid
        id="features"
        title={landingCopy.pipelineTitle}
        items={pipelineCards}
        className="scroll-mt-20 bg-background py-16 text-foreground md:py-24"
      />
      <TestimonialsGrid
        title={landingCopy.testimonialsTitle}
        className="border-y border-foreground/20 bg-primary/10 py-16 text-foreground md:py-24"
        cardClassName="bg-background text-foreground [&_svg]:text-foreground"
        testimonials={landingCopy.testimonials}
      />
      <CTASimple
        title={landingCopy.ctaTitle}
        description={landingCopy.ctaDescription}
        className="bg-background py-38 text-foreground"
        primaryAction={landingCopy.primaryAction}
        secondaryAction={landingCopy.secondaryAction}
      />
      <Image
        src="/separator.png"
        alt={landingCopy.separatorAlt}
        width={1200}
        height={400}
        className="h-auto w-full bg-background"
      />
    </section>
  );
}

export function PrivacyPageTemplate() {
  return (
    <section>
      <Image
        src="/separator.png"
        alt={privacyCopy.separatorAlt}
        width={1200}
        height={400}
        className="h-auto w-full bg-background"
      />
      <HeroSection.Centered
        title={privacyCopy.title}
        titleHighlight={privacyCopy.titleHighlight}
        className="mt-8"
      />
      <LegalDocumentSection {...privacyCopy} />
      <Image
        src="/separator.png"
        alt={privacyCopy.separatorAlt}
        width={1200}
        height={400}
        className="h-auto w-full bg-background"
      />
    </section>
  );
}

export function TermsPageTemplate() {
  return (
    <section>
      <Image
        src="/separator.png"
        alt={termsCopy.separatorAlt}
        width={1200}
        height={400}
        className="h-auto w-full bg-background"
      />
      <HeroSection.Centered
        title={termsCopy.title}
        titleHighlight={termsCopy.titleHighlight}
        className="mt-8"
      />
      <LegalDocumentSection {...termsCopy} />
      <Image
        src="/separator.png"
        alt={termsCopy.separatorAlt}
        width={1200}
        height={400}
        className="h-auto w-full bg-background"
      />
    </section>
  );
}
