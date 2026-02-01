#!/usr/bin/env ts-node
/**
 * Video Management Utility
 *
 * Helpful utilities for managing course videos:
 * - List all videos and their sizes
 * - Validate video files
 * - Generate video metadata
 * - Check for missing videos
 * - Generate placeholder video files for testing
 *
 * Usage:
 *   npm run manage-videos -- --list           # List all videos
 *   npm run manage-videos -- --validate       # Validate video files
 *   npm run manage-videos -- --missing        # Find missing videos
 *   npm run manage-videos -- --placeholder    # Generate placeholder videos
 */

import { readdirSync, statSync, existsSync } from 'fs'
import { join } from 'path'

interface VideoInfo {
  course: string
  fileName: string
  size: number
  path: string
}

class VideoManager {
  private videosDir: string

  constructor() {
    this.videosDir = join(process.cwd(), 'public', 'videos')
  }

  /**
   * List all videos across all courses
   */
  listVideos(): VideoInfo[] {
    const videos: VideoInfo[] = []

    if (!existsSync(this.videosDir)) {
      console.log('❌ Videos directory does not exist')
      return videos
    }

    const courses = readdirSync(this.videosDir).filter(f => {
      const path = join(this.videosDir, f)
      return statSync(path).isDirectory()
    })

    for (const course of courses) {
      const courseDir = join(this.videosDir, course)
      const files = readdirSync(courseDir)
      const videoFiles = files.filter(f => /\.(mp4|webm|mov|avi|mkv)$/i.test(f))

      for (const file of videoFiles) {
        const filePath = join(courseDir, file)
        const stats = statSync(filePath)

        videos.push({
          course,
          fileName: file,
          size: stats.size,
          path: filePath,
        })
      }
    }

    return videos
  }

  /**
   * Print video list with formatting
   */
  printVideoList(): void {
    const videos = this.listVideos()

    if (videos.length === 0) {
      console.log('📭 No videos found\n')
      return
    }

    console.log('\n📹 COURSE VIDEOS\n')
    console.log('='.repeat(80))

    const courseGroups = videos.reduce((acc, video) => {
      if (!acc[video.course]) {
        acc[video.course] = []
      }
      acc[video.course].push(video)
      return acc
    }, {} as Record<string, VideoInfo[]>)

    for (const [course, vids] of Object.entries(courseGroups)) {
      const totalSize = vids.reduce((sum, v) => sum + v.size, 0)
      console.log(`\n📦 ${course}`)
      console.log(`   ${vids.length} videos · ${this.formatBytes(totalSize)}`)
      console.log('   ' + '-'.repeat(76))

      vids.forEach(video => {
        console.log(`   ${video.fileName.padEnd(50)} ${this.formatBytes(video.size).padStart(10)}`)
      })
    }

    const totalSize = videos.reduce((sum, v) => sum + v.size, 0)
    console.log('\n' + '='.repeat(80))
    console.log(`📊 Total: ${videos.length} videos · ${this.formatBytes(totalSize)}`)
    console.log('='.repeat(80) + '\n')
  }

  /**
   * Validate video files
   */
  validateVideos(): void {
    const videos = this.listVideos()
    console.log('\n🔍 VALIDATING VIDEOS\n')

    let issues = 0

    for (const video of videos) {
      const warnings: string[] = []

      // Check file size (warn if too small or too large)
      if (video.size < 1024 * 100) { // < 100KB
        warnings.push('File too small - possibly corrupted')
        issues++
      }
      if (video.size > 1024 * 1024 * 1024) { // > 1GB
        warnings.push('File very large - consider compression')
        issues++
      }

      // Check file extension
      const ext = video.fileName.toLowerCase().split('.').pop()
      if (ext !== 'mp4' && ext !== 'webm') {
        warnings.push(`Non-standard format (.${ext}) - recommend MP4 or WebM`)
        issues++
      }

      if (warnings.length > 0) {
        console.log(`⚠️  ${video.course}/${video.fileName}`)
        warnings.forEach(w => console.log(`   - ${w}`))
      }
    }

    if (issues === 0) {
      console.log('✅ All videos passed validation!')
    } else {
      console.log(`\n⚠️  Found ${issues} potential issues`)
    }
    console.log()
  }

  /**
   * Check for missing videos based on course data
   */
  checkMissingVideos(): void {
    console.log('\n🔍 CHECKING FOR MISSING VIDEOS\n')
    console.log('This feature requires parsing course-content.ts')
    console.log('TODO: Implement parsing logic to detect missing videos\n')
  }

  /**
   * Generate a README for the videos folder
   */
  generateReadme(): string {
    return `# Course Videos

This directory contains all video files for Phazur Labs Academy courses.

## Structure

\`\`\`
videos/
├── react-patterns/       # Advanced React Patterns course
├── python-fundamentals/  # Python Fundamentals course
├── machine-learning/     # Machine Learning course
├── web-security/         # Web Security course
├── cloud-architecture/   # Cloud Architecture course
└── data-science/         # Data Science course
\`\`\`

## Video Specifications

For optimal performance and compatibility:

- **Format**: MP4 (H.264 codec preferred)
- **Resolution**: 1080p (1920x1080)
- **Frame Rate**: 30fps
- **Bitrate**: 3-5 Mbps for high quality
- **Audio**: AAC codec, 128kbps

## Naming Convention

Videos should follow this naming pattern:
\`\`\`
[section-number]-[lesson-number]-[descriptive-name].mp4
\`\`\`

Examples:
- \`1-1-welcome.mp4\`
- \`2-3-compound-components.mp4\`
- \`3-1-custom-hooks-intro.mp4\`

## Uploading Videos

### To Local Storage (Development)
Simply place video files in the appropriate course folder.

### To Cloudflare R2 (Production - Recommended)
\`\`\`bash
npm run upload-videos
\`\`\`

### To AWS S3 (Alternative)
\`\`\`bash
npm run upload-videos:s3
\`\`\`

## CDN Integration

For production, videos should be hosted on:
- **Cloudflare R2** (recommended - zero egress fees)
- **AWS S3 + CloudFront** (alternative)

Update the CDN URLs in \`lib/data/course-content.ts\` after uploading.

## File Size Guidelines

- Short lessons (< 10 min): ~50-150 MB
- Medium lessons (10-20 min): ~150-300 MB
- Long lessons (20-30 min): ~300-500 MB

If videos exceed these sizes, consider:
1. Reducing bitrate
2. Using 720p instead of 1080p
3. Compressing with HandBrake or FFmpeg

## Tools

- **List videos**: \`npm run manage-videos -- --list\`
- **Validate videos**: \`npm run manage-videos -- --validate\`
- **Upload to R2**: \`npm run upload-videos\`
- **Upload to S3**: \`npm run upload-videos:s3\`
`
  }

  /**
   * Format bytes to human-readable string
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2)
  const manager = new VideoManager()

  if (args.includes('--list')) {
    manager.printVideoList()
  } else if (args.includes('--validate')) {
    manager.validateVideos()
  } else if (args.includes('--missing')) {
    manager.checkMissingVideos()
  } else if (args.includes('--readme')) {
    console.log(manager.generateReadme())
  } else {
    console.log(`
📹 Video Management Utility

Usage:
  npm run manage-videos -- --list      List all videos
  npm run manage-videos -- --validate  Validate video files
  npm run manage-videos -- --missing   Check for missing videos
  npm run manage-videos -- --readme    Generate README content
    `)
  }
}

main()
