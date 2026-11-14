import type { Route } from "next";
import { z } from "zod";

/** Reject external, protocol-relative and backslash-based navigation targets. */
export const tenantInternalRouteSchema = z.custom<Route>(
  (value) =>
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.includes("\\") &&
    !/[\r\n\u0000]/.test(value),
  "Expected a local application route.",
);

/** Runtime boundary for the server-assembled navigation DTO. */
export const tenantNavigationSchema = z.strictObject({
  groups: z.array(
    z.strictObject({
      id: z.string().min(1),
      label: z.string().min(1),
      icon: z.enum([
        "brain",
        "briefcase",
        "building",
        "credit-card",
        "folder-kanban",
        "headphones",
        "megaphone",
        "users",
        "settings",
      ]),
      links: z.array(
        z.strictObject({
          label: z.string().min(1),
          href: tenantInternalRouteSchema,
        }),
      ),
    }),
  ),
  mobile: z.array(
    z.strictObject({
      label: z.string().min(1),
      href: tenantInternalRouteSchema,
      icon: z.enum(["home", "settings", "users", "building"]),
    }),
  ),
});
