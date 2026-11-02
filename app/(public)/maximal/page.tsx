import type { Metadata } from "next";
import { MaximalBrowserFeature } from "@/features/maximal/maximalBrowserFeature";

export const metadata: Metadata = {
  title: "The Maximal Template™ · Codependent Coding™",
};

export default async function Page() {
  "use cache";

  return <MaximalBrowserFeature />;
}
