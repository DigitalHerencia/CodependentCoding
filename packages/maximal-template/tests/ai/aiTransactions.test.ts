import { Prisma } from "@/generated/prisma/client";
import {
  completeAiGenerationTx,
  failAiGenerationTx,
  startAiGenerationTx,
} from "@/lib/db/selects/aiTx";
import {
  ConcurrencyConflictError,
  ResourceNotFoundError,
} from "@/lib/db/transactions/errors";
import { beforeEach, describe, expect, it, vi } from "vitest";

const owner = { organizationId: "organization-1", userId: "user-1" };
const input = {
  ...owner,
  generationId: "generation-1",
  text: "response",
  inputTokens: null,
  outputTokens: null,
  cost: null,
};

/** Narrow transactional double checks compare-and-set behavior; database rollback is not simulated. */
function transaction() {
  const generation = {
    id: input.generationId,
    model: "server-model",
    provider: "hugging-face",
    status: "SUCCEEDED",
  };
  const tx = {
    aiGeneration: {
      create: vi.fn(async (_args: unknown) => ({ id: input.generationId })),
      updateMany: vi.fn(async (_args: unknown) => ({ count: 1 })),
      findFirst: vi.fn(
        async (_args: unknown): Promise<typeof generation | null> => generation,
      ),
    },
    aiUsageLedger: {
      create: vi.fn(async (_args: unknown) => ({ id: "usage-1" })),
    },
    auditEvent: {
      create: vi.fn(async (_args: unknown) => ({ id: "audit-1" })),
    },
  };
  return { tx, client: tx as unknown as Prisma.TransactionClient, generation };
}

describe("AI transactional lifecycle", () => {
  beforeEach(() => vi.clearAllMocks());

  it("starts in RUNNING with the captured owner and no invented provider measurements", async () => {
    const { tx, client } = transaction();
    await startAiGenerationTx(client, {
      ...owner,
      model: "server-model",
      provider: "hugging-face",
      prompt: "private prompt",
    });
    expect(tx.aiGeneration.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          ...owner,
          status: "RUNNING",
          input: { prompt: "private prompt" },
          inputTokens: null,
          outputTokens: null,
          cost: null,
        }),
      }),
    );
    expect(tx.aiUsageLedger.create).not.toHaveBeenCalled();
    expect(JSON.stringify(tx.auditEvent.create.mock.calls)).not.toContain(
      "private prompt",
    );
  });

  it("completes only the captured owner's RUNNING request and appends exact measurements", async () => {
    const { tx, client } = transaction();
    await completeAiGenerationTx(client, {
      ...input,
      cost: "99999999999.12345678",
    });
    expect(tx.aiGeneration.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: input.generationId, ...owner, status: "RUNNING" },
        data: expect.objectContaining({
          status: "SUCCEEDED",
          output: { text: "response" },
        }),
      }),
    );
    expect(tx.aiGeneration.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: input.generationId, ...owner } }),
    );
    expect(tx.aiUsageLedger.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        ...owner,
        generationId: input.generationId,
        inputTokens: null,
        outputTokens: null,
        cost: new Prisma.Decimal("99999999999.12345678"),
      }),
    });
  });

  it("treats a second completion as idempotent and never appends another usage or audit entry", async () => {
    const { tx, client, generation } = transaction();
    tx.aiGeneration.updateMany
      .mockResolvedValueOnce({ count: 1 })
      .mockResolvedValueOnce({ count: 0 });
    await completeAiGenerationTx(client, input);
    expect(
      await completeAiGenerationTx(client, {
        ...input,
        text: "replacement response",
      }),
    ).toEqual(generation);
    expect(tx.aiUsageLedger.create).toHaveBeenCalledTimes(1);
    expect(tx.auditEvent.create).toHaveBeenCalledTimes(1);
  });

  it("does not overwrite a failure that wins the completion race", async () => {
    const { tx, client, generation } = transaction();
    tx.aiGeneration.updateMany.mockResolvedValue({ count: 0 });
    tx.aiGeneration.findFirst.mockResolvedValue({
      ...generation,
      status: "FAILED",
    });
    await expect(completeAiGenerationTx(client, input)).rejects.toBeInstanceOf(
      ConcurrencyConflictError,
    );
    expect(tx.aiUsageLedger.create).not.toHaveBeenCalled();
    expect(tx.auditEvent.create).not.toHaveBeenCalled();
  });

  it("rejects a record that cannot be found under both captured owner identifiers", async () => {
    const { tx, client } = transaction();
    tx.aiGeneration.updateMany.mockResolvedValue({ count: 0 });
    tx.aiGeneration.findFirst.mockResolvedValue(null);
    await expect(completeAiGenerationTx(client, input)).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
    expect(tx.aiUsageLedger.create).not.toHaveBeenCalled();
  });

  it("propagates ledger failure to the caller's transaction rather than reporting a successful completion", async () => {
    const { tx, client } = transaction();
    tx.aiUsageLedger.create.mockRejectedValue(new Error("ledger unavailable"));
    await expect(completeAiGenerationTx(client, input)).rejects.toThrow(
      "ledger unavailable",
    );
    expect(tx.auditEvent.create).not.toHaveBeenCalled();
  });

  it("cannot mark a succeeded generation failed or append duplicate failure audit records", async () => {
    const { tx, client } = transaction();
    tx.aiGeneration.updateMany.mockResolvedValue({ count: 0 });
    await failAiGenerationTx(client, input);
    expect(tx.aiGeneration.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: input.generationId, ...owner, status: "RUNNING" },
      }),
    );
    expect(tx.auditEvent.create).not.toHaveBeenCalled();
    expect(tx.aiUsageLedger.create).not.toHaveBeenCalled();
  });
});
