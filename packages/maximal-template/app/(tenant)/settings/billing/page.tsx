import { Suspense } from "react";
import { SettingsBillingFeature } from "@/features/settings/settingsBillingFeature";
import { SettingsBillingSkeleton } from "@/features/settings/settingsBillingSkeleton";

/** Preserve the billing route with a route-specific pending boundary. */
export default function Page() {
  return (
    <Suspense fallback={<SettingsBillingSkeleton />}>
      <SettingsBillingFeature />
    </Suspense>
  );
}
