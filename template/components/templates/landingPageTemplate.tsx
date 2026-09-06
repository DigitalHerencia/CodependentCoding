import { HeroSection } from "@/components/blocks/hero-section";
import { FeatureContentGrid } from "@/components/blocks/feature-grid";
import { TestimonialsGrid } from "@/components/blocks/testimonials";
import { CTASimple } from "@/components/blocks/cta-section";
import { landingCopy, pipelineCards } from "@/content/public-pages";
import Image from "next/image";

export function LandingPageTemplate() {
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
        title="The Maximal Template™"
        titleHighlight="Domain Library"
        description={landingCopy[1].content}
        className="mt-12 mb-12 bg-background text-foreground"
        primaryAction={{ label: "GET STARTED", href: "/signup" }}
        secondaryAction={{ label: "LEARN MORE", href: "/features" }}
      />
      <Image
        src="/logo cloud.png"
        alt="Integrations"
        width={1200}
        height={200}
        className="h-auto w-full"
      />
      <FeatureContentGrid
        title={landingCopy[5].title}
        items={pipelineCards}
        className="bg-background py-36 text-foreground"
      />
      <TestimonialsGrid
        title="Early Adopter Results"
        className="bg-primary py-28 text-foreground"
        cardClassName="bg-background text-foreground [&_svg]:text-foreground"
        testimonials={[
          {
            quote: "None of the code lands but it still gets merged.",
            author: "Senior Engineer",
            role: "",
          },
          {
            quote: "My manager says my PR's are hard to read.",

            author: "Product Designer",
            role: "",
          },
          {
            quote: "I don’t argue anymore. I deploy.",
            author: "Founder",
            role: "",
          },
        ]}
      />
      <CTASimple
        title={
          <>
            The Maximal Template™
            <br />
            Domain Library
          </>
        }
        description={
          <>
            Ship less code
            <br />
            Move more product
          </>
        }
        className="bg-background py-36 text-foreground"
        primaryAction={{ label: "GET STARTED", href: "/signup" }}
        secondaryAction={{ label: "LEARN MORE", href: "/features" }}
      />
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
