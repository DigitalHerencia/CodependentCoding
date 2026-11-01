import { getBillingSubscription } from "@/lib/fetchers/billingFetchers";
import { BillingSettingsTemplate } from "@/components/templates/billing-templates";
export async function BillingFeature() {
  return (
    <BillingSettingsTemplate subscription={await getBillingSubscription()} />
  );
}
