import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

// Validation schema for search parameters
const searchParamsSchema = z.object({
  q: z.string().optional(),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse and validate query parameters
    const validationResult = searchParamsSchema.safeParse({
      q: searchParams.get('q') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
    })

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { q, startDate, endDate } = validationResult.data

    // Build where clause for Prisma query
    const whereClause: any = {}

    // Add search query filter (search in title and content)
    if (q) {
      whereClause.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
      ]
    }

    // Add date filters
    if (startDate || endDate) {
      whereClause.createdAt = {}
      if (startDate) {
        whereClause.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        whereClause.createdAt.lte = new Date(endDate)
      }
    }

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