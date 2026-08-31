# Chapter 24: Route and Feature Orchestration

**The Book of Implementation™**

## Canonical structure

```text
app/projects/[projectId]/page.tsx
features/projects/project-detail.feature.tsx
components/blocks/projects/project-detail.block.tsx
components/ui/...
lib/fetchers/projects/get-project-detail.fetcher.ts
lib/actions/projects/archive-project.action.ts
```

## Page

```tsx
export default async function ProjectPage({ params }: PageProps) {
  const { projectId } = await params;
  return (
    <Suspense fallback={<ProjectDetailSkeleton />}>
      <ProjectDetailFeature projectId={projectId} />
    </Suspense>
  );
}
```

## Feature

```tsx
export async function ProjectDetailFeature({ projectId }: { projectId: string }) {
  const project = await getProjectDetail({ projectId });
  if (!project) notFound();
  return <ProjectDetailBlock project={project} archiveAction={archiveProjectAction} />;
}
```

## Block

```tsx
export function ProjectDetailBlock({ project, archiveAction }: Props) {
  return (
    <section>
      <h1>{project.name}</h1>
      <ArchiveProjectForm projectId={project.id} action={archiveAction} />
    </section>
  );
}
```

## Correction

- The older route/feature pattern that requires `*.loader.ts`, resolution unions, and page-level Fetcher orchestration is superseded by this simpler ownership model. Complexity may justify helpers, but helpers do not redefine the architecture.
