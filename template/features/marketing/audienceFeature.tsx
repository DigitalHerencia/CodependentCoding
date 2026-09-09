import { notFound } from "next/navigation";
import { getAudience } from "@/lib/fetchers/marketingFetchers";
import { MarketingAudienceDetailTemplate } from "@/components/templates/marketingAudienceDetailTemplate";
export async function AudienceFeature({ audienceId }: { audienceId: string }) {
  const audience = await getAudience(audienceId);
  if (!audience) notFound();
  return <MarketingAudienceDetailTemplate audience={audience} />;
}
