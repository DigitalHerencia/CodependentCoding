import {
  Bot,
  BriefcaseBusiness,
  CircleDollarSign,
  Headphones,
  Kanban,
  Megaphone,
  Shield,
  Share2,
  Users,
} from "lucide-react";

import { FeatureGrid } from "@/components/blocks/feature-sections";
import { HeroSection } from "@/components/blocks/hero-sections";

const recipeFeatures = [
  [
    BriefcaseBusiness,
    "CRM",
    "Accounts, contacts, pipeline, and authorized analytics.",
  ],
  [
    Kanban,
    "Projects",
    "Projects, tasks, milestones, dependencies, and assignments.",
  ],
  [
    Headphones,
    "Support",
    "Tenant-aware inbox, ticket lifecycle, and knowledge base.",
  ],
  [
    Megaphone,
    "Marketing",
    "Audiences, campaigns, steps, and performance reporting.",
  ],
  [
    CircleDollarSign,
    "Invoicing",
    "Decimal-safe invoices, expenses, and billing access.",
  ],
  [
    Share2,
    "Social",
    "Account variants, scheduling, media, and publication state.",
  ],
  [Bot, "AI", "Provider-neutral generation records, usage, and entitlements."],
  [
    Users,
    "Client portal",
    "Strict client visibility, documents, versions, and approvals.",
  ],
  [
    Shield,
    "Admin",
    "Explicit privileged capabilities and auditable operations.",
  ],
] as const;

export default function Page() {
  return (
    <>
      <HeroSection.Minimal
        title="Nine recipes. One application."
        description="Each domain has real nouns and boundaries while sharing identity, tenancy, assets, audit, and idempotency."
      />
      <FeatureGrid.WithIcons
        title="Supported recipe domains"
        columns={3}
        features={recipeFeatures.map(([Icon, title, description]) => ({
          icon: <Icon className="size-7" />,
          title,
          description,
        }))}
      />
    </>
  );
}
