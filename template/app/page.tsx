import { PublicShell } from "@/components/shells/public-shell";
import { LandingPageTemplate } from "@/components/templates/landingPageTemplate";

// ISR: static public copy, regenerated daily (cacheLife.static).
export const revalidate = 86400;

export default function Page() {
  return (
    <PublicShell>
      <LandingPageTemplate />
    </PublicShell>
  );
}
