import { z } from "zod";
const fields = z.object({
  identifier: z.string().default(""),
  password: z.string().default(""),
  code: z.string().default(""),
});
export function getSignInFormSchema(
  step: "password" | "recover" | "reset-code" | "new-password" | "mfa",
) {
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
