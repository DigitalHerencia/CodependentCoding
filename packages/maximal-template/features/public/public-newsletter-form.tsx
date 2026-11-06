"use client";

import { type FooterColumn } from "@/components/blocks/public-blocks.client";
import {
  PublicFormButtonBlock as Button,
  PublicFormFieldBlock as Field,
  PublicFormFieldErrorBlock as FieldError,
  PublicFormFieldLabelBlock as FieldLabel,
  PublicFormInputBlock as Input,
  PublicFormSeparatorBlock as Separator,
} from "@/components/blocks/public-form-blocks";
import { cn, safeHref } from "@/components/ui/utils";
import { formResultCopy } from "@/content/application";
import { publicUiCopy } from "@/content/public";
import { publicEmailSchema } from "@/schemas/publicSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail } from "lucide-react";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

// ============================================================================
// CTA VARIANT 3: Newsletter
// ============================================================================
export type CTANewsletterProps = {
  title: string;
  description?: string;
  placeholder?: string;
  buttonLabel?: string;
  onSubmit?: (email: string) => void;
  className?: string;
};

export function CTANewsletter({
  title,
  description,
  placeholder = publicUiCopy.enterYourEmail,
  buttonLabel = publicUiCopy.subscribe,
  onSubmit,
  className,
}: CTANewsletterProps) {
  const id = React.useId();
  const form = useForm<z.input<typeof publicEmailSchema>>({
    resolver: zodResolver(publicEmailSchema),
    defaultValues: { email: "" },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!onSubmit) return;
    try {
      await onSubmit(values.email);
      form.reset();
    } catch {
      form.setError("root", { message: formResultCopy.failed });
    }
  });

  return (
    <section
      className={cn("bg-muted/30 px-4 py-16 md:px-8 lg:px-16", className)}
    >
      <div className="mx-auto max-w-2xl space-y-6 text-center">
        <Mail className="mx-auto h-12 w-12 text-primary" />

        <h2 className="text-2xl font-black tracking-tight uppercase md:text-3xl">
          {title}
        </h2>

        {description && (
          <p className="font-medium text-muted-foreground">{description}</p>
        )}

        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={id} className="sr-only">
                  {publicUiCopy.email}
                </FieldLabel>
                <Input
                  {...field}
                  id={id}
                  aria-invalid={fieldState.invalid}
                  type="email"
                  placeholder={placeholder}

                  className="flex-1"
                  required
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting || !onSubmit}
          >
            {buttonLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          {form.formState.errors.root && (
            <FieldError>{form.formState.errors.root.message}</FieldError>
          )}
        </form>

        <p className="text-xs text-muted-foreground">
          {publicUiCopy.noSpamUnsubscribeAnytime}
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER VARIANT 2: With Newsletter
// ============================================================================
export type FooterWithNewsletterProps = {
  logo?: React.ReactNode;
  columns: FooterColumn[];
  newsletterTitle?: string;
  newsletterDescription?: string;
  onNewsletterSubmit?: (email: string) => void;
  copyright?: string;
  className?: string;
};

export function FooterWithNewsletter({
  logo,
  columns,
  newsletterTitle = "Subscribe to our newsletter",
  newsletterDescription = "Get the latest updates and news delivered to your inbox.",
  onNewsletterSubmit,
  copyright = `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
  className,
}: FooterWithNewsletterProps) {
  const id = React.useId();
  const form = useForm<z.input<typeof publicEmailSchema>>({
    resolver: zodResolver(publicEmailSchema),
    defaultValues: { email: "" },
  });
  const handleSubmit = form.handleSubmit(async (values) => {
    if (!onNewsletterSubmit) return;
    try {
      await onNewsletterSubmit(values.email);
      form.reset();
    } catch {
      form.setError("root", { message: formResultCopy.failed });
    }
  });

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
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={id} className="sr-only">
                      {publicUiCopy.email}
                    </FieldLabel>
                    <Input
                      {...field}
                      id={id}
                      aria-invalid={fieldState.invalid}

                      type="email"
                      placeholder={publicUiCopy.enterYourEmail}
                      required
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Button
                type="submit"
                aria-label={publicUiCopy.subscribe}
                disabled={form.formState.isSubmitting || !onNewsletterSubmit}
              >
                <Mail className="h-4 w-4" />
              </Button>
              {form.formState.errors.root && (
                <FieldError>{form.formState.errors.root.message}</FieldError>
              )}
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
