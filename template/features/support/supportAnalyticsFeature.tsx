import { getSupportInbox } from "@/lib/fetchers/supportFetchers";
import { SupportAnalyticsTemplate } from "@/components/templates/support-templates";
export async function SupportAnalyticsFeature() {
  return <SupportAnalyticsTemplate tickets={await getSupportInbox()} />;
}
