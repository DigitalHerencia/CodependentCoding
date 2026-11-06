import { NewProjectForm } from "@/features/projects/newProjectForm";

// Why: Route only: renders the new-project form; no data to load.

export default async function Page() {
  return <NewProjectForm />;
}
