/**
 * Video URL Resolution Utility
 *
 * Handles smart video URL resolution for development and production:
 * - Development: Uses local /videos/ files
 * - Production: Uses CDN URLs (R2, S3, or BunnyCDN)
 *
 * This allows seamless transition from local development to production
 * without changing course content data.
 */

type VideoStorageProvider = 'r2' | 's3' | 'bunnycdn' | 'local'

interface VideoUrlConfig {
  provider: VideoStorageProvider
  baseUrl: string
  enabled: boolean
}

/**
 * Get the configured video storage provider
 */
function getVideoProvider(): VideoUrlConfig {
  // Check for Cloudflare R2 (priority 1)
  if (process.env.R2_PUBLIC_URL && process.env.R2_BUCKET_NAME) {
    return {
      provider: 'r2',
      baseUrl: process.env.R2_PUBLIC_URL,
      enabled: true,
    }
  }

  // Check for AWS S3/CloudFront (priority 2)
  if (process.env.CLOUDFRONT_URL || process.env.S3_BUCKET_NAME) {
    const baseUrl = process.env.CLOUDFRONT_URL ||
      `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com`
    return {
      provider: 's3',
      baseUrl,
      enabled: true,
    }
  }

  // Check for BunnyCDN (priority 3)
  if (process.env.BUNNYCDN_HOSTNAME) {
    return {
      provider: 'bunnycdn',
      baseUrl: `https://${process.env.BUNNYCDN_HOSTNAME}`,
      enabled: true,
    }
  }

  // Default to local development
  return {
    provider: 'local',
    baseUrl: '',
    enabled: false,
  }
}

/**
 * Resolve a video URL for use in the application
 *
 * Converts CDN URLs to local URLs in development, or vice versa in production.
 *
 * @param cdnUrl - The original CDN URL from course content data
 * @param courseName - The course slug (e.g., 'react-patterns')
 * @param fileName - The video filename (e.g., '1-1-welcome.mp4')
 * @returns The resolved video URL (local or CDN)
 *
 * @example
 * // Development (no CDN configured)
 * resolveVideoUrl(
 *   'https://cdn.phazurlabs.com/courses/react-patterns/1-1-welcome.mp4',
 *   'react-patterns',
 *   '1-1-welcome.mp4'
 * )
 * // Returns: '/videos/react-patterns/1-1-welcome.mp4'
 *
 * // Production (R2 configured)
 * resolveVideoUrl(
 *   'https://cdn.phazurlabs.com/courses/react-patterns/1-1-welcome.mp4',
 *   'react-patterns',
 *   '1-1-welcome.mp4'
 * )
 * // Returns: 'https://videos.phazurlabs.com/courses/react-patterns/1-1-welcome.mp4'
 */
export function resolveVideoUrl(
  cdnUrl: string,
  courseName?: string,
  fileName?: string
): string {
  const config = getVideoProvider()

  // In production with CDN configured, use CDN URL
  if (config.enabled && process.env.NODE_ENV === 'production') {
    // If course and filename are provided, construct URL
    if (courseName && fileName) {
      return `${config.baseUrl}/courses/${courseName}/${fileName}`
    }
    // Otherwise use the CDN URL as-is (after updating domain)
    return cdnUrl.replace(/https:\/\/cdn\.phazurlabs\.com/, config.baseUrl)
  }

  // In development or when CDN is not configured, use local files
  if (courseName && fileName) {
    return `/videos/${courseName}/${fileName}`
  }

  // Fallback: Extract course and filename from CDN URL
  const urlMatch = cdnUrl.match(/\/courses\/([^/]+)\/([^/]+)$/)
  if (urlMatch) {
    const [, course, file] = urlMatch
    return `/videos/${course}/${file}`
  }

  // Last resort: use CDN URL as-is (might not work locally)
  return cdnUrl
}

/**
 * Extract course name and filename from a CDN URL
 *
 * @param cdnUrl - The CDN URL
 * @returns Object with courseName and fileName, or null if not found
 */
export function parseVideoUrl(cdnUrl: string): {
  courseName: string
  fileName: string
} | null {
  const match = cdnUrl.match(/\/courses\/([^/]+)\/([^/]+)$/)
  if (match) {
    return {
      courseName: match[1],
      fileName: match[2],
    }
  }
  return null
}

/**
 * Check if CDN is configured and available
 */
export function isCdnEnabled(): boolean {
  return getVideoProvider().enabled
}

/**
 * Get the active video provider name
 */
export function getActiveProvider(): VideoStorageProvider {
  return getVideoProvider().provider
}

/**
 * Get CDN info for debugging
 */
export function getVideoConfig() {
  const config = getVideoProvider()
  return {
    provider: config.provider,
    baseUrl: config.baseUrl,
    enabled: config.enabled,
    environment: process.env.NODE_ENV,
  }
}
