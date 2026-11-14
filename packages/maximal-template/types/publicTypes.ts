/**
 * Public presentation contracts for the Maximal Template.
 *
 * @remarks
 * Type-only definitions shared by public blocks and their page templates.
 * Content originates in `content/public.ts`; no runtime dependencies or JSX
 * belong in this module.
 */

import type { ReactNode } from "react";

// ============================================================================
// SHARED PUBLIC ACTION
// ============================================================================

/** A navigational public action; it does not carry browser event handlers.
 * @public
 */
export type PublicAction = {
  label: string;
  href: string;
};

// ============================================================================
// FEATURE CONTENT GRID
// ============================================================================

/** Presentation-only content for a feature card.
 * @public
 */
export type FeatureContentItem = {
  title: string;
  content: ReactNode;
};

/** Input contract for {@link FeatureContentGridProps} consumers.
 * @public
 */
export type FeatureContentGridProps = {
  id?: string;
  title: string;
  introduction?: ReactNode;
  items: readonly FeatureContentItem[];
  closing?: ReactNode;
  columns?: 3 | 4;
  className?: string;
};

// ============================================================================
// HERO SECTION
// ============================================================================

/** Input contract for the centered variant of `HeroSection`.
 * @public
 */
export type HeroCenteredProps = {
  badge?: string;
  title: string;
  titleHighlight?: string;
  description?: ReactNode;
  primaryAction?: PublicAction;
  secondaryAction?: PublicAction;
  className?: string;
};

// ============================================================================
// LEGAL DOCUMENT SECTION
// ============================================================================

/** Addressable legal-document subsection.
 * @public
 */
export type LegalDocumentItem = {
  id: string;
  title: string;
  content: ReactNode;
};

/** Input contract for the dated legal-document block.
 * @public
 */
export type LegalDocumentSectionProps = {
  updatedAt: string;
  updatedAtDateTime: string;
  updatedAtLabel: string;
  introduction: ReactNode;
  sections: readonly LegalDocumentItem[];
  className?: string;
};

// ============================================================================
// SIMPLE CTA
// ============================================================================

/** Input contract for the centered link-based call to action.
 * @public
 */
export type CTASimpleProps = {
  title: ReactNode;
  description?: ReactNode;
  primaryAction: PublicAction;
  secondaryAction?: PublicAction;
  className?: string;
};

// ============================================================================
// FAQ ACCORDION
// ============================================================================

/** Question and presentational answer for the public FAQ.
 * @public
 */
export type FAQItem = {
  question: string;
  answer: ReactNode;
};

/** Input contract for the ShadCN FAQ accordion.
 * @public
 */
export type FAQAccordionProps = {
  title?: string;
  subtitle?: string;
  description?: string;
  items: readonly FAQItem[];
  className?: string;
};

// ============================================================================
// TESTIMONIALS GRID
// ============================================================================

/** Attribution and optional visual rating for a testimonial.
 * @public
 */
export type TestimonialItem = {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
  rating?: number;
};

/** Input contract for the public testimonials grid.
 * @public
 */
export type TestimonialsGridProps = {
  title?: string;
  subtitle?: string;
  testimonials: readonly TestimonialItem[];
  columns?: 2 | 3;
  className?: string;
  cardClassName?: string;
};

// ============================================================================
// PUBLIC ROUTE STATES
// ============================================================================

/** Props for a public route-group error boundary and its recovery block. */
export type PublicErrorBoundaryProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** Recovery action passed from the route boundary to public presentation. */
export type PublicErrorBlockProps = {
  onRetry: () => void;
};

// ============================================================================
// PUBLIC NAVIGATION AND SHELL CONTRACTS
// ============================================================================

/** Shared destination model for all public navigation surfaces. */
export type PublicNavigationLink = {
  label: string;
  href: string;
};

/** Icon keys resolved by the public mobile navigation component. */
export type PublicMobileNavIcon = "home" | "features" | "faq" | "signIn";

/** Public mobile navigation destination and icon reference. */
export type PublicMobileNavigationLink = PublicNavigationLink & {
  icon: PublicMobileNavIcon;
};

/** Optional branding override for the public header. */
export type PublicHeaderProps = {
  logo?: ReactNode;
};

/** Optional footer destinations. */
export type PublicFooterProps = {
  links?: readonly PublicNavigationLink[];
};

/** Input for a public link with a route-aware active state. */
export type PublicNavLinkProps = PublicNavigationLink;

/** Children rendered inside the public presentation shell and layout. */
export type PublicShellProps = {
  children: ReactNode;
};
