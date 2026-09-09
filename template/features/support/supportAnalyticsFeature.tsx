import { getSupportInbox } from "@/lib/fetchers/supportFetchers";
import { SupportAnalyticsTemplate } from "@/components/templates/supportAnalyticsTemplate";
export async function SupportAnalyticsFeature() {
  return <SupportAnalyticsTemplate tickets={await getSupportInbox()} />;
}
