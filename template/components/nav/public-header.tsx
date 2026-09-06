// components/navigation/public-header.tsx

import type { ReactNode } from "react";
import Link from "next/link";

import { LogoLockup } from "@/components/brand/logo-lockup";
import { Button } from "@/components/ui/button";
import { applicationProduct } from "@/content/application";

export interface PublicHeaderProps {
  logo?: ReactNode | undefined;
}

export function PublicHeader({ logo = <LogoLockup /> }: PublicHeaderProps) {
  return (
    <header className="sticky top-0 z-50 h-21 w-full border-b border-foreground bg-background">
      <div className="mx-auto hidden h-full w-full max-w-7xl items-center justify-between px-6 sm:px-10 md:flex lg:px-12">
        <Link
          href="/"
          aria-label={`${applicationProduct.name} home`}
          className="flex shrink-0 items-center"
        >
          {logo}
        </Link>

        <div className="flex items-center gap-2 lg:gap-4">
          <Button variant="default" size="default" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>

          <Button variant="outline" size="default" className="shrink-0" asChild>
            <Link href="/sign-up?return_to=/dashboard">Get started</Link>
          </Button>
        </div>
      </div>

      <div className="flex h-full items-center justify-center px-6 md:hidden">
        <Link
          href="/"
          aria-label={`${applicationProduct.name} home`}
          className="inline-flex items-center"
        >
          {logo}
        </Link>
      </div>
    </header>
  );
}
