import { ProjectEditFeature } from "@/features/projects/projectEditFeature";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <ProjectEditFeature projectId={projectId} />;
}
