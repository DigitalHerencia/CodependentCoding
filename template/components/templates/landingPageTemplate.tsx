import { HeroSection } from "@/components/blocks/hero-section";
import {
  FeatureEditorial,
  FeatureContentGrid,
} from "@/components/blocks/feature-grid";
import { ComparisonTable } from "@/components/blocks/comparison-table";
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
        className="w-full h-auto bg-background"
      />
      <HeroSection.Centered
        title="The Maximal Template™"
        titleHighlight="Domain Library"
        description={landingCopy[1].content}
        className="bg-background text-foreground mt-12 mb-12"
        primaryAction={{ label: "GET STARTED", href: "/signup" }}
        secondaryAction={{ label: "LEARN MORE", href: "/features" }}
      />
      <Image
        src="/logo cloud.png"
        alt="Integrations"
        width={1200}
        height={200}
        className="w-full h-auto"
      />
      <FeatureContentGrid
        title={landingCopy[5].title}
        items={pipelineCards}
        className="bg-background text-foreground mt-12 mb-12"
      />
      <TestimonialsGrid
        title="Early Adopter Results"
        className="bg-primary text-foreground py-36"
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
        className="bg-background text-foreground py-48"
        primaryAction={{ label: "GET STARTED", href: "/signup" }}
        secondaryAction={{ label: "LEARN MORE", href: "/features" }}
      />
      <Image
        src="/seperator.png"
        alt="Caution"
        width={1200}
        height={400}
        className="w-full h-auto bg-background"
      />
    </section>
  );
}
