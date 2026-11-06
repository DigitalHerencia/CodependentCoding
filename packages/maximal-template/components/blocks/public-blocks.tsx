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
import { Marquee } from "@/components/ui/marquee";
import { cn, safeHref } from "@/components/ui/utils";
import { publicUiCopy } from "@/content/public";
import {
  ArrowRight,
  Check,
  Mail,
  Minus,
  Play,
  Star,
  TrendingDown,
  TrendingUp,
  X,
  XIcon,
  Zap,
} from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { type ReactNode } from "react";

export type BentoItem = {
  title: string;
  description?: string;
  icon?: ReactNode;
  span?: "large" | "tall" | "wide" | "normal";
  accent?: "primary" | "secondary" | "accent" | "card";
};

export type BentoGridProps = {
  title?: string;
  subtitle?: string;
  items: BentoItem[];
  className?: string;
};

const spanClass: Record<NonNullable<BentoItem["span"]>, string> = {
  large: "md:col-span-2 md:row-span-2",
  tall: "md:row-span-2",
  wide: "md:col-span-2",
  normal: "",
};

const accentClass: Record<NonNullable<BentoItem["accent"]>, string> = {
  primary: "bg-primary/15",
  secondary: "bg-secondary/15",
  accent: "bg-accent/15",
  card: "bg-card",
};

export function BentoGrid({
  title,
  subtitle,
  items,
  className,
}: BentoGridProps) {
  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-6xl">
        {(title || subtitle) && (
          <div className="mb-12 space-y-3 text-center">
            {title && (
              <h2 className="text-4xl font-black tracking-tight uppercase md:text-5xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mx-auto max-w-xl text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className="grid auto-rows-[minmax(140px,auto)] grid-cols-1 gap-4 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className={cn(
                "flex flex-col justify-between border-3 border-foreground p-5 shadow-[4px_4px_0px_hsl(var(--shadow-color))] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_hsl(var(--shadow-color))]",
                spanClass[item.span ?? "normal"],
                accentClass[item.accent ?? "card"],
              )}
            >
              {item.icon && (
                <div className="mb-4 flex h-10 w-10 items-center justify-center border-2 border-foreground bg-background">
                  {item.icon}
                </div>
              )}
              <div>
                <h3 className="text-lg font-black tracking-wide uppercase">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export type ChangelogTag = "feature" | "fix" | "improvement" | "breaking";

export type ChangelogEntry = {
  version: string;
  date: string;
  tag?: ChangelogTag;
  title: string;
  items: string[];
};

export type ChangelogSectionProps = {
  title?: string;
  subtitle?: string;
  entries: ChangelogEntry[];
  className?: string;
};

const tagVariant: Record<
  ChangelogTag,
  "default" | "secondary" | "success" | "destructive"
> = {
  feature: "default",
  improvement: "secondary",
  fix: "success",
  breaking: "destructive",
};

export function ChangelogSection({
  title = publicUiCopy.changelog,
  subtitle,
  entries,
  className,
}: ChangelogSectionProps) {
  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 space-y-3">
          <h2 className="text-4xl font-black tracking-tight uppercase md:text-5xl">
            {title}
          </h2>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
        <ol className="relative space-y-10 border-l-3 border-foreground pl-8">
          {entries.map((entry) => (
            <li key={entry.version} className="relative">
              <span className="absolute -left-[41px] flex h-5 w-5 items-center justify-center border-3 border-foreground bg-primary shadow-[2px_2px_0px_hsl(var(--shadow-color))]" />
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xl font-black tracking-wide uppercase">
                  {entry.version}
                </span>
                {entry.tag && (
                  <Badge variant={tagVariant[entry.tag]}>{entry.tag}</Badge>
                )}
                <span className="text-sm font-bold text-muted-foreground">
                  {entry.date}
                </span>
              </div>
              <h3 className="mt-2 font-bold">{entry.title}</h3>
              <ul className="mt-2 space-y-1.5">
                {entry.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export type ComparisonRow = {
  feature: string;
  values: (string | boolean)[];
};

export type ComparisonTableProps = {
  title?: string;
  subtitle?: string;
  columns: string[];
  rows: ComparisonRow[];
  /** Zero-based index of the emphasized column. */
  highlightColumn?: number;
  className?: string;
  headerClassName?: string;
  tableClassName?: string;
  footer?: ReactNode;
};

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="inline-flex size-6 items-center justify-center border-2 border-foreground bg-success">
        <Check className="size-3.5 text-success-foreground" />
        <span className="sr-only">{publicUiCopy.included}</span>
      </span>
    ) : (
      <span className="inline-flex size-6 items-center justify-center border-2 border-foreground bg-muted">
        <X className="size-3.5 text-muted-foreground" />
        <span className="sr-only">{publicUiCopy.notIncluded}</span>
      </span>
    );
  }

  return <span className="text-sm leading-6 font-semibold">{value}</span>;
}

export function ComparisonTable({
  title = publicUiCopy.comparePlans,
  subtitle,
  columns,
  rows,
  highlightColumn,
  className,
  headerClassName,
  tableClassName,
  footer,
}: ComparisonTableProps) {
  return (
    <section className={cn("px-6 py-20 sm:px-10 lg:px-12", className)}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black tracking-tight uppercase md:text-4xl">
            {title}
          </h2>

          {subtitle && (
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        <div className="overflow-x-auto border-2 border-foreground shadow-[8px_8px_0_hsl(var(--background))]">
          <table className={cn("w-full border-collapse", tableClassName)}>
            <thead>
              <tr
                className={cn(
                  "border-b-2 border-foreground bg-muted",
                  headerClassName,
                )}
              >
                <th
                  scope="col"
                  className="w-32 px-5 py-3 text-left text-lg font-black tracking-wider uppercase"
                >
                  {publicUiCopy.metric}
                </th>

                {columns.map((column, index) => (
                  <th
                    key={column}
                    scope="col"
                    className={cn(
                      "px-5 py-3 text-left text-lg font-black tracking-wider uppercase",
                      index === highlightColumn &&
                        "bg-primary text-primary-foreground",
                    )}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.feature}
                  className="border-b border-foreground/30 last:border-b-0"
                >
                  <th
                    scope="row"
                    className="px-5 py-4 text-left text-sm font-black uppercase"
                  >
                    {row.feature}
                  </th>

                  {row.values.map((value, index) => (
                    <td
                      key={index}
                      className={cn(
                        "px-5 py-4 text-left align-top",
                        index === highlightColumn && "bg-primary/10",
                      )}
                    >
                      <Cell value={value} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {footer && (
          <div className="mt-8 text-center leading-7 [&_p]:my-3">{footer}</div>
        )}
      </div>
    </section>
  );
}

export type ContactMethod = {
  icon: ReactNode;
  title: string;
  description: string;
  action: { label: string; href: string };
};

export type ContactWithCardsProps = {
  title?: string;
  description?: string;
  contactMethods: ContactMethod[];
  className?: string;
};

export function ContactWithCards({
  title = publicUiCopy.getInTouch,
  description = publicUiCopy.chooseYourPreferredWayToReachUs,
  contactMethods,
  className,
}: ContactWithCardsProps) {
  const cardTones = ["bg-primary/10", "bg-secondary/10"];

  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 space-y-4 text-center">
          <h2 className="text-3xl font-black tracking-tight uppercase md:text-4xl">
            {title}
          </h2>
          <p className="text-lg font-medium text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {contactMethods.map((method, index) => (
            <Card key={method.title} className={cardTones[index % 2]}>
              <CardContent className="space-y-4 p-6 text-center">
                <div className="mx-auto flex size-14 items-center justify-center border-3 border-foreground bg-card shadow-[3px_3px_0px_hsl(var(--shadow-color))]">
                  {method.icon}
                </div>
                <h3 className="text-lg font-black uppercase">{method.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {method.description}
                </p>
                <Button variant="outline" asChild>
                  <a href={safeHref(method.action.href)}>
                    {method.action.label}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactInline({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description: string;
  action: { label: string; href: string };
  className?: string;
}) {
  return (
    <section
      className={cn(
        "flex flex-col gap-5 border-3 border-foreground bg-card p-6 shadow-[4px_4px_0px_hsl(var(--shadow-color))] sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div>
        <h2 className="text-xl font-black uppercase">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button asChild>
        <a href={safeHref(action.href)}>{action.label}</a>
      </Button>
    </section>
  );
}

export const ContactSections = {
  WithCards: ContactWithCards,
  Inline: ContactInline,
};

export function FeatureContentGrid({
  id,
  title,
  introduction,
  items,
  closing,
  columns = 3,
  className,
}: {
  id?: string;
  title: string;
  introduction?: React.ReactNode;
  items: readonly { title: string; content: React.ReactNode }[];
  closing?: React.ReactNode;
  columns?: 3 | 4;
  className?: string;
}) {
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
            <Card
              key={item.title}
              className="border-4 border-foreground bg-background shadow-[8px_8px_0_hsl(var(--primary))]"
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <span className="grid size-12 shrink-0 place-items-center border border-muted bg-primary text-lg font-bold">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <CardTitle className="text-lg uppercase">
                    {item.title}
                  </CardTitle>
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

export function FeatureEditorial({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "border-y border-muted/30 px-6 py-16 sm:px-10 lg:px-12",
        className,
      )}
    >
      <div className="mx-auto max-w-4xl">
        {title && (
          <h2 className="mb-8 text-3xl font-black tracking-tight uppercase sm:text-4xl">
            {title}
          </h2>
        )}
        <div className="text-lg leading-8 [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-6 [&_h3]:mt-10 [&_h3]:text-xl [&_h3]:font-bold [&_p]:my-5 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </div>
      </div>
    </section>
  );
}

const featureColors = [
  "bg-primary/10",
  "bg-secondary/10",
  "bg-accent/10",
  "bg-green-500/10",
  "bg-yellow-500/10",
  "bg-blue-500/10",
];

const iconColors = [
  "bg-primary",
  "bg-secondary",
  "bg-accent",
  "bg-green-500",
  "bg-yellow-500",
  "bg-blue-500",
];

// ============================================================================
// FEATURE GRID VARIANT 1: With Icons
// ============================================================================
export type FeatureItem = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export type FeatureGridWithIconsProps = {
  title?: string;
  subtitle?: string;
  description?: string;
  features: FeatureItem[];
  columns?: 2 | 3 | 4;
  className?: string;
};

export function FeatureGridWithIcons({
  title,
  subtitle,
  description,
  features,
  columns = 3,
  className,
}: FeatureGridWithIconsProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-7xl">
        {(title || subtitle || description) && (
          <div className="mb-12 space-y-4 text-center">
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
            {description && (
              <p className="mx-auto max-w-2xl text-lg font-medium text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}

        <div className={cn("grid gap-6", gridCols[columns])}>
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className={cn(
                "group hover:-translate-x-1er:translate-y-[-4px] transition hover:shadow-[8px_8px_0px_hsl(var(--shadow-color))]",
                featureColors[index % 6],
              )}
            >
              <CardHeader>
                <div
                  className={cn(
                    "mb-4 flex h-14 w-14 items-center justify-center border-3 border-foreground shadow-[3px_3px_0px_hsl(var(--shadow-color))]",
                    iconColors[index % 6],
                  )}
                >
                  {feature.icon}
                </div>
                <CardTitle className="uppercase">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FEATURE GRID VARIANT 2: With Images
// ============================================================================
export type FeatureWithImageItem = {
  image: string;
  title: string;
  description: string;
};

export type FeatureGridWithImagesProps = {
  title?: string;
  subtitle?: string;
  features: FeatureWithImageItem[];
  className?: string;
};

export function FeatureGridWithImages({
  title,
  subtitle,
  features,
  className,
}: FeatureGridWithImagesProps) {
  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-7xl">
        {(title || subtitle) && (
          <div className="mb-12 space-y-4 text-center">
            {subtitle && (
              <p className="text-sm font-bold tracking-widest text-secondary uppercase">
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

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="group">
              <div className="mb-4 overflow-hidden border-3 border-foreground shadow-[6px_6px_0px_hsl(var(--shadow-color))] transition group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[8px_8px_0px_hsl(var(--shadow-color))]">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  height={450}
                  unoptimized
                  width={800}
                  className="h-48 w-full object-cover"
                />
              </div>
              <h3 className="mb-2 text-xl font-black uppercase">
                {feature.title}
              </h3>
              <p className="font-medium text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FEATURE GRID VARIANT 3: Alternating
// ============================================================================
export type FeatureAlternatingItem = {
  icon: React.ReactNode;
  title: string;
  description: string;
  image: string;
};

export type FeatureGridAlternatingProps = {
  features: FeatureAlternatingItem[];
  className?: string;
};

export function FeatureGridAlternating({
  features,
  className,
}: FeatureGridAlternatingProps) {
  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-6xl space-y-16">
        {features.map((feature, index) => {
          const isReversed = index % 2 === 1;

          return (
            <div
              key={feature.title}
              className={cn(
                "grid items-center gap-8 md:grid-cols-2 md:gap-12",
                isReversed && "md:[&>*:first-child]:order-2",
              )}
            >
              <div className="space-y-4">
                <div
                  className={cn(
                    "flex h-16 w-16 items-center justify-center border-3 border-foreground shadow-hard",
                    iconColors[index % 6],
                  )}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black uppercase md:text-3xl">
                  {feature.title}
                </h3>
                <p className="text-lg font-medium text-muted-foreground">
                  {feature.description}
                </p>
              </div>

              <div className="relative">
                <div className="overflow-hidden border-3 border-foreground shadow-[8px_8px_0px_hsl(var(--shadow-color))]">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    height={450}
                    unoptimized
                    width={800}
                    className="h-auto w-full object-cover"
                  />
                </div>
                <div
                  className={cn(
                    "absolute -bottom-4 h-16 w-16 border-3 border-foreground",
                    isReversed ? "-right-4" : "-left-4",
                    featureColors[index % 6],
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ============================================================================
// FEATURE GRID VARIANT 4: Bento Grid
// ============================================================================
export type BentoFeatureItem = {
  icon: React.ReactNode;
  title: string;
  description: string;
  span?: "normal" | "wide" | "tall";
};

export type FeatureBentoGridProps = {
  title?: string;
  subtitle?: string;
  features: BentoFeatureItem[];
  className?: string;
};

export function FeatureBentoGrid({
  title,
  subtitle,
  features,
  className,
}: FeatureBentoGridProps) {
  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-7xl">
        {(title || subtitle) && (
          <div className="mb-12 space-y-4 text-center">
            {subtitle && (
              <p className="inline-block border-2 border-foreground bg-accent px-3 py-1 text-sm font-bold tracking-widest text-accent-foreground uppercase">
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

        <div className="grid auto-rows-50 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const spanClass = {
              normal: "",
              wide: "md:col-span-2",
              tall: "md:row-span-2",
            }[feature.span || "normal"];

            return (
              <Card
                key={feature.title}
                className={cn(
                  "group flex flex-col overflow-hidden transition hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_hsl(var(--shadow-color))]",
                  featureColors[index % 6],
                  spanClass,
                )}
              >
                <CardHeader className="flex-1">
                  <div
                    className={cn(
                      "mb-4 flex h-12 w-12 items-center justify-center border-3 border-foreground shadow-[3px_3px_0px_hsl(var(--shadow-color))]",
                      iconColors[index % 6],
                    )}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg uppercase">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Export all variants
// ============================================================================
export const FeatureGrid = {
  WithIcons: FeatureGridWithIcons,
  WithImages: FeatureGridWithImages,
  Alternating: FeatureGridAlternating,
  Bento: FeatureBentoGrid,
};

// ============================================================================
// HERO VARIANT 1: Centered with Badge
// ============================================================================
export type HeroCenteredProps = {
  badge?: string;
  title: string;
  titleHighlight?: string;
  description?: ReactNode;
  primaryAction?: { label: string; href?: string; onClick?: () => void };
  secondaryAction?: { label: string; href?: string; onClick?: () => void };
  className?: string;
};

export function HeroCentered({
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
        {badge && (
          <Badge variant="outline" className="px-4 py-1 text-sm">
            {badge}
          </Badge>
        )}

        <h1 className="text-4xl leading-snug font-black tracking-tight uppercase md:text-5xl lg:text-6xl">
          {title}{" "}
          {titleHighlight && (
            <span className="bg-primary px-2 text-primary-foreground">
              {titleHighlight}
            </span>
          )}
        </h1>

        <div className="mx-auto max-w-2xl text-2xl font-medium whitespace-pre-line text-foreground/90 md:text-xl [&_p]:my-4">
          {description}
        </div>

        {(primaryAction || secondaryAction) && (
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            {primaryAction &&
              (primaryAction.href ? (
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
              ))}
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
        )}
      </div>
    </section>
  );
}

// ============================================================================
// HERO VARIANT 2: Split with Image
// ============================================================================
export type HeroSplitProps = {
  title: string;
  titleHighlight?: string;
  description: string;
  primaryAction?: { label: string; href?: string; onClick?: () => void };
  secondaryAction?: { label: string; href?: string; onClick?: () => void };
  imageSrc: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
  className?: string;
};

export function HeroSplit({
  title,
  titleHighlight,
  description,
  primaryAction,
  secondaryAction,
  imageSrc,
  imageAlt = "Hero image",
  imagePosition = "right",
  className,
}: HeroSplitProps) {
  const contentOrder = imagePosition === "right" ? "order-1" : "order-2";
  const imageOrder = imagePosition === "right" ? "order-2" : "order-1";

  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div className={cn("space-y-6", contentOrder)}>
          <h1 className="text-4xl font-black tracking-tight uppercase md:text-5xl">
            {title}{" "}
            {titleHighlight && (
              <span className="bg-accent px-2 text-accent-foreground">
                {titleHighlight}
              </span>
            )}
          </h1>

          <p className="text-lg font-medium text-muted-foreground">
            {description}
          </p>

          {(primaryAction || secondaryAction) && (
            <div className="flex flex-col gap-4 sm:flex-row">
              {primaryAction &&
                (primaryAction.href ? (
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
                ))}
              {secondaryAction &&
                (secondaryAction.href ? (
                  <Button size="lg" variant="outline" asChild>
                    <a href={safeHref(secondaryAction.href)}>
                      <Play className="mr-2 h-4 w-4" />
                      {secondaryAction.label}
                    </a>
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={secondaryAction.onClick}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {secondaryAction.label}
                  </Button>
                ))}
            </div>
          )}
        </div>

        <div className={cn("relative", imageOrder)}>
          <div className="overflow-hidden border-3 border-foreground shadow-[8px_8px_0px_hsl(var(--shadow-color))]">
            <Image
              src={imageSrc}
              alt={imageAlt}
              height={800}
              unoptimized
              width={1200}
              className="h-auto w-full object-cover"
            />
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 h-8 w-8 border-3 border-foreground bg-primary" />
          <div className="absolute -bottom-4 -left-4 h-12 w-12 border-3 border-foreground bg-accent" />
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// HERO VARIANT 3: With Stats
// ============================================================================
export type HeroWithStatsProps = {
  title: string;
  titleHighlight?: string;
  description: string;
  primaryAction?: { label: string; href?: string; onClick?: () => void };
  stats: Array<{ value: string; label: string }>;
  className?: string;
};

export function HeroWithStats({
  title,
  titleHighlight,
  description,
  primaryAction,
  stats,
  className,
}: HeroWithStatsProps) {
  return (
    <section className={cn("px-4 py-20 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 space-y-6 text-center">
          <h1 className="text-4xl font-black tracking-tight uppercase md:text-5xl lg:text-6xl">
            {title}{" "}
            {titleHighlight && (
              <span className="bg-secondary px-2 text-secondary-foreground">
                {titleHighlight}
              </span>
            )}
          </h1>

          <p className="mx-auto max-w-2xl text-lg font-medium text-muted-foreground md:text-xl">
            {description}
          </p>

          {primaryAction &&
            (primaryAction.href ? (
              <Button size="lg" asChild>
                <a href={safeHref(primaryAction.href)}>
                  {primaryAction.label}
                  <Zap className="ml-2 h-4 w-4" />
                </a>
              </Button>
            ) : (
              <Button size="lg" onClick={primaryAction.onClick}>
                {primaryAction.label}
                <Zap className="ml-2 h-4 w-4" />
              </Button>
            ))}
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={`stat-${stat.label}`}
              className="border-3 border-foreground bg-card p-6 text-center shadow-hard"
            >
              <div className="text-3xl font-black md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm font-bold tracking-wide text-muted-foreground uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// HERO VARIANT 4: Minimal
// ============================================================================
export type HeroMinimalProps = {
  title: string;
  description: string;
  primaryAction?: { label: string; href?: string; onClick?: () => void };
  className?: string;
};

export function HeroMinimal({
  title,
  description,
  primaryAction,
  className,
}: HeroMinimalProps) {
  return (
    <section className={cn("px-4 py-32 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-5xl leading-none font-black tracking-tight uppercase md:text-6xl lg:text-7xl">
          {title}
        </h1>

        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <p className="max-w-md text-lg font-medium text-muted-foreground">
            {description}
          </p>

          {primaryAction &&
            (primaryAction.href ? (
              <Button size="lg" className="shrink-0" asChild>
                <a href={safeHref(primaryAction.href)}>
                  {primaryAction.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            ) : (
              <Button
                size="lg"
                className="shrink-0"
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ))}
        </div>

        <div className="h-1 w-full bg-foreground" />
      </div>
    </section>
  );
}

// ============================================================================
// HERO VARIANT 5: With Video
// ============================================================================
export type HeroWithVideoProps = {
  badge?: string;
  title: string;
  titleHighlight?: string;
  description: string;
  primaryAction?: { label: string; href?: string; onClick?: () => void };
  videoThumbnail: string;
  onPlayClick?: () => void;
  className?: string;
};

export function HeroWithVideo({
  badge,
  title,
  titleHighlight,
  description,
  primaryAction,
  videoThumbnail,
  onPlayClick,
  className,
}: HeroWithVideoProps) {
  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="space-y-6 text-center">
          {badge && (
            <Badge variant="secondary" className="px-4 py-1 text-sm">
              <Star className="mr-2 h-3 w-3" />
              {badge}
            </Badge>
          )}

          <h1 className="text-4xl font-black tracking-tight uppercase md:text-5xl">
            {title}{" "}
            {titleHighlight && (
              <span className="underline decoration-primary decoration-4 underline-offset-4">
                {titleHighlight}
              </span>
            )}
          </h1>

          <p className="mx-auto max-w-2xl text-lg font-medium text-muted-foreground">
            {description}
          </p>

          {primaryAction &&
            (primaryAction.href ? (
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
            ))}
        </div>

        <div className="group relative cursor-pointer" onClick={onPlayClick}>
          <div className="overflow-hidden border-3 border-foreground shadow-[8px_8px_0px_hsl(var(--shadow-color))]">
            <Image
              src={videoThumbnail}
              alt={publicUiCopy.videoThumbnail}
              height={720}
              unoptimized
              width={1280}
              className="aspect-video h-auto w-full object-cover"
            />
          </div>
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 transition-colors group-hover:bg-foreground/30">
            <div className="flex h-20 w-20 items-center justify-center border-3 border-foreground bg-primary shadow-hard transition group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[8px_8px_0px_hsl(var(--shadow-color))]">
              <Play className="h-8 w-8 fill-current" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Export all variants
// ============================================================================
export const HeroSection = {
  Centered: HeroCentered,
  Split: HeroSplit,
  WithStats: HeroWithStats,
  Minimal: HeroMinimal,
  WithVideo: HeroWithVideo,
};

export type LegalDocumentSectionProps = {
  updatedAt: string;
  updatedAtDateTime: string;
  updatedAtLabel: string;
  introduction: ReactNode;
  sections: readonly { id: string; title: string; content: ReactNode }[];
};

export function LegalDocumentSection({
  updatedAt,
  updatedAtDateTime,
  updatedAtLabel,
  introduction,
  sections,
}: LegalDocumentSectionProps) {
  return (
    <section className="typeset typeset-app mx-auto max-w-prose px-6 pb-20 leading-relaxed sm:px-10 lg:px-12">
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

export function LogoCloudImage({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="block h-auto w-full"
      />
    </div>
  );
}

export type LogoItem = {
  name: string;
  logo: string | React.ReactNode;
  url?: string;
};

// ============================================================================
// LOGO CLOUD VARIANT 1: Simple Grid
// ============================================================================
export type LogoCloudGridProps = {
  title?: string;
  subtitle?: string;
  logos: LogoItem[];
  columns?: 3 | 4 | 5 | 6;
  className?: string;
};

export function LogoCloudGrid({
  title,
  subtitle,
  logos,
  columns = 5,
  className,
}: LogoCloudGridProps) {
  const gridCols = {
    3: "grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-3 md:grid-cols-6",
  };

  return (
    <section className={cn("px-4 py-12 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-6xl">
        {(title || subtitle) && (
          <div className="mb-8 space-y-2 text-center">
            {subtitle && (
              <p className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-xl font-black tracking-tight uppercase md:text-2xl">
                {title}
              </h2>
            )}
          </div>
        )}

        <div className={cn("grid items-center gap-8", gridCols[columns])}>
          {logos.map((logo) => (
            <LogoCloudItem key={`logo-${logo.name}`} logo={logo} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// LOGO CLOUD VARIANT 2: With Marquee
// ============================================================================
export type LogoCloudMarqueeProps = {
  title?: string;
  logos: LogoItem[];
  speed?: "slow" | "normal" | "fast";
  direction?: "left" | "right";
  className?: string;
};

export function LogoCloudMarquee({
  title,
  logos,
  speed = "normal",
  direction = "left",
  className,
}: LogoCloudMarqueeProps) {
  return (
    <section
      className={cn("overflow-hidden px-4 py-12 md:px-8 lg:px-16", className)}
    >
      <div className="mx-auto max-w-7xl">
        {title && (
          <p className="mb-8 text-center text-sm font-bold tracking-widest text-muted-foreground uppercase">
            {title}
          </p>
        )}

        <Marquee className="py-4" direction={direction} speed={speed}>
          {logos.map((logo) => (
            <div
              key={`logo-marquee-${logo.name}`}
              className="mx-8 flex h-12 items-center justify-center opacity-70 grayscale transition-opacity hover:opacity-100 hover:grayscale-0"
            >
              {typeof logo.logo === "string" ? (
                <Image
                  src={logo.logo}
                  alt={logo.name}
                  height={96}
                  unoptimized
                  width={240}
                  className="h-full w-auto object-contain"
                />
              ) : (
                logo.logo
              )}
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

// ============================================================================
// LOGO CLOUD VARIANT 3: Bordered Cards
// ============================================================================
export type LogoCloudCardsProps = {
  title?: string;
  subtitle?: string;
  logos: LogoItem[];
  className?: string;
};

export function LogoCloudCards({
  title,
  subtitle,
  logos,
  className,
}: LogoCloudCardsProps) {
  return (
    <section
      className={cn("bg-muted/30 px-4 py-16 md:px-8 lg:px-16", className)}
    >
      <div className="mx-auto max-w-6xl">
        {(title || subtitle) && (
          <div className="mb-10 space-y-2 text-center">
            {subtitle && (
              <p className="text-sm font-bold tracking-widest text-primary uppercase">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-2xl font-black tracking-tight uppercase md:text-3xl">
                {title}
              </h2>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {logos.map((logo) => {
            const inner = (
              <div className="flex h-24 cursor-pointer items-center justify-center border-3 border-foreground bg-card p-6 transition hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_hsl(var(--shadow-color))]">
                {typeof logo.logo === "string" ? (
                  <Image
                    src={logo.logo}
                    alt={logo.name}
                    height={96}
                    unoptimized
                    width={240}
                    className="h-10 w-auto object-contain"
                  />
                ) : (
                  logo.logo
                )}
              </div>
            );
            return logo.url ? (
              <a
                key={`logo-${logo.name}`}
                href={safeHref(logo.url)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {inner}
              </a>
            ) : (
              <React.Fragment key={`logo-${logo.name}`}>{inner}</React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// LOGO CLOUD VARIANT 4: With Stats
// ============================================================================
export type LogoCloudWithStatsProps = {
  title?: string;
  logos: LogoItem[];
  stats: Array<{ value: string; label: string }>;
  /**
   * Cap the number of logos rendered. Omit to render all of them — the 3-column
   * grid simply grows another row. Previously this was hard-capped at 9, which
   * dropped the rest with only a console warning.
   */
  maxLogos?: number;
  className?: string;
};

export function LogoCloudWithStats({
  title,
  logos,
  stats,
  maxLogos,
  className,
}: LogoCloudWithStatsProps) {
  const visibleLogos =
    maxLogos === undefined ? logos : logos.slice(0, maxLogos);
  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            {title && (
              <h2 className="text-2xl font-black tracking-tight uppercase md:text-3xl">
                {title}
              </h2>
            )}

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={`stat-${stat.label}`}
                  className="border-3 border-foreground p-4 shadow-[4px_4px_0px_hsl(var(--shadow-color))]"
                >
                  <div className="text-3xl font-black">{stat.value}</div>
                  <div className="text-sm font-bold text-muted-foreground uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {visibleLogos.map((logo) => {
              const inner = (
                <div className="flex h-16 items-center justify-center opacity-70 transition-opacity hover:opacity-100">
                  {typeof logo.logo === "string" ? (
                    <Image
                      src={logo.logo}
                      alt={logo.name}
                      height={96}
                      unoptimized
                      width={240}
                      className="h-8 w-auto object-contain grayscale transition hover:grayscale-0"
                    />
                  ) : (
                    logo.logo
                  )}
                </div>
              );
              return logo.url ? (
                <a
                  key={`logo-${logo.name}`}
                  href={safeHref(logo.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer"
                >
                  {inner}
                </a>
              ) : (
                <React.Fragment key={`logo-${logo.name}`}>
                  {inner}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Helper Component
// ============================================================================
function LogoCloudItem({ logo }: { logo: LogoItem }) {
  const content = (
    <div className="flex h-12 items-center justify-center opacity-60 grayscale transition-opacity hover:opacity-100 hover:grayscale-0">
      {typeof logo.logo === "string" ? (
        <Image
          src={logo.logo}
          alt={logo.name}
          height={96}
          unoptimized
          width={240}
          className="h-full w-auto object-contain"
        />
      ) : (
        logo.logo
      )}
    </div>
  );

  if (logo.url) {
    return (
      <a href={safeHref(logo.url)} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
}

// ============================================================================
// Export all variants
// ============================================================================
export const LogoCloud = {
  Image: LogoCloudImage,
  Grid: LogoCloudGrid,
  Marquee: LogoCloudMarquee,
  Cards: LogoCloudCards,
  WithStats: LogoCloudWithStats,
};

export type PricingTier = {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  cta?: string;
  /** Navigate on click. Takes precedence over `onCtaClick`. */
  ctaHref?: string;
  /** Called when the tier's CTA is clicked and no `ctaHref` is set. */
  onCtaClick?: () => void;
  featured?: boolean;
};

export type PricingSectionProps = {
  title?: string;
  subtitle?: string;
  tiers: PricingTier[];
  className?: string;
};

// ============================================================================
// PRICING VARIANT 1: Tiers
// ============================================================================
export function PricingSection({
  title = publicUiCopy.pricing,
  subtitle,
  tiers,
  className,
}: PricingSectionProps) {
  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 space-y-3 text-center">
          <h2 className="text-4xl font-black tracking-tight uppercase md:text-5xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mx-auto max-w-xl text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "flex flex-col border-3 border-foreground bg-card p-6",
                tier.featured
                  ? "shadow-[8px_8px_0px_hsl(var(--shadow-color))] md:-translate-y-2"
                  : "shadow-[4px_4px_0px_hsl(var(--shadow-color))]",
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black tracking-wide uppercase">
                  {tier.name}
                </h3>
                {tier.featured && (
                  <Badge variant="accent">{publicUiCopy.popular}</Badge>
                )}
              </div>
              {tier.description && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {tier.description}
                </p>
              )}
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black">{tier.price}</span>
                {tier.period && (
                  <span className="text-sm font-bold text-muted-foreground">
                    /{tier.period}
                  </span>
                )}
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm font-medium"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 border-foreground bg-success">
                      <Check className="h-3 w-3 text-success-foreground" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              {tier.ctaHref ? (
                <Button
                  className="mt-6 w-full"
                  variant={tier.featured ? "default" : "outline"}
                  asChild
                >
                  <a href={safeHref(tier.ctaHref)}>
                    {tier.cta ?? "Get started"}
                  </a>
                </Button>
              ) : (
                <Button
                  className="mt-6 w-full"
                  variant={tier.featured ? "default" : "outline"}
                  onClick={tier.onCtaClick}
                >
                  {tier.cta ?? "Get started"}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// PRICING VARIANT 2: WithCheckout — tiers + an order-summary panel
// ============================================================================
export type CheckoutSummaryProps = {
  planName: string;
  lineItems: { label: string; amount: string }[];
  total: string;
  /** Label for the checkout button. Defaults to "Checkout". */
  checkoutLabel?: string;
  /** Called when the checkout button is clicked. */
  onCheckout?: () => void;
  className?: string;
};

export function CheckoutSummary({
  planName,
  lineItems,
  total,
  checkoutLabel = "Checkout",
  onCheckout,
  className,
}: CheckoutSummaryProps) {
  return (
    <div
      className={cn(
        "border-3 border-foreground bg-card p-6 shadow-[4px_4px_0px_hsl(var(--shadow-color))]",
        className,
      )}
    >
      <h3 className="text-lg font-black tracking-wide uppercase">
        {publicUiCopy.orderSummary}
      </h3>
      <p className="mt-1 text-sm font-bold text-muted-foreground">{planName}</p>
      <div className="mt-4 space-y-2 border-t-2 border-foreground pt-4">
        {lineItems.map((item) => (
          <div
            key={item.label}
            className="flex justify-between text-sm font-medium"
          >
            <span>{item.label}</span>
            <span className="font-bold">{item.amount}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between border-t-3 border-foreground pt-4 text-lg font-black uppercase">
        <span>{publicUiCopy.total}</span>
        <span>{total}</span>
      </div>
      <Button className="mt-6 w-full" onClick={onCheckout}>
        {checkoutLabel}
      </Button>
    </div>
  );
}

export type StatItem = {
  value: string;
  label: string;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
};

// ============================================================================
// STATS VARIANT 1: Simple Grid
// ============================================================================
export type StatsGridProps = {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  className?: string;
};

export function StatsGrid({ stats, columns = 4, className }: StatsGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div className={cn("mx-auto grid max-w-6xl gap-6", gridCols[columns])}>
        {stats.map((stat) => (
          <div key={`stat-${stat.label}`} className="space-y-2 text-center">
            <div className="text-4xl font-black md:text-5xl">{stat.value}</div>
            <div className="text-sm font-bold tracking-wide text-muted-foreground uppercase">
              {stat.label}
            </div>
            {stat.description && (
              <p className="text-sm text-muted-foreground">
                {stat.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// STATS VARIANT 2: With Cards
// ============================================================================
export type StatsCardsProps = {
  title?: string;
  subtitle?: string;
  stats: StatItem[];
  className?: string;
};

export function StatsCards({
  title,
  subtitle,
  stats,
  className,
}: StatsCardsProps) {
  const cardColors = [
    "bg-primary/10",
    "bg-secondary/10",
    "bg-accent/10",
    "bg-green-500/10",
  ];

  return (
    <section
      className={cn("bg-muted/30 px-4 py-16 md:px-8 lg:px-16", className)}
    >
      <div className="mx-auto max-w-6xl">
        {(title || subtitle) && (
          <div className="mb-12 space-y-2 text-center">
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

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={`stat-${stat.label}`}
              className={cn(
                "border-3 border-foreground p-6 shadow-[4px_4px_0px_hsl(var(--shadow-color))] transition hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_hsl(var(--shadow-color))]",
                cardColors[index % 4],
              )}
            >
              <div className="text-3xl font-black md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-bold tracking-wide uppercase">
                {stat.label}
              </div>
              {stat.trend && (
                <div className="mt-2 flex items-center gap-1">
                  {stat.trend === "up" && (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  )}
                  {stat.trend === "down" && (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  {stat.trend === "neutral" && (
                    <Minus className="h-4 w-4 text-muted-foreground" />
                  )}
                  {stat.trendValue && (
                    <span
                      className={cn(
                        "text-xs font-bold",
                        stat.trend === "up" && "text-green-600",
                        stat.trend === "down" && "text-destructive",
                        stat.trend === "neutral" && "text-muted-foreground",
                      )}
                    >
                      {stat.trendValue}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STATS VARIANT 3: Split with Content
// ============================================================================
export type StatsSplitProps = {
  title: string;
  description: string;
  stats: StatItem[];
  contentPosition?: "left" | "right";
  className?: string;
};

export function StatsSplit({
  title,
  description,
  stats,
  contentPosition = "left",
  className,
}: StatsSplitProps) {
  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div
        className={cn(
          "mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2",
          contentPosition === "right" && "md:[&>*:first-child]:order-2",
        )}
      >
        <div className="space-y-6">
          <h2 className="text-3xl font-black tracking-tight uppercase md:text-4xl">
            {title}
          </h2>
          <p className="text-lg font-medium text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div
              key={`stat-${stat.label}`}
              className="border-3 border-foreground bg-card p-6 shadow-[4px_4px_0px_hsl(var(--shadow-color))]"
            >
              <div className="text-3xl font-black">{stat.value}</div>
              <div className="mt-1 text-sm font-bold tracking-wide text-muted-foreground uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STATS VARIANT 4: Inline
// ============================================================================
export type StatsInlineProps = {
  stats: StatItem[];
  className?: string;
};

export function StatsInline({ stats, className }: StatsInlineProps) {
  return (
    <section
      className={cn(
        "border-y-3 border-foreground bg-muted/30 px-4 py-8 md:px-8 lg:px-16",
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-8 md:gap-16">
        {stats.map((stat) => (
          <div key={`stat-${stat.label}`} className="text-center">
            <span className="text-3xl font-black md:text-4xl">
              {stat.value}
            </span>
            <span className="ml-2 text-sm font-bold tracking-wide text-muted-foreground uppercase">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// STATS VARIANT 5: With Icons
// ============================================================================
export interface StatWithIconItem extends StatItem {
  icon: React.ReactNode;
}

export type StatsWithIconsProps = {
  stats: StatWithIconItem[];
  className?: string;
};

export function StatsWithIcons({ stats, className }: StatsWithIconsProps) {
  const iconColors = [
    "bg-primary",
    "bg-secondary",
    "bg-accent",
    "bg-green-500",
  ];

  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={`stat-${stat.label}`} className="space-y-4 text-center">
            <div
              className={cn(
                "mx-auto flex h-16 w-16 items-center justify-center border-3 border-foreground shadow-[4px_4px_0px_hsl(var(--shadow-color))]",
                iconColors[index % 4],
              )}
            >
              {stat.icon}
            </div>
            <div>
              <div className="text-3xl font-black md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm font-bold tracking-wide text-muted-foreground uppercase">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Export all variants
// ============================================================================
export const StatsSection = {
  Grid: StatsGrid,
  Cards: StatsCards,
  Split: StatsSplit,
  Inline: StatsInline,
  WithIcons: StatsWithIcons,
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]?.[0] ?? "";
  if (parts.length === 1) return (first || "?").toUpperCase();
  return (first + (parts.at(-1)?.[0] ?? "")).toUpperCase();
}

export type TeamMember = {
  name: string;
  role: string;
  bio?: string;
  avatar?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
};

// ============================================================================
// TEAM VARIANT 1: Grid with Cards
// ============================================================================
export type TeamGridProps = {
  title?: string;
  subtitle?: string;
  description?: string;
  members: TeamMember[];
  columns?: 2 | 3 | 4;
  className?: string;
};

export function TeamGrid({
  title,
  subtitle,
  description,
  members,
  columns = 4,
  className,
}: TeamGridProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-7xl">
        {(title || subtitle || description) && (
          <div className="mb-12 space-y-4 text-center">
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
            {description && (
              <p className="mx-auto max-w-2xl text-lg font-medium text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}

        <div className={cn("grid gap-6", gridCols[columns])}>
          {members.map((member) => (
            <Card
              key={`team-${member.name}`}
              className="group transition hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_hsl(var(--shadow-color))]"
            >
              <CardContent className="space-y-4 p-6 text-center">
                <Avatar className="mx-auto h-24 w-24 border-3 border-foreground shadow-[4px_4px_0px_hsl(var(--shadow-color))]">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="text-2xl font-bold">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="text-lg font-black uppercase">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground">
                    {member.role}
                  </p>
                </div>

                {member.bio && (
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                )}

                {member.social && (
                  <div className="flex justify-center gap-2">
                    {member.social.twitter && (
                      <SocialLink
                        href={member.social.twitter}
                        label={publicUiCopy.xTwitter}
                        icon={<XIcon className="h-4 w-4" />}
                      />
                    )}
                    {member.social.linkedin && (
                      <SocialLink
                        href={member.social.linkedin}
                        label={publicUiCopy.linkedIn}
                        icon={
                          <span
                            aria-hidden="true"
                            className="text-[10px] font-black"
                          >
                            {publicUiCopy.in}
                          </span>
                        }
                      />
                    )}
                    {member.social.github && (
                      <SocialLink
                        href={member.social.github}
                        label={publicUiCopy.gitHub}
                        icon={
                          <span
                            aria-hidden="true"
                            className="text-[9px] font-black"
                          >
                            {publicUiCopy.gH}
                          </span>
                        }
                      />
                    )}
                    {member.social.email && (
                      <SocialLink
                        href={`mailto:${member.social.email}`}
                        label={`Email ${member.name}`}
                        icon={<Mail className="h-4 w-4" />}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TEAM VARIANT 2: Simple List
// ============================================================================
export type TeamListProps = {
  title?: string;
  members: TeamMember[];
  className?: string;
};

export function TeamList({ title, members, className }: TeamListProps) {
  return (
    <section
      className={cn("bg-muted/30 px-4 py-16 md:px-8 lg:px-16", className)}
    >
      <div className="mx-auto max-w-4xl">
        {title && (
          <h2 className="mb-12 text-center text-3xl font-black tracking-tight uppercase md:text-4xl">
            {title}
          </h2>
        )}

        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={`team-${member.name}`}
              className="flex items-center gap-4 border-3 border-foreground bg-card p-4 shadow-[4px_4px_0px_hsl(var(--shadow-color))] transition hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_hsl(var(--shadow-color))]"
            >
              <Avatar className="h-16 w-16 border-2 border-foreground">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="font-bold">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h3 className="font-black uppercase">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>

              {member.social && (
                <div className="flex gap-2">
                  {member.social.twitter && (
                    <SocialLink
                      href={member.social.twitter}
                      label={publicUiCopy.xTwitter}
                      icon={<XIcon className="h-4 w-4" />}
                    />
                  )}
                  {member.social.linkedin && (
                    <SocialLink
                      href={member.social.linkedin}
                      label={publicUiCopy.linkedIn}
                      icon={
                        <span
                          aria-hidden="true"
                          className="text-[10px] font-black"
                        >
                          {publicUiCopy.in}
                        </span>
                      }
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TEAM VARIANT 3: With Large Photos
// ============================================================================
export type TeamLargePhotosProps = {
  title?: string;
  subtitle?: string;
  members: TeamMember[];
  className?: string;
};

export function TeamLargePhotos({
  title,
  subtitle,
  members,
  className,
}: TeamLargePhotosProps) {
  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-7xl">
        {(title || subtitle) && (
          <div className="mb-12 space-y-2 text-center">
            {subtitle && (
              <p className="text-sm font-bold tracking-widest text-secondary uppercase">
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

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <div key={`team-${member.name}`} className="group">
              <div className="relative mb-4 overflow-hidden border-3 border-foreground shadow-[6px_6px_0px_hsl(var(--shadow-color))] transition group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-[8px_8px_0px_hsl(var(--shadow-color))]">
                {member.avatar ? (
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={600}
                    height={800}
                    className="h-80 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-80 w-full items-center justify-center bg-muted">
                    <span className="text-6xl font-black text-muted-foreground">
                      {getInitials(member.name)}
                    </span>
                  </div>
                )}

                {member.social && (
                  <div
                    aria-hidden="true"
                    className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-foreground/80 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <div className="flex justify-center gap-2">
                      {member.social.twitter && (
                        <SocialLink
                          href={member.social.twitter}
                          label={publicUiCopy.xTwitter}
                          icon={<XIcon className="h-4 w-4" />}
                          light
                          tabIndex={-1}
                        />
                      )}
                      {member.social.linkedin && (
                        <SocialLink
                          href={member.social.linkedin}
                          label={publicUiCopy.linkedIn}
                          icon={
                            <span
                              aria-hidden="true"
                              className="text-[10px] font-black"
                            >
                              {publicUiCopy.in}
                            </span>
                          }
                          light
                          tabIndex={-1}
                        />
                      )}
                      {member.social.github && (
                        <SocialLink
                          href={member.social.github}
                          label={publicUiCopy.gitHub}
                          icon={
                            <span
                              aria-hidden="true"
                              className="text-[9px] font-black"
                            >
                              {publicUiCopy.gH}
                            </span>
                          }
                          light
                          tabIndex={-1}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-black uppercase">{member.name}</h3>
              <p className="font-medium text-muted-foreground">{member.role}</p>
              {member.bio && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {member.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TEAM VARIANT 4: Compact Avatars
// ============================================================================
export type TeamCompactProps = {
  title?: string;
  description?: string;
  members: TeamMember[];
  className?: string;
};

export function TeamCompact({
  title,
  description,
  members,
  className,
}: TeamCompactProps) {
  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-4xl space-y-8 text-center">
        {(title || description) && (
          <div className="space-y-4">
            {title && (
              <h2 className="text-2xl font-black tracking-tight uppercase md:text-3xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="font-medium text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-6">
          {members.map((member) => (
            <div key={`team-${member.name}`} className="text-center">
              <Avatar className="mx-auto mb-2 h-20 w-20 border-3 border-foreground shadow-[3px_3px_0px_hsl(var(--shadow-color))]">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="text-lg font-bold">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-bold">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.role}</p>
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
function SocialLink({
  href,
  label,
  icon,
  light = false,
  tabIndex,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  light?: boolean;
  tabIndex?: number;
}) {
  return (
    <a
      href={safeHref(href)}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={tabIndex}
      aria-label={label}
      className={cn(
        "flex h-8 w-8 items-center justify-center border-2 border-foreground transition hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_hsl(var(--shadow-color))]",
        light
          ? "bg-background text-foreground"
          : "bg-muted hover:bg-primary hover:text-primary-foreground",
      )}
    >
      {icon}
    </a>
  );
}

// ============================================================================
// Export all variants
// ============================================================================
export const TeamSection = {
  Grid: TeamGrid,
  List: TeamList,
  LargePhotos: TeamLargePhotos,
  Compact: TeamCompact,
};
