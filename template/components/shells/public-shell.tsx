import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
type PublicShellProps = { children: ReactNode; className?: string };
export function PublicShell({ children, className }: PublicShellProps) {
  return (
    <div
      className={cn(
        "flex min-h-dvh flex-col bg-background pb-14 text-foreground md:pb-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
