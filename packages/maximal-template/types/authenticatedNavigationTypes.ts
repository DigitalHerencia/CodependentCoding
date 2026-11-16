import type { ReactNode } from "react";
import type { OnboardingProfileDTO } from "@/types/onboardingTypes";
import type { OrganizationSwitcherDTO } from "@/types/commonTypes";

export type AuthenticatedMobileNavigationProps = {
  title: string;
  children?: ReactNode;
};
export type AuthenticatedUserMenuProps = {
  profile: OnboardingProfileDTO;
  switcher: OrganizationSwitcherDTO;
  presentation?: "popover" | "panel";
};
