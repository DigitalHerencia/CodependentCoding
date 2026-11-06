import { loadComposerWorkflow } from "@/lib/workflows/socialWorkflows";
import { NewSocialPostForm } from "./newSocialPostForm";

export async function ComposerFeature() {
  const { accounts } = await loadComposerWorkflow();
  return <NewSocialPostForm accounts={accounts} />;
}
