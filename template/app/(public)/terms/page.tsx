import { FAQSimpleList } from "@/components/blocks/faq-sections";
import { HeroSection } from "@/components/blocks/hero-sections";

export default function Page() {
  return (
    <>
      <HeroSection.Minimal
        title="Terms template"
        description="Generic demonstration content for applications generated from The Maximal Template™."
      />
      <FAQSimpleList
        title="Template notice"
        items={[
          {
            question: "Is this production legal text?",
            answer:
              "No. Replace this demonstration content with terms approved for the generated product before publication.",
          },
          {
            question: "What does this route demonstrate?",
            answer:
              "A static public legal-information surface composed directly from reusable presentation blocks.",
          },
        ]}
      />
    </>
  );
}
