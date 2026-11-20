import { Suspense } from "react";
import type { Metadata } from "next";
import { AnthimeriaBrowserFeature } from "@/features/anthimeria/anthimeria-browser-feature";

export const metadata: Metadata = {
  title: "The Maximal Template™ · Codependent Coding™",
};

export default function Page({ searchParams }: PageProps<"/maximal">) {
  return (
    <Suspense fallback={<p>Loading architecture…</p>}>
      <AnthimeriaBrowserFeature
        searchParams={searchParams}
        sourceId="maximal"
      />
    </Suspense>
  );
}
