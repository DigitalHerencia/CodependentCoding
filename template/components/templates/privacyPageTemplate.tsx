import { HeroSection } from "@/components/blocks/hero-section";
import { LegalDocumentSection } from "@/components/blocks/legal-document-section";
import { privacyCopy } from "@/content/public-pages";
export function PrivacyPageTemplate() {
  return (
    <>
      <HeroSection.Centered
        badge="Legal"
        title="Privacy"
        titleHighlight="Policy"
        description=""
        className="pb-6"
      />
      <LegalDocumentSection updatedAt="September 4, 2026" {...privacyCopy} />
    </>
  );
}
