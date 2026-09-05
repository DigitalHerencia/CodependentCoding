import { HeroSection } from "@/components/blocks/hero-section";
import { FeatureEditorial, FeatureContentGrid } from "@/components/blocks/feature-grid";
import { LogoCloud } from "@/components/blocks/logo-cloud";
import { ComparisonTable } from "@/components/blocks/comparison-table";
import { TestimonialsGrid } from "@/components/blocks/testimonials";
import { CTASimple } from "@/components/blocks/cta-section";
import { landingCopy, pipelineCards } from "@/content/public-pages";
export function LandingPageTemplate() {
  return (
    <>
      <HeroSection.Centered
        title="The Maximal"
        titleHighlight="Template™"
        description={landingCopy[0].content}
        primaryAction={{ label: "ENTER THE TEMPLATE", href: "/dashboard" }}
        secondaryAction={{ label: "VIEW FEATURES", href: "/features" }}
      />
      <FeatureEditorial className="bg-primary text-center">
        {landingCopy[1].content}
      </FeatureEditorial>
      <LogoCloud.Grid
        columns={6}
        logos={[
          "Next.js",
          "React",
          "Prisma",
          "Neon",
          "Clerk",
          "Tailwind CSS",
        ].map((name) => ({ name, logo: <strong>{name}</strong> }))}
      />
      <FeatureEditorial>{landingCopy[2].content}</FeatureEditorial>
      <FeatureEditorial title={landingCopy[3].title}>
        {landingCopy[3].content}
      </FeatureEditorial>
      <FeatureContentGrid title={landingCopy[5].title} items={pipelineCards} />
      <ComparisonTable
        title="Product vs Productivity"
        columns={["Old", "New"]}
        rows={[
          {
            feature: "metric",
            values: [
              "Tasks completed per hour.",
              "Codebases destabilized per commit.",
            ],
          },
          { feature: "KPI", values: ["Velocity.", "After-taste."] },
        ]}
        highlightColumn={1}
      />
      <FeatureEditorial>
        {
          <>
            {" "}
            <p>
              If your PR doesn’t get merged unless you stop commenting,
              <br />
              you didn’t ship.
            </p>
            <p>You compiled.</p>
          </>
        }
      </FeatureEditorial>
      <FeatureEditorial title={landingCopy[6].title}>
        {landingCopy[6].content}
      </FeatureEditorial>
      <FeatureEditorial title={landingCopy[7].title}>
        {landingCopy[7].content}
      </FeatureEditorial>
      <TestimonialsGrid
        title="Early Adopter Results"
        testimonials={[
          {
            quote:
              "We reduced development time by forty percent.\nNone of the code lands but it still gets merged.",
            author: "Senior Engineer",
            role: "",
          },
          {
            quote:
              "My manager says my PR's are ‘hard to read.’\nThat’s because I upgraded.",
            author: "Product Designer",
            role: "",
          },
          {
            quote: "I don’t argue anymore.\nI deploy.",
            author: "Founder, extremely tired",
            role: "",
          },
        ]}
      />
      <CTASimple
        title={landingCopy[9].title}
        description={landingCopy[9].content}
        primaryAction={{ label: "ENTER THE TEMPLATE", href: "/dashboard" }}
        secondaryAction={{ label: "VIEW FEATURES", href: "/features" }}
      />
    </>
  );
}
