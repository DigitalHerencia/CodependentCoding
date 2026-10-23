import { getPortalBilling } from "@/lib/fetchers/portalFetchers";
import { SharedBillingSettingsTemplate } from "@/components/templates/billingSettingsTemplate";
export async function BillingFeature() {
  return <SharedBillingSettingsTemplate billing={await getPortalBilling()} />;
}
