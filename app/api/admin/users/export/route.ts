import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, logAdminAccess } from '@/lib/auth/admin'

/**
 * Admin Users Export API Endpoint
 * GET /api/admin/users/export - Export user data as CSV or JSON
 * 
 * Query Parameters:
 * - format: Export format ('csv' or 'json', default: 'csv')
 */
export async function GET(request: NextRequest) {
  // Check admin authorization
  const authError = await requireAdmin(request)
  if (authError) {
    logAdminAccess(request, 'EXPORT_USERS', false)
    return authError
  }

  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv'

    if (!['csv', 'json'].includes(format)) {
      return NextResponse.json(
        { 
          error: 'Invalid format. Must be "csv" or "json"',
          code: 'INVALID_FORMAT',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }

    logAdminAccess(request, `EXPORT_USERS format=${format}`)

    // TODO: Replace with actual database query when Prisma is available
    // For now, return mock data
    
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

    if (format === 'csv') {
      // Generate CSV data
      const headers = 'id,clerkId,email,firstName,lastName,archiveCount,createdAt,updatedAt'
      const rows = mockUsers.map(user => 
        [
          user.id,
          user.clerkId,
          user.email || '',
          user.firstName || '',
          user.lastName || '',
          user.archiveCount.toString(),
          user.createdAt,
          user.updatedAt
        ].join(',')
      )
      
      const csvContent = [headers, ...rows].join('\n')
      
      return new Response(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="users-export-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    } else {
      // Return JSON format
      return NextResponse.json(mockUsers, {
        headers: {
          'Content-Disposition': `attachment; filename="users-export-${new Date().toISOString().split('T')[0]}.json"`
        }
      })
    }

  } catch (error) {
    logAdminAccess(request, 'EXPORT_USERS', false)
    console.error('Admin users export API error:', error)
    
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