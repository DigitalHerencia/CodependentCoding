import { NextResponse } from 'next/server';
import { getOntology } from '@/lib/public-catalog';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const ontology = getOntology(slug);
  if (!ontology)
    return NextResponse.json({ error: 'Unknown ontology' }, { status: 404 });
  return NextResponse.json({ ontology });
}
