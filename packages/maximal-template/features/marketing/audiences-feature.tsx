import { getAudiences } from "@/lib/fetchers/marketingFetchers";
import { AudiencesFeatureClient } from "./audiences-feature.client";
export async function AudiencesFeature() {
  return <AudiencesFeatureClient audiences={await getAudiences()} />;
}
