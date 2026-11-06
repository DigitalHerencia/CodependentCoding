import { BillingSettingsContentBlock } from "@/components/blocks/billing-page-blocks";
import { DashboardLayout } from "@/components/blocks/shared-blocks";
import { billingPresentationCopy } from "@/content/billing";
import type { ComponentProps } from "react";

export function BillingSettingsTemplate(
  props: ComponentProps<typeof BillingSettingsContentBlock>,
) {
  return (
    <DashboardLayout title={billingPresentationCopy.billing} nav={[]}>
      <BillingSettingsContentBlock {...props} />
    </DashboardLayout>
  );
}
