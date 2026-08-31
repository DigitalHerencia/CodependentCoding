import { SignUp } from "@clerk/nextjs";

export function SignUpFeature() {
  return (
    <SignUp
      path="/sign-up"
      routing="path"
      signInUrl="/sign-in"
      fallbackRedirectUrl="/dashboard"
    />
  );
}
