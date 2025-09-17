/**
 * Admin authentication and authorization utilities
 * 
 * This module provides secure admin role checking for the ChatGPT Archive Utility.
 * Admin access is controlled via Clerk user metadata and environment configuration.
 */

// List of admin Clerk user IDs - in production this should be managed via Clerk metadata
// For security, admins are defined by environment variables
const ADMIN_CLERK_IDS = (process.env.ADMIN_CLERK_IDS || '').split(',').filter(Boolean)

// Default admin emails for development/testing
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').filter(Boolean)

export interface AdminUser {
  id: string
  clerkId: string
  email: string | null
  firstName: string | null
  lastName: string | null
  isAdmin: boolean
}

export interface AuthContext {
  userId: string
  clerkId: string
  email: string | null
  isAdmin: boolean
}

/**
 * Check if a Clerk user ID has admin privileges
 * 
 * @param clerkId - The Clerk user ID to check
 * @param email - Optional email for fallback admin checking
 * @returns boolean indicating if the user is an admin
 */
export function isAdminUser(clerkId: string, email?: string | null): boolean {
  // Check if user is in admin Clerk IDs list
  if (ADMIN_CLERK_IDS.includes(clerkId)) {
    return true
  }
  
  // Fallback to email-based admin checking for development
  if (email && ADMIN_EMAILS.includes(email)) {
    return true
  }
  
  return false
}

/**
 * Create an authorization error response
 * 
 * @param message - Error message
 * @param status - HTTP status code (default: 403)
 * @returns Response object
 */
export function createAuthError(message: string = 'Admin access required', status: number = 403): Response {
  return new Response(
    JSON.stringify({ 
      error: message,
      code: status === 403 ? 'FORBIDDEN' : 'UNAUTHORIZED',
      timestamp: new Date().toISOString()
    }), 
    { 
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

/**
 * Extract auth context from request headers
 * This is a placeholder - in a real implementation this would integrate with Clerk
 * 
 * @param request - The incoming request
 * @returns AuthContext or null if not authenticated
 */
export async function extractAuthContext(request: Request): Promise<AuthContext | null> {
  // For now, this is a mock implementation
  // In a real app, this would use Clerk's authentication
  
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.substring(7)
  
  // Mock implementation for testing
  if (token === 'admin_test_user') {
    return {
      userId: 'admin_user_id',
      clerkId: 'admin_test_user',
      email: 'admin@test.com',
      isAdmin: true
    }
  }
  
  if (token === 'regular_test_user') {
    return {
      userId: 'regular_user_id', 
      clerkId: 'regular_test_user',
      email: 'user@test.com',
      isAdmin: false
    }
  }
  
  return null
}

/**
 * Middleware to check if user has admin access
 * Returns early response if unauthorized, or null if authorized
 * 
 * @param request - The incoming request
 * @returns Response for unauthorized access, or null if authorized
 */
export async function requireAdmin(request: Request): Promise<Response | null> {
  const authContext = await extractAuthContext(request)
  
  if (!authContext) {
    return createAuthError('Authentication required', 401)
  }
  
  if (!authContext.isAdmin) {
    return createAuthError('Admin access required', 403)
  }
  
  return null
}

/**
 * Get current authenticated admin user
 * Throws error if not authenticated or not admin
 * 
 * @param request - The incoming request
 * @returns AuthContext for admin user
 * @throws Error if not authenticated or not admin
 */
export async function requireAdminContext(request: Request): Promise<AuthContext> {
  const authContext = await extractAuthContext(request)
  
  if (!authContext) {
    throw new Error('Authentication required')
  }
  
  if (!authContext.isAdmin) {
    throw new Error('Admin access required')
  }
  
  return authContext
}

/**
 * Security audit: Log admin access attempts
 * 
 * @param request - The incoming request
 * @param action - The admin action being performed
 * @param success - Whether the action was successful
 */
export function logAdminAccess(
  request: Request, 
  action: string, 
  success: boolean = true
): void {
  const timestamp = new Date().toISOString()
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  // In production, this should go to a proper logging service
  console.log(`[ADMIN_ACCESS] ${timestamp} | ${success ? 'SUCCESS' : 'FAILED'} | ${action} | IP: ${ip} | UA: ${userAgent}`)
}

/**
 * Validate pagination parameters
 * 
 * @param searchParams - URL search parameters
 * @returns Validated pagination object
 */
export function validatePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
  const offset = (page - 1) * limit
  
  return { page, limit, offset }
}

/**
 * Calculate pagination metadata
 * 
 * @param page - Current page number
 * @param limit - Items per page
 * @param total - Total number of items
 * @returns Pagination metadata object
 */
export function calculatePaginationMeta(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit)
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  }
}