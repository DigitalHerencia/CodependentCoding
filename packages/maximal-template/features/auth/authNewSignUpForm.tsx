"use client";
/** Auth New Sign Up Form contracts and composition for the owning application slice. */
import type { AuthMessage, AuthInputTemplateProps } from "@/types/authTypes";

import { AuthSignUpTemplate } from "@/components/templates/auth-templates";
import { getSignUpFormSchema } from "@/schemas/authSchemas";
import {
  useAuthSignUpWorkflow,
  advanceAuthSignUpWorkflow,
  submitAuthSignUpWorkflow,
  sendAuthSignUpCodeWorkflow,
} from "@/lib/workflows/authWorkflows";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useSyncExternalStore } from "react";
import { useForm, useController } from "react-hook-form";
import type { z } from "zod";

const subscribeToHydration = () => () => {};

/** Own RHF validation and Clerk state; presentation is composed by the auth template. */
export function AuthNewSignUpForm() {
  const hasHydrated = useSyncExternalStore<boolean>(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const { signUp, fetchStatus } = useAuthSignUpWorkflow();
  const [verifying, setVerifying] = useState(false);
  const [managed, setManaged] = useState(false);
  const [message, setMessage] = useState<AuthMessage>("");
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
  const { field: codeField } = useController({
    control: form.control,
    name: "code",
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
    const next = await advanceAuthSignUpWorkflow(signUp, {
      onTask: () => setManaged(true),
      navigate: (url) => window.location.assign(url),
    });
    if (next.kind === "managed") setManaged(true);
    else {
      if (next.kind === "verify") setVerifying(true);
      await check(next.result);
    }
  }

  async function submit(values: z.output<typeof schema>) {
    setMessage("");
    try {
      const result = await submitAuthSignUpWorkflow(signUp, verifying, values);
      if (await check(result)) await advance();
    } catch {
      setMessage({ copy: "unableToConnectPleaseTryAgain" });
    }
  }

  const fields: AuthInputTemplateProps[] = verifying
    ? [
        {
          ...codeField,
          onValueChange: codeField.onChange,
          id: "signup-code",
          labelKey: "verificationCode",
          autoComplete: "one-time-code",
          inputMode: "numeric",
          required: true,
          error: form.formState.errors.code?.message,
        },
      ]
    : [
        {
          ...form.register("username"),
          id: "signup-username",
          labelKey: "username",
          autoComplete: "username",
          required: true,
          error: form.formState.errors.username?.message,
        },
        {
          ...form.register("emailAddress"),
          id: "signup-email",
          labelKey: "email",
          type: "email",
          autoComplete: "email",
          required: true,
          error: form.formState.errors.emailAddress?.message,
        },
        {
          ...form.register("password"),
          id: "signup-password",
          labelKey: "password",
          type: showPassword ? "text" : "password",
          autoComplete: "new-password",
          required: true,
          error: form.formState.errors.password?.message,
        },
      ];
  return (
    <AuthSignUpTemplate
      fields={fields}
      busy={busy}
      managed={managed}
      message={message}
      onSubmit={form.handleSubmit(submit)}
      titleKey={verifying ? "verifyYourEmail" : "createAnAccount"}
      descriptionKey={
        verifying ? "enterTheCodeSentToYourEmailAddress" : "setUpYourAccount"
      }
      submitKey={verifying ? "verifyEmail" : "createAccount"}
      shown={showPassword}
      onTogglePassword={() => setShowPassword(!showPassword)}
      actions={
        verifying
          ? [
              {
                key: "resend",
                label: "resendCode",
                onClick: async () => {
                  setMessage("");
                  try {
                    await check(await sendAuthSignUpCodeWorkflow(signUp));
                  } catch {
                    setMessage({ copy: "unableToSendACodePleaseTryAgain" });
                  }
                },
              },
            ]
          : []
      }
    />
  );
}
