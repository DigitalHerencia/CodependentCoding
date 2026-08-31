import { ProjectFeature } from "@/features/projects/projectFeature";

// URL ownership stops here; orchestration is delegated to the feature.
export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <ProjectFeature projectId={projectId} />;
}
