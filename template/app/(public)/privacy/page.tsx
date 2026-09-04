import { FAQSimpleList } from "@/components/blocks/faq-section";
import { HeroSection } from "@/components/blocks/hero-section";

export default function Page() {
  return (
    <>
      <HeroSection.Minimal
        title="Privacy template"
        description="Generic demonstration content for applications generated from The Maximal Template™."
      />
      <FAQSimpleList
        title="Template notice"
        items={[
          {
            question: "Is this a production privacy policy?",
            answer:
              "No. Replace this demonstration content with a policy approved for the generated product before publication.",
          },
          {
            question: "What does this route demonstrate?",
            answer:
              "A static public privacy-information surface without application data access or mutation behavior.",
          },
        ]}
      />
    </>
  );
}
