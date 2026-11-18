/** Tenancy Provisioning.test contracts for the owning application slice. */
import { beforeEach, expect, test, vi } from "vitest";
import type { Prisma } from "@/generated/prisma/client";
import { provisionWorkspaceAccessTx } from "@/lib/db/selects/authzTx";
import { SINGLE_ORGANIZATION_ID } from "@/lib/authz/mode";
import type * as AuthzMode from "@/lib/authz/mode";
import type { AppRole } from "@/types/authzTypes";
import { syncClerkUserTx } from "@/lib/db/selects/authTx";
import { acceptInvitationTx } from "@/lib/db/transactions/invitationTx";

const mode = vi.hoisted(() => ({ tenancy: "single" }));
vi.mock("@/lib/authz/mode", async (importOriginal) => ({
  ...(await importOriginal<typeof AuthzMode>()),
  get tenancy() {
    return mode.tenancy;
  },
}));

type Membership = {
  id: string;
  userId: string;
  organizationId: string;
  role: string;
  status: string;
};
type Audit = { action: string; metadata?: { role?: string } };
type Invitation = {
  id: string;
  organizationId: string;
  email: string;
  role: AppRole;
  requiresToken: boolean;
  status: "PENDING" | "ACCEPTED";
  expiresAt: Date;
};

/** Models transaction-held advisory locks; real PostgreSQL/RLS execution is still required. */
function database() {
  const memberships: Membership[] = [];
  const audit: Audit[] = [];
  const locks = new Map<string, Promise<void>>();
  const organizations: string[] = [];
  const pendingInvitations: Invitation[] = [];
  const invitations = vi.fn(
    async ({ where }: { where: { email: string; requiresToken: boolean } }) =>
      pendingInvitations.find(
        (row) =>
          row.email === where.email &&
          row.requiresToken === where.requiresToken &&
          row.status === "PENDING" &&
          row.expiresAt > new Date(),
      ) ?? null,
  );
  async function transaction<T>(
    userId: string,
    work: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
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
          const next = new Promise<void>((resolve) => {
            release = resolve;
          });
          locks.set(
            key,
            previous.then(() => next),
          );
          await previous;
          releases.push(release);
        }
        return 1;
      },
      $queryRaw: async () => [],
      user: { upsert: async () => ({ id: userId }) },
      organization: {
        findUnique: async () => ({ id: SINGLE_ORGANIZATION_ID }),
        create: async ({ data }: { data: { id: string } }) => {
          organizations.push(data.id);
        },
      },
      organizationSettings: { create: async () => ({}) },
      membership: {
        findUnique: async ({
          where: { organizationId_userId: key },
        }: {
          where: {
            organizationId_userId: { organizationId: string; userId: string };
          };
        }) =>
          memberships.find(
            (row) =>
              row.userId === key.userId &&
              row.organizationId === key.organizationId,
          ) ?? null,
        findFirst: async ({
          where,
        }: {
          where: {
            userId?: string | { not: string };
            organizationId?: string;
            role?: string;
            status?: string;
          };
        }) =>
          memberships.find(
            (row) =>
              (typeof where.userId === "string"
                ? row.userId === where.userId
                : row.userId !== where.userId?.not) &&
              (!where.organizationId ||
                row.organizationId === where.organizationId) &&
              (!where.role || row.role === where.role) &&
              (!where.status || row.status === where.status),
          ) ?? null,
        create: async ({ data }: { data: Omit<Membership, "id"> }) => {
          const row = { ...data, id: `membership-${memberships.length}` };
          memberships.push(row);
          return { id: row.id };
        },
      },
      invitation: {
        findFirst: invitations,
        updateMany: async ({
          where,
        }: {
          where: {
            id: string;
            organizationId: string;
            role: string;
            status: string;
          };
        }) => {
          const row = pendingInvitations.find(
            (entry) =>
              entry.id === where.id &&
              entry.organizationId === where.organizationId &&
              entry.role === where.role &&
              entry.status === where.status &&
              entry.expiresAt > new Date(),
          );
          if (!row) return { count: 0 };
          row.status = "ACCEPTED";
          return { count: 1 };
        },
      },
      auditEvent: {
        findFirst: async ({ where }: { where: { action?: string } }) =>
          audit.find((row) =>
            where.action
              ? row.action === where.action
              : row.action === "membership.bootstrap_owner" ||
                (row.action === "membership.provisioned" &&
                  row.metadata?.role === "OWNER"),
          ) ?? null,
        create: async ({ data }: { data: Audit }) => {
          audit.push(data);
        },
      },
    } as unknown as Prisma.TransactionClient;
    try {
      return await work(tx);
    } finally {
      for (const release of releases.reverse()) release();
    }
  }
  const provision = (userId: string, email: string | null = null) =>
    transaction(userId, (tx) =>
      provisionWorkspaceAccessTx(tx, { id: userId, displayName: null }, email),
    );
  const sync = (userId: string, email: string, verified: boolean) =>
    transaction(userId, (tx) =>
      syncClerkUserTx(tx, {
        clerkUserId: userId,
        email,
        verifiedEmail: verified ? email : null,
        displayName: null,
        imageUrl: null,
        username: null,
      }),
    );
  const accept = (userId: string, invitation: Invitation) =>
    transaction(userId, (tx) => acceptInvitationTx(tx, invitation, userId));
  return {
    provision,
    sync,
    accept,
    memberships,
    audit,
    organizations,
    invitations,
    pendingInvitations,
  };
}

beforeEach(() => {
  mode.tenancy = "single";
});

test("concurrent signups allocate exactly one owner and one customer without profiles", async () => {
  const db = database();
  await Promise.all([db.provision("user_a"), db.provision("user_b")]);
  expect(db.memberships.map((row) => row.role).sort()).toEqual([
    "OWNER",
    "VIEWER",
  ]);
  expect(
    db.audit.filter((row) => row.action === "tenancy.initial_owner_allocated"),
  ).toHaveLength(1);
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

test.each(["SUSPENDED", "REVOKED"])(
  "%s ownership is neither reactivated nor reassigned",
  async (status) => {
    const db = database();
    await db.provision("user_first");
    db.memberships[0]!.status = status;
    expect(await db.provision("user_first")).toBe(false);
    await db.provision("user_later");
    expect(db.memberships.map((row) => [row.role, row.status])).toEqual([
      ["OWNER", status],
      ["VIEWER", "ACTIVE"],
    ]);
  },
);

test("seeded example owner does not consume the live allocation", async () => {
  const db = database();
  db.memberships.push({
    id: "seed",
    userId: "user_seed_owner",
    organizationId: SINGLE_ORGANIZATION_ID,
    role: "OWNER",
    status: "ACTIVE",
  });
  await db.provision("user_seed_owner");
  expect(db.audit).toHaveLength(0);
  await db.provision("user_real");
  expect(db.memberships.find((row) => row.userId === "user_real")?.role).toBe(
    "OWNER",
  );
});

test("a deleted legacy owner with provisioning evidence prevents a replacement owner", async () => {
  const db = database();
  db.audit.push({
    action: "membership.provisioned",
    metadata: { role: "OWNER" },
  });
  await db.provision("user_later");
  expect(db.memberships[0]?.role).toBe("VIEWER");
});

test("multi tenancy provisions one owned organization per unaffiliated signup", async () => {
  mode.tenancy = "multi";
  const db = database();
  await Promise.all([
    db.provision("user_a", "a@example.test"),
    db.provision("user_a", "a@example.test"),
    db.provision("user_b", "b@example.test"),
  ]);
  expect(db.organizations).toHaveLength(2);
  expect(new Set(db.memberships.map((row) => row.organizationId)).size).toBe(2);
  expect(db.memberships.every((row) => row.role === "OWNER")).toBe(true);
});

test("multi tenancy cannot bypass revoked membership through a new workspace", async () => {
  mode.tenancy = "multi";
  const db = database();
  db.memberships.push({
    id: "revoked",
    userId: "user_a",
    organizationId: "old",
    role: "OWNER",
    status: "REVOKED",
  });
  expect(await db.provision("user_a", "a@example.test")).toBe(false);
  expect(db.organizations).toHaveLength(0);
});

function approval(requiresToken = false): Invitation {
  return {
    id: "invite-b",
    organizationId: "org-b",
    email: "invitee@example.test",
    role: "ADMIN",
    requiresToken,
    status: "PENDING",
    expiresAt: new Date(Date.now() + 60_000),
  };
}

test("an active member of A accepts verified approval to B without changing A or its role", async () => {
  mode.tenancy = "multi";
  const db = database();
  const original = {
    id: "member-a",
    userId: "invitee",
    organizationId: "org-a",
    role: "MEMBER",
    status: "ACTIVE",
  };
  db.memberships.push({ ...original });
  db.pendingInvitations.push(approval());
  await db.provision("invitee", "different@example.test");
  expect(db.memberships).toEqual([original]);
  await db.provision("invitee", "invitee@example.test");
  await db.provision("invitee", "invitee@example.test");
  expect(db.memberships).toHaveLength(2);
  expect(db.memberships[0]).toEqual(original);
  expect(db.memberships[1]).toMatchObject({
    organizationId: "org-b",
    role: "ADMIN",
    status: "ACTIVE",
  });
  expect(db.organizations).toHaveLength(0);
});

test.each(["SUSPENDED", "REVOKED"])(
  "approval cannot reactivate %s membership in B while A stays active",
  async (status) => {
    mode.tenancy = "multi";
    const db = database();
    db.memberships.push(
      {
        id: "member-a",
        userId: "invitee",
        organizationId: "org-a",
        role: "MEMBER",
        status: "ACTIVE",
      },
      {
        id: "member-b",
        userId: "invitee",
        organizationId: "org-b",
        role: "VIEWER",
        status,
      },
    );
    const original = db.memberships.map((row) => ({ ...row }));
    db.pendingInvitations.push(approval());
    await expect(
      db.provision("invitee", "invitee@example.test"),
    ).rejects.toThrow(/Invitation/);
    expect(db.memberships).toEqual(original);
    expect(db.organizations).toHaveLength(0);
  },
);

test("approvals preserve an existing active role in their target organization", async () => {
  mode.tenancy = "multi";
  const db = database();
  const target = {
    id: "member-b",
    userId: "invitee",
    organizationId: "org-b",
    role: "VIEWER",
    status: "ACTIVE",
  };
  db.memberships.push({ ...target });
  db.pendingInvitations.push(approval());
  await db.provision("invitee", "invitee@example.test");
  expect(db.memberships).toEqual([target]);
  expect(db.pendingInvitations[0]?.status).toBe("ACCEPTED");
  expect(db.organizations).toHaveLength(0);
});

test("repeated unverified events defer ownership; verification joins the approved organization once", async () => {
  mode.tenancy = "multi";
  const db = database();
  db.pendingInvitations.push(approval());
  await db.sync("invitee", "invitee@example.test", false);
  await db.sync("invitee", "invitee@example.test", false);
  expect(db.memberships).toHaveLength(0);
  expect(db.organizations).toHaveLength(0);
  await db.sync("invitee", "invitee@example.test", true);
  await db.sync("invitee", "invitee@example.test", true);
  // A delayed unverified delivery cannot create a second tenant either.
  await db.sync("invitee", "invitee@example.test", false);
  expect(db.memberships).toHaveLength(1);
  expect(db.memberships[0]).toMatchObject({
    organizationId: "org-b",
    role: "ADMIN",
  });
  expect(db.organizations).toHaveLength(0);
});

test("verified invitee waits for a token and joins with its assigned role without owning another tenant", async () => {
  mode.tenancy = "multi";
  const db = database();
  const invitation = approval(true);
  invitation.role = "VIEWER";
  db.pendingInvitations.push(invitation);
  await db.sync("invitee", invitation.email, false);
  await db.sync("invitee", invitation.email, true);
  expect(db.memberships).toHaveLength(0);
  expect(db.organizations).toHaveLength(0);
  await db.accept("invitee", invitation);
  await db.sync("invitee", invitation.email, true);
  expect(db.memberships).toHaveLength(1);
  expect(db.memberships[0]).toMatchObject({
    organizationId: "org-b",
    role: "VIEWER",
  });
  expect(db.organizations).toHaveLength(0);
});

test("unaffiliated signup owns one new tenant only after verification despite repeated events", async () => {
  mode.tenancy = "multi";
  const db = database();
  await db.sync("new-user", "new@example.test", false);
  expect(db.organizations).toHaveLength(0);
  await db.sync("new-user", "new@example.test", true);
  await db.sync("new-user", "new@example.test", true);
  expect(db.organizations).toHaveLength(1);
  expect(db.memberships).toHaveLength(1);
  expect(db.memberships[0]?.role).toBe("OWNER");
});

test("single tenancy retains one-time allocation by first provisioning, not signup timestamps", async () => {
  const db = database();
  await db.sync("first-processed", "first@example.test", false);
  await db.sync("processed-later", "later@example.test", true);
  await db.sync("first-processed", "first@example.test", true);
  expect(db.memberships.map(({ userId, role }) => ({ userId, role }))).toEqual([
    { userId: "first-processed", role: "OWNER" },
    { userId: "processed-later", role: "VIEWER" },
  ]);
  expect(
    db.audit.filter((row) => row.action === "tenancy.initial_owner_allocated"),
  ).toHaveLength(1);
});
