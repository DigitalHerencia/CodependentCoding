import { beforeEach, expect, test, vi } from "vitest";
import type { Prisma } from "@/generated/prisma/client";
import { provisionWorkspaceAccessTx } from "@/lib/db/transactions/onboardingTx";
import { SINGLE_ORGANIZATION_ID } from "@/lib/authz/mode";

const mode = vi.hoisted(() => ({ tenancy: "single" }));
vi.mock("@/lib/authz/mode", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/authz/mode")>()),
  get tenancy() { return mode.tenancy; },
}));

type Membership = { id: string; userId: string; organizationId: string; role: string; status: string };
type Audit = { action: string; metadata?: { role?: string } };

/** Models transaction-held advisory locks; real PostgreSQL/RLS execution is still required. */
function database() {
  const memberships: Membership[] = [];
  const audit: Audit[] = [];
  const locks = new Map<string, Promise<void>>();
  const organizations: string[] = [];
  const invitations = vi.fn(async () => null);
  async function provision(userId: string) {
    const releases: Array<() => void> = [];
    const held = new Set<string>();
    const tx = {
      $executeRaw: async (sql: TemplateStringsArray, ...values: unknown[]) => {
        if (!sql.join("").includes("pg_advisory_xact_lock")) return 1;
        const key = String(values[0] ?? "single-tenancy:initial-owner");
        if (!held.has(key)) {
          held.add(key);
          const previous = locks.get(key) ?? Promise.resolve();
          let release = () => {};
          const next = new Promise<void>((resolve) => { release = resolve; });
          locks.set(key, previous.then(() => next));
          await previous;
          releases.push(release);
        }
        return 1;
      },
      $queryRaw: async () => [],
      organization: {
        findUnique: async () => ({ id: SINGLE_ORGANIZATION_ID }),
        create: async ({ data }: { data: { id: string } }) => { organizations.push(data.id); },
      },
      organizationSettings: { create: async () => ({}) },
      membership: {
        findUnique: async () => memberships.find((row) => row.userId === userId && row.organizationId === SINGLE_ORGANIZATION_ID) ?? null,
        findFirst: async ({ where }: { where: { userId?: string | { not: string }; role?: string; status?: string } }) => memberships.find((row) =>
          (typeof where.userId === "string" ? row.userId === where.userId : row.userId !== where.userId?.not) &&
          (!where.role || row.role === where.role) && (!where.status || row.status === where.status)) ?? null,
        create: async ({ data }: { data: Omit<Membership, "id"> }) => {
          const row = { ...data, id: `membership-${memberships.length}` };
          memberships.push(row);
          return { id: row.id };
        },
      },
      invitation: { findFirst: invitations },
      auditEvent: {
        findFirst: async ({ where }: { where: { action?: string } }) => audit.find((row) => where.action ? row.action === where.action : row.action === "membership.bootstrap_owner" || (row.action === "membership.provisioned" && row.metadata?.role === "OWNER")) ?? null,
        create: async ({ data }: { data: Audit }) => { audit.push(data); },
      },
    } as unknown as Prisma.TransactionClient;
    try {
      return await provisionWorkspaceAccessTx(tx, { id: userId, displayName: null }, null);
    } finally {
      for (const release of releases.reverse()) release();
    }
  }
  return { provision, memberships, audit, organizations, invitations };
}

beforeEach(() => { mode.tenancy = "single"; });

test("concurrent signups allocate exactly one owner and one customer without profiles", async () => {
  const db = database();
  await Promise.all([db.provision("user_a"), db.provision("user_b")]);
  expect(db.memberships.map((row) => row.role).sort()).toEqual(["OWNER", "VIEWER"]);
  expect(db.audit.filter((row) => row.action === "tenancy.initial_owner_allocated")).toHaveLength(1);
  expect(db.invitations).not.toHaveBeenCalled();
});

test("owner deletion never reallocates the initial owner and repeat signup is idempotent", async () => {
  const db = database();
  await db.provision("user_first");
  db.memberships.length = 0;
  await db.provision("user_later");
  await db.provision("user_later");
  expect(db.memberships).toHaveLength(1);
  expect(db.memberships[0]?.role).toBe("VIEWER");
});

test.each(["SUSPENDED", "REVOKED"])("%s ownership is neither reactivated nor reassigned", async (status) => {
  const db = database();
  await db.provision("user_first");
  db.memberships[0]!.status = status;
  expect(await db.provision("user_first")).toBe(false);
  await db.provision("user_later");
  expect(db.memberships.map((row) => [row.role, row.status])).toEqual([["OWNER", status], ["VIEWER", "ACTIVE"]]);
});

test("seeded example owner does not consume the live allocation", async () => {
  const db = database();
  db.memberships.push({ id: "seed", userId: "user_seed_owner", organizationId: SINGLE_ORGANIZATION_ID, role: "OWNER", status: "ACTIVE" });
  await db.provision("user_seed_owner");
  expect(db.audit).toHaveLength(0);
  await db.provision("user_real");
  expect(db.memberships.find((row) => row.userId === "user_real")?.role).toBe("OWNER");
});

test("a deleted legacy owner with provisioning evidence prevents a replacement owner", async () => {
  const db = database();
  db.audit.push({ action: "membership.provisioned", metadata: { role: "OWNER" } });
  await db.provision("user_later");
  expect(db.memberships[0]?.role).toBe("VIEWER");
});

test("multi tenancy provisions one owned organization per unaffiliated signup", async () => {
  mode.tenancy = "multi";
  const db = database();
  await Promise.all([db.provision("user_a"), db.provision("user_a"), db.provision("user_b")]);
  expect(db.organizations).toHaveLength(2);
  expect(new Set(db.memberships.map((row) => row.organizationId)).size).toBe(2);
  expect(db.memberships.every((row) => row.role === "OWNER")).toBe(true);
});

test("multi tenancy cannot bypass revoked membership through a new workspace", async () => {
  mode.tenancy = "multi";
  const db = database();
  db.memberships.push({ id: "revoked", userId: "user_a", organizationId: "old", role: "OWNER", status: "REVOKED" });
  expect(await db.provision("user_a")).toBe(false);
  expect(db.organizations).toHaveLength(0);
});
