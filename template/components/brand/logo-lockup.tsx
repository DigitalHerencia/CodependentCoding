import { cn } from "@/lib/utils/cn";
import { applicationProduct } from "@/content/application";

export function LogoLockup({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-sans text-sm leading-snug font-bold tracking-wide text-balance uppercase",
        className,
      )}
    >
      {applicationProduct.name}
    </span>
  );
}
