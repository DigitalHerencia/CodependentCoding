import { billingPresentationCopy } from "@/content/billing";
// Why: Templates: pure presentation for the billing pages, laid out from DTOs; data and slots come from features.
import type { BillingSubscriptionDTO } from "@/types/billingTypes";
import {
  DashboardLayout,
  DashboardPanel,
} from "@/components/blocks/shared-blocks";

export function BillingSettingsTemplate({
  subscription,
}: {
  subscription: BillingSubscriptionDTO | null;
}) {
  return (
    <DashboardLayout title={billingPresentationCopy.billing} nav={[]}>
      <DashboardPanel title={billingPresentationCopy.subscription}>
        {subscription ? (
          <dl className="grid gap-3 sm:grid-cols-2">
            <dt>{billingPresentationCopy.plan}</dt>
            <dd>{subscription.planKey}</dd>
            <dt>{billingPresentationCopy.status}</dt>
            <dd>{subscription.status}</dd>
            <dt>{billingPresentationCopy.currentPeriodEnds}</dt>
            <dd>
              {subscription.currentPeriodEnd?.slice(0, 10) ??
                billingPresentationCopy.notRecorded}
            </dd>
            <dt>{billingPresentationCopy.renewal}</dt>
            <dd>
              {subscription.cancelAtPeriodEnd
                ? billingPresentationCopy.cancelsAtPeriodEnd
                : billingPresentationCopy.continues}
            </dd>
          </dl>
        ) : (
          <p>
            {billingPresentationCopy.noSubscriptionIsRecordedForThisWorkspace}
          </p>
        )}
      </DashboardPanel>
    </DashboardLayout>
  );
}
