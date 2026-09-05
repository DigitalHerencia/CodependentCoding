import { HeroSection } from "@/components/blocks/hero-section";
import { LegalDocumentSection } from "@/components/blocks/legal-document-section";
import { termsCopy } from "@/content/public-pages";
export function TermsPageTemplate() {
  return (
    <>
      <HeroSection.Centered
        badge="Legal"
        title="Terms of"
        titleHighlight="Service"
        description=""
        className="pb-6"
      />
      <LegalDocumentSection updatedAt="September 4, 2026" {...termsCopy} />
    </>
  );
}
