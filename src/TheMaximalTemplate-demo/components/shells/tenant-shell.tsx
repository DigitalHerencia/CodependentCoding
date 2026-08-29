import { UserButton } from '@clerk/nextjs';
import {
  Brain,
  Image,
  LayoutDashboard,
  Map,
  Settings,
  SquareKanban,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { Wordmark } from '@/components/brand/wordmark';
import { Button } from '@/components/ui/button';
import {
  loadedVibesCapabilities,
  loadedVibesDesign,
} from '@/content/loadedvibes';

type TenantShellProps = {
  children: ReactNode;
};

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ...(loadedVibesCapabilities.sampleDomain
    ? [{ href: '/projects', label: 'Projects', icon: SquareKanban }]
    : []),
  ...(loadedVibesCapabilities.invitations
    ? [{ href: '/team', label: 'Team', icon: Users }]
    : []),
  ...(loadedVibesCapabilities.uploads
    ? [{ href: '/uploads', label: 'Media', icon: Image }]
    : []),
  ...(loadedVibesCapabilities.maps
    ? [{ href: '/maps', label: 'Maps', icon: Map }]
    : []),
  ...(loadedVibesCapabilities.ai
    ? [{ href: '/ai', label: 'AI', icon: Brain }]
    : []),
  { href: '/settings', label: 'Settings', icon: Settings },
] as const;

export function TenantShell({ children }: TenantShellProps) {
  const sidebar = loadedVibesDesign.navigation === 'sidebar';

  return (
    <div
      className={
        sidebar
          ? 'min-h-dvh pb-20 md:grid md:grid-cols-[15rem_1fr] md:pb-0'
          : 'min-h-dvh pb-20 md:pb-0'
      }
    >
      {sidebar ? (
        <aside className="sticky top-0 hidden h-dvh border-r bg-background/90 p-6 backdrop-blur md:flex md:flex-col md:gap-8">
          <Wordmark />
          <nav className="grid gap-2">
            {navItems.map((item) => (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                className="justify-start"
              >
                <Link href={item.href}>
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
          <div className="mt-auto">
            <UserButton />
          </div>
        </aside>
      ) : null}
      <div className="min-w-0">
        <header
          className={`sticky top-0 z-40 border-b bg-background/90 backdrop-blur ${sidebar ? 'md:hidden' : ''}`}
        >
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12">
            <Wordmark />
            <nav className="hidden items-center gap-2 md:flex">
              {navItems.map((item) => (
                <Button key={item.href} asChild variant="ghost" size="sm">
                  <Link href={item.href}>
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                </Button>
              ))}
            </nav>
            <UserButton />
          </div>
        </header>
        <main className="lv-shell-main mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
          {children}
        </main>
        <nav className="fixed inset-x-0 bottom-0 z-50 flex overflow-x-auto border-t bg-background md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-16 min-w-20 flex-1 flex-col items-center justify-center gap-1 text-xs text-muted-foreground no-underline"
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
