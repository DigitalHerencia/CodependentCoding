import { type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type AuthFormPanelProps = {
  children: ReactNode;
  title: string;
  description: string;
};

export function AuthFormPanel({
  children,
  title,
  description,
}: AuthFormPanelProps) {
  return (
    <div className="w-full space-y-6 bg-transparent text-left">
      <div className="space-y-2">
        <h2 className="type-title uppercase">{title}</h2>
        <p className="max-w-prose type-body">{description}</p>
      </div>
      {children}
    </div>
  );
}

export type AuthSplitLayoutProps = {
  children: ReactNode;
  brandContent?: ReactNode;
  brandBackground?: string;
  position?: "left" | "right";
  className?: string;
};

export function AuthSplitLayout({
  children,
  brandContent,
  brandBackground = "bg-primary",
  position = "left",
  className,
}: AuthSplitLayoutProps) {
  return (
    <div className={cn("flex min-h-screen", className)}>
      {position === "left" && brandContent && (
        <div
          className={cn(
            "hidden flex-col justify-center p-12 lg:flex lg:w-1/2",
            brandBackground,
          )}
        >
          {brandContent}
        </div>
      )}

      <div className="flex flex-1 items-center justify-center p-4 md:p-8">
        {children}
      </div>

      {position === "right" && brandContent && (
        <div
          className={cn(
            "hidden flex-col justify-center p-12 lg:flex lg:w-1/2",
            brandBackground,
          )}
        >
          {brandContent}
        </div>
      )}
    </div>
  );
}
