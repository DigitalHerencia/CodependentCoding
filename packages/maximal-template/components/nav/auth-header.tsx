// components/nav/auth-header.tsx

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { authHeaderContent } from "@/content/auth";

/** The auth group's only navigation: a quiet way back to the landing page. */
export function AuthHeader() {
  return (
    <header className="auth-header">
      <Button asChild variant="link" size="sm" className="auth-back-link">
        <Link href={authHeaderContent.homeHref}>
          <ArrowLeft aria-hidden />
          {authHeaderContent.homeLabel}
        </Link>
      </Button>
    </header>
  );
}
