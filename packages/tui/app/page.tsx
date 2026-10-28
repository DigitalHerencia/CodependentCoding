// Why: the home screen; static for now, so it composes a block directly.
import { WelcomePanel } from "@/components/blocks/welcome-panel";

export function HomePage() {
  return <WelcomePanel workspace="main" />;
}
