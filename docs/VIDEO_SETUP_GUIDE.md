# 📹 Video Setup Guide for Phazur Labs Academy

Complete guide for adding, managing, and deploying course videos.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Video Production](#video-production)
3. [Local Development](#local-development)
4. [Production Deployment](#production-deployment)
5. [Video Management](#video-management)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start

### For Immediate Testing (5 minutes)

1. **Place a test video:**
   ```bash
   # Copy any MP4 file to test
   cp my-video.mp4 public/videos/react-patterns/1-1-welcome.mp4
   ```

2. **Start the dev server:**
   ```bash
   npm run dev
   ```

3. **View the video:**
   Navigate to: `http://localhost:3000/courses/advanced-react-patterns/learn?lesson=lesson-react-1-1`

That's it! Videos in `public/videos/` are automatically served locally.

---

## Video Production

### Recommended Tools

#### Screen Recording
- **OBS Studio** (Free) - Professional, feature-rich
- **Loom** (Free tier) - Easy, cloud-based
- **Camtasia** ($300) - Best for editing

#### AI Avatar Videos
- **HeyGen** - Realistic AI avatars (we have API integration!)
- **Synthesia** - Professional AI presenters
- **D-ID** - Quick AI video generation

### Video Specifications

```yaml
Format: MP4 (H.264 codec)
Resolution: 1080p (1920x1080) or 720p (1280x720)
Frame Rate: 30 fps
Video Bitrate: 2-5 Mbps
Audio Codec: AAC
Audio Bitrate: 128 kbps
```

### Export Settings

**OBS Studio:**
```
Output Mode: Advanced
Encoder: x264
Rate Control: CBR
Bitrate: 3000 Kbps
Keyframe Interval: 2
CPU Preset: veryfast
```

**Camtasia:**
```
Format: MP4 - Smart Player (H.264)
Frame Rate: 30
Video Quality: High (3-5 Mbps)
Audio: AAC 128 kbps
```

### File Naming Convention

```
[section]-[lesson]-[descriptive-name].mp4
```

Examples:
- `1-1-welcome.mp4` - Section 1, Lesson 1
- `2-3-compound-components.mp4` - Section 2, Lesson 3
- `4-2-custom-hooks-advanced.mp4` - Section 4, Lesson 2

---

## Local Development

### Folder Structure

```
public/videos/
├── react-patterns/
│   ├── 1-1-welcome.mp4
│   ├── 1-2-patterns.mp4
│   └── 1-3-setup.mp4
├── python-fundamentals/
│   └── ...
└── machine-learning/
    └── ...
```

### Adding Videos Locally

1. **Copy videos to the appropriate folder:**
   ```bash
   cp ~/my-videos/*.mp4 public/videos/react-patterns/
   ```

2. **Videos are immediately available:**
   - URL pattern: `/videos/{course-slug}/{filename}.mp4`
   - Example: `/videos/react-patterns/1-1-welcome.mp4`

3. **The app automatically resolves URLs:**
   - Development: Uses `/videos/...` (local files)
   - Production: Uses CDN URLs (if configured)

### Verify Videos

```bash
# List all videos
npm run videos:list

# Validate video files
npm run videos:validate
```

---

## Production Deployment

### ⚠️ Important: Don't Deploy Videos to Vercel!

Vercel has strict file size limits. Instead, use a CDN.

### Option 1: Cloudflare R2 (Recommended ⭐)

**Why R2?**
- ✅ Zero egress fees (unlimited bandwidth)
- ✅ Cheap storage ($0.015/GB/month)
- ✅ Fast global CDN
- ✅ S3-compatible API

**Setup Steps:**

1. **Create R2 Bucket:**
   - Go to https://dash.cloudflare.com
   - Navigate to R2 Object Storage
   - Create bucket: `phazur-academy-videos`

2. **Get API Credentials:**
   - Click "Manage R2 API Tokens"
   - Create API token with Read & Write permissions
   - Save: Account ID, Access Key ID, Secret Access Key

3. **Configure Environment:**
   Add to `.env.local`:
   ```env
   R2_ACCOUNT_ID=your_account_id
   R2_ACCESS_KEY_ID=your_access_key_id
   R2_SECRET_ACCESS_KEY=your_secret_key
   R2_BUCKET_NAME=phazur-academy-videos
   R2_PUBLIC_URL=https://videos.phazurlabs.com
   ```

4. **Optional: Custom Domain:**
   - In R2 bucket settings, click "Connect Domain"
   - Add your domain: `videos.phazurlabs.com`
   - Add CNAME record in your DNS
   - Update `R2_PUBLIC_URL` with custom domain

5. **Upload Videos:**
   ```bash
   # Dry run first (preview)
   npm run upload-videos:dry-run

   # Upload all videos
   npm run upload-videos

   # Upload specific course
   npm run upload-videos -- --course=react-patterns
   ```

6. **Deploy App:**
   ```bash
   # Videos are now on R2, deploy your app to Vercel
   git add .
   git commit -m "Add video infrastructure"
   git push
   ```

### Option 2: AWS S3 + CloudFront

**Setup Steps:**

1. **Create S3 Bucket:**
   - Go to AWS Console → S3
   - Create bucket: `phazur-academy-videos`
   - Enable "Public Access" for videos
   - Enable "Static Website Hosting"

2. **Create CloudFront Distribution:**
   - Go to CloudFront → Create Distribution
   - Origin: Your S3 bucket
   - Cache policy: CachingOptimized
   - Copy Distribution URL

3. **Configure IAM User:**
   - Create IAM user with S3 permissions
   - Generate access keys
   - Save credentials

4. **Configure Environment:**
   Add to `.env.local`:
   ```env
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=phazur-academy-videos
   CLOUDFRONT_URL=https://d1234567890.cloudfront.net
   ```

5. **Upload Videos:**
   ```bash
   npm run upload-videos:s3
   ```

### Cost Comparison

| Provider | Storage (100GB) | Bandwidth (1TB) | Total/Month |
|----------|----------------|-----------------|-------------|
| **Cloudflare R2** | $1.50 | **FREE** 🎉 | **$1.50** |
| AWS S3 + CloudFront | $2.30 | $85 | $87.30 |
| BunnyCDN | $1.00 | $10 | $11.00 |

**Winner: Cloudflare R2** - Save $1,000+/year!

---

## Video Management

### List Videos

```bash
npm run videos:list
```

Output:
```
📹 COURSE VIDEOS
================================================================================

📦 react-patterns
   3 videos · 450.5 MB
   ----------------------------------------------------------------------------
   1-1-welcome.mp4                                      150.2 MB
   1-2-patterns.mp4                                     180.3 MB
   1-3-setup.mp4                                        120.0 MB

================================================================================
📊 Total: 3 videos · 450.5 MB
================================================================================
```

### Validate Videos

```bash
npm run videos:validate
```

Checks for:
- File size issues (too small/large)
- Non-standard formats
- Potential corruption

### Check for Missing Videos

```bash
npm run videos:missing
```

Compares course content data with actual files to find missing videos.

---

## Troubleshooting

### Videos Not Playing Locally

**Problem:** Video player shows error

**Solutions:**
1. Check file format (must be MP4 with H.264)
2. Verify file exists: `ls public/videos/react-patterns/`
3. Check browser console for errors
4. Try a different video file

### Upload Failed

**Problem:** `npm run upload-videos` fails

**Solutions:**
1. Verify credentials in `.env.local`
2. Check bucket exists and is accessible
3. Verify API permissions (Read & Write)
4. Try dry run: `npm run upload-videos:dry-run`
5. Check bucket region matches

### Videos Load Slowly

**Problem:** Videos buffer or load slowly

**Solutions:**
1. **Reduce bitrate:**
   ```bash
   ffmpeg -i input.mp4 -b:v 2M -c:a copy output.mp4
   ```

2. **Use 720p:**
   ```bash
   ffmpeg -i input.mp4 -vf scale=1280:720 -b:v 2M output.mp4
   ```

3. **Check CDN configuration:**
   - Verify CloudFront/R2 is enabled
   - Check cache settings
   - Ensure public access

### File Too Large

**Problem:** Video file exceeds 500MB

**Solutions:**
1. **Reduce bitrate:**
   ```bash
   ffmpeg -i large-video.mp4 -b:v 2M -c:a aac -b:a 128k smaller-video.mp4
   ```

2. **Two-pass encoding (better quality):**
   ```bash
   ffmpeg -i input.mp4 -c:v libx264 -b:v 2M -pass 1 -f null /dev/null
   ffmpeg -i input.mp4 -c:v libx264 -b:v 2M -pass 2 output.mp4
   ```

3. **Split into parts:**
   - Divide long lessons into multiple videos
   - Create section breaks naturally

### CDN Not Working in Production

**Problem:** Videos work locally but not in production

**Solutions:**
1. Verify environment variables in Vercel:
   - Go to Project Settings → Environment Variables
   - Add all R2/S3 variables
   - Redeploy

2. Check URLs in course content:
   - URLs should use CDN domain
   - Verify resolveVideoUrl() is being called

3. Test CDN directly:
   - Open CDN URL in browser
   - Should download/play video

---

## Advanced Topics

### Batch Upload Script

Upload multiple courses at once:

```bash
# Upload all courses
for course in public/videos/*/; do
  course_name=$(basename "$course")
  npm run upload-videos -- --course="$course_name"
done
```

### Video Compression Pipeline

Compress all videos in a directory:

```bash
#!/bin/bash
for video in *.mp4; do
  ffmpeg -i "$video" \
    -c:v libx264 -preset slow -crf 23 \
    -c:a aac -b:a 128k \
    "compressed-$video"
done
```

### Automated Testing

Test video playback:

```typescript
// tests/video-playback.test.ts
import { test, expect } from '@playwright/test'

test('video plays successfully', async ({ page }) => {
  await page.goto('/courses/advanced-react-patterns/learn?lesson=lesson-react-1-1')
  const video = page.locator('video')
  await expect(video).toBeVisible()
  await video.click() // Play
  await page.waitForTimeout(2000)
  const isPaused = await video.evaluate((v: HTMLVideoElement) => v.paused)
  expect(isPaused).toBe(false)
})
```

---

## Best Practices

### ✅ Do's

- ✅ Use MP4 (H.264) format
- ✅ Keep videos under 500MB each
- ✅ Use descriptive filenames
- ✅ Test locally before uploading
- ✅ Use Cloudflare R2 for production
- ✅ Enable CDN caching (1 year)
- ✅ Compress videos appropriately

### ❌ Don'ts

- ❌ Don't commit videos to Git
- ❌ Don't deploy videos to Vercel
- ❌ Don't use AVI or MOV formats
- ❌ Don't make videos over 1GB
- ❌ Don't skip compression
- ❌ Don't hardcode URLs

---

## Support & Resources

### Documentation
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [AWS S3 Docs](https://docs.aws.amazon.com/s3/)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)

### Video Tools
- [HandBrake](https://handbrake.fr/) - GUI video compressor
- [FFmpeg](https://ffmpeg.org/) - Command-line video processor
- [OBS Studio](https://obsproject.com/) - Screen recorder

### Need Help?
- Check browser console for errors
- Review upload script output
- Verify environment variables
- Test with sample video first

---

**Happy video creating! 🎥**
