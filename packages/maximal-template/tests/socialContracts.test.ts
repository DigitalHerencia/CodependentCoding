import { describe, expect, it } from "vitest";
import {
  createSocialPostSchema,
  scheduleSocialPostFormSchema,
  scheduleSocialPostSchema,
} from "@/schemas/socialSchemas";

const postId = "00000000-0000-4000-8000-000000000081";
const accountId = "00000000-0000-4000-8000-00000000008a";
const secondAccountId = "00000000-0000-4000-8000-00000000008b";

describe("social command contracts", () => {
  it("rejects repeated account references before persistence and keeps distinct variants", () => {
    const content = "Parent content";
    const variants = [
      { socialAccountId: accountId, content: "First target" },
      { socialAccountId: secondAccountId, content: "Second target" },
    ];
    expect(
      createSocialPostSchema.parse({ content, variants }).variants,
    ).toEqual(variants);
    expect(
      createSocialPostSchema.safeParse({
        content,
        variants: [
          variants[0],
          { ...variants[1], socialAccountId: accountId.toUpperCase() },
        ],
      }).success,
    ).toBe(false);
  });

  it("normalizes the UTC form while the command requires an explicit instant", () => {
    const input = {
      postId,
      expectedVersion: 2,
      scheduledAt: "2090-11-03T01:30",
    };
    expect(
      scheduleSocialPostFormSchema.parse(input).scheduledAt.toISOString(),
    ).toBe("2090-11-03T01:30:00.000Z");
    expect(scheduleSocialPostSchema.safeParse(input).success).toBe(false);
    expect(
      scheduleSocialPostSchema.safeParse({ ...input, scheduledAt: new Date() })
        .success,
    ).toBe(false);
  });
});
