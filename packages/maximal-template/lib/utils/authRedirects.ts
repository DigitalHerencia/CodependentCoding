/** Auth Redirects contracts and composition for the owning application slice. */
import "server-only";

import { redirect } from "next/navigation";

import {
  SIGN_IN_PATH,
  SIGN_UP_PATH,
  DEFAULT_AUTH_REDIRECT_PATH,
} from "@/lib/constants/authConstants";

export function redirectToSignIn(): never {
  redirect(SIGN_IN_PATH);
}

export function redirectToSignUp(): never {
  redirect(SIGN_UP_PATH);
}

export function redirectAfterAuth(): never {
  redirect(DEFAULT_AUTH_REDIRECT_PATH);
}
