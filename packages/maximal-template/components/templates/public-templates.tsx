/**
 * Public page templates for the Maximal Template.
 *
 * @remarks
 * These templates arrange presentation-only public blocks and media. They
 * obtain approved copy from `content/public.ts` and do not access authentication,
 * persisted data, server actions, or workflows.
 */

import {
  CTASimple,
  FAQAccordion,
  FeatureContentGrid,
  HeroSection,
  LegalDocumentSection,
  OfflinePageBlock,
  TestimonialsGrid,
} from "@/components/blocks/public-blocks";
import {
  faqCopy,
  landingCopy,
  pipelineCards,
  privacyCopy,
  termsCopy,
} from "@/content/public";
import Image from "next/image";

// ============================================================================
// FAQ PAGE TEMPLATE
// ============================================================================

/**
 * Composes the public FAQ hero, accessible accordion, and separator images.
 *
 * @returns The FAQ page's presentation tree.
 * @public
 */
export function FAQPageTemplate() {
  return (
    <>
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
      <FAQAccordion
        items={faqCopy.items.map((item) => ({
          question: item.question,
          answer: <span className="whitespace-pre-line">{item.answer}</span>,
        }))}
        className="mb-20"
      />
      <Image
        src="/separator.png"
        alt={faqCopy.separatorAlt}
        width={1200}
        height={400}
        className="h-auto w-full bg-background"
      />
    </>
  );
}

// ============================================================================
// LANDING PAGE TEMPLATE
// ============================================================================

/**
 * Composes the public landing hero, feature grid, testimonials, and CTA.
 *
 * @returns The landing page's presentation tree.
 * @public
 */
export function LandingPageTemplate() {
  return (
    <>
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
        description={
          <>
            <p>
              <strong>
                <em>{landingCopy.description.tagline}</em>
              </strong>
            </p>
            <p className="whitespace-pre-line">
              {landingCopy.description.lines.join("\n")}
            </p>
          </>
        }
        className="mt-12 mb-12 bg-background text-foreground"
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
        items={pipelineCards.map((item) => ({
          title: item.title,
          content: <p>{item.content}</p>,
        }))}
        className="scroll-mt-20 bg-background py-16 text-foreground md:py-24"
      />
      <TestimonialsGrid
        title={landingCopy.testimonialsTitle}
        testimonials={landingCopy.testimonials}
        className="border-y border-foreground/20 bg-primary/10 py-16 text-foreground md:py-24"
        cardClassName="bg-background text-foreground [&_svg]:text-foreground"
      />
      <CTASimple
        title={<span className="whitespace-pre-line">{landingCopy.ctaTitle}</span>}
        description={
          <span className="whitespace-pre-line">
            {landingCopy.ctaDescription}
          </span>
        }
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
    </>
  );
}

// ============================================================================
// PRIVACY PAGE TEMPLATE
// ============================================================================

/**
 * Composes the public privacy-policy page from the approved copy.
 *
 * @returns The privacy page's presentation tree.
 * @public
 */
export function PrivacyPageTemplate() {
  return (
    <>
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
      <LegalDocumentSection
        updatedAt={privacyCopy.updatedAt}
        updatedAtDateTime={privacyCopy.updatedAtDateTime}
        updatedAtLabel={privacyCopy.updatedAtLabel}
        introduction={<p>{privacyCopy.introduction}</p>}
        sections={privacyCopy.sections.map((section) => ({
          id: section.id,
          title: section.title,
          content: <p>{section.content}</p>,
        }))}
      />
      <Image
        src="/separator.png"
        alt={privacyCopy.separatorAlt}
        width={1200}
        height={400}
        className="h-auto w-full bg-background"
      />
    </>
  );
}

// ============================================================================
// TERMS PAGE TEMPLATE
// ============================================================================

/**
 * Composes the public terms-of-service page from the approved copy.
 *
 * @returns The terms page's presentation tree.
 * @public
 */
export function TermsPageTemplate() {
  return (
    <>
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
      <LegalDocumentSection
        updatedAt={termsCopy.updatedAt}
        updatedAtDateTime={termsCopy.updatedAtDateTime}
        updatedAtLabel={termsCopy.updatedAtLabel}
        introduction={<p>{termsCopy.introduction}</p>}
        sections={termsCopy.sections.map((section) => ({
          id: section.id,
          title: section.title,
          content: <p>{section.content}</p>,
        }))}
      />
      <Image
        src="/separator.png"
        alt={termsCopy.separatorAlt}
        width={1200}
        height={400}
        className="h-auto w-full bg-background"
      />
    </>
  );
}

// ============================================================================
// OFFLINE PAGE TEMPLATE (EXISTING COMPATIBILITY BRIDGE)
// ============================================================================

/**
 * Retains the existing offline-page export without introducing a seventh
 * public block into this six-block reference.
 *
 * @returns The current offline page's presentation block.
 * @remarks
 * The offline block now lives in `public-blocks.tsx`, preserving its markup
 * while the obsolete public-page-blocks module is removed.
 * @public
 */
export function OfflinePageTemplate() {
  return <OfflinePageBlock />;
}
