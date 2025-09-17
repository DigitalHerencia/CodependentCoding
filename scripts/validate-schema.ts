/**
 * Schema validation script to ensure Prisma schema is correctly defined
 * and matches the data-model.md specification.
 * 
 * This script performs static validation without requiring a database connection.
 */

import fs from 'fs'
import path from 'path'

interface SchemaValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

function validatePrismaSchema(): SchemaValidationResult {
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma')
  const result: SchemaValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  }

  try {
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8')

    // Check for required models
    const requiredModels = ['User', 'Archive']
    for (const model of requiredModels) {
      if (!schemaContent.includes(`model ${model}`)) {
        result.errors.push(`Missing required model: ${model}`)
        result.isValid = false
      }
    }

    // Check for required User fields from data-model.md
    const userRequiredFields = ['id', 'clerkId', 'email', 'firstName', 'lastName', 'archives']
    for (const field of userRequiredFields) {
      if (!schemaContent.match(new RegExp(`\\s+${field}\\s+`, 'g'))) {
        result.errors.push(`User model missing required field: ${field}`)
        result.isValid = false
      }
    }

    // Check for required Archive fields from data-model.md
    const archiveRequiredFields = ['id', 'userId', 'title', 'content', 'attachments', 'createdAt', 'updatedAt', 'user']
    for (const field of archiveRequiredFields) {
      if (!schemaContent.match(new RegExp(`\\s+${field}\\s+`, 'g'))) {
        result.errors.push(`Archive model missing required field: ${field}`)
        result.isValid = false
      }
    }

    // Check for required indexes from data-model.md
    if (!schemaContent.includes('@@index([userId, createdAt])')) {
      result.warnings.push('Missing recommended index: Archive(userId, createdAt)')
    }

    if (!schemaContent.includes('@@index([title])')) {
      result.warnings.push('Missing recommended index: Archive(title)')
    }

    // Check for proper relation
    if (!schemaContent.includes('@relation(fields: [userId], references: [id]')) {
      result.errors.push('Archive model missing proper relation to User')
      result.isValid = false
    }

    // Check for unique constraint on clerkId
    if (!schemaContent.includes('clerkId   String   @unique')) {
      result.errors.push('User.clerkId must have @unique constraint')
      result.isValid = false
    }

    console.log('✅ Schema validation completed')
    
    if (result.errors.length > 0) {
      console.log('❌ Validation Errors:')
      result.errors.forEach(error => console.log(`  - ${error}`))
    }

    if (result.warnings.length > 0) {
      console.log('⚠️  Validation Warnings:')
      result.warnings.forEach(warning => console.log(`  - ${warning}`))
    }

    if (result.isValid && result.errors.length === 0) {
      console.log('✅ Prisma schema matches data-model.md specification!')
    }

  } catch (error) {
    result.errors.push(`Failed to read schema file: ${error}`)
    result.isValid = false
  }

  return result
}

// Run validation
const validation = validatePrismaSchema()
process.exit(validation.isValid ? 0 : 1)