import type {
  TenantMobileNavigationItem,
  TenantNavigationLink,
} from "@/types/tenantTypes";

/** Tenant-only presentation text; not an authorization policy. */
export const tenantCopy = {
  skipToContent: "Skip to workspace content",
  headerNavigation: "Workspace navigation",
  openNavigation: "Open navigation",
  closeNavigation: "Close navigation",
  sidebar: "Workspace sidebar",
  expandSidebar: "Expand sidebar",
  collapseSidebar: "Collapse sidebar",
  collapsedNavigation: "Collapsed domain navigation",
  domains: "Domains",
  dashboard: "Dashboard",
  settings: "Settings",
  mobileNavigation: "Tenant mobile navigation",
  footer: "Workspace information",
  footerDescription: "Authenticated workspace",
  loadingWorkspace: "Loading workspace",
  loadingContent: "Loading tenant content",
  errorTitle: "Something went wrong",
  errorDescription: "The workspace could not display this page.",
  tryAgain: "Try again",
  goToDashboard: "Go to dashboard",
} as const;

/** Fixed mobile destinations are independent of optional installed modules. */
export const tenantMobileItems = [
  { href: "/dashboard", label: "Dashboard", icon: "home" },
  { href: "/settings/profile", label: "Profile", icon: "settings" },
  { href: "/settings/members", label: "Members", icon: "users" },
  { href: "/onboarding", label: "Workspace", icon: "building" },
] as const satisfies readonly TenantMobileNavigationItem[];

/** Public legal destinations available from the authenticated footer. */
export const tenantFooterLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const satisfies readonly TenantNavigationLink[];
