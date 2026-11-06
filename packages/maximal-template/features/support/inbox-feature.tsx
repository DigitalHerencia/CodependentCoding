import { loadInboxWorkflow } from "@/lib/workflows/supportWorkflows";
import { InboxFeatureClient } from "./inbox-feature.client";

export async function InboxFeature() {
  const { tickets } = await loadInboxWorkflow();
  return <InboxFeatureClient tickets={tickets} />;
}
