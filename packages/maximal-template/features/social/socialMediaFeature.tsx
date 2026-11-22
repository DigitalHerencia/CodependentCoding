import { loadMediaLibraryWorkflow } from "@/lib/workflows/socialWorkflows";
import { SocialMediaFeatureClient } from "./socialMediaFeatureClient";

/** Load the authorized uploads projection for the social media route. */
export async function SocialMediaFeature() {
  const view = await loadMediaLibraryWorkflow();
  return <SocialMediaFeatureClient {...view} />;
}
