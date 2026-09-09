"use client";

import { UserButton } from "@clerk/nextjs";
import {
  Brain,
  BriefcaseBusiness,
  Building2,
  CreditCard,
  FolderKanban,
  Headphones,
  LayoutDashboard,
  Megaphone,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Users,
  X,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import type { Route } from "next";
import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";
import { TreeView, type TreeNode } from "@/components/ui/tree-view";
import {
  applicationCapabilities,
  applicationDesign,
} from "@/content/application";
import { cn } from "@/lib/utils/cn";

const route = (label: string, href: Route): TreeNode => ({
  id: href,
  label,
  href,
});
const domains: TreeNode[] = [
  ...(applicationCapabilities.crm
    ? [
        {
          id: "crm",
          label: "CRM",
          icon: <Users className="size-4" />,
          children: [
            route("Contacts", "/crm/contacts"),
            route("Accounts", "/crm/accounts"),
            route("Leads", "/crm/leads"),
            route("Pipeline", "/crm/pipeline"),
            route("Analytics", "/crm/analytics"),
          ],
        },
      ]
    : []),
  ...(applicationCapabilities.projects
    ? [
        {
          id: "projects",
          label: "Projects",
          icon: <FolderKanban className="size-4" />,
          children: [
            route("All projects", "/projects"),
            route("New project", "/projects/new"),
            route("My tasks", "/my-tasks"),
          ],
        },
      ]
    : []),
  ...(applicationCapabilities.support
    ? [
        {
          id: "support",
          label: "Support",
          icon: <Headphones className="size-4" />,
          children: [
            route("Inbox", "/support/inbox"),
            route("New ticket", "/support/tickets/new"),
            route("Knowledge base", "/support/knowledge-base"),
            route("Analytics", "/support/analytics"),
          ],
        },
      ]
    : []),
  ...(applicationCapabilities.marketingAutomation
    ? [
        {
          id: "marketing",
          label: "Marketing",
          icon: <Megaphone className="size-4" />,
          children: [
            route("Campaigns", "/marketing/campaigns"),
            route("Audiences", "/marketing/audiences"),
            route("Analytics", "/marketing/analytics"),
          ],
        },
      ]
    : []),
  ...(applicationCapabilities.invoicing
    ? [
        {
          id: "invoicing",
          label: "Invoicing",
          icon: <CreditCard className="size-4" />,
          children: [
            route("Invoices", "/invoices"),
            route("Expenses", "/expenses"),
          ],
        },
      ]
    : []),
  ...(applicationCapabilities.social
    ? [
        {
          id: "social",
          label: "Social",
          icon: <Megaphone className="size-4" />,
          children: [
            route("Calendar", "/social/calendar"),
            route("Compose", "/social/compose"),
            route("Media", "/social/media"),
          ],
        },
      ]
    : []),
  ...(applicationCapabilities.ai
    ? [
        {
          id: "ai",
          label: "AI",
          icon: <Brain className="size-4" />,
          children: [
            route("Overview", "/ai"),
            route("Playground", "/ai/playground"),
            route("Usage", "/ai/usage"),
          ],
        },
      ]
    : []),
  ...(applicationCapabilities.portal
    ? [
        {
          id: "portal",
          label: "Portal",
          icon: <BriefcaseBusiness className="size-4" />,
          children: [
            route("Overview", "/portal"),
            route("Documents", "/portal/documents"),
            route("Billing", "/portal/billing"),
          ],
        },
      ]
    : []),
  ...(applicationCapabilities.admin
    ? [
        {
          id: "admin",
          label: "Admin",
          icon: <Building2 className="size-4" />,
          children: [
            route("Users", "/admin/users"),
            route("Records", "/admin/records"),
            route("Audit", "/admin/audit"),
          ],
        },
      ]
    : []),
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="size-4" />,
    children: [
      route("Profile", "/settings/profile"),
      route("Members", "/settings/members"),
      route("Integrations", "/settings/integrations"),
      route("Billing", "/settings/billing"),
      route("Workspace setup", "/onboarding"),
    ],
  },
];

export function TenantShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const activeRoute = domains
    .flatMap((domain) => domain.children ?? [])
    .filter(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    )
    .sort((a, b) => b.id.length - a.id.length)[0];
  const activeDomain = domains.find((domain) =>
    domain.children?.some((item) => item.id === activeRoute?.id),
  );
  const [expandedIds, setExpandedIds] = useState<string[]>(
    activeDomain ? [activeDomain.id] : [],
  );
  const sidebar = applicationDesign.navigation === "sidebar";
  const navigation = (
    <nav
      aria-label="Domain navigation"
      className="min-h-0 flex-1 overflow-y-auto"
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("a")) setMobileOpen(false);
      }}
    >
      <Link
        href="/dashboard"
        aria-current={pathname === "/dashboard" ? "page" : undefined}
        className={cn(
          "mb-3 navigation-item",
          pathname === "/dashboard" && "navigation-active",
        )}
      >
        <LayoutDashboard className="size-4" />
        Dashboard
      </Link>
      <p className="px-3 pb-2 eyebrow text-muted-primary">Domains</p>
      <TreeView
        aria-label="Domains and routes"
        data={domains}
        expandedIds={expandedIds}
        onExpandedChange={setExpandedIds}
        selectedIds={activeRoute ? [activeRoute.id] : []}
        className="border-0 p-0 shadow-none"
      />
    </nav>
  );
  return (
    <div
      onKeyDown={(event) => {
        if (event.key === "Escape" && mobileOpen) {
          setMobileOpen(false);
          menuButtonRef.current?.focus();
        }
      }}
      className={cn(
        "min-h-dvh",
        sidebar &&
          (collapsed
            ? "md:grid md:grid-cols-[4.5rem_minmax(0,1fr)]"
            : "md:grid md:grid-cols-[19rem_minmax(0,1fr)]"),
      )}
    >
      {sidebar && (
        <aside
          aria-label="Sidebar"
          className="sticky top-0 hidden h-dvh min-w-0 flex-col gap-5 border-r bg-background p-3 md:flex"
        >
          <Wordmark collapsed={collapsed} compact />
          <Button
            variant="ghost"
            size="icon"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          </Button>
          {collapsed ? (
            <nav
              aria-label="Collapsed domain navigation"
              className="min-h-0 flex-1 space-y-1 overflow-y-auto"
            >
              <Button asChild variant="ghost" size="icon">
                <Link
                  href="/dashboard"
                  aria-label="Dashboard"
                  title="Dashboard"
                >
                  <LayoutDashboard />
                </Link>
              </Button>
              {domains.map((domain) => (
                <Button
                  key={domain.id}
                  variant="ghost"
                  size="icon"
                  title={domain.label}
                  aria-label={`Expand ${domain.label} navigation`}
                  onClick={() => {
                    setCollapsed(false);
                    setExpandedIds((ids) =>
                      Array.from(new Set([...ids, domain.id])),
                    );
                  }}
                >
                  {domain.icon}
                </Button>
              ))}
            </nav>
          ) : (
            navigation
          )}
          <div className="border-t pt-4">
            <UserButton />
          </div>
        </aside>
      )}
      <div className="min-w-0">
        <header
          className={cn(
            "sticky top-0 z-40 flex min-h-16 items-center justify-between gap-2 border-b bg-background px-4 py-3",
            sidebar && "md:hidden",
          )}
        >
          <Wordmark compact />
          <Button
            ref={menuButtonRef}
            variant="ghost"
            size="icon"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </header>
        {mobileOpen && (
          <div
            id="mobile-navigation"
            className={cn(
              "flex max-h-[calc(100dvh-4rem)] flex-col gap-4 overflow-y-auto border-b bg-background p-4",
              sidebar && "md:hidden",
            )}
          >
            {navigation}
            <UserButton />
          </div>
        )}
        <main>{children}</main>
      </div>
    </div>
  );
}
