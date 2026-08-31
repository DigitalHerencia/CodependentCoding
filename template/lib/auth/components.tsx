"use client";

import { Show, SignIn, SignInButton, SignUp, UserButton, UserProfile } from "@clerk/nextjs";
import type { ReactNode } from "react";

export function UserButtonControl(props: React.ComponentProps<typeof UserButton>) { return <UserButton {...props} />; }
export function SignedInControl({ children }: { children: ReactNode }) { return <Show when="signed-in">{children}</Show>; }
export function SignedOutControl({ children }: { children: ReactNode }) { return <Show when="signed-out">{children}</Show>; }
export function SignInButtonControl({ children }: { children: ReactNode }) { return <SignInButton mode="modal">{children}</SignInButton>; }
export function SignInControl() { return <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" fallbackRedirectUrl="/dashboard" />; }
export function SignUpControl() { return <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" fallbackRedirectUrl="/dashboard" />; }
export function UserProfileControl() { return <UserProfile routing="hash" />; }
