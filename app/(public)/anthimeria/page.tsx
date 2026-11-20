import { Suspense } from "react";
import type { Metadata } from "next";
import { MaximalBrowserFeature } from "@/features/maximal/maximal-browser-feature";

export const metadata: Metadata = {
  title: "The Anthimeria™ · Codependent Coding™",
};

export default function Page({ searchParams }: PageProps<"/anthimeria">) {
  return (
    <Suspense fallback={<p>Loading source…</p>}>
      <MaximalBrowserFeature searchParams={searchParams} />
    </Suspense>
  );
}
