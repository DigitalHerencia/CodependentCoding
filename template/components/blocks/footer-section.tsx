import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { safeHref } from "@/lib/utils/strings";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  Code2,
  BriefcaseBusiness,
  Camera,
  Play,
  Mail,
  ArrowRight,
} from "lucide-react";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterSocialLink {
  platform: "twitter" | "github" | "linkedin" | "instagram" | "youtube";
  href: string;
}

// ============================================================================
// FOOTER VARIANT 1: Multi-Column
// ============================================================================
export interface FooterMultiColumnProps {
  logo?: React.ReactNode;
  description?: string;
  columns: FooterColumn[];
  socialLinks?: FooterSocialLink[];
  copyright?: string;
  className?: string;
}

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
export interface FooterWithNewsletterProps {
  logo?: React.ReactNode;
  columns: FooterColumn[];
  newsletterTitle?: string;
  newsletterDescription?: string;
  onNewsletterSubmit?: (email: string) => void;
  copyright?: string;
  className?: string;
}

export function FooterWithNewsletter({
  logo,
  columns,
  newsletterTitle = "Subscribe to our newsletter",
  newsletterDescription = "Get the latest updates and news delivered to your inbox.",
  onNewsletterSubmit,
  copyright = `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
  className,
}: FooterWithNewsletterProps) {
  const [email, setEmail] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNewsletterSubmit?.(email);
    setEmail("");
  };

  return (
    <footer
      className={cn(
        "border-t-3 border-foreground bg-muted/30 px-4 py-16 md:px-8 lg:px-16",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-12 lg:grid-cols-2">
          {/* Newsletter section */}
          <div className="space-y-4">
            {logo && (
              <div className="text-2xl font-black uppercase">{logo}</div>
            )}
            <h4 className="text-lg font-black uppercase">{newsletterTitle}</h4>
            <p className="font-medium text-muted-foreground">
              {newsletterDescription}
            </p>
            <form onSubmit={handleSubmit} className="flex max-w-md gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" aria-label="Subscribe">
                <Mail className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Links section */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
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
// FOOTER VARIANT 3: Simple Centered
// ============================================================================
export interface FooterSimpleProps {
  logo?: React.ReactNode;
  links?: FooterLink[];
  socialLinks?: FooterSocialLink[];
  copyright?: string;
  className?: string;
}

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
export interface FooterMinimalProps {
  logo?: React.ReactNode;
  links?: FooterLink[];
  copyright?: string;
  className?: string;
}

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
export interface FooterWithCTAProps {
  logo?: React.ReactNode;
  description?: string;
  columns: FooterColumn[];
  ctaTitle?: string;
  ctaAction?: { label: string; onClick?: () => void };
  socialLinks?: FooterSocialLink[];
  copyright?: string;
  className?: string;
}

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
  const icons = {
    twitter: MessageCircle,
    github: Code2,
    linkedin: BriefcaseBusiness,
    instagram: Camera,
    youtube: Play,
  };

  const Icon = icons[platform];
  const sizeClasses = size === "sm" ? "w-7 h-7" : "w-9 h-9";
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <a
      href={safeHref(href)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center justify-center border-2 border-foreground bg-muted transition hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-primary hover:text-primary-foreground hover:shadow-[2px_2px_0px_hsl(var(--shadow-color))]",
        sizeClasses,
      )}
    >
      <Icon className={iconSize} />
    </a>
  );
}

// ============================================================================
// Export all variants
// ============================================================================
export const FooterSection = {
  MultiColumn: FooterMultiColumn,
  WithNewsletter: FooterWithNewsletter,
  Simple: FooterSimple,
  Minimal: FooterMinimal,
  WithCTA: FooterWithCTA,
};
