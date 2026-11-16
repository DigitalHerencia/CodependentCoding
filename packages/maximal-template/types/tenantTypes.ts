import type { Route } from "next";
import type { ReactNode } from "react";

import type { ModuleIcon } from "@/types/moduleTypes";

/** Visual identifiers supported by the tenant's module navigation. */
export type TenantNavigationIcon = ModuleIcon | "settings";

/** Stable icon identifiers serialized across the tenant Server/Client boundary. */
export type TenantMobileIcon = "home" | "settings" | "users" | "building";

/** An internal destination shown in the tenant navigation. */
export type TenantNavigationLink = {
  label: string;
  href: Route;
};

/** One authorized domain or settings navigation group. */
export type TenantNavigationGroup = {
  id: string;
  label: string;
  icon: TenantNavigationIcon;
  links: readonly TenantNavigationLink[];
};

/** One mobile navigation destination, represented without component values. */
export type TenantMobileNavigationItem = TenantNavigationLink & {
  icon: TenantMobileIcon;
};

/** Serializable, authorized tenant navigation model. */
export type TenantNavigationDTO = {
  groups: readonly TenantNavigationGroup[];
  mobile: readonly TenantMobileNavigationItem[];
};

/** Shared tenant shell and its server-rendered account controls. */
export type TenantShellProps = {
  children: ReactNode;
  navigation: TenantNavigationDTO;
  accountMenu: ReactNode;
  mobileAccountMenu: ReactNode;
  organizationSwitcher?: ReactNode;
};

/** Browser-only toggle controls for the tenant's header. */
export type TenantHeaderBlockProps = {
  sidebar: boolean;
  mobileMenu: ReactNode;
};

/** Controlled navigation view, also reused inside the mobile menu. */
export type TenantNavigationBlockProps = {
  navigation: TenantNavigationDTO;
  pathname: string;
  expandedIds: string[];
  onExpandedChange: (ids: string[]) => void;
  onNavigate?: (() => void) | undefined;
};

/** Sidebar presentation composed from the same navigation view. */
export type TenantSidebarBlockProps = TenantNavigationBlockProps & {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onExpand: (id: string) => void;
  organizationSwitcher?: ReactNode;
  accountMenu: ReactNode;
};

/** Next.js route-group error boundary: never display the raw error. */
export type TenantErrorBoundaryProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** Browser recovery handler passed to the tenant error block. */
export type TenantErrorBlockProps = {
  onRetry: () => void;
};

/** Accessible loading label for route and layout fallbacks. */
export type TenantLoadingBlockProps = {
  label?: string;
};
