import { getSupportInbox } from "@/lib/fetchers/supportFetchers";
import { InboxFeatureClient } from "./inboxFeature.client";
export async function InboxFeature() {
  return <InboxFeatureClient tickets={await getSupportInbox()} />;
}
