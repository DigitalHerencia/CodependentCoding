/** Authenticated Navigation Types contracts and composition for the owning application slice. */
import type { ReactNode } from "react";
import type { AppRole } from "@/types/authzTypes";
import type { OrganizationSwitcherDTO } from "@/types/authzTypes";

export type AuthenticatedMobileNavigationProps = {
  title: string;
  children?: ReactNode;
};
export type AuthenticatedUserMenuProps = {
  switcher: OrganizationSwitcherDTO;
  role: AppRole;
  presentation?: "popover" | "panel";
};
