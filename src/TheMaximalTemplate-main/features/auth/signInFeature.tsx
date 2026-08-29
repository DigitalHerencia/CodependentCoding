import { SignIn } from "@clerk/nextjs";

export function SignInFeature() {
  return (
    <SignIn
      path="/sign-in"
      routing="path"
      signUpUrl="/sign-up"
      fallbackRedirectUrl="/dashboard"
    />
  );
}
