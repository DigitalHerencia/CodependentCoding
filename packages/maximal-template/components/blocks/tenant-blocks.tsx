import type { LucideIcon } from "lucide-react";
import {
  Brain,
  BriefcaseBusiness,
  Building2,
  CreditCard,
  FolderKanban,
  Headphones,
  Home,
  LayoutDashboard,
  Megaphone,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Wordmark } from "@/components/brand/wordmark";
import { MobileBottomNav } from "@/components/nav/mobile-bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TreeView, type TreeNode } from "@/components/ui/tree-view";
import { cn } from "@/components/ui/utils";
import { applicationProduct } from "@/content/application";
import { tenantCopy, tenantFooterLinks } from "@/content/tenant";
import type {
  TenantErrorBlockProps,
  TenantHeaderBlockProps,
  TenantLoadingBlockProps,
  TenantMobileIcon,
  TenantMobileNavigationItem,
  TenantNavigationBlockProps,
  TenantNavigationIcon,
  TenantSidebarBlockProps,
} from "@/types/tenantTypes";

// ============================================================================
// SHARED NAVIGATION ICONS
// ============================================================================

const navigationIcons: Record<TenantNavigationIcon, ReactNode> = {
  brain: <Brain className="size-4" />,
  briefcase: <BriefcaseBusiness className="size-4" />,
  building: <Building2 className="size-4" />,
  "credit-card": <CreditCard className="size-4" />,
  "folder-kanban": <FolderKanban className="size-4" />,
  headphones: <Headphones className="size-4" />,
  megaphone: <Megaphone className="size-4" />,
  users: <Users className="size-4" />,
  settings: <Settings className="size-4" />,
};

const mobileIcons: Record<TenantMobileIcon, LucideIcon> = {
  home: Home,
  settings: Settings,
  users: Users,
  building: Building2,
};

// ============================================================================
// HEADER
// ============================================================================

/** Branded header with an accessible, client-controlled mobile menu toggle. */
export function TenantHeaderBlock({
  sidebar,
  mobileOpen,
  onToggle,
  menuButtonRef,
}: TenantHeaderBlockProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex min-h-16 items-center justify-between gap-2 border-b bg-background px-4 py-3",
        sidebar && "md:hidden",
      )}
    >
      <Wordmark compact />
      <Button
        ref={menuButtonRef}
        type="button"
        variant="ghost"
        size="icon"
        aria-label={mobileOpen ? tenantCopy.closeNavigation : tenantCopy.openNavigation}
        aria-expanded={mobileOpen}
        aria-controls="mobile-navigation"
        onClick={onToggle}
      >
        {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </Button>
    </header>
  );
}

// ============================================================================
// EXPANDED AND COLLAPSED NAVIGATION
// ============================================================================

/** Domain navigation reused by both the desktop sidebar and mobile drawer. */
export function TenantNavigationBlock({
  navigation,
  pathname,
  expandedIds,
  onExpandedChange,
  onNavigate,
}: TenantNavigationBlockProps) {
  const routeMatch = navigation.groups
    .flatMap((group) => group.links)
    .filter((link) => pathname === link.href || pathname.startsWith(link.href + "/"))
    .sort((left, right) => right.href.length - left.href.length)[0];

  const nodes: TreeNode[] = navigation.groups.map((group) => ({
    id: group.id,
    label: group.label,
    icon: navigationIcons[group.icon],
    children: group.links.map((link) => ({
      id: link.href,
      label: link.label,
      href: link.href,
    })),
  }));

  return (
    <nav
      aria-label={tenantCopy.headerNavigation}
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
        <LayoutDashboard className="size-4" aria-hidden="true" />
        {tenantCopy.dashboard}
      </Link>
      <p className="px-3 pb-2 eyebrow text-muted-primary">{tenantCopy.domains}</p>
      <TreeView
        aria-label={tenantCopy.domains}
        data={nodes}
        expandedIds={expandedIds}
        onExpandedChange={onExpandedChange}
        selectedIds={routeMatch ? [routeMatch.href] : []}
        className="border-0 p-0 shadow-none"
      />
    </nav>
  );
}

/** Compact sidebar uses the same authorized domain list and expands on demand. */
export function TenantCollapsedNavigationBlock({
  navigation,
  pathname,
  onExpand,
}: {
  navigation: TenantSidebarBlockProps["navigation"];
  pathname: string;
  onExpand: (groupId: string) => void;
}) {
  return (
    <nav
      aria-label={tenantCopy.collapsedNavigation}
      className="min-h-0 flex-1 space-y-1 overflow-y-auto"
    >
      <Button asChild variant="ghost" size="icon">
        <Link
          href="/dashboard"
          title={tenantCopy.dashboard}
          aria-label={tenantCopy.dashboard}
          aria-current={pathname === "/dashboard" ? "page" : undefined}
        >
          <LayoutDashboard aria-hidden="true" />
        </Link>
      </Button>
      {navigation.groups.map((group) => (
        <Button
          key={group.id}
          type="button"
          variant="ghost"
          size="icon"
          title={group.label}
          aria-label={"Expand " + group.label + " navigation"}
          onClick={() => onExpand(group.id)}
        >
          {navigationIcons[group.icon]}
        </Button>
      ))}
    </nav>
  );
}

/** Shared sidebar composition; state and authorization remain outside the block. */
export function TenantSidebarBlock({
  navigation,
  pathname,
  expandedIds,
  onExpandedChange,
  onNavigate,
  collapsed,
  onToggleCollapsed,
  onExpand,
  organizationSwitcher,
  accountMenu,
}: TenantSidebarBlockProps) {
  return (
    <aside
      aria-label={tenantCopy.sidebar}
      className="sticky top-0 hidden h-dvh min-w-0 flex-col gap-5 border-r bg-background p-3 md:flex"
    >
      <Wordmark collapsed={collapsed} compact />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={collapsed ? tenantCopy.expandSidebar : tenantCopy.collapseSidebar}
        aria-expanded={!collapsed}
        onClick={onToggleCollapsed}
      >
        {collapsed ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}
      </Button>
      {collapsed ? (
        <TenantCollapsedNavigationBlock
          navigation={navigation}
          pathname={pathname}
          onExpand={onExpand}
        />
      ) : (
        <TenantNavigationBlock
          navigation={navigation}
          pathname={pathname}
          expandedIds={expandedIds}
          onExpandedChange={onExpandedChange}
          onNavigate={onNavigate}
        />
      )}
      <div className="space-y-3 border-t pt-4">
        {!collapsed && organizationSwitcher}
        {accountMenu}
      </div>
    </aside>
  );
}

// ============================================================================
// FOOTER AND MOBILE BOTTOM NAVIGATION
// ============================================================================

/** Tenant-owned footer, without public header or public-footer dependencies. */
export function TenantFooterBlock() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-5 text-sm text-muted-foreground">
      <p>
        {applicationProduct.brand.title} · {tenantCopy.footerDescription}
      </p>
      <nav aria-label={tenantCopy.footer}>
        <ul className="flex flex-wrap gap-4">
          {tenantFooterLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-foreground focus-visible:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}

/** Mobile bottom navigation built from serializable tenant link/icon data. */
export function TenantMobileBottomNavBlock({
  items,
}: {
  items: readonly TenantMobileNavigationItem[];
}) {
  return (
    <MobileBottomNav
      items={items.map(({ label, href, icon }) => ({
        label,
        href,
        icon: mobileIcons[icon],
      }))}
      aria-label={tenantCopy.mobileNavigation}
    />
  );
}

// ============================================================================
// ROUTE-GROUP ERROR AND LOADING
// ============================================================================

/** Safe recovery UI for errors arising inside tenant child routes. */
export function TenantErrorBlock({ onRetry }: TenantErrorBlockProps) {
  return (
    <section role="alert" className="mx-auto flex min-h-[60vh] max-w-3xl items-center p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{tenantCopy.errorTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{tenantCopy.errorDescription}</p>
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={onRetry}>{tenantCopy.tryAgain}</Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">{tenantCopy.goToDashboard}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

/** Accessible, generic tenant content skeleton for route and layout fallback. */
export function TenantLoadingBlock({
  label = tenantCopy.loadingContent,
}: TenantLoadingBlockProps) {
  return (
    <section role="status" aria-busy="true" aria-label={label} className="space-y-4 p-4">
      <Skeleton className="h-9 w-56" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <Skeleton className="h-56 w-full" />
      <span className="sr-only">{label}</span>
    </section>
  );
}
