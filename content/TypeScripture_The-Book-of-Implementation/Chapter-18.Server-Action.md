# Chapter 18: Server Action

**The Book of Implementation™**

## Placement

- `lib/actions/<domain>/<imperative>.action.ts`

## Canonical skeleton

```ts
"use server";

export async function archiveProjectAction(input: unknown): Promise<ActionResult<ProjectDto>> {
  const parsed = archiveProjectSchema.safeParse(input);
  if (!parsed.success) return validationError(parsed.error);

  const actor = await requireActor();
  try {
    const result = await archiveProjectWorkflow(actor, parsed.data);
    applyInvalidation(result.invalidate);
    return { ok: true, data: result.data };
  } catch (error) {
    return toActionResult(error);
  }
}
```

## Rules

- Do not catch a framework redirect inside a broad error mapper.
- Never trust client-provided user/role/price/customer/account/return-URL authority.
- Test result mapping and success-only invalidation by mocking the Workflow, not Prisma.
