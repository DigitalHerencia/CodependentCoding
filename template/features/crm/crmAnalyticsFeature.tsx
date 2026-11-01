import { getCrmDeals } from "@/lib/fetchers/crmFetchers";
import { CrmAnalyticsTemplate } from "@/components/templates/crm-templates";
export async function CrmAnalyticsFeature() {
  return <CrmAnalyticsTemplate deals={await getCrmDeals(100)} />;
}
