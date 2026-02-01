#!/usr/bin/env ts-node
/**
 * Video Upload Script for AWS S3
 *
 * This script uploads course videos from local public/videos folder to AWS S3
 * with CloudFront CDN integration for fast global delivery.
 *
 * Setup:
 * 1. Install dependencies: npm install @aws-sdk/client-s3 dotenv
 * 2. Add to .env.local:
 *    AWS_ACCESS_KEY_ID=your_access_key
 *    AWS_SECRET_ACCESS_KEY=your_secret_key
 *    AWS_REGION=us-east-1
 *    S3_BUCKET_NAME=phazur-academy-videos
 *    CLOUDFRONT_URL=https://d1234567890.cloudfront.net (optional)
 *
 * Usage:
 *   npm run upload-videos:s3              # Upload all videos
 *   npm run upload-videos:s3 -- --course react-patterns  # Upload specific course
 *   npm run upload-videos:s3 -- --dry-run  # Preview what would be uploaded
 */

import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname, basename } from 'path'
import { config } from 'dotenv'

config({ path: '.env.local' })

interface UploadResult {
  fileName: string
  size: number
  url: string
  success: boolean
  error?: string
}

interface UploadStats {
  total: number
  uploaded: number
  skipped: number
  failed: number
  totalSize: number
}

class S3VideoUploader {
  private client: S3Client
  private bucketName: string
  private baseUrl: string
  private dryRun: boolean

  constructor(dryRun = false) {
    this.dryRun = dryRun

    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
    const region = process.env.AWS_REGION || 'us-east-1'
    this.bucketName = process.env.S3_BUCKET_NAME || 'phazur-academy-videos'

    // Use CloudFront URL if available, otherwise S3 direct URL
    this.baseUrl = process.env.CLOUDFRONT_URL ||
      `https://${this.bucketName}.s3.${region}.amazonaws.com`

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('Missing AWS credentials in .env.local')
    }

    this.client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  }

  async uploadVideo(filePath: string, key: string): Promise<UploadResult> {
    try {
      const fileContent = readFileSync(filePath)
      const stats = statSync(filePath)
      const fileName = basename(filePath)

      const exists = await this.checkFileExists(key)
      if (exists && !this.dryRun) {
        console.log(`⏭️  Skipping ${fileName} (already exists)`)
        return {
          fileName,
          size: stats.size,
          url: `${this.baseUrl}/${key}`,
          success: true,
        }
      }

      if (this.dryRun) {
        console.log(`[DRY RUN] Would upload: ${fileName} -> ${key}`)
        return {
          fileName,
          size: stats.size,
          url: `${this.baseUrl}/${key}`,
          success: true,
        }
      }

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: fileContent,
        ContentType: this.getContentType(filePath),
        CacheControl: 'public, max-age=31536000',
        // Make public for easy access
        ACL: 'public-read',
      })

      await this.client.send(command)

      const url = `${this.baseUrl}/${key}`
      console.log(`✅ Uploaded: ${fileName} -> ${url}`)

      return {
        fileName,
        size: stats.size,
        url,
        success: true,
      }
    } catch (error) {
      console.error(`❌ Failed to upload ${basename(filePath)}:`, error)
      return {
        fileName: basename(filePath),
        size: 0,
        url: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  private async checkFileExists(key: string): Promise<boolean> {
    if (this.dryRun) return false

    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })
      await this.client.send(command)
      return true
    } catch {
      return false
    }
  }

  private getContentType(filePath: string): string {
    const ext = extname(filePath).toLowerCase()
    const contentTypes: Record<string, string> = {
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.mov': 'video/quicktime',
      '.avi': 'video/x-msvideo',
      '.mkv': 'video/x-matroska',
    }
    return contentTypes[ext] || 'application/octet-stream'
  }

  async uploadCourse(courseName: string): Promise<UploadStats> {
    const stats: UploadStats = {
      total: 0,
      uploaded: 0,
      skipped: 0,
      failed: 0,
      totalSize: 0,
    }

    const videosDir = join(process.cwd(), 'public', 'videos', courseName)

    try {
      const files = readdirSync(videosDir)
      const videoFiles = files.filter(f => /\.(mp4|webm|mov|avi|mkv)$/i.test(f))

      console.log(`\n📦 Processing course: ${courseName}`)
      console.log(`   Found ${videoFiles.length} video files\n`)

      for (const file of videoFiles) {
        const filePath = join(videosDir, file)
        const key = `courses/${courseName}/${file}`

        const result = await this.uploadVideo(filePath, key)
        stats.total++
        stats.totalSize += result.size

        if (result.success) {
          if (result.url) {
            stats.uploaded++
          } else {
            stats.skipped++
          }
        } else {
          stats.failed++
        }
      }
    } catch (error) {
      console.error(`Error processing course ${courseName}:`, error)
    }

    return stats
  }

  async uploadAll(): Promise<void> {
    const videosDir = join(process.cwd(), 'public', 'videos')
    const courses = readdirSync(videosDir).filter(f => {
      const path = join(videosDir, f)
      return statSync(path).isDirectory()
    })

    console.log(`🚀 Starting video upload to AWS S3`)
    console.log(`   Bucket: ${this.bucketName}`)
    console.log(`   CDN: ${this.baseUrl}`)
    console.log(`   Courses: ${courses.length}`)
    if (this.dryRun) {
      console.log(`   ⚠️  DRY RUN MODE - No files will be uploaded\n`)
    }

    const allStats: UploadStats = {
      total: 0,
      uploaded: 0,
      skipped: 0,
      failed: 0,
      totalSize: 0,
    }

    for (const course of courses) {
      const stats = await this.uploadCourse(course)
      allStats.total += stats.total
      allStats.uploaded += stats.uploaded
      allStats.skipped += stats.skipped
      allStats.failed += stats.failed
      allStats.totalSize += stats.totalSize
    }

    this.printSummary(allStats)
  }

  private printSummary(stats: UploadStats): void {
    console.log('\n' + '='.repeat(60))
    console.log('📊 UPLOAD SUMMARY')
    console.log('='.repeat(60))
    console.log(`Total files:     ${stats.total}`)
    console.log(`✅ Uploaded:     ${stats.uploaded}`)
    console.log(`⏭️  Skipped:      ${stats.skipped}`)
    console.log(`❌ Failed:       ${stats.failed}`)
    console.log(`📦 Total size:   ${this.formatBytes(stats.totalSize)}`)
    console.log('='.repeat(60) + '\n')
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const courseArg = args.find(arg => arg.startsWith('--course='))
  const specificCourse = courseArg?.split('=')[1]

  try {
    const uploader = new S3VideoUploader(dryRun)

    if (specificCourse) {
      console.log(`Uploading single course: ${specificCourse}`)
      await uploader.uploadCourse(specificCourse)
    } else {
      await uploader.uploadAll()
    }

    console.log('✨ Upload process completed!')
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  }
}

main()
