"use client";
import { Menu, X } from "lucide-react";
import type { Ref } from "react";
import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
export function TenantHeader({
  sidebar,
  mobileOpen,
  setMobileOpen,
  menuButtonRef,
}: {
  sidebar: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  menuButtonRef: Ref<HTMLButtonElement>;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex min-h-16 items-center justify-between gap-2 border-b bg-background px-4 py-3",
        sidebar && "md:hidden",
      )}
    >
      <Wordmark compact />
      <Button
        ref={menuButtonRef}
        variant="ghost"
        size="icon"
        aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={mobileOpen}
        aria-controls="mobile-navigation"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X /> : <Menu />}
      </Button>
    </header>
  );
}
