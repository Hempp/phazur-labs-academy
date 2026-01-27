/**
 * S3 Storage Service
 *
 * Handles AWS S3 operations for video storage including:
 * - Presigned URL generation for secure upload/download
 * - Multipart upload for large files
 * - File organization with course hierarchy paths
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  CopyObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  ListPartsCommand,
  type CompletedPart,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// ============================================================================
// TYPES
// ============================================================================

export interface S3Config {
  bucket: string
  region: string
  accessKeyId: string
  secretAccessKey: string
  cdnDomain?: string
}

export interface PresignedUploadResult {
  uploadUrl: string
  key: string
  expiresAt: Date
}

export interface PresignedDownloadResult {
  downloadUrl: string
  expiresAt: Date
}

export interface MultipartUploadInitResult {
  uploadId: string
  key: string
}

export interface PartPresignedUrl {
  partNumber: number
  url: string
  expiresAt: Date
}

export interface CompleteMultipartResult {
  key: string
  location: string
  etag: string
}

export interface S3ObjectMetadata {
  contentType: string
  contentLength: number
  lastModified?: Date
  etag?: string
  metadata?: Record<string, string>
}

export interface CopyObjectResult {
  newKey: string
  etag?: string
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEFAULT_EXPIRY_SECONDS = 3600 // 1 hour
const MULTIPART_CHUNK_SIZE = 100 * 1024 * 1024 // 100MB per part
const MAX_VIDEO_SIZE = 5 * 1024 * 1024 * 1024 // 5GB max

/**
 * Get S3 configuration from environment variables
 */
export function getS3Config(): S3Config | null {
  const bucket = process.env.AWS_S3_BUCKET
  const region = process.env.AWS_REGION
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

  if (!bucket || !region || !accessKeyId || !secretAccessKey) {
    return null
  }

  return {
    bucket,
    region,
    accessKeyId,
    secretAccessKey,
    cdnDomain: process.env.AWS_CLOUDFRONT_DOMAIN,
  }
}

/**
 * Check if S3 is configured
 */
export function isS3Configured(): boolean {
  return getS3Config() !== null
}

/**
 * Create S3 client instance
 */
export function createS3Client(): S3Client {
  const config = getS3Config()
  if (!config) {
    throw new Error('AWS S3 is not configured. Please set AWS_S3_BUCKET, AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY environment variables.')
  }

  return new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  })
}

// ============================================================================
// PATH UTILITIES
// ============================================================================

/**
 * Sanitize a string for use in S3 keys
 */
export function sanitizeKey(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9-_.]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Generate S3 key for staging area (pre-upload)
 */
export function generateStagingKey(
  userId: string,
  sessionId: string,
  filename: string
): string {
  const sanitizedFilename = sanitizeKey(filename)
  return `staging/${userId}/${sessionId}/${sanitizedFilename}`
}

/**
 * Generate S3 key for library (organized by course hierarchy)
 */
export function generateLibraryKey(options: {
  videoId: string
  filename: string
  courseSlug?: string
  moduleOrder?: number
  moduleSlug?: string
  lessonOrder?: number
  lessonSlug?: string
}): string {
  const { videoId, filename, courseSlug, moduleOrder, moduleSlug, lessonOrder, lessonSlug } = options
  const sanitizedFilename = sanitizeKey(filename)
  const ext = filename.split('.').pop() || 'mp4'

  if (courseSlug && moduleSlug && lessonSlug) {
    // Full course hierarchy path
    const modulePath = moduleOrder ? `${moduleOrder}_${sanitizeKey(moduleSlug)}` : sanitizeKey(moduleSlug)
    const lessonPath = lessonOrder ? `${lessonOrder}_${sanitizeKey(lessonSlug)}` : sanitizeKey(lessonSlug)
    return `library/courses/${sanitizeKey(courseSlug)}/modules/${modulePath}/lessons/${lessonPath}/video.${ext}`
  }

  // Standalone video (not yet assigned to course)
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `library/standalone/${year}/${month}/${videoId}/${sanitizedFilename}`
}

/**
 * Generate S3 key for thumbnails
 */
export function generateThumbnailKey(videoId: string, filename: string = 'default.jpg'): string {
  return `thumbnails/${videoId}/${filename}`
}

// ============================================================================
// PRESIGNED URL OPERATIONS
// ============================================================================

/**
 * Generate a presigned URL for uploading a file
 */
export async function generateUploadPresignedUrl(
  key: string,
  contentType: string,
  expiresIn: number = DEFAULT_EXPIRY_SECONDS
): Promise<PresignedUploadResult> {
  const config = getS3Config()
  if (!config) throw new Error('S3 not configured')

  const client = createS3Client()
  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    ContentType: contentType,
  })

  const uploadUrl = await getSignedUrl(client, command, { expiresIn })
  const expiresAt = new Date(Date.now() + expiresIn * 1000)

  return { uploadUrl, key, expiresAt }
}

/**
 * Generate a presigned URL for downloading/streaming a file
 */
export async function generateDownloadPresignedUrl(
  key: string,
  expiresIn: number = DEFAULT_EXPIRY_SECONDS,
  responseContentDisposition?: string
): Promise<PresignedDownloadResult> {
  const config = getS3Config()
  if (!config) throw new Error('S3 not configured')

  const client = createS3Client()
  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: key,
    ResponseContentDisposition: responseContentDisposition,
  })

  const downloadUrl = await getSignedUrl(client, command, { expiresIn })
  const expiresAt = new Date(Date.now() + expiresIn * 1000)

  return { downloadUrl, expiresAt }
}

/**
 * Get CDN URL if CloudFront is configured, otherwise return presigned URL
 */
export async function getVideoUrl(key: string): Promise<string> {
  const config = getS3Config()
  if (!config) throw new Error('S3 not configured')

  // If CloudFront is configured, use CDN URL
  if (config.cdnDomain) {
    return `https://${config.cdnDomain}/${key}`
  }

  // Otherwise, generate a presigned URL
  const { downloadUrl } = await generateDownloadPresignedUrl(key)
  return downloadUrl
}

// ============================================================================
// MULTIPART UPLOAD OPERATIONS
// ============================================================================

/**
 * Calculate the number of parts needed for a multipart upload
 */
export function calculateParts(fileSizeBytes: number, chunkSize: number = MULTIPART_CHUNK_SIZE): number {
  return Math.ceil(fileSizeBytes / chunkSize)
}

/**
 * Initiate a multipart upload
 */
export async function initiateMultipartUpload(
  key: string,
  contentType: string
): Promise<MultipartUploadInitResult> {
  const config = getS3Config()
  if (!config) throw new Error('S3 not configured')

  const client = createS3Client()
  const command = new CreateMultipartUploadCommand({
    Bucket: config.bucket,
    Key: key,
    ContentType: contentType,
  })

  const response = await client.send(command)

  if (!response.UploadId) {
    throw new Error('Failed to initiate multipart upload')
  }

  return {
    uploadId: response.UploadId,
    key,
  }
}

/**
 * Generate presigned URLs for all parts of a multipart upload
 */
export async function generatePartPresignedUrls(
  key: string,
  uploadId: string,
  totalParts: number,
  expiresIn: number = DEFAULT_EXPIRY_SECONDS
): Promise<PartPresignedUrl[]> {
  const config = getS3Config()
  if (!config) throw new Error('S3 not configured')

  const client = createS3Client()
  const urls: PartPresignedUrl[] = []

  for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
    const command = new UploadPartCommand({
      Bucket: config.bucket,
      Key: key,
      UploadId: uploadId,
      PartNumber: partNumber,
    })

    const url = await getSignedUrl(client, command, { expiresIn })
    urls.push({
      partNumber,
      url,
      expiresAt: new Date(Date.now() + expiresIn * 1000),
    })
  }

  return urls
}

/**
 * Complete a multipart upload
 */
export async function completeMultipartUpload(
  key: string,
  uploadId: string,
  parts: CompletedPart[]
): Promise<CompleteMultipartResult> {
  const config = getS3Config()
  if (!config) throw new Error('S3 not configured')

  const client = createS3Client()
  const command = new CompleteMultipartUploadCommand({
    Bucket: config.bucket,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: { Parts: parts },
  })

  const response = await client.send(command)

  return {
    key,
    location: response.Location || `s3://${config.bucket}/${key}`,
    etag: response.ETag || '',
  }
}

/**
 * Abort a multipart upload
 */
export async function abortMultipartUpload(key: string, uploadId: string): Promise<void> {
  const config = getS3Config()
  if (!config) throw new Error('S3 not configured')

  const client = createS3Client()
  const command = new AbortMultipartUploadCommand({
    Bucket: config.bucket,
    Key: key,
    UploadId: uploadId,
  })

  await client.send(command)
}

/**
 * List completed parts of a multipart upload
 */
export async function listUploadParts(key: string, uploadId: string): Promise<CompletedPart[]> {
  const config = getS3Config()
  if (!config) throw new Error('S3 not configured')

  const client = createS3Client()
  const command = new ListPartsCommand({
    Bucket: config.bucket,
    Key: key,
    UploadId: uploadId,
  })

  const response = await client.send(command)

  return (response.Parts || []).map((part) => ({
    PartNumber: part.PartNumber,
    ETag: part.ETag,
  }))
}

// ============================================================================
// OBJECT OPERATIONS
// ============================================================================

/**
 * Get object metadata (head object)
 */
export async function getObjectMetadata(key: string): Promise<S3ObjectMetadata | null> {
  const config = getS3Config()
  if (!config) throw new Error('S3 not configured')

  try {
    const client = createS3Client()
    const command = new HeadObjectCommand({
      Bucket: config.bucket,
      Key: key,
    })

    const response = await client.send(command)

    return {
      contentType: response.ContentType || 'application/octet-stream',
      contentLength: response.ContentLength || 0,
      lastModified: response.LastModified,
      etag: response.ETag,
      metadata: response.Metadata,
    }
  } catch (error) {
    if ((error as { name: string }).name === 'NotFound') {
      return null
    }
    throw error
  }
}

/**
 * Copy object to a new location (used for moving from staging to library)
 */
export async function copyObject(
  sourceKey: string,
  destinationKey: string
): Promise<CopyObjectResult> {
  const config = getS3Config()
  if (!config) throw new Error('S3 not configured')

  const client = createS3Client()
  const command = new CopyObjectCommand({
    Bucket: config.bucket,
    CopySource: `${config.bucket}/${sourceKey}`,
    Key: destinationKey,
  })

  const response = await client.send(command)

  return {
    newKey: destinationKey,
    etag: response.CopyObjectResult?.ETag,
  }
}

/**
 * Delete an object
 */
export async function deleteObject(key: string): Promise<void> {
  const config = getS3Config()
  if (!config) throw new Error('S3 not configured')

  const client = createS3Client()
  const command = new DeleteObjectCommand({
    Bucket: config.bucket,
    Key: key,
  })

  await client.send(command)
}

// ============================================================================
// VALIDATION
// ============================================================================

const ALLOWED_VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/webm',
  'video/x-matroska',
  'video/mpeg',
  'video/x-m4v',
]

/**
 * Validate video file before upload
 */
export function validateVideoFile(
  filename: string,
  mimeType: string,
  fileSizeBytes: number
): { valid: boolean; error?: string } {
  // Check file extension
  const ext = filename.split('.').pop()?.toLowerCase()
  const allowedExtensions = ['mp4', 'mov', 'avi', 'webm', 'mkv', 'mpeg', 'm4v']

  if (!ext || !allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `Invalid file extension. Allowed: ${allowedExtensions.join(', ')}`,
    }
  }

  // Check MIME type
  if (!ALLOWED_VIDEO_MIME_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${ALLOWED_VIDEO_MIME_TYPES.join(', ')}`,
    }
  }

  // Check file size
  const maxSizeMB = parseInt(process.env.VIDEO_MAX_SIZE_MB || '5000', 10)
  const maxSizeBytes = maxSizeMB * 1024 * 1024

  if (fileSizeBytes > maxSizeBytes) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSizeMB}MB`,
    }
  }

  if (fileSizeBytes > MAX_VIDEO_SIZE) {
    return {
      valid: false,
      error: 'File exceeds maximum allowed size of 5GB',
    }
  }

  return { valid: true }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  MULTIPART_CHUNK_SIZE,
  MAX_VIDEO_SIZE,
  DEFAULT_EXPIRY_SECONDS,
}
