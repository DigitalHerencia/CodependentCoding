import { PageHero } from "@/components/blocks/page-hero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqCopy } from "@/lib/constants/siteCopy";

export function FaqList() {
  return (
    <main className="pb-16">
      <PageHero
        kicker={faqCopy.kicker}
        title={faqCopy.title}
        subtitle={faqCopy.subtitle}
      />
      <Accordion
        type="single"
        collapsible
        defaultValue="faq-0"
        className="site-rise mx-auto max-w-3xl px-4"
      >
        {faqCopy.items.map((item, index) => (
          <AccordionItem key={item.question} value={`faq-${index}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>
              {item.answer.map((line) => (
                <p className="my-1" key={line}>
                  {line}
                </p>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
}
