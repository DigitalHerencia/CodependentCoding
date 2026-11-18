/** Auth Types contracts and composition for the owning application slice. */
import type { NextRequest } from "next/server";
import type { UseFormRegisterReturn } from "react-hook-form";
import type { verifyClerkWebhook } from "@/lib/integrations/clerk/webhooks";
import type { onboardingSchema } from "@/schemas/authSchemas";
/** Auth Types contracts and composition for the owning application slice. */
import type { ComponentProps, ReactNode, RefObject } from "react";
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
  control?: ReactNode;
};

/** Clerk establishes user identity only. Application tenancy is resolved locally. */
export type AuthenticatedIdentity = {
  clerkUserId: string;
};

export type AuthenticatedSession = {
  clerkUserId: string;
  clerkSessionId: string;
};

export type CurrentSessionContext = {
  isAuthenticated: boolean;
  clerkUserId: string | null;
  clerkSessionId: string | null;
};

export type CurrentUserProfile = {
  clerkUserId: string;
  displayName: string | null;
  primaryEmailAddress: string | null;
  imageUrl: string;
};

export type ClerkUserProjection = {
  clerkUserId: string;
  email: string | null;
  /** Only provider-verified email may match a pending invitation. */
  verifiedEmail: string | null;
  displayName: string | null;
  imageUrl: string | null;
  username: string | null;
};

export type AuthCopyKey =
  | "unableToConnectPleaseTryAgain"
  | "unableToSendACodePleaseTryAgain"
  | "unableToSwitchVerificationMethodsPleaseTryAgain"
  | "aNewCodeHasBeenSent"
  | "forgotPassword"
  | "newHere"
  | "createAnAccount"
  | "welcomeBack"
  | "verifyYourIdentity"
  | "resetYourPassword"
  | "enterYourUsernameAndPasswordToContinue"
  | "enterYourUsernameToReceiveARecoveryCodeAt"
  | "chooseANewPassword"
  | "enterYourVerificationCodeToContinue"
  | "username"
  | "newPassword"
  | "password"
  | "backupCode"
  | "verificationCode"
  | "pleaseWait"
  | "signIn"
  | "sendRecoveryCode"
  | "continue"
  | "resendCode"
  | "backToSignIn"
  | "alreadyHaveAnAccount"
  | "verifyYourEmail"
  | "enterTheCodeSentToYourEmailAddress"
  | "setUpYourAccount"
  | "email"
  | "verifyEmail"
  | "createAccount"
  | "changeAccountDetails";
export type AuthMessage = string | { copy: AuthCopyKey };
export type AuthInputTemplateProps = Omit<AuthInputBlockProps, "label"> & {
  labelKey: AuthCopyKey;
  onValueChange?: ((value: string) => void) | undefined;
};
/** Local profile values; null means the optional field was left blank. */
export type AuthProfileInput = z.output<typeof onboardingSchema>;
/** Browser form values before optional text normalization. */
export type AuthProfileFormValues = z.input<typeof onboardingSchema>;
/** One application-owned profile per user, with an explicit completion marker. */
export type AuthProfileDTO = AuthProfileInput & {
  profileCompletedAt: string | null;
};
/** Verified Clerk envelope; this import is erased from browser bundles. */
export type ClerkWebhookEvent = Awaited<ReturnType<typeof verifyClerkWebhook>>;
/** Server-owned capabilities supplied by the API route, never by a browser action. */
export type ClerkWebhookDependencies = {
  verify: (request: NextRequest) => Promise<ClerkWebhookEvent>;
  claim: (
    eventId: string,
    type: string,
    payload: string,
  ) => Promise<string | null>;
  project: (
    event: ClerkWebhookEvent,
  ) => Promise<ClerkUserProjection | null | undefined>;
  commit: (
    event: ClerkWebhookEvent,
    projection: ClerkUserProjection | null | undefined,
    id: string,
  ) => Promise<void>;
  fail: (id: string) => Promise<unknown>;
  isConflict: (error: unknown) => boolean;
};
/** Session activation callbacks are presentation effects supplied by forms. */
export type AuthFinalizeCallbacks = {
  onTask: () => void;
  navigate: (url: string) => void;
};
/** One page template receives RHF input bindings and route-specific controls. */
export type AuthPageTemplateProps = {
  busy: boolean;
  managed: boolean;
  message: AuthMessage;
  onSubmit: ComponentProps<"form">["onSubmit"];
  fields: AuthInputTemplateProps[];
  submitKey: AuthCopyKey;
  titleKey: AuthCopyKey;
  descriptionKey: AuthCopyKey;
  actions?: {
    key: string;
    label: AuthCopyKey;
    onClick: () => void | Promise<void>;
  }[];
  factors?: { factor: AuthFactor; onClick: () => void | Promise<void> }[];
  shown: boolean;
  onTogglePassword: () => void;
};
/** Shared new/edit modal contract; only editing is dismissible. */
export type OnboardingModalProps = {
  profile: AuthProfileDTO;
  mode: "complete" | "edit";
  onClose?: (() => void) | undefined;
};
/** RHF-owned bindings passed into the onboarding presentation template. */
export type OnboardingTemplateProps = OnboardingModalProps & {
  pending: boolean;
  saved: boolean;
  failed: boolean;
  error?: string | undefined;
  onSubmit: ComponentProps<"form">["onSubmit"];
  fields: Record<
    keyof AuthProfileInput,
    UseFormRegisterReturn & {
      error?: string | undefined;
    }
  >;
};

/** Shared layout contract for sign-in and sign-up route presentation. */
export type AuthRouteVariantProps = AuthPageTemplateProps & {
  variant: "signIn" | "signUp";
};
/** Auth shell and navigation accept only presentation slots. */
export type AuthChildrenProps = Readonly<{ children: ReactNode }>;

/** Route and form failure boundaries receive only a retry callback. */
export type AuthErrorProps = {
  reset: () => void;
  error?: Error & { digest?: string };
};
/** Auth shell owns the responsive split and its navigation/content slots. */
export type AuthShellProps = AuthChildrenProps & {
  header: ReactNode;
  brand: ReactNode;
  logo: ReactNode;
  footer: ReactNode;
};
/** Raw provider user shape accepted by the verified webhook projection mapper. */
export type ClerkWebhookUser = {
  id: string;
  email_addresses: Array<{
    id: string;
    email_address: string;
    verification?: { status: string } | null;
  }>;
  primary_email_address_id: string | null;
  first_name: string | null;
  last_name: string | null;
  image_url: string;
  username: string | null;
};

/** Provider failures displayed by the RHF form without logging credentials. */
export type AuthProviderResult = { error: { message: string } | null };
/** Post-submit sign-in state selected by the workflow. */
export type AuthSignInTransition =
  | { kind: "finalize"; result: AuthProviderResult }
  | { kind: "password" }
  | { kind: "factor"; factor: AuthFactor; result: AuthProviderResult }
  | { kind: "managed" };
/** Post-submit sign-up state selected by the workflow. */
export type AuthSignUpTransition =
  | { kind: "finalize" | "verify"; result: AuthProviderResult }
  | { kind: "managed" };

/** Editing always supplies a close callback from its eventual modal trigger. */
export type OnboardingEditFormProps = Omit<OnboardingModalProps, "mode"> & {
  onClose: () => void;
};

/** Server-owned account projection and independently authorized organization presentation. */
export type AuthAccountFeatureProps = {
  profile: AuthProfileDTO;
  organizationSwitcher: ReactNode;
};
/** Account sheet receives interaction state; it performs no identity or membership reads. */
export type AuthAccountTemplateProps = AuthAccountFeatureProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  pending: boolean;
  failed: boolean;
  onAfterClose: () => boolean;
  onViewProfile: () => void;
  onEditProfile: () => void;
  onSignOut: () => Promise<void>;
};
