import { BillingFeature } from "@/features/portal/billingFeature";

// URL ownership stops here; orchestration is delegated to the feature.
export default function Page() {
  return <BillingFeature />;
}
