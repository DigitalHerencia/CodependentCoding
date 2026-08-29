import { NextResponse } from 'next/server';
import { getOntology } from '@hipster-stack/core';
export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; if (!(slug in (await import('@hipster-stack/core')).ontologyCatalog)) return NextResponse.json({ error: 'Unknown ontology' }, { status: 404 }); return NextResponse.json({ ontology: getOntology(slug as never) }); }
