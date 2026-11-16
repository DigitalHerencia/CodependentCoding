import type { ComponentProps, ReactNode } from "react";
import type { useSignIn, useSignUp } from "@clerk/nextjs";
import type { z } from "zod";
import type {
  getSignInFormSchema,
  getSignUpFormSchema,
} from "@/schemas/authSchemas";

export type AuthSignInResource = ReturnType<typeof useSignIn>["signIn"];
export type AuthSignUpResource = ReturnType<typeof useSignUp>["signUp"];
export type AuthSignInValues = z.output<ReturnType<typeof getSignInFormSchema>>;
export type AuthSignUpValues = z.output<ReturnType<typeof getSignUpFormSchema>>;

/** Supported stages of the existing Clerk password and recovery flow. */
export type AuthSignInStep =
  "password" | "recover" | "reset-code" | "new-password" | "mfa";
export type AuthFactor = "email_code" | "phone_code" | "totp" | "backup_code";

/** Presentation only: RHF supplies field values, handlers, refs and errors. */
export type AuthInputBlockProps = ComponentProps<"input"> & {
  id: string;
  label: string;
  error?: string | undefined;
  invalid?: boolean;
  labelAction?: ReactNode;
};

export type AuthFormBlockProps = {
  action: "/sign-in" | "/sign-up";
  busy: boolean;
  onSubmit: ComponentProps<"form">["onSubmit"];
  children: ReactNode;
  footer: ReactNode;
  challenge?: ReactNode;
};

export type AuthFormTemplateProps = AuthFormBlockProps & {
  title: string;
  description: string;
  variant?: "signIn" | "signUp";
};
