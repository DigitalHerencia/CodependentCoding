import { InboxFeature } from "@/features/support/inboxFeature";

// URL ownership stops here; orchestration is delegated to the feature.
export default function Page() {
  return <InboxFeature />;
}
