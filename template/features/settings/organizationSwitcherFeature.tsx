import { OrganizationSwitcherClient } from "@/features/settings/organizationSwitcher.client";
import { getOrganizationSwitcher } from "@/lib/fetchers/organizationFetchers";

/** The tenant shell's organization picker; shown only to users with more than one organization. */
export async function OrganizationSwitcherFeature() {
  const switcher = await getOrganizationSwitcher();
  if (switcher.organizations.length < 2) return null;
  return <OrganizationSwitcherClient {...switcher} />;
}
