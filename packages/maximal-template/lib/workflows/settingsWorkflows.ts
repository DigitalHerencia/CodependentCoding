/** Settings Workflows contracts and composition for the owning application slice. */
import "server-only";
import { getBillingSubscription } from "@/lib/fetchers/billingFetchers";
export async function loadBillingWorkflow() {
  const subscription = await getBillingSubscription();
  return { subscription };
}
