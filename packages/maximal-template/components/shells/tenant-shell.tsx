"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { TenantFooter } from "@/components/nav/tenant-footer";
import { TenantHeader } from "@/components/nav/tenant-header";
import { AuthenticatedMobileNavigation } from "@/components/nav/authenticated-mobile-navigation";
import {
  TenantNavigation,
  TenantSidebar,
} from "@/components/nav/tenant-navigation";
import { cn } from "@/components/ui/utils";
import { applicationDesign } from "@/content/application";
import { tenantCopy } from "@/content/tenant";
import type { TenantShellProps } from "@/types/tenantTypes";

/**
 * Shared tenant frame. The layout supplies authorized navigation and server
 * account slots; this component owns only responsive interaction state.
 */
export function TenantShell({
  children,
  navigation,
  accountMenu,
  mobileAccountMenu,
  organizationSwitcher,
}: TenantShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const activeGroup = navigation.groups.find((group) =>
    group.links.some(
      (link) => pathname === link.href || pathname.startsWith(link.href + "/"),
    ),
  );

  // A new route gets its appropriate default expanded group without a render
  // effect; user-controlled expansion persists on the current pathname.
  const [expanded, setExpanded] = useState({
    route: pathname,
    ids: activeGroup ? [activeGroup.id] : ([] as string[]),
  });
  const expandedIds =
    expanded.route === pathname
      ? expanded.ids
      : activeGroup
        ? [activeGroup.id]
        : [];

  const sidebar = applicationDesign.navigation === "sidebar";
  const onExpandedChange = (ids: string[]) =>
    setExpanded({ route: pathname, ids });

  return (
    <div
      className={cn(
        "tenant-shell min-h-dvh min-w-0",
        sidebar &&
          (collapsed
            ? "lg:grid lg:grid-cols-[4.5rem_minmax(0,1fr)]"
            : "lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]"),
      )}
    >
      <a
        href="#tenant-main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:bg-background focus:px-4 focus:py-2"
      >
        {tenantCopy.skipToContent}
      </a>
      {sidebar && (
        <TenantSidebar
          navigation={navigation}
          pathname={pathname}
          expandedIds={expandedIds}
          onExpandedChange={onExpandedChange}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((value) => !value)}
          onExpand={(id) => {
            setCollapsed(false);
            setExpanded({
              route: pathname,
              ids: Array.from(new Set([...expandedIds, id])),
            });
          }}
          organizationSwitcher={organizationSwitcher}
          accountMenu={accountMenu}
        />
      )}
      <div className="flex min-w-0 flex-col">
        <TenantHeader
          sidebar={sidebar}
          mobileMenu={
            <AuthenticatedMobileNavigation title={tenantCopy.headerNavigation}>
              <TenantNavigation
                navigation={navigation}
                pathname={pathname}
                expandedIds={expandedIds}
                onExpandedChange={onExpandedChange}
              />
              {mobileAccountMenu}
            </AuthenticatedMobileNavigation>
          }
        />
        {!sidebar && (
          <div className="hidden space-y-4 border-b bg-background p-4 lg:block">
            <TenantNavigation
              navigation={navigation}
              pathname={pathname}
              expandedIds={expandedIds}
              onExpandedChange={onExpandedChange}
            />
            {organizationSwitcher}
            {accountMenu}
          </div>
        )}
        <main id="tenant-main-content" tabIndex={-1} className="min-w-0 flex-1">
          {children}
        </main>
        <TenantFooter />
      </div>
    </div>
  );
}
