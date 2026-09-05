// components/navigation/public-header.tsx

import type { ReactNode } from "react";
import Link from "next/link";

import { LogoLockup } from "@/components/brand/logo-lockup";
import { Button } from "@/components/ui/button";
import { applicationProduct } from "@/content/application";

export interface PublicHeaderNavItem {
  label: string;
  href: string;
}

export interface PublicHeaderProps {
  logo?: ReactNode | undefined;
  navItems?: readonly PublicHeaderNavItem[] | undefined;
}

export const defaultPublicNavItems = [
  { label: "Features", href: "/features" },
  { label: "FAQ", href: "/faq" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
] satisfies readonly PublicHeaderNavItem[];

export function PublicHeader({
  logo = <LogoLockup />,
  navItems = defaultPublicNavItems,
}: PublicHeaderProps) {
  return (
    <header className="sticky top-0 z-50 h-21 w-full border-b border-muted bg-background">
      <div className="mx-auto hidden h-full w-full max-w-7xl items-center justify-between px-6 sm:px-10 md:flex lg:px-12">
        <Link
          href="/"
          aria-label={`${applicationProduct.name} home`}
          className="flex shrink-0 items-center"
        >
          {logo}
        </Link>

        <nav className="flex items-center gap-2 lg:gap-6">
          {navItems.map((item) => (
            <Button key={item.href} variant="ghost" size="sm" asChild>
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2 lg:gap-4">
          <Button variant="secondary" size="lg" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>

          <Button variant="default" size="lg" className="shrink-0" asChild>
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
          <LogoLockup />
        </Link>
      </div>
    </header>
  );
}
