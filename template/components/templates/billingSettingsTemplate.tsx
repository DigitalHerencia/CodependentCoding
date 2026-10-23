import type { BillingSubscriptionDTO } from "@/types/billingTypes";
import {
  DashboardLayout,
  DashboardPanel,
} from "@/components/blocks/dashboard-layout";
export function BillingSettingsTemplate({
  subscription,
}: {
  subscription: BillingSubscriptionDTO | null;
}) {
  return (
    <DashboardLayout title="Billing" nav={[]}>
      <DashboardPanel title="Subscription">
        {subscription ? (
          <dl className="grid gap-3 sm:grid-cols-2">
            <dt>Plan</dt>
            <dd>{subscription.planKey}</dd>
            <dt>Status</dt>
            <dd>{subscription.status}</dd>
            <dt>Current period ends</dt>
            <dd>
              {subscription.currentPeriodEnd?.slice(0, 10) ?? "Not recorded"}
            </dd>
            <dt>Renewal</dt>
            <dd>
              {subscription.cancelAtPeriodEnd
                ? "Cancels at period end"
                : "Continues"}
            </dd>
          </dl>
        ) : (
          <p>No subscription is recorded for this workspace.</p>
        )}
      </DashboardPanel>
    </DashboardLayout>
  );
}
