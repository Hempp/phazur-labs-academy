/**
 * Video Library Service
 *
 * Manages the central video catalog including:
 * - CRUD operations for video entries
 * - Workflow status management (draft -> review -> approved -> published)
 * - Assignment to courses/modules/lessons
 * - Search and filtering
 */

import { createServerSupabaseAdmin } from '@/lib/supabase/server'
import { generateLibraryKey, deleteObject, getVideoUrl } from './s3-storage'

// ============================================================================
// TYPES
// ============================================================================

export type WorkflowStatus = 'draft' | 'review' | 'approved' | 'published'
export type SourceType = 'upload' | 'ai_generated' | 'external' | 'imported'
export type Visibility = 'private' | 'internal' | 'public'
export type StorageProvider = 's3' | 'supabase' | 'bunnycdn'
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface VideoLibraryItem {
  id: string
  title: string
  description: string | null
  slug: string | null
  originalFilename: string
  fileSizeBytes: number
  mimeType: string
  durationSeconds: number | null
  width: number | null
  height: number | null
  resolution: string | null
  storageProvider: StorageProvider
  storageBucket: string
  storageKey: string
  cdnUrl: string | null
  thumbnailUrl: string | null
  thumbnailKey: string | null
  workflowStatus: WorkflowStatus
  courseId: string | null
  moduleId: string | null
  lessonId: string | null
  tags: string[]
  sourceType: SourceType
  sourceReference: string | null
  visibility: Visibility
  uploadedBy: string
  reviewedBy: string | null
  approvedBy: string | null
  createdAt: string
  updatedAt: string
  reviewedAt: string | null
  approvedAt: string | null
  publishedAt: string | null
  processingStatus: ProcessingStatus
  processingError: string | null
  metadata: Record<string, unknown>
  // Joined data
  course?: { id: string; title: string; slug: string } | null
  module?: { id: string; title: string } | null
  lesson?: { id: string; title: string } | null
  uploader?: { id: string; full_name: string; email: string } | null
}

export interface CreateVideoInput {
  title: string
  description?: string
  originalFilename: string
  fileSizeBytes: number
  mimeType: string
  storageKey: string
  storageBucket: string
  storageProvider?: StorageProvider
  uploadedBy: string
  courseId?: string
  moduleId?: string
  lessonId?: string
  sourceType?: SourceType
  sourceReference?: string
  tags?: string[]
  durationSeconds?: number
  width?: number
  height?: number
  resolution?: string
  thumbnailUrl?: string
  thumbnailKey?: string
  metadata?: Record<string, unknown>
}

export interface UpdateVideoInput {
  title?: string
  description?: string
  tags?: string[]
  visibility?: Visibility
  durationSeconds?: number
  width?: number
  height?: number
  resolution?: string
  thumbnailUrl?: string
  thumbnailKey?: string
  metadata?: Record<string, unknown>
}

export interface VideoQueryOptions {
  workflowStatus?: WorkflowStatus | WorkflowStatus[]
  courseId?: string
  moduleId?: string
  lessonId?: string
  uploadedBy?: string
  sourceType?: SourceType | SourceType[]
  visibility?: Visibility | Visibility[]
  tags?: string[]
  search?: string
  processingStatus?: ProcessingStatus
  sortBy?: 'created_at' | 'updated_at' | 'title' | 'duration_seconds' | 'file_size_bytes'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
  includeRelations?: boolean
}

export interface VideoQueryResult {
  videos: VideoLibraryItem[]
  total: number
  limit: number
  offset: number
}

// ============================================================================
// DATABASE HELPERS
// ============================================================================

function mapDbRowToVideo(row: Record<string, unknown>): VideoLibraryItem {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string | null,
    slug: row.slug as string | null,
    originalFilename: row.original_filename as string,
    fileSizeBytes: row.file_size_bytes as number,
    mimeType: row.mime_type as string,
    durationSeconds: row.duration_seconds as number | null,
    width: row.width as number | null,
    height: row.height as number | null,
    resolution: row.resolution as string | null,
    storageProvider: row.storage_provider as StorageProvider,
    storageBucket: row.storage_bucket as string,
    storageKey: row.storage_key as string,
    cdnUrl: row.cdn_url as string | null,
    thumbnailUrl: row.thumbnail_url as string | null,
    thumbnailKey: row.thumbnail_key as string | null,
    workflowStatus: row.workflow_status as WorkflowStatus,
    courseId: row.course_id as string | null,
    moduleId: row.module_id as string | null,
    lessonId: row.lesson_id as string | null,
    tags: (row.tags as string[]) || [],
    sourceType: row.source_type as SourceType,
    sourceReference: row.source_reference as string | null,
    visibility: row.visibility as Visibility,
    uploadedBy: row.uploaded_by as string,
    reviewedBy: row.reviewed_by as string | null,
    approvedBy: row.approved_by as string | null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    reviewedAt: row.reviewed_at as string | null,
    approvedAt: row.approved_at as string | null,
    publishedAt: row.published_at as string | null,
    processingStatus: row.processing_status as ProcessingStatus,
    processingError: row.processing_error as string | null,
    metadata: (row.metadata as Record<string, unknown>) || {},
    course: row.courses as { id: string; title: string; slug: string } | null,
    module: row.modules as { id: string; title: string } | null,
    lesson: row.lessons as { id: string; title: string } | null,
    uploader: row.users as { id: string; full_name: string; email: string } | null,
  }
}

// ============================================================================
// CRUD OPERATIONS
// ============================================================================

/**
 * Create a new video entry in the library
 */
export async function createVideo(input: CreateVideoInput): Promise<VideoLibraryItem> {
  const supabase = await createServerSupabaseAdmin()

  const { data, error } = await supabase
    .from('video_library')
    .insert({
      title: input.title,
      description: input.description || null,
      original_filename: input.originalFilename,
      file_size_bytes: input.fileSizeBytes,
      mime_type: input.mimeType,
      storage_provider: input.storageProvider || 's3',
      storage_bucket: input.storageBucket,
      storage_key: input.storageKey,
      uploaded_by: input.uploadedBy,
      course_id: input.courseId || null,
      module_id: input.moduleId || null,
      lesson_id: input.lessonId || null,
      source_type: input.sourceType || 'upload',
      source_reference: input.sourceReference || null,
      tags: input.tags || [],
      duration_seconds: input.durationSeconds || null,
      width: input.width || null,
      height: input.height || null,
      resolution: input.resolution || null,
      thumbnail_url: input.thumbnailUrl || null,
      thumbnail_key: input.thumbnailKey || null,
      metadata: input.metadata || {},
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create video: ${error.message}`)
  }

  return mapDbRowToVideo(data)
}

/**
 * Get a single video by ID
 */
export async function getVideo(
  id: string,
  includeRelations: boolean = true
): Promise<VideoLibraryItem | null> {
  const supabase = await createServerSupabaseAdmin()

  const selectQuery = includeRelations
    ? '*, courses!course_id(id, title, slug), modules!module_id(id, title), lessons!lesson_id(id, title), users!uploaded_by(id, full_name, email)'
    : '*'

  const { data, error } = await supabase
    .from('video_library')
    .select(selectQuery)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw new Error(`Failed to get video: ${error.message}`)
  }

  return mapDbRowToVideo(data as unknown as Record<string, unknown>)
}

/**
 * Update a video entry
 */
export async function updateVideo(
  id: string,
  input: UpdateVideoInput
): Promise<VideoLibraryItem> {
  const supabase = await createServerSupabaseAdmin()

  const updateData: Record<string, unknown> = {}

  if (input.title !== undefined) updateData.title = input.title
  if (input.description !== undefined) updateData.description = input.description
  if (input.tags !== undefined) updateData.tags = input.tags
  if (input.visibility !== undefined) updateData.visibility = input.visibility
  if (input.durationSeconds !== undefined) updateData.duration_seconds = input.durationSeconds
  if (input.width !== undefined) updateData.width = input.width
  if (input.height !== undefined) updateData.height = input.height
  if (input.resolution !== undefined) updateData.resolution = input.resolution
  if (input.thumbnailUrl !== undefined) updateData.thumbnail_url = input.thumbnailUrl
  if (input.thumbnailKey !== undefined) updateData.thumbnail_key = input.thumbnailKey
  if (input.metadata !== undefined) updateData.metadata = input.metadata

  const { data, error } = await supabase
    .from('video_library')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update video: ${error.message}`)
  }

  return mapDbRowToVideo(data)
}

/**
 * Delete a video (also deletes from S3)
 */
export async function deleteVideo(id: string): Promise<void> {
  const supabase = await createServerSupabaseAdmin()

  // First get the video to get storage key
  const video = await getVideo(id, false)
  if (!video) {
    throw new Error('Video not found')
  }

  // Delete from S3
  if (video.storageProvider === 's3') {
    try {
      await deleteObject(video.storageKey)
      if (video.thumbnailKey) {
        await deleteObject(video.thumbnailKey)
      }
    } catch (error) {
      console.error('Failed to delete video from S3:', error)
      // Continue with database deletion even if S3 delete fails
    }
  }

  // Delete from database
  const { error } = await supabase.from('video_library').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete video: ${error.message}`)
  }
}

/**
 * List videos with filtering and pagination
 */
export async function listVideos(options: VideoQueryOptions = {}): Promise<VideoQueryResult> {
  const supabase = await createServerSupabaseAdmin()

  const {
    workflowStatus,
    courseId,
    moduleId,
    lessonId,
    uploadedBy,
    sourceType,
    visibility,
    tags,
    search,
    processingStatus,
    sortBy = 'created_at',
    sortOrder = 'desc',
    limit = 20,
    offset = 0,
    includeRelations = true,
  } = options

  const selectQuery = includeRelations
    ? '*, courses!course_id(id, title, slug), modules!module_id(id, title), lessons!lesson_id(id, title), users!uploaded_by(id, full_name, email)'
    : '*'

  let query = supabase.from('video_library').select(selectQuery, { count: 'exact' })

  // Apply filters
  if (workflowStatus) {
    if (Array.isArray(workflowStatus)) {
      query = query.in('workflow_status', workflowStatus)
    } else {
      query = query.eq('workflow_status', workflowStatus)
    }
  }

  if (courseId) query = query.eq('course_id', courseId)
  if (moduleId) query = query.eq('module_id', moduleId)
  if (lessonId) query = query.eq('lesson_id', lessonId)
  if (uploadedBy) query = query.eq('uploaded_by', uploadedBy)

  if (sourceType) {
    if (Array.isArray(sourceType)) {
      query = query.in('source_type', sourceType)
    } else {
      query = query.eq('source_type', sourceType)
    }
  }

  if (visibility) {
    if (Array.isArray(visibility)) {
      query = query.in('visibility', visibility)
    } else {
      query = query.eq('visibility', visibility)
    }
  }

  if (processingStatus) query = query.eq('processing_status', processingStatus)

  if (tags && tags.length > 0) {
    query = query.overlaps('tags', tags)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  // Apply sorting
  const sortColumn = sortBy === 'duration_seconds' ? 'duration_seconds' :
                     sortBy === 'file_size_bytes' ? 'file_size_bytes' :
                     sortBy === 'updated_at' ? 'updated_at' :
                     sortBy === 'title' ? 'title' : 'created_at'

  query = query.order(sortColumn, { ascending: sortOrder === 'asc' })

  // Apply pagination
  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    throw new Error(`Failed to list videos: ${error.message}`)
  }

  return {
    videos: ((data || []) as unknown as Record<string, unknown>[]).map(mapDbRowToVideo),
    total: count || 0,
    limit,
    offset,
  }
}

// ============================================================================
// WORKFLOW STATUS OPERATIONS
// ============================================================================

/**
 * Update workflow status with audit trail
 */
export async function updateWorkflowStatus(
  id: string,
  status: WorkflowStatus,
  userId: string
): Promise<VideoLibraryItem> {
  const supabase = await createServerSupabaseAdmin()

  const updateData: Record<string, unknown> = {
    workflow_status: status,
  }

  const now = new Date().toISOString()

  switch (status) {
    case 'review':
      // No additional fields needed
      break
    case 'approved':
      updateData.approved_by = userId
      updateData.approved_at = now
      break
    case 'published':
      updateData.published_at = now
      break
    case 'draft':
      // Reset approval fields when moving back to draft
      updateData.approved_by = null
      updateData.approved_at = null
      updateData.published_at = null
      break
  }

  const { data, error } = await supabase
    .from('video_library')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update workflow status: ${error.message}`)
  }

  return mapDbRowToVideo(data)
}

/**
 * Get videos by workflow status
 */
export async function getVideosByStatus(status: WorkflowStatus): Promise<VideoLibraryItem[]> {
  const result = await listVideos({ workflowStatus: status, limit: 100 })
  return result.videos
}

// ============================================================================
// ASSIGNMENT OPERATIONS
// ============================================================================

/**
 * Assign a video to a lesson (and optionally course/module)
 */
export async function assignVideoToLesson(
  videoId: string,
  lessonId: string,
  options?: {
    courseId?: string
    moduleId?: string
    updateLessonVideoUrl?: boolean
  }
): Promise<VideoLibraryItem> {
  const supabase = await createServerSupabaseAdmin()

  // Get lesson info if we need course/module
  let courseId = options?.courseId
  let moduleId = options?.moduleId

  if (!courseId || !moduleId) {
    const { data: lesson } = await supabase
      .from('lessons')
      .select('course_id, module_id')
      .eq('id', lessonId)
      .single()

    if (lesson) {
      courseId = courseId || lesson.course_id
      moduleId = moduleId || lesson.module_id
    }
  }

  // Update video library entry
  const { data, error } = await supabase
    .from('video_library')
    .update({
      lesson_id: lessonId,
      course_id: courseId,
      module_id: moduleId,
    })
    .eq('id', videoId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to assign video: ${error.message}`)
  }

  const video = mapDbRowToVideo(data)

  // Optionally update the lesson's video_url
  if (options?.updateLessonVideoUrl) {
    const videoUrl = await getVideoUrl(video.storageKey)

    await supabase
      .from('lessons')
      .update({
        video_url: videoUrl,
        video_duration_seconds: video.durationSeconds,
        video_status: 'ready',
      })
      .eq('id', lessonId)
  }

  return video
}

/**
 * Remove video assignment from lesson
 */
export async function removeVideoFromLesson(videoId: string): Promise<VideoLibraryItem> {
  const supabase = await createServerSupabaseAdmin()

  const { data, error } = await supabase
    .from('video_library')
    .update({
      lesson_id: null,
      course_id: null,
      module_id: null,
    })
    .eq('id', videoId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to remove video assignment: ${error.message}`)
  }

  return mapDbRowToVideo(data)
}

// ============================================================================
// STATISTICS
// ============================================================================

/**
 * Get video library statistics
 */
export async function getVideoStats(): Promise<{
  total: number
  byStatus: Record<WorkflowStatus, number>
  bySource: Record<SourceType, number>
  totalSizeBytes: number
  assigned: number
  unassigned: number
}> {
  const supabase = await createServerSupabaseAdmin()

  const { data, error } = await supabase
    .from('video_library')
    .select('workflow_status, source_type, file_size_bytes, lesson_id')

  if (error) {
    throw new Error(`Failed to get video stats: ${error.message}`)
  }

  const videos = data || []

  const byStatus: Record<WorkflowStatus, number> = {
    draft: 0,
    review: 0,
    approved: 0,
    published: 0,
  }

  const bySource: Record<SourceType, number> = {
    upload: 0,
    ai_generated: 0,
    external: 0,
    imported: 0,
  }

  let totalSizeBytes = 0
  let assigned = 0
  let unassigned = 0

  for (const video of videos) {
    byStatus[video.workflow_status as WorkflowStatus]++
    bySource[video.source_type as SourceType]++
    totalSizeBytes += video.file_size_bytes || 0

    if (video.lesson_id) {
      assigned++
    } else {
      unassigned++
    }
  }

  return {
    total: videos.length,
    byStatus,
    bySource,
    totalSizeBytes,
    assigned,
    unassigned,
  }
}
