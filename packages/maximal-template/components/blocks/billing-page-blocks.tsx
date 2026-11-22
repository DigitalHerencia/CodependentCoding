import { Card } from "@/components/ui/card";
import { billingPresentationCopy } from "@/content/billing";
import type { BillingSubscriptionPresentationProps } from "@/types/billingTypes";

/** Present the authoritative billing record without deriving subscription state. */
export function BillingSettingsContentBlock({
  subscription,
}: BillingSubscriptionPresentationProps) {
  return (
    <>
      <Card className="space-y-4 p-5">
        <h2 className="type-heading">{billingPresentationCopy.subscription}</h2>
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
      </Card>
    </>
  );
}
