// Why: Route only: renders the new-{{entity}} form; no data to load.
import { {{Entity}}NewForm } from "@/features/{{module}}/{{entity}}NewForm";

export default async function Page() {
  return <{{Entity}}NewForm />;
}
