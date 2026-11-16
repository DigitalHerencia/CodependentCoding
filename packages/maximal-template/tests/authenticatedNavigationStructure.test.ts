import { readFileSync } from "node:fs";
import { expect, test } from "vitest";

test.each(["tenant", "admin"])(
  "%s shell has no duplicate bottom navigation or obsolete bottom reservation",
  (group) => {
    const source = readFileSync(
      new URL(`../components/shells/${group}-shell.tsx`, import.meta.url),
      "utf8",
    );
    expect(source).not.toMatch(/MobileBottomNav|safe-area-inset-bottom/);
    expect(source).toContain("{children}");
  },
);

test("authenticated responsive navigation uses viewport media queries, not device identification", () => {
  const source = readFileSync(
    new URL(
      "../components/nav/authenticated-mobile-navigation.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  expect(source).not.toMatch(/userAgent|platform|isMobile/);
  expect(source).toContain("lg:hidden");
});
