"use client";
import {
  Home,
  Brain,
  BriefcaseBusiness,
  Building2,
  CreditCard,
  FolderKanban,
  Headphones,
  LayoutDashboard,
  Megaphone,
  Settings,
  Users,
} from "lucide-react";
import type { MobileBottomNavItem } from "@/components/nav/mobile-bottom-nav";
import Link from "next/link";
import type { ReactNode } from "react";
import { TreeView, type TreeNode } from "@/components/ui/tree-view";
import { moduleNavigation, settingsNavigation } from "@/lib/modules/navigation";
import { cn } from "@/lib/utils/cn";
import type { ModuleIcon, ModuleNavLink } from "@/types/moduleTypes";
const icons: Record<ModuleIcon, ReactNode> = {
  brain: <Brain className="size-4" />,
  briefcase: <BriefcaseBusiness className="size-4" />,
  building: <Building2 className="size-4" />,
  "credit-card": <CreditCard className="size-4" />,
  "folder-kanban": <FolderKanban className="size-4" />,
  headphones: <Headphones className="size-4" />,
  megaphone: <Megaphone className="size-4" />,
  users: <Users className="size-4" />,
};

const route = ({ label, href }: ModuleNavLink): TreeNode => ({
  id: href,
  label,
  href,
});

export const tenantDomains: TreeNode[] = [
  ...moduleNavigation().map(({ id, label, icon, links }) => ({
    id,
    label,
    icon: icons[icon],
    children: links.map(route),
  })),
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="size-4" />,
    children: settingsNavigation().map(route),
  },
];

export function TenantNavLinks({
  pathname,
  expandedIds,
  setExpandedIds,
  activeRoute,
  onNavigate,
}: {
  pathname: string;
  expandedIds: string[];
  setExpandedIds: (ids: string[]) => void;
  activeRoute: TreeNode | undefined;
  onNavigate: () => void;
}) {
  return (
    <nav
      aria-label="Domain navigation"
      className="min-h-0 flex-1 overflow-y-auto"
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("a")) onNavigate();
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
        data={tenantDomains}
        expandedIds={expandedIds}
        onExpandedChange={setExpandedIds}
        selectedIds={activeRoute ? [activeRoute.id] : []}
        className="border-0 p-0 shadow-none"
      />
    </nav>
  );
}

export const tenantMobileItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/settings/profile", label: "Profile", icon: Settings },
  { href: "/settings/members", label: "Members", icon: Users },
  { href: "/onboarding", label: "Workspace", icon: Building2 },
] satisfies readonly MobileBottomNavItem[];
