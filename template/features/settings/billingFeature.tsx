import { getBillingSubscription } from "@/lib/fetchers/billingFetchers";
import { BillingSettingsTemplate } from "@/components/templates/billingSettingsTemplate";
export async function BillingFeature() {
  return (
    <BillingSettingsTemplate subscription={await getBillingSubscription()} />
  );
}
