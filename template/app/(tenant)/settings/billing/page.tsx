import { BillingFeature } from "@/features/settings/billingFeature";

// URL ownership stops here; orchestration is delegated to the feature.
export default function Page() {
  return <BillingFeature />;
}
