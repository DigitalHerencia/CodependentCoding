import { notFound } from "next/navigation";
import { DoctrineArticle } from "@/components/blocks/doctrine-article";
import { DoctrineSidebar } from "@/features/doctrine/doctrine-sidebar.client";
import {
  getDoctrineDoc,
  getDoctrineNav,
  getDoctrineSlugs,
} from "@/lib/content/doctrine";

export async function DoctrineDocsFeature({ slug }: { slug: string }) {
  const [doc, nav] = await Promise.all([
    getDoctrineDoc(slug),
    getDoctrineNav(),
  ]);
  if (!doc) notFound();
  return <DoctrineArticle doc={doc} sidebar={<DoctrineSidebar nav={nav} />} />;
}

export async function doctrineDocsStaticParams() {
  return (await getDoctrineSlugs()).map((slug) => ({ slug: slug.split("/") }));
}
