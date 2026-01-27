/**
 * Upload Session Service
 *
 * Manages multipart upload sessions for large video files including:
 * - Session creation with presigned URLs
 * - Progress tracking
 * - Session completion (moves from staging to library)
 * - Cleanup of expired/cancelled sessions
 */

import { createServerSupabaseAdmin } from '@/lib/supabase/server'
import {
  generateStagingKey,
  generateLibraryKey,
  initiateMultipartUpload,
  generatePartPresignedUrls,
  completeMultipartUpload,
  abortMultipartUpload,
  listUploadParts,
  copyObject,
  deleteObject,
  validateVideoFile,
  calculateParts,
  getS3Config,
  MULTIPART_CHUNK_SIZE,
  type PartPresignedUrl,
} from './s3-storage'
import { createVideo, type CreateVideoInput } from './video-library'
import type { CompletedPart } from '@aws-sdk/client-s3'

// ============================================================================
// TYPES
// ============================================================================

export type UploadSessionStatus = 'pending' | 'uploading' | 'processing' | 'completed' | 'failed' | 'cancelled'

export interface UploadSession {
  id: string
  uploadId: string
  userId: string
  courseId: string | null
  moduleId: string | null
  lessonId: string | null
  filename: string
  fileSizeBytes: number
  mimeType: string
  title: string | null
  status: UploadSessionStatus
  partsCompleted: number
  totalParts: number
  bytesUploaded: number
  bucketName: string
  objectKey: string
  presignedUrls: PartPresignedUrl[]
  presignedUrlsExpireAt: string | null
  videoLibraryId: string | null
  errorMessage: string | null
  retryCount: number
  createdAt: string
  updatedAt: string
  expiresAt: string
  completedAt: string | null
}

export interface InitiateUploadInput {
  filename: string
  fileSizeBytes: number
  mimeType: string
  userId: string
  title?: string
  courseId?: string
  moduleId?: string
  lessonId?: string
}

export interface InitiateUploadResult {
  session: UploadSession
  presignedUrls: PartPresignedUrl[]
}

export interface CompleteUploadInput {
  sessionId: string
  parts: CompletedPart[]
  title?: string
  description?: string
  tags?: string[]
}

// ============================================================================
// DATABASE HELPERS
// ============================================================================

function mapDbRowToSession(row: Record<string, unknown>): UploadSession {
  return {
    id: row.id as string,
    uploadId: row.upload_id as string,
    userId: row.user_id as string,
    courseId: row.course_id as string | null,
    moduleId: row.module_id as string | null,
    lessonId: row.lesson_id as string | null,
    filename: row.filename as string,
    fileSizeBytes: row.file_size_bytes as number,
    mimeType: row.mime_type as string,
    title: row.title as string | null,
    status: row.status as UploadSessionStatus,
    partsCompleted: row.parts_completed as number,
    totalParts: row.total_parts as number,
    bytesUploaded: row.bytes_uploaded as number,
    bucketName: row.bucket_name as string,
    objectKey: row.object_key as string,
    presignedUrls: (row.presigned_urls as PartPresignedUrl[]) || [],
    presignedUrlsExpireAt: row.presigned_urls_expire_at as string | null,
    videoLibraryId: row.video_library_id as string | null,
    errorMessage: row.error_message as string | null,
    retryCount: row.retry_count as number,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    expiresAt: row.expires_at as string,
    completedAt: row.completed_at as string | null,
  }
}

// ============================================================================
// SESSION OPERATIONS
// ============================================================================

/**
 * Initiate a new multipart upload session
 */
export async function initiateUpload(input: InitiateUploadInput): Promise<InitiateUploadResult> {
  const config = getS3Config()
  if (!config) {
    throw new Error('S3 not configured')
  }

  // Validate the file
  const validation = validateVideoFile(input.filename, input.mimeType, input.fileSizeBytes)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  const supabase = await createServerSupabaseAdmin()

  // Generate a session ID for the staging path
  const sessionId = crypto.randomUUID()
  const objectKey = generateStagingKey(input.userId, sessionId, input.filename)

  // Calculate number of parts
  const totalParts = calculateParts(input.fileSizeBytes, MULTIPART_CHUNK_SIZE)

  // Initiate S3 multipart upload
  const { uploadId } = await initiateMultipartUpload(objectKey, input.mimeType)

  // Generate presigned URLs for all parts
  const presignedUrls = await generatePartPresignedUrls(objectKey, uploadId, totalParts)
  const presignedUrlsExpireAt = presignedUrls[0]?.expiresAt.toISOString() || null

  // Create database record
  const { data, error } = await supabase
    .from('video_upload_sessions')
    .insert({
      id: sessionId,
      upload_id: uploadId,
      user_id: input.userId,
      course_id: input.courseId || null,
      module_id: input.moduleId || null,
      lesson_id: input.lessonId || null,
      filename: input.filename,
      file_size_bytes: input.fileSizeBytes,
      mime_type: input.mimeType,
      title: input.title || null,
      status: 'pending',
      parts_completed: 0,
      total_parts: totalParts,
      bytes_uploaded: 0,
      bucket_name: config.bucket,
      object_key: objectKey,
      presigned_urls: presignedUrls,
      presigned_urls_expire_at: presignedUrlsExpireAt,
    })
    .select()
    .single()

  if (error) {
    // Clean up S3 multipart upload if database insert fails
    await abortMultipartUpload(objectKey, uploadId).catch(console.error)
    throw new Error(`Failed to create upload session: ${error.message}`)
  }

  return {
    session: mapDbRowToSession(data),
    presignedUrls,
  }
}

/**
 * Get an upload session by ID
 */
export async function getUploadSession(sessionId: string): Promise<UploadSession | null> {
  const supabase = await createServerSupabaseAdmin()

  const { data, error } = await supabase
    .from('video_upload_sessions')
    .select('*')
    .eq('id', sessionId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`Failed to get upload session: ${error.message}`)
  }

  return mapDbRowToSession(data)
}

/**
 * Update upload progress
 */
export async function updateUploadProgress(
  sessionId: string,
  partsCompleted: number,
  bytesUploaded: number
): Promise<UploadSession> {
  const supabase = await createServerSupabaseAdmin()

  const updateData: Record<string, unknown> = {
    parts_completed: partsCompleted,
    bytes_uploaded: bytesUploaded,
  }

  // If any parts are completed, mark as uploading
  if (partsCompleted > 0) {
    updateData.status = 'uploading'
  }

  const { data, error } = await supabase
    .from('video_upload_sessions')
    .update(updateData)
    .eq('id', sessionId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update progress: ${error.message}`)
  }

  return mapDbRowToSession(data)
}

/**
 * Refresh presigned URLs for an upload session
 */
export async function refreshPresignedUrls(sessionId: string): Promise<PartPresignedUrl[]> {
  const session = await getUploadSession(sessionId)
  if (!session) {
    throw new Error('Session not found')
  }

  if (session.status !== 'pending' && session.status !== 'uploading') {
    throw new Error('Cannot refresh URLs for completed/cancelled session')
  }

  // Generate new presigned URLs
  const presignedUrls = await generatePartPresignedUrls(
    session.objectKey,
    session.uploadId,
    session.totalParts
  )

  const supabase = await createServerSupabaseAdmin()

  await supabase
    .from('video_upload_sessions')
    .update({
      presigned_urls: presignedUrls,
      presigned_urls_expire_at: presignedUrls[0]?.expiresAt.toISOString(),
    })
    .eq('id', sessionId)

  return presignedUrls
}

/**
 * Complete an upload and move to video library
 */
export async function completeUpload(input: CompleteUploadInput): Promise<{
  session: UploadSession
  video: Awaited<ReturnType<typeof createVideo>>
}> {
  const session = await getUploadSession(input.sessionId)
  if (!session) {
    throw new Error('Session not found')
  }

  if (session.status === 'completed') {
    throw new Error('Session already completed')
  }

  if (session.status === 'cancelled' || session.status === 'failed') {
    throw new Error(`Cannot complete ${session.status} session`)
  }

  const supabase = await createServerSupabaseAdmin()
  const config = getS3Config()!

  try {
    // Mark as processing
    await supabase
      .from('video_upload_sessions')
      .update({ status: 'processing' })
      .eq('id', input.sessionId)

    // Complete the S3 multipart upload
    const { etag } = await completeMultipartUpload(
      session.objectKey,
      session.uploadId,
      input.parts
    )

    // Generate the library destination key
    const libraryKey = generateLibraryKey({
      videoId: session.id,
      filename: session.filename,
    })

    // Copy from staging to library
    await copyObject(session.objectKey, libraryKey)

    // Delete from staging
    await deleteObject(session.objectKey)

    // Create video library entry
    const videoInput: CreateVideoInput = {
      title: input.title || session.title || session.filename,
      description: input.description,
      originalFilename: session.filename,
      fileSizeBytes: session.fileSizeBytes,
      mimeType: session.mimeType,
      storageKey: libraryKey,
      storageBucket: config.bucket,
      storageProvider: 's3',
      uploadedBy: session.userId,
      courseId: session.courseId || undefined,
      moduleId: session.moduleId || undefined,
      lessonId: session.lessonId || undefined,
      sourceType: 'upload',
      tags: input.tags,
    }

    const video = await createVideo(videoInput)

    // Update session as completed
    const { data, error } = await supabase
      .from('video_upload_sessions')
      .update({
        status: 'completed',
        video_library_id: video.id,
        completed_at: new Date().toISOString(),
        parts_completed: session.totalParts,
        bytes_uploaded: session.fileSizeBytes,
      })
      .eq('id', input.sessionId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update session: ${error.message}`)
    }

    return {
      session: mapDbRowToSession(data),
      video,
    }
  } catch (error) {
    // Mark as failed
    await supabase
      .from('video_upload_sessions')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        retry_count: session.retryCount + 1,
      })
      .eq('id', input.sessionId)

    throw error
  }
}

/**
 * Abort/cancel an upload session
 */
export async function cancelUpload(sessionId: string): Promise<void> {
  const session = await getUploadSession(sessionId)
  if (!session) {
    throw new Error('Session not found')
  }

  if (session.status === 'completed') {
    throw new Error('Cannot cancel completed session')
  }

  const supabase = await createServerSupabaseAdmin()

  // Abort S3 multipart upload
  try {
    await abortMultipartUpload(session.objectKey, session.uploadId)
  } catch (error) {
    console.error('Failed to abort S3 upload:', error)
  }

  // Update session status
  await supabase
    .from('video_upload_sessions')
    .update({ status: 'cancelled' })
    .eq('id', sessionId)
}

/**
 * Get active upload sessions for a user
 */
export async function getActiveSessions(userId: string): Promise<UploadSession[]> {
  const supabase = await createServerSupabaseAdmin()

  const { data, error } = await supabase
    .from('video_upload_sessions')
    .select('*')
    .eq('user_id', userId)
    .in('status', ['pending', 'uploading', 'processing'])
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to get active sessions: ${error.message}`)
  }

  return (data || []).map(mapDbRowToSession)
}

/**
 * Cleanup expired upload sessions
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const supabase = await createServerSupabaseAdmin()

  // Get expired sessions
  const { data: expiredSessions } = await supabase
    .from('video_upload_sessions')
    .select('id, upload_id, object_key')
    .in('status', ['pending', 'uploading'])
    .lt('expires_at', new Date().toISOString())

  if (!expiredSessions || expiredSessions.length === 0) {
    return 0
  }

  // Abort each S3 upload
  for (const session of expiredSessions) {
    try {
      await abortMultipartUpload(session.object_key, session.upload_id)
    } catch (error) {
      console.error(`Failed to abort upload ${session.id}:`, error)
    }
  }

  // Update all as cancelled
  const sessionIds = expiredSessions.map((s) => s.id)
  await supabase
    .from('video_upload_sessions')
    .update({ status: 'cancelled' })
    .in('id', sessionIds)

  return expiredSessions.length
}

/**
 * List all upload sessions with filtering
 */
export async function listUploadSessions(options: {
  userId?: string
  status?: UploadSessionStatus | UploadSessionStatus[]
  limit?: number
  offset?: number
}): Promise<{
  sessions: UploadSession[]
  total: number
}> {
  const supabase = await createServerSupabaseAdmin()

  let query = supabase
    .from('video_upload_sessions')
    .select('*', { count: 'exact' })

  if (options.userId) {
    query = query.eq('user_id', options.userId)
  }

  if (options.status) {
    if (Array.isArray(options.status)) {
      query = query.in('status', options.status)
    } else {
      query = query.eq('status', options.status)
    }
  }

  query = query
    .order('created_at', { ascending: false })
    .range(options.offset || 0, (options.offset || 0) + (options.limit || 20) - 1)

  const { data, error, count } = await query

  if (error) {
    throw new Error(`Failed to list sessions: ${error.message}`)
  }

  return {
    sessions: (data || []).map(mapDbRowToSession),
    total: count || 0,
  }
}
