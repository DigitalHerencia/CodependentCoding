import { NextResponse } from 'next/server';
import { readMaximalSource } from '@/lib/maximal';
export async function GET(request: Request) {
  const sourcePath = new URL(request.url).searchParams.get('path');
  if (!sourcePath)
    return NextResponse.json(
      { error: 'A source path is required.' },
      { status: 400 },
    );
  try {
    return NextResponse.json({
      path: sourcePath,
      source: await readMaximalSource(sourcePath),
    });
  } catch {
    return NextResponse.json(
      { error: 'Source file unavailable.' },
      { status: 404 },
    );
  }
}
