import { LandingHero } from "@/components/blocks/landing-hero";
import { getLandingStats } from "@/lib/content/landing";

export async function LandingFeature() {
  return <LandingHero stats={await getLandingStats()} />;
}
