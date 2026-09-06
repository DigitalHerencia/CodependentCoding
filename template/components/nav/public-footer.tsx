import Link from "next/link";

import { Button } from "@/components/ui/button";

export interface PublicFooterLink {
  label: string;
  href: string;
}

export interface PublicFooterProps {
  links?: readonly PublicFooterLink[] | undefined;
}

export const defaultPublicFooterLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
] satisfies readonly PublicFooterLink[];

export function PublicFooter({
  links = defaultPublicFooterLinks,
}: PublicFooterProps) {
  return (
    <footer className="w-full border-t border-foreground bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-6 py-7 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <p className="font-mono text-sm leading-none text-foreground sm:text-base lg:text-lg">
          © {new Date().getFullYear()} All rights reserved.
        </p>

        <nav className="flex flex-wrap gap-x-2 gap-y-2 text-foreground sm:gap-x-1">
          {links.map((item) => (
            <Button key={item.href} variant="link" size="default" asChild>
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>
      </div>
    </footer>
  );
}
