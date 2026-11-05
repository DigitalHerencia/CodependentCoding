"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { getSignUpFormSchema } from "@/schemas/authSchemas";

import { authPresentationCopy } from "@/content/auth";
import { SignUp, useSignUp } from "@/lib/auth/clerkAccount";
import Link from "next/link";
import { authAppearance } from "@/content/auth";
import { useState, useSyncExternalStore } from "react";
import { Controller, useForm } from "react-hook-form";
import { AuthFormPanel } from "@/components/blocks/auth-blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

const subscribeToHydration = () => () => {};

export function SignUpForm() {
  const hasHydrated = useSyncExternalStore<boolean>(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const { signUp, fetchStatus } = useSignUp();
  const [verifying, setVerifying] = useState(false);
  const [managed, setManaged] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const schema = getSignUpFormSchema(verifying);
  const form = useForm<
    z.input<typeof schema>,
    unknown,
    z.output<typeof schema>
  >({
    resolver: zodResolver(schema),
    defaultValues: { username: "", emailAddress: "", password: "", code: "" },
    shouldUnregister: true,
  });
  const busy =
    !hasHydrated || fetchStatus === "fetching" || form.formState.isSubmitting;

  async function check(result: { error: { message: string } | null }) {
    if (result.error) {
      setMessage(result.error.message);
      return false;
    }
    return true;
  }

  async function advance() {
    form.resetField("password");
    if (signUp.status === "complete") {
      await check(
        await signUp.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session.currentTask) {
              setManaged(true);
              return;
            }
            window.location.assign(decorateUrl("/dashboard"));
          },
        }),
      );
    } else if (
      signUp.missingFields.length === 0 &&
      signUp.unverifiedFields.includes("email_address")
    ) {
      setVerifying(true);
      await check(await signUp.verifications.sendEmailCode());
    } else {
      // Clerk handles additional requirements when template owners change configuration.
      setManaged(true);
    }
  }

  async function submit(values: z.output<typeof schema>) {
    setMessage("");
    try {
      const result = verifying
        ? await signUp.verifications.verifyEmailCode({ code: values.code })
        : await signUp.password({
            username: values.username,
            emailAddress: values.emailAddress,
            password: values.password,
          });
      if (await check(result)) await advance();
    } catch {
      setMessage(authPresentationCopy.unableToConnectPleaseTryAgain);
    }
  }

  if (managed)
    return (
      <SignUp
        path="/sign-up"
        routing="path"
        appearance={authAppearance}
        signInUrl="/sign-in"
        fallbackRedirectUrl="/dashboard"
      />
    );

  return (
    <AuthFormPanel
      title={
        verifying
          ? authPresentationCopy.verifyYourEmail
          : authPresentationCopy.createAnAccount
      }
      description={
        verifying
          ? authPresentationCopy.enterTheCodeSentToYourEmailAddress
          : authPresentationCopy.setUpYourAccount
      }
    >
      <form
        method="post"
        action="/sign-up"
        onSubmit={form.handleSubmit(submit)}
        className="space-y-4"
        aria-busy={busy}
        noValidate
      >
        <fieldset disabled={busy} className="space-y-4 disabled:opacity-70">
          {!verifying ? (
            <>
              <Controller
                name={"username"}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="signup-username" className="text-left">
                      {authPresentationCopy.username}
                    </FieldLabel>
                    <Input
                      id="signup-username"
                      autoComplete="username"
                      required
                      {...field}
                      value={field.value ?? ""}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                name={"emailAddress"}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="signup-email" className="text-left">
                      {authPresentationCopy.email}
                    </FieldLabel>
                    <Input
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      required
                      {...field}
                      value={field.value ?? ""}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                name={"password"}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <FieldLabel
                        htmlFor="signup-password"
                        className="text-left"
                      >
                        {authPresentationCopy.password}
                      </FieldLabel>
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="h-auto min-h-8 px-0 py-1"
                        aria-pressed={showPassword}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword
                          ? authPresentationCopy.hidePassword
                          : authPresentationCopy.showPassword}
                      </Button>
                    </div>
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      {...field}
                      value={field.value ?? ""}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </>
          ) : (
            <Controller
              name={"code"}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-code">
                    {authPresentationCopy.verificationCode}
                  </FieldLabel>
                  <Input
                    id="signup-code"
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    required
                    {...field}
                    value={field.value ?? ""}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          )}
          {message && (
            <p role="alert" className="text-left text-sm leading-relaxed">
              {message}
            </p>
          )}
          <Button type="submit" className="w-full">
            {busy
              ? authPresentationCopy.pleaseWait
              : verifying
                ? authPresentationCopy.verifyEmail
                : authPresentationCopy.createAccount}
          </Button>
          {verifying && (
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="link"
                onClick={async () => {
                  setMessage("");
                  try {
                    if (await check(await signUp.verifications.sendEmailCode()))
                      setMessage(authPresentationCopy.aNewCodeHasBeenSent);
                  } catch {
                    setMessage(
                      authPresentationCopy.unableToSendACodePleaseTryAgain,
                    );
                  }
                }}
              >
                {authPresentationCopy.resendCode}
              </Button>
              <Button
                type="button"
                variant="link"
                onClick={async () => {
                  await signUp.reset();
                  form.reset();
                  setMessage("");
                  setVerifying(false);
                }}
              >
                {authPresentationCopy.changeAccountDetails}
              </Button>
            </div>
          )}
        </fieldset>
        {/* Smart CAPTCHA stays mounted and may display a challenge when Clerk requires one. */}
        <div id="clerk-captcha" />
        <p className="border-t border-foreground/30 pt-4 text-sm">
          {authPresentationCopy.alreadyHaveAnAccount}{" "}
          <Link href="/sign-in" className="type-link">
            {authPresentationCopy.signIn}
          </Link>
        </p>
      </form>
    </AuthFormPanel>
  );
}
