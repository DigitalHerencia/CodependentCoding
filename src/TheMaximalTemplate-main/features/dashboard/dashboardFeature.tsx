import { Bot, Kanban, ReceiptText, Users } from "lucide-react";

import { FeatureGrid } from "@/components/blocks/feature-sections";
import { HeroSection } from "@/components/blocks/hero-sections";

export function DashboardFeature() {
  return (
    <>
      <HeroSection.Minimal
        title="Application dashboard"
        description="Open a recipe workspace. Persisted metrics appear only through its authorized fetcher."
      />
      <FeatureGrid.WithIcons
        title="Workspaces"
        columns={2}
        features={[
          {
            icon: <Users className="size-7" />,
            title: "CRM",
            description: "Manage tenant-scoped accounts, contacts, and deals.",
          },
          {
            icon: <Kanban className="size-7" />,
            title: "Projects",
            description: "Coordinate projects, milestones, and assigned tasks.",
          },
          {
            icon: <ReceiptText className="size-7" />,
            title: "Invoicing",
            description: "Create decimal-safe invoices and track expenses.",
          },
          {
            icon: <Bot className="size-7" />,
            title: "AI workspace",
            description: "Run selected models with explicit usage records.",
          },
        ]}
      />
    </>
  );
}
