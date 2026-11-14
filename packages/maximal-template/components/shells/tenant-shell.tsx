"use client";

import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

import {
  TenantFooterBlock,
  TenantHeaderBlock,
  TenantMobileBottomNavBlock,
  TenantNavigationBlock,
  TenantSidebarBlock,
} from "@/components/blocks/tenant-blocks";
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
  organizationSwitcher,
}: TenantShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [menuState, setMenuState] = useState({ route: pathname, open: false });
  const mobileOpen = menuState.route === pathname && menuState.open;
  const closeMobileMenu = () => setMenuState({ route: pathname, open: false });
  const menuButtonRef = useRef<HTMLButtonElement>(null);
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
  const onNavigate = closeMobileMenu;
  const onExpandedChange = (ids: string[]) =>
    setExpanded({ route: pathname, ids });

  return (
    <div
      className={cn(
        "tenant-shell min-h-dvh pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0",
        sidebar &&
          (collapsed
            ? "md:grid md:grid-cols-[4.5rem_minmax(0,1fr)]"
            : "md:grid md:grid-cols-[16rem_minmax(0,1fr)]"),
      )}
      onKeyDown={(event) => {
        if (event.key === "Escape" && mobileOpen) {
          closeMobileMenu();
          menuButtonRef.current?.focus();
        }
      }}
    >
      <a
        href="#tenant-main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:bg-background focus:px-4 focus:py-2"
      >
        {tenantCopy.skipToContent}
      </a>
      {sidebar && (
        <TenantSidebarBlock
          navigation={navigation}
          pathname={pathname}
          expandedIds={expandedIds}
          onExpandedChange={onExpandedChange}
          onNavigate={onNavigate}
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
        <TenantHeaderBlock
          sidebar={sidebar}
          mobileOpen={mobileOpen}
          onToggle={() => setMenuState({ route: pathname, open: !mobileOpen })}
          menuButtonRef={menuButtonRef}
        />
        {mobileOpen && (
          <div
            id="mobile-navigation"
            className={cn(
              "flex max-h-[calc(100dvh-4rem)] flex-col gap-4 overflow-y-auto border-b bg-background p-4",
              sidebar && "md:hidden",
            )}
          >
            <TenantNavigationBlock
              navigation={navigation}
              pathname={pathname}
              expandedIds={expandedIds}
              onExpandedChange={onExpandedChange}
              onNavigate={onNavigate}
            />
            {organizationSwitcher}
            {accountMenu}
          </div>
        )}
        <main id="tenant-main-content" tabIndex={-1} className="min-w-0 flex-1">
          {children}
        </main>
        <TenantFooterBlock />
        <TenantMobileBottomNavBlock items={navigation.mobile} />
      </div>
    </div>
  );
}
