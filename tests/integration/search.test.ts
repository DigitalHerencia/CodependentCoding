import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '../../app/api/search/route'
import { NextRequest } from 'next/server'

// Mock Prisma
vi.mock('../../lib/prisma', () => ({
  prisma: {
    archive: {
      findMany: vi.fn(),
    },
  },
}))

describe('Search API Integration Tests', () => {
  let mockPrisma: any

  beforeEach(async () => {
    // Import after mock is set up
    const { prisma } = await import('../../lib/prisma')
    mockPrisma = prisma as any
    vi.clearAllMocks()
  })

  it('should handle search with query parameter', async () => {
    // Mock prisma response
    mockPrisma.archive.findMany.mockResolvedValue([
      {
        id: '1',
        userId: 'user-1',
        title: 'JavaScript Tutorial',
        content: 'This is a comprehensive guide to JavaScript programming',
        attachments: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ])

    const request = new NextRequest('http://localhost:3000/api/search?q=JavaScript')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBe(1)
    expect(data[0].title).toBe('JavaScript Tutorial')

    // Verify prisma was called with correct parameters
    expect(mockPrisma.archive.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { title: { contains: 'JavaScript', mode: 'insensitive' } },
          { content: { contains: 'JavaScript', mode: 'insensitive' } },
        ],
      },
      orderBy: [{ createdAt: 'desc' }],
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
  })

  it('should handle date range filtering', async () => {
    mockPrisma.archive.findMany.mockResolvedValue([])

    const request = new NextRequest(
      'http://localhost:3000/api/search?startDate=2024-01-10&endDate=2024-01-20'
    )
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)

    // Verify prisma was called with date filters
    expect(mockPrisma.archive.findMany).toHaveBeenCalledWith({
      where: {
        createdAt: {
          gte: new Date('2024-01-10'),
          lte: new Date('2024-01-20'),
        },
      },
      orderBy: [{ createdAt: 'desc' }],
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
  })

  it('should combine search query with date filters', async () => {
    mockPrisma.archive.findMany.mockResolvedValue([])

    const request = new NextRequest(
      'http://localhost:3000/api/search?q=JavaScript&startDate=2024-01-01&endDate=2024-01-31'
    )
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)

    // Verify prisma was called with both search and date filters
    expect(mockPrisma.archive.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { title: { contains: 'JavaScript', mode: 'insensitive' } },
          { content: { contains: 'JavaScript', mode: 'insensitive' } },
        ],
        createdAt: {
          gte: new Date('2024-01-01'),
          lte: new Date('2024-01-31'),
        },
      },
      orderBy: [{ createdAt: 'desc' }],
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
  })

  it('should return 400 for invalid date format', async () => {
    const request = new NextRequest('http://localhost:3000/api/search?startDate=invalid-date')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid query parameters')
  })

  it('should return all archives when no parameters provided', async () => {
    mockPrisma.archive.findMany.mockResolvedValue([
      {
        id: '1',
        userId: 'user-1',
        title: 'Archive 1',
        content: 'Content 1',
        attachments: [],
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
      },
      {
        id: '2',
        userId: 'user-1',
        title: 'Archive 2',
        content: 'Content 2',
        attachments: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ])

    const request = new NextRequest('http://localhost:3000/api/search')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBe(2)

    // Verify prisma was called with empty where clause
    expect(mockPrisma.archive.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: [{ createdAt: 'desc' }],
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
  })

  it('should handle database errors gracefully', async () => {
    mockPrisma.archive.findMany.mockRejectedValue(new Error('Database connection failed'))

    const request = new NextRequest('http://localhost:3000/api/search')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Internal server error')
  })
})