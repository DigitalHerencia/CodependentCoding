import { loadComposerWorkflow } from "@/lib/workflows/socialWorkflows";
import { SocialNewPostForm } from "./socialNewPostForm";

/** Load account references and delegate composition to the RHF form. */
export async function SocialComposeFeature() {
  const initialPage = await loadComposerWorkflow();
  return <SocialNewPostForm initialPage={initialPage} />;
}
