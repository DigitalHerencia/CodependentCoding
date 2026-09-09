import { getAudiences } from "@/lib/fetchers/marketingFetchers";
import { AudiencesFeatureClient } from "./audiencesFeature.client";
export async function AudiencesFeature() {
  return <AudiencesFeatureClient audiences={await getAudiences()} />;
}
