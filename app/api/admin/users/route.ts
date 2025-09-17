import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, logAdminAccess, validatePagination, calculatePaginationMeta } from '@/lib/auth/admin'

/**
 * Admin Users API Endpoint
 * GET /api/admin/users - Get paginated list of users with archive counts
 * 
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 100)
 * - search: Search term for email, firstName, or lastName
 */
export async function GET(request: NextRequest) {
  // Check admin authorization
  const authError = await requireAdmin(request)
  if (authError) {
    logAdminAccess(request, 'GET_USERS', false)
    return authError
  }

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, offset } = validatePagination(searchParams)
    const search = searchParams.get('search')?.trim() || ''

    logAdminAccess(request, `GET_USERS page=${page} limit=${limit} search=${search}`)

    // TODO: Replace with actual database query when Prisma is available
    // For now, return mock data that matches the expected structure
    
    // Mock users data
    const mockUsers = [
      {
        id: '1',
        clerkId: 'clerk_user_1',
        email: 'user1@example.com',
        firstName: 'John',
        lastName: 'Doe',
        archiveCount: 5,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
      },
      {
        id: '2',
        clerkId: 'clerk_user_2',
        email: 'user2@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        archiveCount: 3,
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-16T00:00:00Z'
      },
      {
        id: '3',
        clerkId: 'clerk_user_3',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        archiveCount: 8,
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-17T00:00:00Z'
      }
    ]

    // Apply search filter
    let filteredUsers = mockUsers
    if (search) {
      const searchLower = search.toLowerCase()
      filteredUsers = mockUsers.filter(user => 
        user.email?.toLowerCase().includes(searchLower) ||
        user.firstName?.toLowerCase().includes(searchLower) ||
        user.lastName?.toLowerCase().includes(searchLower)
      )
    }

    // Apply pagination
    const total = filteredUsers.length
    const paginatedUsers = filteredUsers.slice(offset, offset + limit)
    
    const paginationMeta = calculatePaginationMeta(page, limit, total)

    const response = {
      users: paginatedUsers,
      pagination: paginationMeta
    }

    return NextResponse.json(response)

  } catch (error) {
    logAdminAccess(request, 'GET_USERS', false)
    console.error('Admin users API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

/* 
TODO: When Prisma client is available, replace the mock implementation with:

import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) {
    logAdminAccess(request, 'GET_USERS', false)
    return authError
  }

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, offset } = validatePagination(searchParams)
    const search = searchParams.get('search')?.trim() || ''

    logAdminAccess(request, `GET_USERS page=${page} limit=${limit} search=${search}`)

    // Build where clause for search
    const whereClause = search ? {
      OR: [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } }
      ]
    } : {}

    // Get users with archive counts
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          clerkId: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              archives: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.user.count({ where: whereClause })
    ])

    // Transform the data to match API schema
    const transformedUsers = users.map(user => ({
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      archiveCount: user._count.archives,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    }))

    const paginationMeta = calculatePaginationMeta(page, limit, total)

    const response = {
      users: transformedUsers,
      pagination: paginationMeta
    }

    return NextResponse.json(response)

  } catch (error) {
    logAdminAccess(request, 'GET_USERS', false)
    console.error('Admin users API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
*/