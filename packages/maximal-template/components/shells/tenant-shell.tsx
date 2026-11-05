"use client";
import { LayoutDashboard, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";
import {
  TenantNavLinks,
  tenantDomains as domains,
} from "@/components/nav/tenant-nav-links";
import { TenantHeader } from "@/components/nav/tenant-header";
import { TenantFooter } from "@/components/nav/tenant-footer";
import { TenantMobileBottomNav } from "@/components/nav/tenant-mobile-bottom-nav";
import { applicationDesign } from "@/content/application";
import { cn } from "@/lib/utils/cn";

export function TenantShell({
  children,
  accountMenu,
  organizationSwitcher,
}: {
  children: ReactNode;
  accountMenu: ReactNode;
  /** Rendered above the user menu; the route layout passes the organization switcher. */
  organizationSwitcher?: ReactNode;
}) {
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
    <TenantNavLinks
      pathname={pathname}
      expandedIds={expandedIds}
      setExpandedIds={setExpandedIds}
      activeRoute={activeRoute}
      onNavigate={() => setMobileOpen(false)}
    />
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
        "tenant-shell min-h-dvh pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0",
        sidebar &&
          (collapsed
            ? "md:grid md:grid-cols-[4.5rem_minmax(0,1fr)]"
            : "md:grid md:grid-cols-[16rem_minmax(0,1fr)]"),
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
          <div className="space-y-3 border-t pt-4">
            {!collapsed && organizationSwitcher}
            {accountMenu}
          </div>
        </aside>
      )}
      <div className="min-w-0">
        <TenantHeader
          sidebar={sidebar}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
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
            {navigation}
            {organizationSwitcher}
            {accountMenu}
          </div>
        )}
        <main>{children}</main>
        <TenantFooter />
        <TenantMobileBottomNav />
      </div>
    </div>
  );
}
