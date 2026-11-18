/** BoldKit login, signup, OTP, loading and server-error patterns composed from local shadcn primitives.
 * @see https://boldkit.dev
 */
import { UserAvatar, UserButton } from "@clerk/nextjs";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { authAccountCopy } from "@/content/auth";
import type { AuthAccountTemplateProps } from "@/types/authTypes";
import type { ReactNode } from "react";
import { SignIn, SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { RefreshCw, ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  authAppearance,
  authPresentationCopy,
  authRemainingCopy,
  authStateContent,
} from "@/content/auth";
import type {
  AuthPageTemplateProps,
  AuthInputTemplateProps,
  AuthInputBlockProps,
  AuthRouteVariantProps,
} from "@/types/authTypes";

/** A route-specific heading with copy resolved only in the block layer. */
export function AuthHeadingBlock({
  titleKey,
  descriptionKey,
}: Pick<AuthPageTemplateProps, "titleKey" | "descriptionKey">) {
  return (
    <div className="space-y-2">
      <h2 className="type-title uppercase">{authPresentationCopy[titleKey]}</h2>
      <p className="max-w-prose type-body">
        {authPresentationCopy[descriptionKey]}
      </p>
    </div>
  );
}
/** Compose labels, errors and custom OTP controls through one reusable field block. */
export function AuthInputBlock({
  id,
  label,
  labelAction,
  error,
  invalid,
  control,
  ...input
}: AuthInputBlockProps) {
  return (
    <Field data-invalid={invalid ?? Boolean(error)}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {labelAction}
      </div>
      {control ?? (
        <Input
          {...input}
          id={id}
          aria-invalid={invalid ?? Boolean(error)}
          aria-describedby={error ? id + "-error" : undefined}
        />
      )}
      {error && <FieldError id={id + "-error"}>{error}</FieldError>}
    </Field>
  );
}
/** RHF supplies input bindings; blocks own copy, password visibility and OTP primitives. */
export function AuthFieldsBlock({
  fields,
  shown,
  onTogglePassword,
}: Pick<AuthPageTemplateProps, "fields" | "shown" | "onTogglePassword">) {
  return fields.map(
    ({ labelKey, error, onValueChange, ...field }: AuthInputTemplateProps) => (
      <AuthInputBlock
        {...field}
        key={field.id}
        label={authPresentationCopy[labelKey]}
        error={error}
        labelAction={
          field.name === "password" ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-pressed={shown}
              onClick={onTogglePassword}
            >
              {shown
                ? authPresentationCopy.hidePassword
                : authPresentationCopy.showPassword}
            </Button>
          ) : undefined
        }
        control={
          field.name === "code" &&
          field.inputMode === "numeric" &&
          onValueChange ? (
            <InputOTP
              id={field.id}
              name={field.name}
              ref={field.ref}
              value={typeof field.value === "string" ? field.value : ""}
              onChange={onValueChange}
              onBlur={field.onBlur}
              maxLength={6}
              pattern="[0-9]*"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              aria-invalid={Boolean(error)}
              aria-describedby={error ? field.id + "-error" : undefined}
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }, (_, index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          ) : undefined
        }
      />
    ),
  );
}
/** Native POST and disabled controls prevent pre-hydration credential leakage. */
export function AuthFormBlock({
  onSubmit,
  busy,
  children,
  variant,
}: AuthRouteVariantProps & { children: ReactNode }) {
  return (
    <form
      method="post"
      action={variant === "signIn" ? "/sign-in" : "/sign-up"}
      onSubmit={onSubmit}
      aria-busy={busy}
      className="space-y-4"
      noValidate
    >
      <fieldset disabled={busy} className="space-y-4 disabled:opacity-70">
        {children}
      </fieldset>
      {variant === "signUp" && <div id="clerk-captcha" />}
    </form>
  );
}
/** Keep all feedback, submission and verification controls within the disabled fieldset. */
export function AuthControlsBlock({
  message,
  busy,
  submitKey,
  actions,
  factors,
}: AuthPageTemplateProps) {
  const labels = {
    totp: authRemainingCopy.authenticatorApp,
    email_code: authRemainingCopy.emailCode,
    phone_code: authRemainingCopy.sMSCode,
    backup_code: authRemainingCopy.backupCode,
  };
  return (
    <>
      {message && (
        <p role="alert" className="text-left text-sm leading-relaxed">
          {typeof message === "string"
            ? message
            : authPresentationCopy[message.copy]}
        </p>
      )}
      <Button type="submit" className="w-full">
        {authPresentationCopy[busy ? "pleaseWait" : submitKey]}
      </Button>
      {actions?.map((action) => (
        <Button
          key={action.key}
          type="button"
          variant="link"
          onClick={action.onClick}
        >
          {authPresentationCopy[action.label]}
        </Button>
      ))}
      {factors?.map(({ factor, onClick }) => (
        <Button key={factor} type="button" variant="link" onClick={onClick}>
          {labels[factor]}
        </Button>
      ))}
    </>
  );
}
/** Navigation copy remains owned by blocks for both authentication routes. */
export function AuthFooterLinksBlock({
  variant,
}: Pick<AuthRouteVariantProps, "variant">) {
  return (
    <p className="auth-secondary-actions">
      {
        authPresentationCopy[
          variant === "signIn" ? "newHere" : "alreadyHaveAnAccount"
        ]
      }{" "}
      <Link
        href={variant === "signIn" ? "/sign-up" : "/sign-in"}
        className="type-link"
      >
        {
          authPresentationCopy[
            variant === "signIn" ? "createAnAccount" : "signIn"
          ]
        }
      </Link>
    </p>
  );
}
/** Clerk retains support for instance-specific requirements and session tasks. */
export function AuthManagedBlock({
  variant,
}: Pick<AuthRouteVariantProps, "variant">) {
  return variant === "signIn" ? (
    <SignIn
      path="/sign-in"
      routing="path"
      appearance={authAppearance}
      signUpUrl="/sign-up"
      fallbackRedirectUrl="/dashboard"
    />
  ) : (
    <SignUp
      path="/sign-up"
      routing="path"
      appearance={authAppearance}
      signInUrl="/sign-in"
      fallbackRedirectUrl="/dashboard"
    />
  );
}
/** Announce loading while skeleton shapes remain hidden from assistive technology. */
export function AuthLoadingBlock() {
  return (
    <div
      role="status"
      aria-label={authStateContent.loading}
      className="space-y-6"
    >
      <span className="sr-only">{authStateContent.loading}</span>
      <div aria-hidden className="space-y-6">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
/** A retryable server error never exposes exception content or impersonates a 404. */
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

/** Clerk's provider avatar/menu stays in auth; the organization slot belongs to authz.
 * @see https://clerk.com/docs/nextjs/reference/components/user/user-button
 */
export function AuthAccountBlock({
  profile,
  organizationSwitcher,
  open,
  onOpenChange,
  triggerRef,
  pending,
  failed,
  onAfterClose,
  onViewProfile,
  onEditProfile,
  onSignOut,
}: AuthAccountTemplateProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          ref={triggerRef}
          type="button"
          variant="ghost"
          className="w-full justify-start gap-3"
          aria-label={authAccountCopy.title}
        >
          <UserAvatar />
          <span className="truncate">
            {profile.firstName || authAccountCopy.account}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-full space-y-6 overflow-y-auto sm:max-w-md"
        onCloseAutoFocus={(event) => {
          if (onAfterClose()) event.preventDefault();
        }}
      >
        <SheetHeader>
          <SheetTitle>{authAccountCopy.title}</SheetTitle>
          <SheetDescription>{authAccountCopy.description}</SheetDescription>
        </SheetHeader>
        <div className="flex items-center gap-3">
          <UserButton userProfileMode="modal" />
          <p className="font-bold">
            {profile.firstName} {profile.lastName}
          </p>
        </div>
        {profile.bio && (
          <p className="break-words text-muted-foreground">{profile.bio}</p>
        )}
        {organizationSwitcher}
        <div className="flex flex-col gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={onViewProfile}
          >
            {authAccountCopy.viewProfile}
          </Button>
          <Button type="button" disabled={pending} onClick={onEditProfile}>
            {authAccountCopy.editProfile}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={onSignOut}
          >
            {pending ? authAccountCopy.signingOut : authAccountCopy.signOut}
          </Button>
        </div>
        {failed && <p role="alert">{authAccountCopy.signOutFailed}</p>}
      </SheetContent>
    </Sheet>
  );
}
