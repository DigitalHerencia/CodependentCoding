import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { SocialCard } from "@/components/brand/social-card";
import { getDoctrineDoc, getDoctrineSlugs } from "@/lib/content/doctrine";

const size = { width: 1200, height: 630 };

export async function generateStaticParams() {
  return (await getDoctrineSlugs()).map((slug) => ({ slug: slug.split("/") }));
}

async function getChapter(slug: string) {
  "use cache";
  return getDoctrineDoc(slug);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  const doc = await getChapter(slug.join("/"));
  if (!doc) notFound();
  return new ImageResponse(
    <SocialCard title={doc.title} chapter={doc.group} />,
    size,
  );
}
