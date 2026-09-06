import { PublicShell } from "@/components/shells/public-shell";
import { PublicHeader } from "@/components/nav/public-header";
import { PublicFooter } from "@/components/nav/public-footer";
import { PublicMobileBottomNav } from "@/components/nav/mobile-bottom-nav";
import { LandingPageTemplate } from "@/components/templates/landingPageTemplate";
export default function Page() {
  return (
    <PublicShell>
      <PublicHeader />
      <LandingPageTemplate />
      <PublicFooter />
      <PublicMobileBottomNav />
    </PublicShell>
  );
}
