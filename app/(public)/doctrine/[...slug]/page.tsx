import type { Metadata } from "next";
import {
  DoctrineDocsFeature,
  doctrineDocsStaticParams,
} from "@/features/doctrine/doctrine-docs-feature";

export const generateStaticParams = doctrineDocsStaticParams;

export const metadata: Metadata = { title: "Doctrine · Codependent Coding™" };

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  "use cache";

  const { slug } = await params;
  return <DoctrineDocsFeature slug={slug.join("/")} />;
}
