import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

/**
 * S3 Configuration for ChatGPT Archive Utility
 * Implements server-side encryption for all file uploads
 */

// S3 Client configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// S3 bucket configuration
export const S3_CONFIG = {
  bucket: process.env.S3_BUCKET_NAME!,
  region: process.env.AWS_REGION || 'us-east-1',
  // Default server-side encryption settings
  encryption: {
    // Use AWS managed keys (SSE-S3) by default
    algorithm: 'AES256',
    // Or use KMS managed keys (SSE-KMS) - uncomment if using KMS
    // algorithm: 'aws:kms',
    // keyId: process.env.AWS_KMS_KEY_ID,
  }
} as const

/**
 * Upload file to S3 with server-side encryption
 * @param key - S3 object key (file path)
 * @param body - File content buffer
 * @param contentType - MIME type
 * @param metadata - Additional metadata
 * @returns Upload result with encryption details
 */
export async function uploadToS3(
  key: string,
  body: Buffer | Uint8Array | string,
  contentType: string,
  metadata: Record<string, string> = {}
) {
  const uploadCommand = new PutObjectCommand({
    Bucket: S3_CONFIG.bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
    Metadata: {
      ...metadata,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'chatgpt-archive-utility',
    },
    // Server-side encryption configuration
    ServerSideEncryption: S3_CONFIG.encryption.algorithm,
    // Uncomment if using KMS
    // SSEKMSKeyId: S3_CONFIG.encryption.keyId,
    
    // Additional security headers
    CacheControl: 'private, no-cache',
    ContentDisposition: 'attachment',
  })

  try {
    const result = await s3Client.send(uploadCommand)
    
    return {
      success: true,
      key,
      etag: result.ETag,
      versionId: result.VersionId,
      encryption: {
        algorithm: result.ServerSideEncryption,
        keyId: result.SSEKMSKeyId,
      },
      location: `https://${S3_CONFIG.bucket}.s3.${S3_CONFIG.region}.amazonaws.com/${key}`,
    }
  } catch (error) {
    console.error('S3 upload error:', error)
    throw new Error(`Failed to upload to S3: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Generate presigned URL for secure file uploads
 * Client can upload directly to S3 with encryption enforced
 * @param key - S3 object key
 * @param contentType - Expected MIME type
 * @param expiresIn - URL expiration time in seconds (default: 5 minutes)
 * @returns Presigned URL and required fields
 */
export async function generatePresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 300 // 5 minutes
) {
  const putCommand = new PutObjectCommand({
    Bucket: S3_CONFIG.bucket,
    Key: key,
    ContentType: contentType,
    // Enforce server-side encryption for presigned uploads
    ServerSideEncryption: S3_CONFIG.encryption.algorithm,
    // Uncomment if using KMS
    // SSEKMSKeyId: S3_CONFIG.encryption.keyId,
    
    // Security headers for presigned uploads
    CacheControl: 'private, no-cache',
    ContentDisposition: 'attachment',
  })

  try {
    const signedUrl = await getSignedUrl(s3Client, putCommand, { 
      expiresIn,
      // Additional security for presigned URLs
      signableHeaders: new Set(['content-type', 'cache-control']),
    })

    return {
      url: signedUrl,
      key,
      fields: {
        'Content-Type': contentType,
        'Cache-Control': 'private, no-cache',
        'Content-Disposition': 'attachment',
        // These headers ensure encryption is applied
        'x-amz-server-side-encryption': S3_CONFIG.encryption.algorithm,
        // Uncomment if using KMS
        // 'x-amz-server-side-encryption-aws-kms-key-id': S3_CONFIG.encryption.keyId,
      },
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
    }
  } catch (error) {
    console.error('Presigned URL generation error:', error)
    throw new Error(`Failed to generate presigned URL: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Validate S3 configuration on startup
 * Ensures all required environment variables are set
 */
export function validateS3Config() {
  const requiredEnvVars = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'S3_BUCKET_NAME',
  ]

  const missing = requiredEnvVars.filter(
    envVar => !process.env[envVar]
  )

  if (missing.length > 0) {
    throw new Error(
      `Missing required S3 environment variables: ${missing.join(', ')}\n` +
      'Please configure these variables for S3 uploads with server-side encryption.'
    )
  }

  console.log('✅ S3 configuration validated')
  console.log(`📦 Bucket: ${S3_CONFIG.bucket}`)
  console.log(`🔒 Encryption: ${S3_CONFIG.encryption.algorithm}`)
  console.log(`🌍 Region: ${S3_CONFIG.region}`)
}

/**
 * Environment variable documentation
 * Add these to your .env.local or Vercel environment variables:
 * 
 * # AWS S3 Configuration
 * AWS_ACCESS_KEY_ID=your_access_key_here
 * AWS_SECRET_ACCESS_KEY=your_secret_key_here
 * AWS_REGION=us-east-1
 * S3_BUCKET_NAME=your-chatgpt-archives-bucket
 * 
 * # Optional: For KMS encryption (more secure)
 * AWS_KMS_KEY_ID=arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012
 * 
 * # S3 Bucket Policy Example (for server-side encryption enforcement):
 * {
 *   "Version": "2012-10-17",
 *   "Statement": [
 *     {
 *       "Sid": "DenyUnencryptedObjectUploads",
 *       "Effect": "Deny",
 *       "Principal": "*",
 *       "Action": "s3:PutObject",
 *       "Resource": "arn:aws:s3:::your-bucket-name/*",
 *       "Condition": {
 *         "StringNotEquals": {
 *           "s3:x-amz-server-side-encryption": "AES256"
 *         }
 *       }
 *     }
 *   ]
 * }
 */