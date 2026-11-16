// components/nav/auth-header.tsx

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { authHeaderContent } from "@/content/auth";

/** The auth group's only navigation: a quiet way back to the landing page. */
export function AuthHeader() {
  return (
    <header className="auth-header">
      <Link
        href={authHeaderContent.homeHref}
        className="inline-flex auth-back-link min-h-9 type-link items-center gap-2"
      >
        <ArrowLeft aria-hidden />
        {authHeaderContent.homeLabel}
      </Link>
    </header>
  );
}
