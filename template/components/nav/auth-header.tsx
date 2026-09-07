// components/auth/auth-header.tsx

import Link from "next/link";

import { authHeaderContent } from "@/content/auth";

export function AuthHeader() {
  return (
    <header className="flex items-center justify-between gap-4 px-6 py-6 md:px-12">
      <Link
        href={authHeaderContent.homeHref}
        className="text-sm text-foreground/60 underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
      >
        {authHeaderContent.homeLabel}
      </Link>
    </header>
  );
}
