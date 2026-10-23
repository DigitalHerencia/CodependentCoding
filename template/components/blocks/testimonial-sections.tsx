"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils/cn";
import { Quote, Star } from "lucide-react";

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
  rating?: number;
}

// ============================================================================
// TESTIMONIALS VARIANT 1: Cards Grid
// ============================================================================
export interface TestimonialsGridProps {
  title?: string;
  subtitle?: string;
  testimonials: TestimonialItem[];
  columns?: 2 | 3;
  className?: string;
}

export function TestimonialsGrid({
  title,
  subtitle,
  testimonials,
  columns = 3,
  className,
}: TestimonialsGridProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <section
      className={cn("bg-muted/30 px-4 py-16 md:px-8 lg:px-16", className)}
    >
      <div className="mx-auto max-w-7xl">
        {(title || subtitle) && (
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
          </div>
        )}

        <div className={cn("grid gap-6", gridCols[columns])}>
          {testimonials.map((testimonial) => (
            <Card
              key={`testimonial-${testimonial.author}`}
              className="bg-card transition hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_hsl(var(--shadow-color))]"
            >
              <CardContent className="space-y-4 p-6">
                <Quote className="h-8 w-8 text-primary" />

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

                <p className="text-lg leading-relaxed font-medium">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3 border-t-2 border-foreground pt-4">
                  <Avatar className="h-12 w-12 border-2 border-foreground">
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback className="font-bold">
                      {testimonial.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                      {testimonial.company && ` at ${testimonial.company}`}
                    </p>
                  </div>
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
export interface TestimonialsSingleProps {
  testimonial: TestimonialItem;
  className?: string;
}

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
          <Avatar className="h-16 w-16 border-3 border-foreground shadow-[4px_4px_0px_hsl(var(--shadow-color))]">
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
export interface TestimonialsMasonryProps {
  title?: string;
  testimonials: TestimonialItem[];
  className?: string;
}

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
                  className="transition hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_hsl(var(--shadow-color))]"
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
export interface TestimonialsWithAvatarsProps {
  title?: string;
  description?: string;
  testimonials: TestimonialItem[];
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  className?: string;
}

export function TestimonialsWithAvatars({
  title,
  description,
  testimonials,
  activeIndex = 0,
  onActiveIndexChange,
  className,
}: TestimonialsWithAvatarsProps) {
  if (!testimonials.length) return null;

  const selectedIndex = Math.min(
    Math.max(activeIndex, 0),
    testimonials.length - 1,
  );
  const activeTestimonial = testimonials[selectedIndex];
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
              aria-pressed={index === selectedIndex}
              onClick={() => onActiveIndexChange?.(index)}
              className={cn(
                "transition",
                index === selectedIndex
                  ? "scale-110"
                  : "opacity-50 hover:opacity-100",
              )}
            >
              <Avatar
                className={cn(
                  "h-12 w-12 border-3 border-foreground",
                  index === selectedIndex &&
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
