import { HeroSection } from "@/components/blocks/hero-section";
import { LegalDocumentSection } from "@/components/blocks/legal-document-section";
import { privacyCopy } from "@/content/public-pages";
import Image from "next/image";

export function PrivacyPageTemplate() {
  return (
    <section>
      <Image
        src="/seperator.png"
        alt="Caution"
        width={1200}
        height={400}
        className="h-auto w-full bg-background"
      />
      <HeroSection.Centered title="Privacy" titleHighlight="Policy" />
      <LegalDocumentSection updatedAt="September 4, 2026" {...privacyCopy} />
      <Image
        src="/seperator.png"
        alt="Caution"
        width={1200}
        height={400}
        className="h-auto w-full bg-background"
      />
    </section>
  );
}
