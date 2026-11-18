"use client";
/** BoldKit workspace compositions; presentation copy and primitives terminate here. */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/brand/wordmark";
import { TenantHeader } from "@/components/nav/tenant-header";
import { TenantFooter } from "@/components/nav/tenant-footer";
import { TenantNavigation } from "@/components/nav/tenant-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarToggle,
  useSidebar,
} from "@/components/ui/sidebar";
import { applicationProduct } from "@/content/application";
import { tenantCopy, tenantFooterLinks } from "@/content/tenant";
import type {
  TenantChildrenProps,
  TenantSidebarBlockProps,
  TenantErrorBlockProps,
  TenantLoadingBlockProps,
} from "@/types/tenantTypes";
/** Provider supplies the responsive drawer and desktop collapse state. */
export function TenantFrameBlock({ children }: TenantChildrenProps) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
/** Branded header uses the existing sidebar toggle at every viewport width. */
export function TenantHeaderBlock() {
  return (
    <TenantHeader
      brand={<Wordmark />}
      controls={<SidebarToggle aria-label={tenantCopy.headerNavigation} />}
    />
  );
}
/** Keyboard access bypasses repeated workspace navigation. */
export function TenantSkipLinkBlock() {
  return (
    <a
      href="#tenant-main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:bg-background focus:px-4 focus:py-2"
    >
      {tenantCopy.skipToContent}
    </a>
  );
}
/** Render only authorized navigation; close the same responsive sidebar after link activation. */
export function TenantSidebarBlock({
  navigation,
  accountMenu,
}: TenantSidebarBlockProps) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  return (
    <TenantNavigation label={tenantCopy.headerNavigation}>
      <Sidebar collapsible="hidden" className="sticky top-0 h-dvh">
        <SidebarHeader>
          <span className="type-heading">{applicationProduct.brand.title}</span>
        </SidebarHeader>
        <SidebarContent className="space-y-5">
          <Button
            asChild
            variant={pathname === "/dashboard" ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <Link
              href="/dashboard"
              aria-current={pathname === "/dashboard" ? "page" : undefined}
              onClick={() => setOpenMobile(false)}
            >
              {tenantCopy.dashboard}
            </Link>
          </Button>
          {navigation.groups.map((group) => (
            <section key={group.id} className="space-y-2">
              <h2 className="text-sm font-bold uppercase">
                {group.id === "settings" ? tenantCopy.settings : group.label}
              </h2>
              <ul className="space-y-1">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Button
                      asChild
                      variant={
                        pathname === link.href ||
                        pathname.startsWith(link.href + "/")
                          ? "default"
                          : "ghost"
                      }
                      className="w-full justify-start"
                    >
                      <Link
                        href={link.href}
                        aria-current={
                          pathname === link.href ||
                          pathname.startsWith(link.href + "/")
                            ? "page"
                            : undefined
                        }
                        onClick={() => setOpenMobile(false)}
                      >
                        {link.label}
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </SidebarContent>
        <SidebarFooter className="mt-auto">{accountMenu}</SidebarFooter>
      </Sidebar>
    </TenantNavigation>
  );
}
// ============================================================================
// FOOTER
// ============================================================================

/** Tenant-owned footer, without public header or public-footer dependencies. */
export function TenantFooterBlock() {
  return (
    <TenantFooter>
      <p>
        {applicationProduct.brand.title} · {tenantCopy.footerDescription}
      </p>
      <nav aria-label={tenantCopy.footer}>
        <ul className="flex flex-wrap gap-4">
          {tenantFooterLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="hover:text-foreground focus-visible:underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </TenantFooter>
  );
}

// ============================================================================
// ROUTE-GROUP ERROR AND LOADING
// ============================================================================

/** Safe recovery UI for errors arising inside tenant child routes. */
export function TenantErrorBlock({ onRetry }: TenantErrorBlockProps) {
  return (
    <section
      role="alert"
      className="mx-auto flex min-h-[60vh] max-w-3xl items-center p-4"
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{tenantCopy.errorTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{tenantCopy.errorDescription}</p>
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={onRetry}>
              {tenantCopy.tryAgain}
            </Button>
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
    <section
      role="status"
      aria-busy="true"
      aria-label={label}
      className="space-y-4 p-4"
    >
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
