import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const areas = [
  [
    "Dashboard",
    "/dashboard",
    "System overview",
    ["SEED DATA", "SERVER COMPONENT"],
  ],
  [
    "CRM",
    "/crm/contacts",
    "Accounts, contacts, pipeline, analytics",
    ["DATABASE READ", "RLS SCOPED"],
  ],
  [
    "Projects",
    "/projects",
    "Projects, tasks, milestones, timelines",
    ["RBAC", "PRISMA"],
  ],
  [
    "Support",
    "/support/inbox",
    "Inbox, tickets, knowledge base",
    ["RLS SCOPED"],
  ],
  [
    "Marketing",
    "/marketing/campaigns",
    "Campaigns, audiences, attribution",
    ["DATABASE READ"],
  ],
  ["Invoicing", "/invoices", "Invoices, expenses, billing", ["RBAC", "PRISMA"]],
  [
    "Social",
    "/social/calendar",
    "Composer, calendar, media",
    ["CLIENT FEATURE"],
  ],
  ["AI", "/ai", "Generation, playground, usage", ["SERVER COMPONENT"]],
  ["Portal", "/portal", "Client-visible documents and billing", ["ABAC"]],
  ["Admin", "/admin/users", "Users, records, audit", ["RBAC", "ABAC"]],
  [
    "User & settings",
    "/settings/profile",
    "Profile, members, billing",
    ["CLERK"],
  ],
  [
    "Auth & onboarding",
    "/onboarding",
    "Sign-in, sign-up, onboarding examples",
    ["REACT HOOK FORM"],
  ],
  [
    "Integrations",
    "/integrations",
    "Provider configuration status",
    ["WEBHOOK"],
  ],
  [
    "Components & blocks",
    "/components",
    "Reusable presentation catalog",
    ["PURE UI"],
  ],
  [
    "Architecture & security",
    "/architecture",
    "Boundaries and enforcement model",
    ["RLS SCOPED", "ABAC"],
  ],
] as const;

export function MaximalTemplateExplorer() {
  return (
    <section className="space-y-8">
      <header className="max-w-3xl space-y-3">
        <Badge>PUBLIC DEMO</Badge>
        <h1 className="text-4xl font-black tracking-tight uppercase sm:text-5xl">
          Explore the maximal system
        </h1>
        <p className="text-muted-foreground">
          Inspect every application recipe while signed out. Authentication
          protects real mutations; it does not hide the architecture.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {areas.map(([title, href, description, labels]) => (
          <Link key={href} href={href} className="no-underline">
            <Card className="h-full transition-transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{description}</p>
                <div className="flex flex-wrap gap-2">
                  {labels.map((label) => (
                    <Badge key={label} variant="outline">
                      {label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
