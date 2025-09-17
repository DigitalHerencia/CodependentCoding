import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '../../../lib/db/prisma'

// Validation schema for search parameters
const searchParamsSchema = z.object({
  q: z.string().optional(),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const validationResult = searchParamsSchema.safeParse({
      q: searchParams.get('q') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
    })

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validationResult.error },
        { status: 400 }
      )
    }

    const { q, startDate, endDate } = validationResult.data

    // Build where clause for Prisma query
    const whereClause = {}



    // Execute search query
    const archives = await prisma.archive.findMany({
      where: whereClause,
      orderBy: [
        // Order by relevance (if search query exists) and then by date
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        userId: true,
        title: true,
        content: true,
        attachments: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(archives)
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}