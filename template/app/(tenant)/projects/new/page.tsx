// Why: Route only: renders the new-project form; no data to load.
import { ProjectNewForm } from "@/features/projects/project-new-form";

export default async function Page() {
  return <ProjectNewForm />;
}
