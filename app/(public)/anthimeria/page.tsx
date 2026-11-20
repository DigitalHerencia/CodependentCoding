import { Suspense } from "react";
import type { Metadata } from "next";
import { AnthimeriaBrowserFeature } from "@/features/anthimeria/anthimeria-browser-feature";

export const metadata: Metadata = {
  title: "The Anthimeria™ · Codependent Coding™",
};

export default function Page({ searchParams }: PageProps<"/anthimeria">) {
  return (
    <Suspense fallback={<p>Loading source…</p>}>
      <AnthimeriaBrowserFeature searchParams={searchParams} />
    </Suspense>
  );
}
