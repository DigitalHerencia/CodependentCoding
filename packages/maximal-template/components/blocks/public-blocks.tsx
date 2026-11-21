/**
 * Pure public-page presentation blocks for the Maximal Template.
 *
 * @remarks
 * Presentation contracts are defined in `types/publicTypes.ts`.
 * Page templates supply copy from `content/public.ts`. Blocks own neither
 * application state nor persisted data access; the ShadCN accordion delegates
 * its interactive behavior to Radix UI.
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, safeHref } from "@/lib/utilites/utils";
import {
  publicErrorCopy,
  publicLoadingCopy,
  publicUiCopy,
} from "@/content/public";
import { ArrowRight, Quote, Star } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  CTASimpleProps,
  FAQAccordionProps,
  FeatureContentGridProps,
  HeroCenteredProps,
  LegalDocumentSectionProps,
  TestimonialsGridProps,
  PublicErrorBlockProps,
} from "@/types/publicTypes";

// ============================================================================
// FEATURE CONTENT GRID
// ============================================================================

/**
 * Presents a numbered collection of public feature descriptions.
 *
 * @param props - Presentation data and responsive column preference.
 * @returns A semantic feature section composed from ShadCN cards.
 * @public
 */
export function FeatureContentGrid({
  id,
  title,
  introduction,
  items,
  closing,
  columns = 3,
  className,
}: FeatureContentGridProps) {
  return (
    <section id={id} className={cn("px-6 py-16 sm:px-10 lg:px-12", className)}>
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-10 text-center text-3xl font-black tracking-tight uppercase">
          {title}
        </h2>
        {introduction && (
          <div className="mx-auto mb-8 max-w-3xl text-center leading-7">
            {introduction}
          </div>
        )}
        <div
          className={cn(
            "grid gap-6 md:grid-cols-2",
            columns === 4 ? "xl:grid-cols-4" : "xl:grid-cols-3",
          )}
        >
          {items.map((item, index) => (
            <Card key={`${index}-${item.title}`}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Badge
                    variant="default"
                    className="grid size-12 shrink-0 place-items-center text-base font-bold"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </Badge>
                  <CardTitle>{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="leading-7 [&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-5">
                {item.content}
              </CardContent>
            </Card>
          ))}
        </div>
        {closing && <div className="mt-8 text-center leading-7">{closing}</div>}
      </div>
    </section>
  );
}

// ============================================================================
// HERO SECTION
// ============================================================================

/**
 * Presents the public-page hero with optional calls to action.
 *
 * @param props - Hero copy and navigational actions.
 * @returns A server-renderable hero section.
 * @internal
 */
function HeroCentered({
  badge,
  title,
  titleHighlight,
  description,
  primaryAction,
  secondaryAction,
  className,
}: HeroCenteredProps) {
  return (
    <section className={cn("px-4 py-20 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-4xl space-y-8 text-center">
        {badge && <Badge variant="outline">{badge}</Badge>}
        <h1 className="text-4xl leading-tight font-black tracking-tight uppercase md:text-5xl lg:text-6xl">
          {title}
          {titleHighlight && (
            <>
              {" "}
              <span className="bg-primary px-2 text-primary-foreground">
                {titleHighlight}
              </span>
            </>
          )}
        </h1>
        {description && (
          <div className="mx-auto max-w-2xl text-lg font-medium whitespace-pre-line text-foreground/90 [&_p]:my-4">
            {description}
          </div>
        )}
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            {primaryAction && (
              <Button size="lg" asChild>
                <a href={safeHref(primaryAction.href)}>
                  {primaryAction.label}
                  <ArrowRight aria-hidden="true" className="ml-2" />
                </a>
              </Button>
            )}
            {secondaryAction && (
              <Button size="lg" variant="outline" asChild>
                <a href={safeHref(secondaryAction.href)}>
                  {secondaryAction.label}
                </a>
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Named hero variant collection, retaining the current `HeroSection.Centered` API.
 *
 * @remarks
 * This focused reference demonstrates the centered variant used by the
 * existing public landing, FAQ, terms, and privacy pages. Other original
 * variants must be retained separately if existing consumers require them.
 * @public
 */
export const HeroSection = {
  Centered: HeroCentered,
} as const;

// ============================================================================
// LEGAL DOCUMENT SECTION
// ============================================================================

/**
 * Renders dated policy content with addressable section headings.
 *
 * @param props - Legal copy, publication date, and document sections.
 * @returns A structured, readable legal-document section.
 * @public
 */
export function LegalDocumentSection({
  updatedAt,
  updatedAtDateTime,
  updatedAtLabel,
  introduction,
  sections,
  className,
}: LegalDocumentSectionProps) {
  return (
    <section
      className={cn(
        "typeset typeset-app mx-auto max-w-prose px-6 pb-20 leading-relaxed sm:px-10 lg:px-12",
        className,
      )}
    >
      <p className="mb-10 text-center text-sm text-primary">
        {updatedAtLabel} <time dateTime={updatedAtDateTime}>{updatedAt}</time>
      </p>
      <div>{introduction}</div>
      {sections.map((section) => (
        <section id={section.id} key={section.id} className="mt-8">
          <h2 className="mb-3 text-xl leading-snug font-bold">
            {section.title}
          </h2>
          <div>{section.content}</div>
        </section>
      ))}
    </section>
  );
}

// ============================================================================
// SIMPLE CTA
// ============================================================================

/**
 * Presents a centered call-to-action with link-only actions.
 *
 * @param props - CTA content and destinations.
 * @returns A CTA section composed from ShadCN buttons.
 * @public
 */
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
          <Button size="lg" asChild>
            <a href={safeHref(primaryAction.href)}>
              {primaryAction.label}
              <ArrowRight aria-hidden="true" className="ml-2" />
            </a>
          </Button>
          {secondaryAction && (
            <Button size="lg" variant="outline" asChild>
              <a href={safeHref(secondaryAction.href)}>
                {secondaryAction.label}
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FAQ ACCORDION
// ============================================================================

/**
 * Presents accessible expandable answers using the installed ShadCN accordion.
 *
 * @param props - Section copy and FAQ items.
 * @returns A single-open, collapsible FAQ section.
 * @remarks
 * Radix owns keyboard interaction, expanded state, and ARIA semantics.
 * @public
 */
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
          <div className="mb-8 space-y-4 text-center">
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
              <p className="text-lg font-medium">{description}</p>
            )}
          </div>
        )}
        <Accordion type="single" collapsible className="space-y-6">
          {items.map((item, index) => (
            <AccordionItem
              key={`${index}-${item.question}`}
              value={`item-${index}`}
              className="bg-card"
            >
              <AccordionTrigger className="px-6 py-4 text-left font-bold tracking-wide uppercase">
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
// TESTIMONIALS GRID
// ============================================================================

/**
 * Displays attributed public testimonials using ShadCN cards and avatars.
 *
 * @param props - Testimonial content and grid presentation options.
 * @returns An adaptive testimonials section.
 * @public
 */
export function TestimonialsGrid({
  title,
  subtitle,
  testimonials,
  columns = 3,
  className,
  cardClassName,
}: TestimonialsGridProps) {
  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
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
        <div
          className={cn(
            "grid gap-8",
            columns === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {testimonials.map((testimonial, index) => {
            const rating =
              testimonial.rating == null
                ? null
                : Math.max(0, Math.min(5, Math.floor(testimonial.rating)));

            return (
              <Card
                key={`${index}-${testimonial.author}`}
                className={cn("bg-card", cardClassName)}
              >
                <CardHeader>
                  <Quote aria-hidden="true" className="size-8 text-primary" />
                  {rating !== null && (
                    <div
                      role="img"
                      aria-label={`${rating}/5`}
                      className="flex items-center gap-1"
                    >
                      {Array.from({ length: 5 }, (_, star) => (
                        <Star
                          aria-hidden="true"
                          key={star}
                          className={cn(
                            "size-4",
                            star < rating
                              ? "fill-warning text-warning"
                              : "text-muted-foreground",
                          )}
                        />
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <blockquote className="text-lg leading-8 font-medium">
                    {publicUiCopy.openingQuote}
                    {testimonial.quote}
                    {publicUiCopy.closingQuote}
                  </blockquote>
                  <div className="flex items-center gap-4 border-t border-border pt-4">
                    {testimonial.avatar && (
                      <Avatar>
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.author}
                        />
                        <AvatarFallback>
                          {testimonial.author.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <p className="font-bold">{testimonial.author}</p>
                      {(testimonial.role || testimonial.company) && (
                        <CardDescription>
                          {testimonial.role}
                          {testimonial.role && testimonial.company && ", "}
                          {testimonial.company}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// PUBLIC ERROR BLOCK
// ============================================================================

/**
 * Presents route-group recovery actions without owning error-boundary state.
 *
 * @param props - Retry callback supplied by the Next.js route boundary.
 * @returns The accessible public recovery presentation.
 * @public
 */
export function PublicErrorBlock({ onRetry }: PublicErrorBlockProps) {
  return (
    <section
      aria-labelledby="public-error-title"
      className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center px-4 py-12 sm:px-8"
    >
      <Card className="w-full">
        <CardHeader>
          <h1 id="public-error-title" className="text-heading-2">
            {publicErrorCopy.title}
          </h1>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button type="button" onClick={onRetry}>
            {publicErrorCopy.retry}
          </Button>
          <Button variant="outline" asChild>
            <Link href={publicErrorCopy.homeHref}>{publicErrorCopy.home}</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

// ============================================================================
// PUBLIC LOADING BLOCK
// ============================================================================

/**
 * Renders a presentational loading state while public routes stream.
 *
 * @returns A labeled, noninteractive ShadCN skeleton.
 * @public
 */
export function PublicLoadingBlock() {
  return (
    <section
      aria-label={publicLoadingCopy.label}
      role="status"
      className="mx-auto w-full max-w-5xl space-y-6 px-4 py-16 sm:px-8"
    >
      <span className="sr-only">{publicLoadingCopy.label}</span>
      <Skeleton className="h-12 w-3/4" aria-hidden="true" />
      <Skeleton className="h-5 w-full" aria-hidden="true" />
      <Skeleton className="h-5 w-5/6" aria-hidden="true" />
      <Skeleton className="h-48 w-full" aria-hidden="true" />
    </section>
  );
}
