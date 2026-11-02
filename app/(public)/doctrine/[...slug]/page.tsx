import type { Metadata } from "next";
import {
  DoctrineDocsFeature,
  doctrineDocsStaticParams,
} from "@/features/doctrine/doctrineDocsFeature";

export const generateStaticParams = doctrineDocsStaticParams;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const image = {
    url: `/og/${slug.map(encodeURIComponent).join("/")}`,
    width: 1200,
    height: 630,
    alt: "Codependent Coding doctrine chapter",
  };
  return {
    title: "Doctrine · Codependent Coding™",
    openGraph: { images: [image] },
    twitter: { card: "summary_large_image", images: [image] },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  "use cache";

  const { slug } = await params;
  return <DoctrineDocsFeature slug={slug.join("/")} />;
}
