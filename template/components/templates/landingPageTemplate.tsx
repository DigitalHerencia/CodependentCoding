import { HeroSection } from "@/components/blocks/hero-section";
import { FeatureContentGrid } from "@/components/blocks/feature-grid";
import { TestimonialsGrid } from "@/components/blocks/testimonials";
import { CTASimple } from "@/components/blocks/cta-section";
import { landingCopy, pipelineCards } from "@/content/landing";
import Image from "next/image";

export function LandingPageTemplate() {
  return (
    <section>
      <Image
        src="/seperator.png"
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
        src="/logo cloud.png"
        alt={landingCopy.integrationsAlt}
        width={1200}
        height={200}
        className="h-auto w-full"
      />
      <FeatureContentGrid
        title={landingCopy.pipelineTitle}
        items={pipelineCards}
        className="bg-background py-32 text-foreground"
      />
      <TestimonialsGrid
        title={landingCopy.testimonialsTitle}
        className="bg-primary py-24 text-background"
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
        src="/seperator.png"
        alt={landingCopy.separatorAlt}
        width={1200}
        height={400}
        className="h-auto w-full bg-background"
      />
    </section>
  );
}
