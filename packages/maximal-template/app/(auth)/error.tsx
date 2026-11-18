"use client";
/** Auth route recovery composes the owned error block directly. */
import { AuthErrorBlock } from "@/components/blocks/auth-blocks";
import type { AuthErrorProps } from "@/types/authTypes";
/** Retry without exposing provider or server exception contents. */
export default function RouteError({ reset }: AuthErrorProps) {
  return <AuthErrorBlock reset={reset} />;
}
