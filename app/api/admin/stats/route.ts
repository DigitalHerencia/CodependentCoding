import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, logAdminAccess } from '@/lib/auth/admin'

/**
 * Admin Stats API Endpoint
 * GET /api/admin/stats - Get system statistics for admin dashboard
 */
export async function GET(request: NextRequest) {
  // Check admin authorization
  const authError = await requireAdmin(request)
  if (authError) {
    logAdminAccess(request, 'GET_STATS', false)
    return authError
  }

  try {
    logAdminAccess(request, 'GET_STATS')

    // TODO: Replace with actual database queries when Prisma is available
    // For now, return mock data that matches the expected structure

    // Calculate date ranges for time-based statistics
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Mock statistics data
    const totalUsers = 156
    const totalArchives = 1243
    const archivesToday = 12
    const archivesThisWeek = 89
    const archivesThisMonth = 342
    const storageUsed = 2147483648 // ~2GB in bytes
    const averageArchivesPerUser = Math.round((totalArchives / totalUsers) * 100) / 100

    const topUsers = [
      {
        userId: '1',
        email: 'power.user@example.com',
        archiveCount: 45
      },
      {
        userId: '2', 
        email: 'active.user@example.com',
        archiveCount: 32
      },
      {
        userId: '3',
        email: 'regular.user@example.com',
        archiveCount: 28
      },
      {
        userId: '4',
        email: 'frequent.user@example.com',
        archiveCount: 24
      },
      {
        userId: '5',
        email: 'daily.user@example.com',
        archiveCount: 19
      }
    ]

    const stats = {
      totalUsers,
      totalArchives,
      archivesToday,
      archivesThisWeek,
      archivesThisMonth,
      storageUsed,
      averageArchivesPerUser,
      topUsers
    }

    return NextResponse.json(stats)

  } catch (error) {
    logAdminAccess(request, 'GET_STATS', false)
    console.error('Admin stats API error:', error)
    
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
    logAdminAccess(request, 'GET_STATS', false)
    return authError
  }

  try {
    logAdminAccess(request, 'GET_STATS')

    // Calculate date ranges for time-based statistics
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Run multiple queries in parallel for better performance
    const [
      totalUsers,
      totalArchives,
      archivesToday,
      archivesThisWeek,
      archivesThisMonth,
      topUsersData
    ] = await Promise.all([
      // Total users count
      prisma.user.count(),
      
      // Total archives count
      prisma.archive.count(),
      
      // Archives created today
      prisma.archive.count({
        where: {
          createdAt: {
            gte: today
          }
        }
      }),
      
      // Archives created this week
      prisma.archive.count({
        where: {
          createdAt: {
            gte: weekAgo
          }
        }
      }),
      
      // Archives created this month
      prisma.archive.count({
        where: {
          createdAt: {
            gte: monthAgo
          }
        }
      }),
      
      // Top 5 users by archive count
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          _count: {
            select: {
              archives: true
            }
          }
        },
        orderBy: {
          archives: {
            _count: 'desc'
          }
        },
        take: 5
      })
    ])

    // Calculate storage used (approximate)
    // In a real implementation, you might want to store this in a separate table
    // or calculate it periodically via a background job
    const storageStats = await prisma.archive.aggregate({
      _sum: {
        // Assuming we add a 'size' field to archive table
        // size: true
      }
    })

    const storageUsed = 0 // storageStats._sum.size || 0
    const averageArchivesPerUser = totalUsers > 0 ? Math.round((totalArchives / totalUsers) * 100) / 100 : 0

    // Transform top users data
    const topUsers = topUsersData.map(user => ({
      userId: user.id,
      email: user.email,
      archiveCount: user._count.archives
    }))

    const stats = {
      totalUsers,
      totalArchives,
      archivesToday,
      archivesThisWeek,
      archivesThisMonth,
      storageUsed,
      averageArchivesPerUser,
      topUsers
    }

    return NextResponse.json(stats)

  } catch (error) {
    logAdminAccess(request, 'GET_STATS', false)
    console.error('Admin stats API error:', error)
    
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