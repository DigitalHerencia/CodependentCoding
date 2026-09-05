import { HeroSection } from "@/components/blocks/hero-section";
import { FeatureEditorial, FeatureContentGrid } from "@/components/blocks/feature-grid";
import { StatsSection } from "@/components/blocks/stats-section";
import { OntologyShowcase } from "@/components/blocks/ontology-showcase";
import { CTASimple } from "@/components/blocks/cta-section";
import { featuresCopy, foundationCards } from "@/content/public-pages";
const ontologies = [
  {
    id: "crm",
    title: "CRM / Pipeline Tracker",
    content: featuresCopy[3].content,
    routes: [
      "/crm/leads",
      "/crm/contacts",
      "/crm/accounts",
      "/crm/pipeline",
      "/crm/analytics",
    ],
    workflow: "lib/workflows/crmWorkflows.ts",
    surfaces: [
      "features/crm/",
      "lib/fetchers/crmFetchers.ts",
      "lib/actions/crmActions.ts",
    ],
  },
  {
    id: "projects",
    title: "Project Management / Task Tracker",
    content: featuresCopy[4].content,
    routes: ["/projects", "/my-tasks"],
    workflow: "lib/workflows/projectsWorkflows.ts",
    surfaces: [
      "features/projects/",
      "lib/fetchers/projectsFetchers.ts",
      "lib/actions/projectsActions.ts",
    ],
  },
  {
    id: "support",
    title: "Customer Support / Ticketing",
    content: featuresCopy[5].content,
    routes: ["/support/inbox", "/support/knowledge-base", "/support/analytics"],
    workflow: "lib/workflows/supportWorkflows.ts",
    surfaces: [
      "features/support/",
      "lib/fetchers/supportFetchers.ts",
      "lib/actions/supportActions.ts",
    ],
  },
  {
    id: "marketing",
    title: "Marketing Automation & Analytics",
    content: featuresCopy[6].content,
    routes: [
      "/marketing/audiences",
      "/marketing/campaigns",
      "/marketing/analytics",
    ],
    workflow: "lib/workflows/marketingWorkflows.ts",
    surfaces: [
      "features/marketing/",
      "lib/fetchers/marketingFetchers.ts",
      "lib/actions/marketingActions.ts",
    ],
  },
  {
    id: "invoicing",
    title: "Invoicing & Expense Tracker",
    content: featuresCopy[7].content,
    routes: ["/invoices", "/expenses"],
    workflow: "lib/workflows/invoicingWorkflows.ts",
    surfaces: [
      "features/invoicing/",
      "lib/fetchers/invoicingFetchers.ts",
      "lib/actions/invoicingActions.ts",
    ],
  },
  {
    id: "social",
    title: "Social Media Scheduler",
    content: featuresCopy[8].content,
    routes: ["/social/compose", "/social/calendar", "/social/media"],
    workflow: "lib/workflows/socialWorkflows.ts",
    surfaces: [
      "features/social/",
      "lib/fetchers/socialFetchers.ts",
      "lib/actions/socialActions.ts",
    ],
  },
  {
    id: "ai",
    title: "AI-Powered Wrapper / Micro-SaaS",
    content: featuresCopy[9].content,
    routes: ["/ai", "/ai/playground", "/ai/usage"],
    workflow: "lib/workflows/aiWorkflows.ts",
    surfaces: [
      "features/ai/",
      "lib/fetchers/aiFetchers.ts",
      "lib/actions/aiActions.ts",
    ],
  },
  {
    id: "portal",
    title: "B2B Client Portal",
    content: featuresCopy[10].content,
    routes: ["/portal", "/portal/billing", "/portal/documents"],
    workflow: "lib/workflows/portalWorkflows.ts",
    surfaces: [
      "features/portal/",
      "lib/fetchers/portalFetchers.ts",
      "lib/actions/portalActions.ts",
    ],
  },
  {
    id: "admin",
    title: "Internal Tools / Admin Portal",
    content: featuresCopy[11].content,
    routes: ["/admin/users", "/admin/records", "/admin/audit"],
    workflow: "lib/workflows/adminWorkflows.ts",
    surfaces: [
      "features/admin/",
      "lib/fetchers/adminFetchers.ts",
      "lib/actions/adminActions.ts",
    ],
  },
];
export function FeaturesPageTemplate() {
  return (
    <>
      <HeroSection.Centered
        badge="Features"
        title="Built for"
        titleHighlight="Builders"
        description={featuresCopy[0].content}
      />
      <FeatureEditorial title={featuresCopy[1].title}>
        {featuresCopy[1].content}
      </FeatureEditorial>
      <FeatureContentGrid title={featuresCopy[2].title} introduction="Every supported ontology operates on the same underlying application foundation." items={foundationCards} columns={4} closing="The boring stuff is already invited to the meeting." />
      <StatsSection.Grid
        columns={3}
        stats={[
          { value: "9", label: "Ontologies" },
          { value: "1", label: "Maximal application" },
          { value: "1", label: "Shared foundation" },
        ]}
      />
      <OntologyShowcase items={ontologies} />
      <FeatureEditorial title={featuresCopy[12].title}>
        {featuresCopy[12].content}
      </FeatureEditorial>
      <FeatureEditorial
        title={featuresCopy[13].title}
        className="bg-primary/10"
      >
        {featuresCopy[13].content}
      </FeatureEditorial>
      <CTASimple
        title={featuresCopy[14].title}
        description={featuresCopy[14].content}
        primaryAction={{ label: "OPEN THE APPLICATION", href: "/dashboard" }}
        secondaryAction={{ label: "VIEW THE FAQ", href: "/faq" }}
      />
    </>
  );
}
