import type { Route } from "next";

/** Administration destinations remain protected by the server-side admin gate. */
export const adminNavigationItems = [
  { href: "/admin/users", label: "Users" },
  { href: "/admin/records", label: "Records" },
  { href: "/admin/audit", label: "Audit" },
  { href: "/dashboard", label: "Workspace" },
] as const satisfies readonly { href: Route; label: string }[];

export const adminNavigationCopy = {
  navigation: "Admin navigation",
  skipToContent: "Skip to admin content",
  loadingLayout: "Loading administration",
  loadingContent: "Loading admin content",
  errorTitle: "Something went wrong",
  errorDescription:
    "Administration could not be loaded. Try again or return to admin.",
  tryAgain: "Try again",
  returnToAdmin: "Return to admin",
} as const;
