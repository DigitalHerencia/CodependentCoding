'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '../prisma';

// Zod schemas for validation
const updateTagsSchema = z.object({
  archiveId: z.string().uuid(),
  tags: z.array(z.string().min(1).max(50)).max(20), // Max 20 tags, each max 50 chars
});

const addTagSchema = z.object({
  archiveId: z.string().uuid(),
  tag: z.string().min(1).max(50),
});

const removeTagSchema = z.object({
  archiveId: z.string().uuid(),
  tag: z.string().min(1).max(50),
});

const generateTagsSchema = z.object({
  archiveId: z.string().uuid(),
});

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Update all tags for an archive (replaces existing tags)
 */
export async function updateArchiveTags(
  formData: FormData
): Promise<ActionResult<string[]>> {
  try {
    const data = updateTagsSchema.parse({
      archiveId: formData.get('archiveId'),
      tags: JSON.parse(formData.get('tags') as string || '[]'),
    });

    // Normalize tags: lowercase, trim, dedupe
    const normalizedTags = Array.from(new Set(
      data.tags
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0)
    ));

    const archive = await prisma.archive.update({
      where: { id: data.archiveId },
      data: { tags: { set: normalizedTags } },
      select: { tags: true },
    });

    revalidatePath('/archives');
    revalidatePath(`/archives/${data.archiveId}`);

    return {
      success: true,
      data: archive.tags,
    };
  } catch (error) {
    console.error('Error updating archive tags:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update tags',
    };
  }
}

/**
 * Add a single tag to an archive
 */
export async function addArchiveTag(
  formData: FormData
): Promise<ActionResult<string[]>> {
  try {
    const data = addTagSchema.parse({
      archiveId: formData.get('archiveId'),
      tag: formData.get('tag'),
    });

    // Normalize the tag
    const normalizedTag = data.tag.trim().toLowerCase();
    if (!normalizedTag) {
      return { success: false, error: 'Tag cannot be empty' };
    }

    // Get current archive
    const archive = await prisma.archive.findUnique({
      where: { id: data.archiveId },
      select: { tags: true },
    });

    if (!archive) {
      return { success: false, error: 'Archive not found' };
    }

    // Add tag if not already present
    const currentTags = archive.tags as string[];
    if (currentTags.includes(normalizedTag)) {
      return { success: false, error: 'Tag already exists' };
    }

    const updatedTags = [...currentTags, normalizedTag];

    const updatedArchive = await prisma.archive.update({
      where: { id: data.archiveId },
      data: { tags: { set: updatedTags } },
      select: { tags: true },
    });

    revalidatePath('/archives');
    revalidatePath(`/archives/${data.archiveId}`);

    return {
      success: true,
      data: updatedArchive.tags,
    };
  } catch (error) {
    console.error('Error adding archive tag:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add tag',
    };
  }
}

/**
 * Remove a single tag from an archive
 */
export async function removeArchiveTag(
  formData: FormData
): Promise<ActionResult<string[]>> {
  try {
    const data = removeTagSchema.parse({
      archiveId: formData.get('archiveId'),
      tag: formData.get('tag'),
    });

    const normalizedTag = data.tag.trim().toLowerCase();

    // Get current archive
    const archive = await prisma.archive.findUnique({
      where: { id: data.archiveId },
      select: { tags: true },
    });

    if (!archive) {
      return { success: false, error: 'Archive not found' };
    }

    // Remove tag
    const currentTags = archive.tags as string[];
    const updatedTags = currentTags.filter(tag => tag !== normalizedTag);

    const updatedArchive = await prisma.archive.update({
      where: { id: data.archiveId },
      data: { tags: { set: updatedTags } },
      select: { tags: true },
    });

    revalidatePath('/archives');
    revalidatePath(`/archives/${data.archiveId}`);

    return {
      success: true,
      data: updatedArchive.tags,
    };
  } catch (error) {
    console.error('Error removing archive tag:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove tag',
    };
  }
}

/**
 * Generate suggested tags for an archive using auto-tagging
 */
export async function generateArchiveTags(
  formData: FormData
): Promise<ActionResult<string[]>> {
  try {
    const { autoTagContent } = await import('../autotag');
    
    const data = generateTagsSchema.parse({
      archiveId: formData.get('archiveId'),
    });

    // Get archive content
    const archive = await prisma.archive.findUnique({
      where: { id: data.archiveId },
      select: { content: true, title: true },
    });

    if (!archive) {
      return { success: false, error: 'Archive not found' };
    }

    // Generate tags from title and content
    const contentToAnalyze = `${archive.title}\n\n${archive.content}`;
    const suggestedTags = await autoTagContent(contentToAnalyze, { maxTags: 8 });

    return {
      success: true,
      data: suggestedTags,
    };
  } catch (error) {
    console.error('Error generating archive tags:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate tags',
    };
  }
}