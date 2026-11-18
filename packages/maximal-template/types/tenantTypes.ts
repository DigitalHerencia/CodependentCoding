import type { Route } from "next";
import type { ReactNode } from "react";

import type { ModuleIcon } from "@/types/moduleTypes";

/** Visual identifiers supported by the tenant's module navigation. */
export type TenantNavigationIcon = ModuleIcon | "settings";

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

/** Serializable, authorized tenant navigation model. */
export type TenantNavigationDTO = {
  groups: readonly TenantNavigationGroup[];
};

/** Layout components receive composed slots and never import application logic. */
export type TenantChildrenProps = Readonly<{ children: ReactNode }>;
/** Authenticated tenant shell presentation, inside the shared sidebar provider. */
export type TenantShellProps = TenantChildrenProps & {
  header: ReactNode;
  navigation: ReactNode;
  footer: ReactNode;
  skipLink: ReactNode;
};
/** One feature prepares the navigation model and the auth-owned account sheet. */
export type TenantShellTemplateProps = TenantChildrenProps & {
  navigation: TenantNavigationDTO;
  accountMenu: ReactNode;
};
/** Header primitive controls and branding are supplied by blocks. */
export type TenantHeaderProps = { brand: ReactNode; controls: ReactNode };
/** Domain-owned navigation landmark with primitive presentation supplied as a slot. */
export type TenantNavigationProps = TenantChildrenProps & { label: string };
/** Authorized model and account sheet are rendered together by the sidebar block. */
export type TenantSidebarBlockProps = Pick<
  TenantShellTemplateProps,
  "navigation" | "accountMenu"
>;
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
