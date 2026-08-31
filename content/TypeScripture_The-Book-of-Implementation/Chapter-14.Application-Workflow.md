# Chapter 14: Application Workflow

**The Book of Implementation™**

## Canonical sequence

```text
Actor + validated command
  → load current facts
  → authorize resource/transition
  → assert invariants/readiness
  → atomic local preparation
  → provider call outside DB transaction (if any)
  → atomic local completion/outbox
  → DTO + logical invalidation plan
```

## Skeleton

```ts
export async function archiveProjectWorkflow(
  actor: Actor,
  command: ArchiveProjectCommand,
): Promise<WorkflowResult<ProjectDto>> {
  const scope = await requireProjectMutationScope(actor, command.organizationId);
  const current = await getProjectForMutation(scope, command.projectId);
  requireProjectArchiveAuthorization(scope, current);
  const record = await withTenantTransaction(scope, (tx) =>
    archiveProjectTx(tx, { projectId: current.id, expectedVersion: current.version }),
  );
  return { data: toProjectDto(record), invalidate: [`project:${record.id}`] };
}
```

## Rule

- A Workflow may use narrowly scoped private DB helpers when needed, but those helpers remain implementation details inside the approved data boundary rather than a new Query/Command layer.
