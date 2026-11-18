import { afterEach, expect, test, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useAuthAccountWorkflow as usePwaAccountMenuWorkflow } from "@/lib/workflows/authWorkflows";

const clerk = vi.hoisted(() => ({
  openUserProfile: vi.fn(),
  signOut: vi.fn(async () => {}),
}));
vi.mock("@clerk/nextjs", () => ({ useClerk: () => clerk }));

afterEach(() => vi.unstubAllGlobals());

function captureMenu() {
  let result: ReturnType<typeof usePwaAccountMenuWorkflow> | undefined;
  function AccountProbe() {
    result = usePwaAccountMenuWorkflow();
    return null;
  }
  renderToStaticMarkup(createElement(AccountProbe));
  if (!result) throw new Error("The account workflow must render.");
  return result;
}

test("the direct Clerk adapter retains account management and purges caches before sign-out", async () => {
  const purge = vi.fn(async () => true);
  vi.stubGlobal("navigator", {
    serviceWorker: { getRegistration: async () => undefined },
  });
  const caches = { keys: async () => ["fixture-shell"], delete: purge };
  vi.stubGlobal("window", { caches });
  vi.stubGlobal("caches", caches);
  const menu = captureMenu();
  menu.onManageAccount();
  expect(clerk.openUserProfile).toHaveBeenCalledOnce();
  await menu.onSignOut();
  expect(purge).toHaveBeenCalledWith("fixture-shell");
  expect(clerk.signOut).toHaveBeenCalledWith({ redirectUrl: "/sign-in" });
  expect(purge.mock.invocationCallOrder[0]).toBeLessThan(
    clerk.signOut.mock.invocationCallOrder[0]!,
  );
});

test("a cache-purge failure still prevents sign-out", async () => {
  vi.stubGlobal("navigator", {
    serviceWorker: { getRegistration: async () => undefined },
  });
  const caches = {
    keys: async () => {
      throw new Error("fixture purge failure");
    },
  };
  vi.stubGlobal("window", { caches });
  vi.stubGlobal("caches", caches);
  await expect(captureMenu().onSignOut()).rejects.toThrow(
    "fixture purge failure",
  );
  expect(clerk.signOut).not.toHaveBeenCalled();
});
