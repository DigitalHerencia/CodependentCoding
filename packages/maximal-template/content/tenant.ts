/** Tenant contracts and composition for the owning application slice. */
import type { TenantNavigationLink } from "@/types/tenantTypes";

/** Tenant-only presentation text; not an authorization policy. */
export const tenantCopy = {
  skipToContent: "Skip to workspace content",
  headerNavigation: "Workspace navigation",
  dashboard: "Dashboard",
  settings: "Settings",
  footer: "Workspace information",
  footerDescription: "Authenticated workspace",
  loadingContent: "Loading tenant content",
  errorTitle: "Something went wrong",
  errorDescription: "The workspace could not display this page.",
  tryAgain: "Try again",
  goToDashboard: "Go to dashboard",
} as const;

/** Public legal destinations available from the authenticated footer. */
export const tenantFooterLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const satisfies readonly TenantNavigationLink[];
