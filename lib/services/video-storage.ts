// Video Storage Service
// Abstraction layer for video storage providers (Supabase, BunnyCDN, S3, etc.)

import { createServerSupabaseAdmin } from '@/lib/supabase/server'

export type VideoProvider = 'supabase' | 'bunnycdn' | 'local'

export interface VideoUploadOptions {
  file: File | Buffer
  fileName: string
  contentType: string
  courseId: string
  lessonId?: string
  userId: string
  metadata?: Record<string, string>
}

export interface VideoUploadResult {
  success: boolean
  videoId: string
  url: string
  cdnUrl?: string
  thumbnailUrl?: string
  provider: VideoProvider
  size: number
  duration?: number
  error?: string
}

export interface VideoMetadata {
  id: string
  url: string
  cdnUrl?: string
  thumbnailUrl?: string
  provider: VideoProvider
  size: number
  duration?: number
  width?: number
  height?: number
  codec?: string
  status: 'pending' | 'processing' | 'ready' | 'failed'
  createdAt: string
}

// Get the active video provider from environment
export function getVideoProvider(): VideoProvider {
  if (process.env.BUNNYCDN_API_KEY && process.env.BUNNYCDN_STORAGE_ZONE) {
    return 'bunnycdn'
  }
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return 'supabase'
  }
  return 'local'
}

// Generate a unique video ID
function generateVideoId(): string {
  return `vid_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`
}

// Validate video file
export function validateVideoFile(
  file: File | { size: number; type: string },
  options?: { maxSizeMB?: number; allowedTypes?: string[] }
): { valid: boolean; error?: string } {
  const maxSize = (options?.maxSizeMB || 500) * 1024 * 1024 // Default 500MB
  const allowedTypes = options?.allowedTypes || [
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-m4v',
    'video/x-msvideo',
  ]

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${options?.maxSizeMB || 500}MB`,
    }
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
    }
  }

  return { valid: true }
}

// Upload to Supabase Storage
async function uploadToSupabase(options: VideoUploadOptions): Promise<VideoUploadResult> {
  const supabase = await createServerSupabaseAdmin()
  const videoId = generateVideoId()
  const filePath = `courses/${options.courseId}/${videoId}/${options.fileName}`

  // Convert File to ArrayBuffer if needed
  let fileData: ArrayBuffer
  if (options.file instanceof Buffer) {
    fileData = options.file
  } else {
    fileData = await options.file.arrayBuffer()
  }

  const { data, error } = await supabase.storage
    .from('course-videos')
    .upload(filePath, fileData, {
      contentType: options.contentType,
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    return {
      success: false,
      videoId,
      url: '',
      provider: 'supabase',
      size: 0,
      error: error.message,
    }
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('course-videos')
    .getPublicUrl(filePath)

  const fileSize = options.file instanceof Buffer
    ? options.file.length
    : options.file.size

  return {
    success: true,
    videoId,
    url: urlData.publicUrl,
    cdnUrl: urlData.publicUrl, // Supabase has built-in CDN
    provider: 'supabase',
    size: fileSize,
  }
}

// Upload to BunnyCDN
async function uploadToBunnyCDN(options: VideoUploadOptions): Promise<VideoUploadResult> {
  const apiKey = process.env.BUNNYCDN_API_KEY
  const storageZone = process.env.BUNNYCDN_STORAGE_ZONE
  const hostname = process.env.BUNNYCDN_HOSTNAME || `${storageZone}.b-cdn.net`

  if (!apiKey || !storageZone) {
    return {
      success: false,
      videoId: '',
      url: '',
      provider: 'bunnycdn',
      size: 0,
      error: 'BunnyCDN not configured. Set BUNNYCDN_API_KEY and BUNNYCDN_STORAGE_ZONE.',
    }
  }

  const videoId = generateVideoId()
  const filePath = `courses/${options.courseId}/${videoId}/${options.fileName}`

  // Convert File to Buffer if needed
  let fileBuffer: Buffer
  if (options.file instanceof Buffer) {
    fileBuffer = options.file
  } else {
    const arrayBuffer = await options.file.arrayBuffer()
    fileBuffer = Buffer.from(arrayBuffer)
  }

  try {
    // Upload to BunnyCDN Storage
    const response = await fetch(
      `https://storage.bunnycdn.com/${storageZone}/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'AccessKey': apiKey,
          'Content-Type': options.contentType,
        },
        body: fileBuffer,
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        videoId,
        url: '',
        provider: 'bunnycdn',
        size: 0,
        error: `BunnyCDN upload failed: ${errorText}`,
      }
    }

    const cdnUrl = `https://${hostname}/${filePath}`

    return {
      success: true,
      videoId,
      url: cdnUrl,
      cdnUrl,
      provider: 'bunnycdn',
      size: fileBuffer.length,
    }
  } catch (error) {
    return {
      success: false,
      videoId,
      url: '',
      provider: 'bunnycdn',
      size: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Main upload function - routes to appropriate provider
export async function uploadVideo(options: VideoUploadOptions): Promise<VideoUploadResult> {
  const provider = getVideoProvider()

  // Validate file first
  const validation = validateVideoFile(options.file as File)
  if (!validation.valid) {
    return {
      success: false,
      videoId: '',
      url: '',
      provider,
      size: 0,
      error: validation.error,
    }
  }

  switch (provider) {
    case 'bunnycdn':
      return uploadToBunnyCDN(options)
    case 'supabase':
    default:
      return uploadToSupabase(options)
  }
}

// Delete video from storage
export async function deleteVideo(videoId: string, provider: VideoProvider, filePath: string): Promise<boolean> {
  switch (provider) {
    case 'bunnycdn': {
      const apiKey = process.env.BUNNYCDN_API_KEY
      const storageZone = process.env.BUNNYCDN_STORAGE_ZONE

      if (!apiKey || !storageZone) return false

      try {
        const response = await fetch(
          `https://storage.bunnycdn.com/${storageZone}/${filePath}`,
          {
            method: 'DELETE',
            headers: { 'AccessKey': apiKey },
          }
        )
        return response.ok
      } catch {
        return false
      }
    }

    case 'supabase':
    default: {
      const supabase = await createServerSupabaseAdmin()
      const { error } = await supabase.storage
        .from('course-videos')
        .remove([filePath])
      return !error
    }
  }
}

// Get signed URL for protected content (time-limited access)
export async function getSignedVideoUrl(
  filePath: string,
  provider: VideoProvider,
  expiresInSeconds = 3600
): Promise<string | null> {
  switch (provider) {
    case 'bunnycdn': {
      // BunnyCDN uses token authentication for signed URLs
      const securityKey = process.env.BUNNYCDN_SECURITY_KEY
      const hostname = process.env.BUNNYCDN_HOSTNAME

      if (!securityKey || !hostname) {
        // Fall back to public URL if no security key
        return `https://${hostname}/${filePath}`
      }

      const expires = Math.floor(Date.now() / 1000) + expiresInSeconds
      const hashableBase = `${securityKey}${filePath}${expires}`

      // Create token hash (in production, use proper crypto)
      const encoder = new TextEncoder()
      const data = encoder.encode(hashableBase)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const token = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

      return `https://${hostname}/${filePath}?token=${token}&expires=${expires}`
    }

    case 'supabase':
    default: {
      const supabase = await createServerSupabaseAdmin()
      const { data, error } = await supabase.storage
        .from('course-videos')
        .createSignedUrl(filePath, expiresInSeconds)

      if (error) return null
      return data.signedUrl
    }
  }
}

// Save video metadata to database
export async function saveVideoMetadata(
  videoResult: VideoUploadResult,
  options: {
    courseId: string
    lessonId?: string
    userId: string
    title?: string
    description?: string
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseAdmin()

  const { error } = await supabase
    .from('video_generations')
    .insert({
      id: videoResult.videoId,
      user_id: options.userId,
      course_id: options.courseId,
      lesson_id: options.lessonId,
      title: options.title,
      description: options.description,
      video_url: videoResult.url,
      cdn_url: videoResult.cdnUrl,
      thumbnail_url: videoResult.thumbnailUrl,
      provider: videoResult.provider,
      file_size: videoResult.size,
      duration: videoResult.duration,
      status: 'ready',
      created_at: new Date().toISOString(),
    })

  if (error) {
    return { success: false, error: error.message }
  }

  // If lessonId provided, update the lesson with the video URL
  if (options.lessonId) {
    await supabase
      .from('lessons')
      .update({
        video_url: videoResult.cdnUrl || videoResult.url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', options.lessonId)
  }

  return { success: true }
}
