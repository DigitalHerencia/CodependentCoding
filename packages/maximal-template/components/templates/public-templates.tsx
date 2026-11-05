// Why: Templates: pure presentation for the public marketing and legal pages, composed from blocks and content/.
import { HeroSection } from "@/components/blocks/public-blocks";
import { FAQAccordion } from "@/components/blocks/public-blocks.client";
import { faqCopy } from "@/content/faq";
import Image from "next/image";
import Link from "next/link";
import { FeatureContentGrid } from "@/components/blocks/public-blocks";
import { TestimonialsGrid } from "@/components/blocks/public-blocks.client";
import { CTASimple } from "@/components/blocks/public-blocks.client";
import { landingCopy, pipelineCards } from "@/content/landing";
import { LegalDocumentSection } from "@/components/blocks/public-blocks";
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

export function OfflinePageTemplate() {
  return (
    <main className="mx-auto grid min-h-dvh max-w-2xl place-items-center px-6 py-16">
      <section className="w-full border border-neutral-400 bg-black p-8 shadow-[8px_8px_0_0_oklch(54.6%_0.245_262.881_/_0.24)]">
        <p className="font-mono text-xs tracking-[0.16em] text-blue-400 uppercase">
          Offline
        </p>
        <h1 className="mt-3 font-(family-name:--font-display) text-4xl tracking-[0.04em] text-white uppercase">
          You are offline
        </h1>
        <p className="mt-4 max-w-prose text-neutral-300">
          Nothing in the workspace is available offline. Reconnect, then try
          again.
        </p>
        <Link
          className="mt-6 inline-flex border border-blue-500 bg-blue-600 px-4 py-2 font-mono text-sm text-white hover:bg-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
          href="/"
        >
          Retry
        </Link>
      </section>
    </main>
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
