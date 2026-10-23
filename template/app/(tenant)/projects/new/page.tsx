// Why: Route only: renders the new-project form; no data to load.
import { ProjectNewForm } from "@/features/projects/projectNewForm";

export default async function Page() {
  return <ProjectNewForm />;
}
