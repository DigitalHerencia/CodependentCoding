"use client";

import {
  PublicFormButtonBlock as Button,
  PublicFormFieldBlock as Field,
  PublicFormFieldErrorBlock as FieldError,
  PublicFormFieldLabelBlock as FieldLabel,
  PublicFormInputBlock as Input,
} from "@/components/blocks/public-form-blocks";
import { cn, safeHref } from "@/components/ui/utils";
import { formResultCopy } from "@/content/application";
import { publicUiCopy } from "@/content/public";
import { sharedLibraryCopy } from "@/content/shared";
import { publicEmailSchema, publicSearchSchema } from "@/schemas/publicSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Clock, FileQuestion, Home, Search } from "lucide-react";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

// ============================================================================
// ERROR PAGE VARIANT 1: 404 Not Found
// ============================================================================
export type NotFoundPageProps = {
  title?: string;
  description?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  homeHref?: string;
  backHref?: string;
  className?: string;
};

export function NotFoundPage({
  title = sharedLibraryCopy.label404,
  description = sharedLibraryCopy.oopsThePageYouReLookingForDoesnT,
  showSearch = false,
  onSearch,
  homeHref = "/",
  backHref,
  className,
}: NotFoundPageProps) {
  const id = React.useId();
  const form = useForm<z.input<typeof publicSearchSchema>>({
    resolver: zodResolver(publicSearchSchema),
    defaultValues: { query: "" },
  });

  const handleSearch = form.handleSubmit(async (values) => {
    if (!onSearch) return;
    try {
      await onSearch(values.query);
    } catch {
      form.setError("root", { message: formResultCopy.failed });
    }
  });

  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-background p-4",
        className,
      )}
    >
      <div className="max-w-lg space-y-8 text-center">
        {/* Large 404 */}
        <div className="relative">
          <h1 className="text-[150px] leading-none font-black text-muted-foreground/20 md:text-[200px]">
            {title}
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-24 w-24 items-center justify-center border-3 border-foreground bg-primary shadow-[6px_6px_0px_hsl(var(--shadow-color))]">
              <FileQuestion className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-black uppercase md:text-3xl">
            {sharedLibraryCopy.pageNotFound}
          </h2>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {showSearch && (
          <form onSubmit={handleSearch} className="mx-auto flex max-w-sm gap-2">
            <Controller
              name="query"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={id} className="sr-only">
                    {publicUiCopy.search}
                  </FieldLabel>
                  <Input
                    {...field}
                    id={id}
                    aria-invalid={fieldState.invalid}
                    type="search"
                    placeholder={sharedLibraryCopy.searchForPages}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
            <Button
              type="submit"
              aria-label={sharedLibraryCopy.search}
              disabled={form.formState.isSubmitting || !onSearch}
            >
              <Search className="h-4 w-4" />
            </Button>
            {form.formState.errors.root && (
              <FieldError>{form.formState.errors.root.message}</FieldError>
            )}
          </form>
        )}

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild>
            <a href={safeHref(homeHref)}>
              <Home className="mr-2 h-4 w-4" />
              {sharedLibraryCopy.backToHome}
            </a>
          </Button>
          {backHref && (
            <Button variant="outline" asChild>
              <a href={safeHref(backHref)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {sharedLibraryCopy.goBack}
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ERROR PAGE VARIANT 6: Coming Soon
// ============================================================================

function getCountdown(launchDate?: Date) {
  if (!launchDate) return null;
  const total = launchDate.getTime() - Date.now();
  if (total <= 0) return null;
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
  };
}

export type ComingSoonPageProps = {
  title?: string;
  description?: string;
  launchDate?: Date;
  onNotify?: (email: string) => void;
  className?: string;
};

export function ComingSoonPage({
  title = sharedLibraryCopy.comingSoon,
  description = sharedLibraryCopy.weReWorkingHardToBringYouSomethingAmazing,
  launchDate,
  onNotify,
  className,
}: ComingSoonPageProps) {
  const id = React.useId();
  const form = useForm<z.input<typeof publicEmailSchema>>({
    resolver: zodResolver(publicEmailSchema),
    defaultValues: { email: "" },
  });
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!onNotify) return;
    try {
      await onNotify(values.email);
      setSubmitted(true);
    } catch {
      form.setError("root", { message: formResultCopy.failed });
    }
  });

  const [timeRemaining, setTimeRemaining] = React.useState(() =>
    getCountdown(launchDate),
  );

  React.useEffect(() => {
    if (!launchDate) return;
    const interval = setInterval(() => {
      setTimeRemaining(getCountdown(launchDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [launchDate]);

  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-background p-4",
        className,
      )}
    >
      <div className="max-w-lg space-y-8 text-center">
        <div className="mx-auto flex h-32 w-32 items-center justify-center border-3 border-foreground bg-primary shadow-[8px_8px_0px_hsl(var(--shadow-color))]">
          <Clock className="h-16 w-16 text-primary-foreground" />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tight uppercase md:text-5xl">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>

        {timeRemaining && (
          <div className="flex justify-center gap-4">
            {[
              { value: timeRemaining.days, label: sharedLibraryCopy.days },
              { value: timeRemaining.hours, label: sharedLibraryCopy.hours },
              {
                value: timeRemaining.minutes,
                label: sharedLibraryCopy.minutes,
              },
            ].map((item) => (
              <div
                key={`action-${item.label}`}
                className="w-24 border-3 border-foreground bg-card p-4 shadow-[4px_4px_0px_hsl(var(--shadow-color))]"
              >
                <div className="text-3xl font-black">{item.value}</div>
                <div className="text-xs font-bold text-muted-foreground uppercase">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {onNotify && !submitted && (
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-sm gap-2">
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
                    placeholder={sharedLibraryCopy.enterYourEmail}

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
              disabled={form.formState.isSubmitting || !onNotify}
            >
              {sharedLibraryCopy.notifyMe}
            </Button>
            {form.formState.errors.root && (
              <FieldError>{form.formState.errors.root.message}</FieldError>
            )}
          </form>
        )}

        {submitted && (
          <div className="border-3 border-success bg-success/10 p-4">
            <p className="font-bold text-success">
              {sharedLibraryCopy.thanksWeAposLlNotifyYouWhenWeLaunch}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
