import { Suspense } from "react";
import type { Metadata } from "next";
import { MaximalBrowserFeature } from "@/features/maximal/maximalBrowserFeature";

export const metadata: Metadata = {
  title: "The Maximal Template™ · Codependent Coding™",
};

export default function Page({ searchParams }: PageProps<"/maximal">) {
  return (
    <Suspense fallback={<p>Loading source�</p>}>
      <MaximalBrowserFeature searchParams={searchParams} />
    </Suspense>
  );
}
