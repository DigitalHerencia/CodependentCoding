import type { Metadata } from "next";
import { MaximalBrowserFeature } from "@/features/maximal/maximalBrowserFeature";

export const metadata: Metadata = {
  title: "The Maximal Template™ · Codependent Coding™",
};

export default function Page() {
  return <MaximalBrowserFeature />;
}
