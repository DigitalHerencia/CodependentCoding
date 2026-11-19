import { beforeEach, describe, expect, it, vi } from "vitest";

const mock = vi.hoisted(() => ({
  activeTransaction: false,
  activeOrganization: "organization-1",
  revoked: false,
  owner: {
    organizationId: "organization-1",
    userId: "user-1",
    membershipId: "membership-1",
  },
  identity: { clerkUserId: "clerk-user-1" },
  permission: vi.fn((_access: unknown, _permission: string) => undefined),
  provider: vi.fn(async (_input: unknown) => ({
    text: "response",
    inputTokens: null,
    outputTokens: null,
    cost: null,
  })),
  limiter: vi.fn(
    async (_key: string, _user: string, _options: unknown) => undefined,
  ),
  captured: vi.fn(
    async (
      _identity: unknown,
      captured: {
        organizationId: string;
        userId: string;
        membershipId: string;
      },
      work: (tx: unknown, access: unknown) => Promise<unknown>,
    ) => {
      mock.activeTransaction = true;
      try {
        return await work({}, captured);
      } finally {
        mock.activeTransaction = false;
      }
    },
  ),
  start: vi.fn(async (_tx: unknown, _input: unknown) => ({
    id: "generation-1",
  })),
  complete: vi.fn(async (_tx: unknown, _input: unknown) => undefined),
  fail: vi.fn(async (_tx: unknown, _input: unknown) => undefined),
  report: vi.fn((_cause: unknown, _context: unknown) => "correlation-1"),
}));
vi.mock("next/navigation", () => ({ unstable_rethrow: vi.fn() }));
vi.mock("@/lib/integrations/clerk/server", () => ({
  requireIdentity: vi.fn(async () => mock.identity),
}));
vi.mock("@/lib/authz/permissions", () => ({
  assertPermission: mock.permission,
}));
vi.mock("@/lib/authz/tenancy", () => ({
  resolveCapturedAccessTx: vi.fn(async () => mock.owner),
}));
vi.mock("@/lib/db/tenancy", () => ({
  withTenantTransaction: vi.fn(
    async (
      _identity: unknown,
      work: (tx: unknown, access: unknown) => Promise<unknown>,
    ) => {
      mock.activeTransaction = true;
      try {
        return await work({}, mock.owner);
      } finally {
        mock.activeTransaction = false;
      }
    },
  ),
  withCapturedTenantTransaction: mock.captured,
}));
vi.mock("@/lib/db/selects/aiTx", () => ({
  startAiGenerationTx: mock.start,
  completeAiGenerationTx: mock.complete,
  failAiGenerationTx: mock.fail,
}));
vi.mock("@/lib/integrations/hugging-face/client", () => ({
  isHuggingFaceConfigured: vi.fn(() => true),
}));
vi.mock("@/lib/integrations/hugging-face/inference", () => ({
  generateHuggingFaceText: mock.provider,
  getConfiguredHuggingFaceModel: vi.fn(() => "server-model"),
}));
vi.mock("@/lib/integrations/upstash/ratelimit", () => ({
  isRateLimitRequested: vi.fn(() => true),
  enforceRateLimit: mock.limiter,
}));
vi.mock("@/lib/utils/reportError", () => ({ reportError: mock.report }));

import { generateAiResponse } from "@/lib/actions/aiActions";

/** Action integration doubles never access a live database, limiter, identity service or provider. */
describe("AI authorized generation orchestration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mock.activeTransaction = false;
    mock.activeOrganization = "organization-1";
    mock.revoked = false;
    mock.permission.mockImplementation(() => undefined);
    mock.provider.mockImplementation(async () => ({
      text: "response",
      inputTokens: null,
      outputTokens: null,
      cost: null,
    }));
    mock.limiter.mockImplementation(async () => undefined);
  });

  it("pins both persistence transitions to the original organization even when inference changes the active organization", async () => {
    mock.provider.mockImplementation(async () => {
      mock.activeOrganization = "organization-2";
      return {
        text: "response",
        inputTokens: null,
        outputTokens: null,
        cost: null,
      };
    });
    const result = await generateAiResponse({ prompt: "hello" });
    expect(result).toEqual({
      ok: true,
      data: {
        generationId: "generation-1",
        text: "response",
        model: "server-model",
      },
    });
    expect(mock.captured).toHaveBeenCalledTimes(2);
    for (const call of mock.captured.mock.calls)
      expect(call[1]).toEqual(mock.owner);
    expect(mock.start).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ ...mock.owner, model: "server-model" }),
    );
    expect(mock.complete).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ ...mock.owner, generationId: "generation-1" }),
    );
  });

  it("rechecks authority before completion and withholds output after permission revocation", async () => {
    mock.permission.mockImplementation((_access, permission) => {
      if (mock.revoked && permission === "ai.generation:update")
        throw Object.assign(new Error("revoked"), { code: "FORBIDDEN" });
    });
    mock.provider.mockImplementation(async () => {
      mock.revoked = true;
      return {
        text: "protected response",
        inputTokens: null,
        outputTokens: null,
        cost: null,
      };
    });
    const result = await generateAiResponse({ prompt: "hello" });
    expect(result).toMatchObject({ ok: false, error: { code: "FORBIDDEN" } });
    expect(JSON.stringify(result)).not.toContain("protected response");
    expect(mock.complete).not.toHaveBeenCalled();
    expect(mock.fail).not.toHaveBeenCalled();
  });

  it("fails closed when an enabled limiter is unavailable before creating records or calling inference", async () => {
    mock.limiter.mockRejectedValue(new Error("limiter unavailable"));
    expect((await generateAiResponse({ prompt: "hello" })).ok).toBe(false);
    expect(mock.start).not.toHaveBeenCalled();
    expect(mock.provider).not.toHaveBeenCalled();
    expect(mock.complete).not.toHaveBeenCalled();
  });

  it("keeps network inference and limiting outside transactions while persistence stays transactional", async () => {
    mock.limiter.mockImplementation(async () => {
      expect(mock.activeTransaction).toBe(false);
    });
    mock.provider.mockImplementation(async () => {
      expect(mock.activeTransaction).toBe(false);
      return {
        text: "response",
        inputTokens: null,
        outputTokens: null,
        cost: null,
      };
    });
    mock.start.mockImplementation(async () => {
      expect(mock.activeTransaction).toBe(true);
      return { id: "generation-1" };
    });
    mock.complete.mockImplementation(async () => {
      expect(mock.activeTransaction).toBe(true);
    });
    expect((await generateAiResponse({ prompt: "hello" })).ok).toBe(true);
    expect(mock.provider).toHaveBeenCalledWith({
      prompt: "hello",
      model: "server-model",
    });
  });

  it("records provider failure for the captured owner without leaking raw diagnostics to the client or reporter", async () => {
    mock.provider.mockRejectedValue(
      new Error("private provider diagnostic and prompt"),
    );
    const result = await generateAiResponse({ prompt: "private prompt" });
    expect(result.ok).toBe(false);
    expect(mock.fail).toHaveBeenCalledWith(expect.anything(), {
      ...mock.owner,
      generationId: "generation-1",
    });
    expect(mock.complete).not.toHaveBeenCalled();
    expect(JSON.stringify(result)).not.toContain("private");
    expect(mock.report).toHaveBeenCalledTimes(1);
    expect(String(mock.report.mock.calls[0]?.[0])).not.toContain("private");
  });

  it("rejects unsupported client model options before entering inference or persistence", async () => {
    const result = await generateAiResponse({
      prompt: "hello",
      model: "client-model",
    });
    expect(result).toMatchObject({ ok: false, error: { code: "VALIDATION" } });
    expect(mock.start).not.toHaveBeenCalled();
    expect(mock.provider).not.toHaveBeenCalled();
  });
});
