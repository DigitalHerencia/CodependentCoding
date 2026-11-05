import { getSupportInbox } from "@/lib/fetchers/supportFetchers";
import { InboxFeatureClient } from "./inbox-feature.client";
export async function InboxFeature() {
  return <InboxFeatureClient tickets={await getSupportInbox()} />;
}
