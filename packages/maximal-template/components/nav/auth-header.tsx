// components/nav/auth-header.tsx

import Link from "next/link";

import { authHeaderContent } from "@/content/auth";

/** The auth group's only navigation: a quiet way back to the landing page. */
export function AuthHeader() {
  return (
    <header className="auth-header">
      <Link
        href={authHeaderContent.homeHref}
        className="inline-flex auth-back-link min-h-9 type-link items-center"
      >
        {authHeaderContent.homeLabel}
      </Link>
    </header>
  );
}
