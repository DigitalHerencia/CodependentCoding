/** Auth Schemas contracts and composition for the owning application slice. */
import { z } from "zod";
import type { AuthSignInStep } from "@/types/authTypes";
const fields = z.object({
  identifier: z.string().default(""),
  password: z.string().default(""),
  code: z.string().default(""),
});
/** Validate the current credential, recovery, or MFA form stage. */
export function getSignInFormSchema(step: AuthSignInStep) {
  return fields.superRefine((values, ctx) => {
    const required =
      step === "password"
        ? (["identifier", "password"] as const)
        : step === "recover"
          ? (["identifier"] as const)
          : step === "new-password"
            ? (["password"] as const)
            : (["code"] as const);
    for (const name of required)
      if (!values[name].trim())
        ctx.addIssue({
          code: "custom",
          path: [name],
          message: "This field is required.",
        });
  });
}
/** Validate account creation separately from its email verification stage. */
export function getSignUpFormSchema(verifying: boolean) {
  return z
    .object({
      username: z.string().default(""),
      emailAddress: z.string().default(""),
      password: z.string().default(""),
      code: z.string().default(""),
    })
    .superRefine((values, ctx) => {
      for (const name of verifying
        ? (["code"] as const)
        : (["username", "emailAddress", "password"] as const))
        if (!values[name].trim())
          ctx.addIssue({
            code: "custom",
            path: [name],
            message: "This field is required.",
          });
      if (!verifying && !z.email().safeParse(values.emailAddress).success)
        ctx.addIssue({
          code: "custom",
          path: ["emailAddress"],
          message: "Enter a valid email address.",
        });
    });
}

/** Blank optional profile input is persisted as SQL NULL; completion is separate. */
const optionalProfileText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((value) => value || null);
/** The caller cannot submit identity, tenancy, roles, or a completion timestamp. */
export const onboardingSchema = z
  .object({
    firstName: optionalProfileText(100),
    lastName: optionalProfileText(100),
    bio: optionalProfileText(2000),
    phoneNumber: z
      .string()
      .trim()
      .max(32)
      .nullish()
      .transform((value) => (value ? value.replace(/[\s().-]/g, "") : null))
      .pipe(
        z
          .string()
          .regex(/^\+?\d{7,15}$/, "Enter a valid phone number.")
          .nullable(),
      ),
  })
  .strict();
