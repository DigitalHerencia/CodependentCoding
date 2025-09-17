'use server'

import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// Validation schemas using Zod as required by the architecture
const AttachmentSchema = z.object({
  name: z.string(),
  size: z.number(),
  contentType: z.string(),
  url: z.string(),
  checksum: z.string(),
})

const CreateArchiveSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  attachments: z.array(AttachmentSchema).default([]),
})

const ArchiveIdSchema = z.string().uuid('Invalid archive ID')

export type CreateArchiveInput = z.infer<typeof CreateArchiveSchema>
export type Attachment = {
  name: string
  size: number
  contentType: string
  url: string
  checksum: string
}

export type Archive = {
  id: string
  userId: string
  title: string
  content: string
  attachments: Attachment[]
  createdAt: Date
  updatedAt: Date
}

export async function createArchive(input: CreateArchiveInput): Promise<Archive> {
  const validatedInput = CreateArchiveSchema.parse(input)
  
  // For now, we'll use a mock user ID since Clerk auth isn't set up yet
  const mockUserId = 'mock-user-id'
  
  const archive = await prisma.archive.create({
    data: {
      userId: mockUserId,
      title: validatedInput.title,
      content: validatedInput.content,
      attachments: validatedInput.attachments,
    },
  })

  revalidatePath('/archives')
  return archive
}

export async function getArchives(): Promise<Archive[]> {
  // For now, we'll get all archives. In a real app, this would be filtered by user
  const archives = await prisma.archive.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return archives
}

export async function getArchive(id: string): Promise<Archive | null> {
  const validatedId = ArchiveIdSchema.parse(id)
  
  const archive = await prisma.archive.findUnique({
    where: {
      id: validatedId,
    },
  })

  return archive
}

export async function deleteArchive(id: string): Promise<void> {
  const validatedId = ArchiveIdSchema.parse(id)
  
  await prisma.archive.delete({
    where: {
      id: validatedId,
    },
  })

  revalidatePath('/archives')
}