import { Boxes, ShieldCheck, Workflow } from "lucide-react";

import { CTASimple } from "@/components/blocks/cta-section";
import { FeatureGrid } from "@/components/blocks/feature-grid";
import { HeroSection } from "@/components/blocks/hero-section";
import { StatsSection } from "@/components/blocks/stats-section";

const capabilities = [
  {
    icon: <Boxes className="size-7" />,
    title: "One superset",
    description:
      "Every supported recipe shares one application core instead of drifting into separate applications.",
  },
  {
    icon: <ShieldCheck className="size-7" />,
    title: "Tenant aware",
    description:
      "Authentication, application authorization, scoped queries, and PostgreSQL RLS reinforce the same boundary.",
  },
  {
    icon: <Workflow className="size-7" />,
    title: "Prunable recipes",
    description:
      "Loaded Vibes can select complete recipe slices without inventing a parallel architecture.",
  },
];

export default function Page() {
  return (
    <>
      <HeroSection.Centered
        badge="Canonical SaaS superset"
        title="Build once."
        titleHighlight="Configure precisely."
        description="The Maximal Template™ is the coherent source implementation for tenant-aware generated applications."
        primaryAction={{ label: "Explore dashboard", href: "/dashboard" }}
        secondaryAction={{ label: "Inspect CRM", href: "/crm/contacts" }}
      />
      <FeatureGrid.WithIcons
        subtitle="Architecture"
        title="Shared where it should be"
        features={capabilities}
      />
      <StatsSection.Grid
        stats={[
          { value: "9", label: "Recipe domains" },
          { value: "1", label: "Tenant model" },
          { value: "1", label: "Application architecture" },
          { value: "0", label: "Generic service layers" },
        ]}
      />
      <CTASimple
        title="Walk through the complete system"
        description="Inspect application surfaces and architecture before choosing capabilities."
        primaryAction={{ label: "Browse application", href: "/dashboard" }}
        secondaryAction={{ label: "View capabilities", href: "/features" }}
      />
    </>
  );
}
