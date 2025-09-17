'use server'

import { z } from 'zod'

// Zod schema for attachment validation
const AttachmentSchema = z.object({
  name: z.string().min(1, 'Attachment name is required'),
  size: z.number().positive('Attachment size must be positive'),
  contentType: z.string().min(1, 'Attachment content type is required'),
  url: z.string().url('Attachment URL must be valid'),
  checksum: z.string().min(1, 'Attachment checksum is required')
})

// Zod schema for archive creation payload
const CreateArchiveSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must not exceed 255 characters'),
  content: z.string().min(1, 'Content is required'),
  attachments: z.array(AttachmentSchema).default([])
})

// Type inference from Zod schema
type CreateArchiveInput = z.infer<typeof CreateArchiveSchema>

// Server action result types
type ServerActionResult<T> = {
  success: true
  data: T
} | {
  success: false
  error: string
}

// Archive creation server action
export async function createArchive(input: CreateArchiveInput): Promise<ServerActionResult<{
  id: string
  userId: string
  title: string
  content: string
  attachments: unknown
  createdAt: Date
  updatedAt: Date
}>> {
  try {
    // Validate input using Zod
    const validatedInput = CreateArchiveSchema.parse(input)
    
    // Lazy import Prisma to avoid initialization issues in tests
    const { prisma } = await import('../prisma')
    
    // Create archive in database using Prisma
    const archive = await prisma.archive.create({
      data: {
        userId: validatedInput.userId,
        title: validatedInput.title,
        content: validatedInput.content,
        attachments: validatedInput.attachments
      }
    })

    return {
      success: true,
      data: archive
    }
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join('; ')
      
      return {
        success: false,
        error: errorMessages
      }
    }
    
    // Handle database or other errors
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

// Export schema for testing purposes
export { CreateArchiveSchema, AttachmentSchema }