import { cn } from "@/components/ui/utils";
import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { authPresentationCopy, authStateContent } from "@/content/auth";
import type {
  AuthFormBlockProps,
  AuthInputBlockProps,
} from "@/types/authTypes";
import { RefreshCw, ServerCrash } from "lucide-react";
import Link from "next/link";

type AuthFormPanelProps = {
  children: ReactNode;
  title: string;
  description: string;
  /** Sign-up mirrors the auth shell (see globals.css). */
  variant?: "signIn" | "signUp";
};

export function AuthFormPanel({
  children,
  title,
  description,
  variant = "signIn",
}: AuthFormPanelProps) {
  return (
    <div
      data-auth-variant={variant}
      className="w-full space-y-6 bg-transparent text-left"
    >
      <div className="space-y-2">
        <h2 className="type-title uppercase">{title}</h2>
        <p className="max-w-prose type-body">{description}</p>
      </div>
      {children}
    </div>
  );
}

export type AuthSplitLayoutProps = {
  children: ReactNode;
  brandContent?: ReactNode;
  brandBackground?: string;
  position?: "left" | "right";
  className?: string;
};

export function AuthSplitLayout({
  children,
  brandContent,
  brandBackground = "bg-primary",
  position = "left",
  className,
}: AuthSplitLayoutProps) {
  return (
    <div className={cn("flex min-h-screen", className)}>
      {position === "left" && brandContent && (
        <div
          className={cn(
            "hidden flex-col justify-center p-12 lg:flex lg:w-1/2",
            brandBackground,
          )}
        >
          {brandContent}
        </div>
      )}

      <div className="flex flex-1 items-center justify-center p-4 md:p-8">
        {children}
      </div>

      {position === "right" && brandContent && (
        <div
          className={cn(
            "hidden flex-col justify-center p-12 lg:flex lg:w-1/2",
            brandBackground,
          )}
        >
          {brandContent}
        </div>
      )}
    </div>
  );
}

/** BoldKit auth-forms presentation; authentication and RHF remain in the feature. */
export function AuthInputBlock({
  label,
  labelAction,
  error,
  invalid,
  id,
  ...input
}: AuthInputBlockProps) {
  return (
    <Field data-invalid={invalid}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {labelAction}
      </div>
      <Input
        {...input}
        id={id}
        aria-invalid={invalid}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </Field>
  );
}

export function AuthPasswordToggleBlock({
  shown,
  onToggle,
}: {
  shown: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      type="button"
      variant="link"
      size="sm"
      className="h-auto min-h-8 px-0 py-1"
      aria-pressed={shown}
      onClick={onToggle}
    >
      {shown
        ? authPresentationCopy.hidePassword
        : authPresentationCopy.showPassword}
    </Button>
  );
}

/** Explicit POST and pre-hydration disabling prevent native GET credential leakage. */
export function AuthFormBlock({
  action,
  onSubmit,
  busy,
  children,
  footer,
  challenge,
}: AuthFormBlockProps) {
  return (
    <form
      method="post"
      action={action}
      onSubmit={onSubmit}
      className="space-y-4"
      aria-busy={busy}
      noValidate
    >
      <fieldset disabled={busy} className="space-y-4 disabled:opacity-70">
        {children}
      </fieldset>
      {challenge}
      {footer}
    </form>
  );
}

export function AuthLoadingBlock() {
  return (
    <div
      role="status"
      aria-label={authStateContent.loading}
      className="space-y-6"
    >
      <span className="sr-only">{authStateContent.loading}</span>
      <div aria-hidden className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

/** Adapt BoldKit ServerErrorPage; this boundary never impersonates a 404. */
export function AuthErrorBlock({ reset }: { reset: () => void }) {
  return (
    <section
      aria-labelledby="auth-error-title"
      className="space-y-8 text-center"
    >
      <ServerCrash aria-hidden className="mx-auto size-12 text-destructive" />
      <h2 id="auth-error-title" className="type-title uppercase">
        {authStateContent.errorTitle}
      </h2>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button type="button" onClick={reset}>
          <RefreshCw aria-hidden />
          {authStateContent.retry}
        </Button>
        <Button variant="outline" asChild>
          <Link href="/sign-in">{authStateContent.returnToAuth}</Link>
        </Button>
      </div>
    </section>
  );
}
