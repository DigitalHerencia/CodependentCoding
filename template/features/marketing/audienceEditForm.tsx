import { notFound } from "next/navigation";
import { getAudience } from "@/lib/fetchers/marketingFetchers";
import { AudienceNewForm } from "./audienceNewForm";
export async function AudienceEditForm({ audienceId }: { audienceId: string }) {
  const audience = await getAudience(audienceId);
  if (!audience) notFound();
  return <AudienceNewForm audience={audience} />;
}
