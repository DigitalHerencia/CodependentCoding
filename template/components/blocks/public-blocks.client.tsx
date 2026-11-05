"use client";
import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils/cn";
import { safeHref } from "@/lib/utils/strings";
import {
  ArrowRight,
  Sparkles,
  Zap,
  HelpCircle,
  MessageCircle,
  Quote,
  Star,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ============================================================================
// CTA VARIANT 1: Simple Centered
// ============================================================================
export type CTASimpleProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  primaryAction: { label: string; href?: string; onClick?: () => void };
  secondaryAction?: { label: string; href?: string; onClick?: () => void };
  className?: string;
};

export function CTASimple({
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: CTASimpleProps) {
  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-4xl space-y-6 text-center">
        <h2 className="text-3xl font-black tracking-tight uppercase md:text-4xl">
          {title}
        </h2>

        {description && (
          <div className="mx-auto max-w-2xl text-lg font-medium whitespace-pre-line text-foreground/90 [&_p]:my-4">
            {description}
          </div>
        )}

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          {primaryAction.href ? (
            <Button size="lg" asChild>
              <a href={safeHref(primaryAction.href)}>
                {primaryAction.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          ) : (
            <Button size="lg" onClick={primaryAction.onClick}>
              {primaryAction.label}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {secondaryAction &&
            (secondaryAction.href ? (
              <Button size="lg" variant="outline" asChild>
                <a href={safeHref(secondaryAction.href)}>
                  {secondaryAction.label}
                </a>
              </Button>
            ) : (
              <Button
                size="lg"
                variant="outline"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CTA VARIANT 2: With Background
// ============================================================================
export type CTAWithBackgroundProps = {
  title: string;
  description?: string;
  primaryAction: { label: string; href?: string; onClick?: () => void };
  backgroundColor?: "primary" | "secondary" | "accent" | "muted";
  className?: string;
};

export function CTAWithBackground({
  title,
  description,
  primaryAction,
  backgroundColor = "primary",
  className,
}: CTAWithBackgroundProps) {
  const bgColors = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    accent: "bg-accent text-accent-foreground",
    muted: "bg-muted text-foreground",
  };

  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div
        className={cn(
          "mx-auto max-w-5xl border-3 border-foreground p-8 shadow-[8px_8px_0px_hsl(var(--shadow-color))] md:p-12",
          bgColors[backgroundColor],
        )}
      >
        <div className="space-y-6 text-center">
          <Sparkles className="mx-auto h-12 w-12" />

          <h2 className="text-3xl font-black tracking-tight uppercase md:text-4xl">
            {title}
          </h2>

          {description && (
            <p className="mx-auto max-w-2xl text-lg font-medium opacity-90">
              {description}
            </p>
          )}

          {primaryAction.href ? (
            <Button
              size="lg"
              variant={backgroundColor === "muted" ? "default" : "outline"}
              className={
                backgroundColor !== "muted"
                  ? "bg-background text-foreground hover:bg-background/90"
                  : ""
              }
              asChild
            >
              <a href={safeHref(primaryAction.href)}>
                {primaryAction.label}
                <Zap className="ml-2 h-4 w-4" />
              </a>
            </Button>
          ) : (
            <Button
              size="lg"
              variant={backgroundColor === "muted" ? "default" : "outline"}
              className={
                backgroundColor !== "muted"
                  ? "bg-background text-foreground hover:bg-background/90"
                  : ""
              }
              onClick={primaryAction.onClick}
            >
              {primaryAction.label}
              <Zap className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CTA VARIANT 3: Newsletter
// ============================================================================

// ============================================================================
// CTA VARIANT 4: Split with Image
// ============================================================================
export type CTASplitProps = {
  title: string;
  description?: string;
  primaryAction: { label: string; href?: string; onClick?: () => void };
  secondaryAction?: { label: string; href?: string; onClick?: () => void };
  imageSrc: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
  className?: string;
};

export function CTASplit({
  title,
  description,
  primaryAction,
  secondaryAction,
  imageSrc,
  imageAlt = "CTA image",
  imagePosition = "right",
  className,
}: CTASplitProps) {
  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-6xl overflow-hidden border-3 border-foreground shadow-[8px_8px_0px_hsl(var(--shadow-color))]">
        <div
          className={cn(
            "grid md:grid-cols-2",
            imagePosition === "left" && "md:[&>*:first-child]:order-2",
          )}
        >
          <div className="flex flex-col justify-center space-y-6 p-8 md:p-12">
            <h2 className="text-2xl font-black tracking-tight uppercase md:text-3xl">
              {title}
            </h2>

            {description && (
              <p className="font-medium text-muted-foreground">{description}</p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              {primaryAction.href ? (
                <Button size="lg" asChild>
                  <a href={safeHref(primaryAction.href)}>
                    {primaryAction.label}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <Button size="lg" onClick={primaryAction.onClick}>
                  {primaryAction.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              {secondaryAction &&
                (secondaryAction.href ? (
                  <Button size="lg" variant="outline" asChild>
                    <a href={safeHref(secondaryAction.href)}>
                      {secondaryAction.label}
                    </a>
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={secondaryAction.onClick}
                  >
                    {secondaryAction.label}
                  </Button>
                ))}
            </div>
          </div>

          <div className="bg-muted">
            <Image
              src={imageSrc}
              alt={imageAlt}
              height={800}
              unoptimized
              width={1200}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CTA VARIANT 5: Banner
// ============================================================================
export type CTABannerProps = {
  text: string;
  action: { label: string; href?: string; onClick?: () => void };
  dismissible?: boolean;
  onDismiss?: () => void;
  variant?: "primary" | "secondary" | "accent" | "warning";
  className?: string;
};

export function CTABanner({
  text,
  action,
  dismissible = false,
  onDismiss,
  variant = "primary",
  className,
}: CTABannerProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  const variantStyles = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    accent: "bg-accent text-accent-foreground",
    warning: "bg-yellow-500 text-foreground",
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "relative border-b-3 border-foreground px-4 py-3",
        variantStyles[variant],
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 text-center sm:flex-row sm:text-left">
        <p className="text-sm font-bold">{text}</p>
        {action.href ? (
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 bg-background text-foreground hover:bg-background/90"
            asChild
          >
            <a href={safeHref(action.href)}>
              {action.label}
              <ArrowRight className="ml-1 h-3 w-3" />
            </a>
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 bg-background text-foreground hover:bg-background/90"
            onClick={action.onClick}
          >
            {action.label}
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        )}
        {dismissible && (
          <button
            aria-label="Dismiss"
            onClick={() => {
              setIsVisible(false);
              onDismiss?.();
            }}
            className="absolute right-4 text-current opacity-70 hover:opacity-100"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Export all variants
// ============================================================================
export const CTASection = {
  Simple: CTASimple,
  WithBackground: CTAWithBackground,

  Split: CTASplit,
  Banner: CTABanner,
};

export type FAQItem = {
  question: string;
  answer: React.ReactNode;
};

// ============================================================================
// FAQ VARIANT 1: Simple Accordion
// ============================================================================
export type FAQAccordionProps = {
  title?: string;
  subtitle?: string;
  description?: string;
  items: FAQItem[];
  className?: string;
};

export function FAQAccordion({
  title,
  subtitle,
  description,
  items,
  className,
}: FAQAccordionProps) {
  return (
    <section className={cn("px-4 py-8 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-3xl">
        {(title || subtitle || description) && (
          <div className="space-y-4 text-center">
            {subtitle && (
              <p className="text-sm font-bold tracking-widest text-primary uppercase">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-3xl font-black uppercase md:text-4xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg font-medium text-foreground">
                {description}
              </p>
            )}
          </div>
        )}

        <Accordion type="single" collapsible className="space-y-6">
          {items.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`item-${index}`}
              className="border-3 border-foreground bg-card shadow-[4px_4px_0px_hsl(var(--shadow-color))] transition data-[state=open]:-translate-x-0.5 data-[state=open]:-translate-y-0.5 data-[state=open]:shadow-[4px_4px_0px_hsl(var(--shadow-color))]"
            >
              <AccordionTrigger className="px-6 py-4 font-bold tracking-wide uppercase hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="bg-background px-6 pb-4 text-foreground [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

// ============================================================================
// FAQ VARIANT 2: Two Columns
// ============================================================================
export type FAQTwoColumnsProps = {
  title?: string;
  items: FAQItem[];
  className?: string;
};

export function FAQTwoColumns({ title, items, className }: FAQTwoColumnsProps) {
  const midpoint = Math.ceil(items.length / 2);
  const leftColumn = items.slice(0, midpoint);
  const rightColumn = items.slice(midpoint);

  return (
    <section
      className={cn("bg-muted/30 px-4 py-16 md:px-8 lg:px-16", className)}
    >
      <div className="mx-auto max-w-6xl">
        {title && (
          <h2 className="mb-12 text-center text-3xl font-black tracking-tight uppercase md:text-4xl">
            {title}
          </h2>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            {leftColumn.map((item, index) => (
              <FAQCard key={item.question} item={item} index={index} />
            ))}
          </div>
          <div className="space-y-6">
            {rightColumn.map((item, index) => (
              <FAQCard
                key={item.question}
                item={item}
                index={midpoint + index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FAQ VARIANT 3: With Categories
// ============================================================================
export type FAQCategory = {
  name: string;
  items: FAQItem[];
};

export type FAQWithCategoriesProps = {
  title?: string;
  categories: FAQCategory[];
  className?: string;
};

export function FAQWithCategories({
  title,
  categories,
  className,
}: FAQWithCategoriesProps) {
  const [activeCategory, setActiveCategory] = React.useState(0);

  if (!categories.length) return null;

  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-4xl">
        {title && (
          <h2 className="mb-12 text-center text-3xl font-black tracking-tight uppercase md:text-4xl">
            {title}
          </h2>
        )}

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((category, index) => (
            <Button
              key={category.name}
              variant={activeCategory === index ? "default" : "outline"}
              onClick={() => setActiveCategory(index)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        <Accordion
          type="single"
          collapsible
          className="space-y-4"
          key={activeCategory}
        >
          {categories[activeCategory]?.items.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`item-${index}`}
              className="border-3 border-foreground bg-card shadow-[4px_4px_0px_hsl(var(--shadow-color))]"
            >
              <AccordionTrigger className="px-6 py-4 font-bold tracking-wide uppercase hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

// ============================================================================
// FAQ VARIANT 4: With Contact CTA
// ============================================================================
export type FAQWithContactProps = {
  title?: string;
  items: FAQItem[];
  contactTitle?: string;
  contactDescription?: string;
  contactAction?: { label: string; onClick?: () => void };
  className?: string;
};

export function FAQWithContact({
  title,
  items,
  contactTitle = "Still have questions?",
  contactDescription = "Can't find the answer you're looking for? Please reach out to our friendly team.",
  contactAction,
  className,
}: FAQWithContactProps) {
  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-4xl">
        {title && (
          <h2 className="mb-12 text-center text-3xl font-black tracking-tight uppercase md:text-4xl">
            {title}
          </h2>
        )}

        <Accordion type="single" collapsible className="mb-12 space-y-4">
          {items.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`item-${index}`}
              className="border-3 border-foreground bg-card shadow-[4px_4px_0px_hsl(var(--shadow-color))]"
            >
              <AccordionTrigger className="px-6 py-4 font-bold tracking-wide uppercase hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="space-y-4 border-3 border-foreground bg-primary/10 p-8 text-center shadow-[6px_6px_0px_hsl(var(--shadow-color))]">
          <HelpCircle className="mx-auto h-12 w-12 text-primary" />
          <h3 className="text-xl font-black uppercase">{contactTitle}</h3>
          <p className="mx-auto max-w-md font-medium text-muted-foreground">
            {contactDescription}
          </p>
          {contactAction && (
            <Button size="lg" onClick={contactAction.onClick}>
              <MessageCircle className="mr-2 h-4 w-4" />
              {contactAction.label}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FAQ VARIANT 5: Simple List
// ============================================================================
export type FAQSimpleListProps = {
  title?: string;
  items: FAQItem[];
  className?: string;
};

export function FAQSimpleList({ title, items, className }: FAQSimpleListProps) {
  return (
    <section
      className={cn("bg-muted/30 px-4 py-16 md:px-8 lg:px-16", className)}
    >
      <div className="mx-auto max-w-3xl">
        {title && (
          <h2 className="mb-12 text-center text-3xl font-black tracking-tight uppercase md:text-4xl">
            {title}
          </h2>
        )}

        <div className="space-y-8">
          {items.map((item) => (
            <div key={item.question} className="space-y-2">
              <h3 className="text-lg font-bold">{item.question}</h3>
              <p className="text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Helper Components
// ============================================================================
function FAQCard({ item, index }: { item: FAQItem; index: number }) {
  return (
    <div className="border-3 border-foreground bg-card p-6 shadow-[4px_4px_0px_hsl(var(--shadow-color))]">
      <div className="flex gap-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-foreground bg-primary text-sm font-black text-primary-foreground">
          {index + 1}
        </div>
        <div>
          <h3 className="mb-2 font-bold">{item.question}</h3>
          <p className="text-sm text-muted-foreground">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Export all variants
// ============================================================================
export const FAQSection = {
  Accordion: FAQAccordion,
  TwoColumns: FAQTwoColumns,
  WithCategories: FAQWithCategories,
  WithContact: FAQWithContact,
  SimpleList: FAQSimpleList,
};

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export type FooterSocialLink = {
  platform: "twitter" | "github" | "linkedin" | "instagram" | "youtube";
  href: string;
};

// ============================================================================
// FOOTER VARIANT 1: Multi-Column
// ============================================================================
export type FooterMultiColumnProps = {
  logo?: React.ReactNode;
  description?: string;
  columns: FooterColumn[];
  socialLinks?: FooterSocialLink[];
  copyright?: string;
  className?: string;
};

export function FooterMultiColumn({
  logo,
  description,
  columns,
  socialLinks,
  copyright = `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
  className,
}: FooterMultiColumnProps) {
  const totalCols = columns.length + 1; // +1 for brand column (counts as 2 on lg)
  const lgCols = Math.min(totalCols + 1, 6); // brand takes 2 slots on lg
  const lgColsClass =
    {
      2: "lg:grid-cols-2",
      3: "lg:grid-cols-3",
      4: "lg:grid-cols-4",
      5: "lg:grid-cols-5",
      6: "lg:grid-cols-6",
    }[lgCols] ?? "lg:grid-cols-6";

  return (
    <footer
      className={cn(
        "border-t-3 border-foreground px-4 py-16 md:px-8 lg:px-16",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div
          className={cn(
            "mb-12 grid grid-cols-2 gap-8 md:grid-cols-4",
            lgColsClass,
          )}
        >
          {/* Brand column */}
          <div className="col-span-2 space-y-4">
            {logo && (
              <div className="text-2xl font-black uppercase">{logo}</div>
            )}
            {description && (
              <p className="max-w-xs font-medium text-muted-foreground">
                {description}
              </p>
            )}
            {socialLinks && (
              <div className="flex gap-2">
                {socialLinks.map((link) => (
                  <SocialIcon
                    key={`social-${link.platform}`}
                    platform={link.platform}
                    href={safeHref(link.href)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Link columns */}
          {columns.map((column, index) => (
            <div key={`col-${index}`} className="space-y-4">
              <h4 className="text-sm font-black tracking-wide uppercase">
                {column.title}
              </h4>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={`link-${link.label}`}>
                    <a
                      href={safeHref(link.href)}
                      className="font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="h-[3px] bg-foreground" />

        <div className="pt-8 text-center text-sm text-muted-foreground">
          {copyright}
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// FOOTER VARIANT 2: With Newsletter
// ============================================================================

// ============================================================================
// FOOTER VARIANT 3: Simple Centered
// ============================================================================
export type FooterSimpleProps = {
  logo?: React.ReactNode;
  links?: FooterLink[];
  socialLinks?: FooterSocialLink[];
  copyright?: string;
  className?: string;
};

export function FooterSimple({
  logo,
  links,
  socialLinks,
  copyright = `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
  className,
}: FooterSimpleProps) {
  return (
    <footer
      className={cn(
        "border-t-3 border-foreground px-4 py-12 md:px-8 lg:px-16",
        className,
      )}
    >
      <div className="mx-auto max-w-4xl space-y-6 text-center">
        {logo && <div className="text-2xl font-black uppercase">{logo}</div>}

        {links && (
          <nav className="flex flex-wrap justify-center gap-6">
            {links.map((link) => (
              <a
                key={`link-${link.label}`}
                href={safeHref(link.href)}
                className="text-sm font-bold text-muted-foreground uppercase transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {socialLinks && (
          <div className="flex justify-center gap-2">
            {socialLinks.map((link) => (
              <SocialIcon
                key={`social-${link.platform}`}
                platform={link.platform}
                href={safeHref(link.href)}
              />
            ))}
          </div>
        )}

        <p className="text-sm text-muted-foreground">{copyright}</p>
      </div>
    </footer>
  );
}

// ============================================================================
// FOOTER VARIANT 4: Minimal
// ============================================================================
export type FooterMinimalProps = {
  logo?: React.ReactNode;
  links?: FooterLink[];
  copyright?: string;
  className?: string;
};

export function FooterMinimal({
  logo,
  links,
  copyright = `© ${new Date().getFullYear()}`,
  className,
}: FooterMinimalProps) {
  return (
    <footer
      className={cn(
        "border-t-3 border-foreground px-4 py-8 md:px-8 lg:px-16",
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-4">
          {logo && <div className="text-lg font-black uppercase">{logo}</div>}
          <span className="text-sm text-muted-foreground">{copyright}</span>
        </div>

        {links && (
          <nav className="flex flex-wrap gap-4">
            {links.map((link) => (
              <a
                key={`link-${link.label}`}
                href={safeHref(link.href)}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </footer>
  );
}

// ============================================================================
// FOOTER VARIANT 5: With CTA
// ============================================================================
export type FooterWithCTAProps = {
  logo?: React.ReactNode;
  description?: string;
  columns: FooterColumn[];
  ctaTitle?: string;
  ctaAction?: { label: string; onClick?: () => void };
  socialLinks?: FooterSocialLink[];
  copyright?: string;
  className?: string;
};

export function FooterWithCTA({
  logo,
  description,
  columns,
  ctaTitle = "Ready to get started?",
  ctaAction,
  socialLinks,
  copyright = `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
  className,
}: FooterWithCTAProps) {
  return (
    <footer className={cn("border-t-3 border-foreground", className)}>
      {/* CTA Banner */}
      <div className="bg-primary px-4 py-12 text-primary-foreground md:px-8 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <h3 className="text-2xl font-black uppercase">{ctaTitle}</h3>
          {ctaAction && (
            <Button
              size="lg"
              variant="outline"
              className="bg-background text-foreground hover:bg-background/90"
              onClick={ctaAction.onClick}
            >
              {ctaAction.label}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main footer */}
      <div className="px-4 py-12 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-2 space-y-4 md:col-span-1">
              {logo && (
                <div className="text-xl font-black uppercase">{logo}</div>
              )}
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
              {socialLinks && (
                <div className="flex gap-2">
                  {socialLinks.map((link) => (
                    <SocialIcon
                      key={`social-${link.platform}`}
                      platform={link.platform}
                      href={safeHref(link.href)}
                      size="sm"
                    />
                  ))}
                </div>
              )}
            </div>

            {columns.map((column, index) => (
              <div key={`col-${index}`} className="space-y-3">
                <h4 className="text-xs font-black tracking-wide uppercase">
                  {column.title}
                </h4>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={`link-${link.label}`}>
                      <a
                        href={safeHref(link.href)}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="h-[3px] bg-foreground" />

          <div className="pt-6 text-center text-xs text-muted-foreground">
            {copyright}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// Helper Components
// ============================================================================
function SocialIcon({
  platform,
  href,
  size = "default",
}: {
  platform: FooterSocialLink["platform"];
  href: string;
  size?: "sm" | "default";
}) {
  const labels: Record<FooterSocialLink["platform"], string> = {
    twitter: "X / Twitter",
    github: "GitHub",
    linkedin: "LinkedIn",
    instagram: "Instagram",
    youtube: "YouTube",
  };

  const glyphs: Record<FooterSocialLink["platform"], string> = {
    twitter: "X",
    github: "GH",
    linkedin: "in",
    instagram: "IG",
    youtube: "YT",
  };

  const sizeClasses = size === "sm" ? "w-7 h-7" : "w-9 h-9";
  const textClass = size === "sm" ? "text-[9px]" : "text-[10px]";

  return (
    <a
      href={safeHref(href)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={labels[platform]}
      className={cn(
        "flex items-center justify-center border-2 border-foreground bg-muted font-black transition hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-primary hover:text-primary-foreground hover:shadow-[2px_2px_0px_hsl(var(--shadow-color))]",
        sizeClasses,
        textClass,
      )}
    >
      <span aria-hidden="true">{glyphs[platform]}</span>
    </a>
  );
}

// ============================================================================
// Export all variants
// ============================================================================
export const FooterSection = {
  MultiColumn: FooterMultiColumn,

  Simple: FooterSimple,
  Minimal: FooterMinimal,
  WithCTA: FooterWithCTA,
};

export type TestimonialItem = {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
  rating?: number;
};

// ============================================================================
// TESTIMONIALS VARIANT 1: Cards Grid
// ============================================================================

export type TestimonialsGridProps = {
  title?: string;
  subtitle?: string;
  testimonials: TestimonialItem[];
  columns?: 2 | 3;
  className?: string;
  cardClassName?: string;
};

export function TestimonialsGrid({
  title,
  subtitle,
  testimonials,
  columns = 3,
  cardClassName,
  className,
}: TestimonialsGridProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <section
      className={cn("bg-primary px-4 py-16 md:px-8 lg:px-16", className)}
    >
      <div className="mx-auto max-w-7xl">
        {(title || subtitle) && (
          <div className="mb-8 space-y-4 text-center">
            {subtitle && (
              <p className="text-sm font-bold tracking-widest text-primary uppercase">
                {subtitle}
              </p>
            )}

            {title && (
              <h2 className="text-3xl font-black tracking-tight uppercase md:text-4xl">
                {title}
              </h2>
            )}
          </div>
        )}

        <div className={cn("grid gap-8", gridCols[columns])}>
          {testimonials.map((testimonial) => (
            <Card
              key={`testimonial-${testimonial.author}`}
              className={cn(
                "bg-card transition hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_hsl(var(--background))]",
                cardClassName,
              )}
            >
              <CardContent className="p-6">
                <Quote className="mb-5 h-8 w-8 text-primary" />

                {testimonial.rating && (
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < (testimonial.rating ?? 0)
                            ? "fill-warning text-warning"
                            : "text-muted-foreground",
                        )}
                      />
                    ))}
                  </div>
                )}

                <div className="min-h-24">
                  <p className="text-lg leading-8 font-medium">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>

                <div className="border-t-2 border-foreground pt-4">
                  <p className="font-bold">{testimonial.author}</p>

                  {(testimonial.role || testimonial.company) && (
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                      {testimonial.company && ` at ${testimonial.company}`}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TESTIMONIALS VARIANT 2: Single Quote (Large)
// ============================================================================
export type TestimonialsSingleProps = {
  testimonial: TestimonialItem;
  className?: string;
};

export function TestimonialsSingle({
  testimonial,
  className,
}: TestimonialsSingleProps) {
  return (
    <section className={cn("px-4 py-20 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-4xl space-y-8 text-center">
        <Quote className="mx-auto h-16 w-16 text-primary" />

        <blockquote className="text-2xl leading-relaxed font-bold md:text-3xl lg:text-4xl">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>

        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-16 w-16 border-3 border-foreground shadow-hard">
            <AvatarImage src={testimonial.avatar} />
            <AvatarFallback className="text-xl font-bold">
              {testimonial.author.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-black uppercase">{testimonial.author}</p>
            <p className="font-medium text-muted-foreground">
              {testimonial.role}
              {testimonial.company && ` at ${testimonial.company}`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TESTIMONIALS VARIANT 3: Masonry Layout
// ============================================================================
export type TestimonialsMasonryProps = {
  title?: string;
  testimonials: TestimonialItem[];
  className?: string;
};

export function TestimonialsMasonry({
  title,
  testimonials,
  className,
}: TestimonialsMasonryProps) {
  // Split testimonials into columns
  const columns = [
    testimonials.filter((_, i) => i % 3 === 0),
    testimonials.filter((_, i) => i % 3 === 1),
    testimonials.filter((_, i) => i % 3 === 2),
  ];

  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-7xl">
        {title && (
          <h2 className="mb-12 text-center text-3xl font-black tracking-tight uppercase md:text-4xl">
            {title}
          </h2>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="space-y-6">
              {column.map((testimonial) => (
                <Card
                  key={`testimonial-${testimonial.author}`}
                  className="transition hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_hsl(var(--shadow-color))]"
                >
                  <CardContent className="space-y-4 p-6">
                    {testimonial.rating && (
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < (testimonial.rating ?? 0)
                                ? "fill-warning text-warning"
                                : "text-muted-foreground",
                            )}
                          />
                        ))}
                      </div>
                    )}
                    <p className="leading-relaxed font-medium">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>

                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-foreground">
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback className="text-sm font-bold">
                          {testimonial.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold">
                          {testimonial.author}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TESTIMONIALS VARIANT 4: With Avatars Row
// ============================================================================
export type TestimonialsWithAvatarsProps = {
  title?: string;
  description?: string;
  testimonials: TestimonialItem[];
  className?: string;
};

export function TestimonialsWithAvatars({
  title,
  description,
  testimonials,
  className,
}: TestimonialsWithAvatarsProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  if (!testimonials.length) return null;

  const activeTestimonial = testimonials[activeIndex] ?? testimonials[0];
  if (!activeTestimonial) return null;

  return (
    <section
      className={cn("bg-muted/30 px-4 py-16 md:px-8 lg:px-16", className)}
    >
      <div className="mx-auto max-w-4xl space-y-8 text-center">
        {(title || description) && (
          <div className="space-y-4">
            {title && (
              <h2 className="text-3xl font-black tracking-tight uppercase md:text-4xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg font-medium text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="border-3 border-foreground bg-card p-8 shadow-[6px_6px_0px_hsl(var(--shadow-color))]">
          <Quote className="mx-auto mb-6 h-10 w-10 text-primary" />

          <blockquote className="mb-6 text-xl leading-relaxed font-medium md:text-2xl">
            &ldquo;{activeTestimonial.quote}&rdquo;
          </blockquote>

          <div>
            <p className="font-black uppercase">{activeTestimonial.author}</p>
            <p className="text-sm text-muted-foreground">
              {activeTestimonial.role}
              {activeTestimonial.company && ` at ${activeTestimonial.company}`}
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-2">
          {testimonials.map((testimonial, index) => (
            <button
              key={`avatar-${testimonial.author}`}
              aria-label={`View testimonial from ${testimonial.author}`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "transition",
                index === activeIndex
                  ? "scale-110"
                  : "opacity-50 hover:opacity-100",
              )}
            >
              <Avatar
                className={cn(
                  "h-12 w-12 border-3 border-foreground",
                  index === activeIndex &&
                    "shadow-[3px_3px_0px_hsl(var(--shadow-color))]",
                )}
              >
                <AvatarImage src={testimonial.avatar} />
                <AvatarFallback className="font-bold">
                  {testimonial.author.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Export all variants
// ============================================================================
export const Testimonials = {
  Grid: TestimonialsGrid,
  Single: TestimonialsSingle,
  Masonry: TestimonialsMasonry,
  WithAvatars: TestimonialsWithAvatars,
};
