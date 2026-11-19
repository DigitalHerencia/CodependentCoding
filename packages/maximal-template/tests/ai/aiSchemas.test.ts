import { describe, expect, it } from "vitest";
import {
  aiGenerationRequestSchema,
  aiInferenceResultSchema,
  aiPageQuerySchema,
} from "@/schemas/aiSchemas";

/** Regression contracts for all untrusted client and provider values entering AI persistence. */
describe("AI runtime validation", () => {
  it("trims valid prompts and accepts the documented maximum without altering their contents", () => {
    expect(aiGenerationRequestSchema.parse({ prompt: "  hello  " })).toEqual({
      prompt: "hello",
    });
    expect(
      aiGenerationRequestSchema.parse({ prompt: "x".repeat(100_000) }).prompt,
    ).toHaveLength(100_000);
  });

  it.each(["", " \n\t ", "x".repeat(100_001)])(
    "rejects empty and oversized prompts",
    (prompt) => {
      expect(aiGenerationRequestSchema.safeParse({ prompt }).success).toBe(
        false,
      );
    },
  );

  it.each([
    "model",
    "provider",
    "organizationId",
    "userId",
    "temperature",
    "maxTokens",
  ])("rejects a client override of %s", (option) => {
    expect(
      aiGenerationRequestSchema.safeParse({
        prompt: "hello",
        [option]: "untrusted",
      }).success,
    ).toBe(false);
  });

  it("bounds pagination offsets and rejects malformed page values", () => {
    expect(aiPageQuerySchema.parse({})).toEqual({ page: 1 });
    expect(aiPageQuerySchema.parse({ page: "2" })).toEqual({ page: 2 });
    for (const page of [0, -1, 1.5, 1001, "invalid", ["1", "2"]]) {
      expect(aiPageQuerySchema.safeParse({ page }).success).toBe(false);
    }
  });

  it("preserves absent provider measurements instead of inventing measured zero", () => {
    expect(
      aiInferenceResultSchema.parse({
        text: "response",
        inputTokens: null,
        outputTokens: null,
        cost: null,
      }),
    ).toEqual({
      text: "response",
      inputTokens: null,
      outputTokens: null,
      cost: null,
    });
    expect(
      aiInferenceResultSchema.parse({
        text: "response",
        inputTokens: 0,
        outputTokens: 0,
        cost: "0.00000000",
      }).cost,
    ).toBe("0.00000000");
  });

  it("rejects unsafe measurements and output before persistence", () => {
    const valid = {
      text: "response",
      inputTokens: null,
      outputTokens: null,
      cost: null,
    };
    for (const patch of [
      { text: "" },
      { text: "x".repeat(100_001) },
      { inputTokens: -1 },
      { inputTokens: 1.5 },
      { outputTokens: 2_147_483_648 },
      { cost: "-0.01" },
      { cost: "0.000000001" },
      { cost: "1e3" },
      { cost: "123456789012.00" },
    ]) {
      expect(
        aiInferenceResultSchema.safeParse({ ...valid, ...patch }).success,
      ).toBe(false);
    }
  });
});
