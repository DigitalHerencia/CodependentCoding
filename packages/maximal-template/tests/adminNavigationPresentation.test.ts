/** Existing administration expectations for the current domain API. */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test, vi } from "vitest";
import { AdminNavigation } from "@/components/nav/admin-navigation";
import AdminLoading from "@/app/(admin)/loading";
import AdminError from "@/app/(admin)/error";

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/users/fixture",
}));

test("administration links preserve authorized destinations and the active route", () => {
  const html = renderToStaticMarkup(
    createElement(AdminNavigation, {
      label: "Admin navigation",
      items: [
        { href: "/admin/users", label: "Users" },
        { href: "/admin/records", label: "Records" },
        { href: "/admin/audit", label: "Audit" },
        { href: "/dashboard", label: "Workspace" },
      ],
    }),
  );
  expect(html).toContain('aria-label="Admin navigation"');
  for (const href of [
    "/admin/users",
    "/admin/records",
    "/admin/audit",
    "/dashboard",
  ])
    expect(html).toContain(`href="${href}"`);
  expect(html).toContain('aria-current="page"');
  expect(html).toContain("focus-visible:outline-2");
  expect(html.match(/aria-current="page"/g)).toHaveLength(1);
});

test("the admin fallback announces loading and hides its decorative skeletons", () => {
  const html = renderToStaticMarkup(createElement(AdminLoading));
  expect(html).toContain('role="status"');
  expect(html).toContain('aria-label="Loading admin content"');
  expect(html).toContain('aria-hidden="true"');
});

test("admin recovery forwards Next reset without displaying private errors or 404", () => {
  const reset = vi.fn();
  const element = AdminError({ error: new Error("private fixture"), reset });
  expect(element.props.reset).toBe(reset);
  const html = renderToStaticMarkup(element);
  expect(html).toContain("Try again");
  expect(html).toContain('href="/admin/users"');
  expect(html).not.toContain("private fixture");
  expect(html).not.toContain("404");
});
