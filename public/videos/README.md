# Course Videos

This directory contains all video files for Phazur Labs Academy courses.

## Structure

```
videos/
├── react-patterns/       # Advanced React Patterns course
├── python-fundamentals/  # Python Fundamentals course
├── machine-learning/     # Machine Learning course
├── web-security/         # Web Security course
├── cloud-architecture/   # Cloud Architecture course
└── data-science/         # Data Science course
```

## Video Specifications

For optimal performance and compatibility:

- **Format**: MP4 (H.264 codec preferred)
- **Resolution**: 1080p (1920x1080) or 720p (1280x720)
- **Frame Rate**: 30fps
- **Bitrate**: 3-5 Mbps for high quality, 1-2 Mbps for standard
- **Audio**: AAC codec, 128kbps

## Naming Convention

Videos should follow this naming pattern:
```
[section-number]-[lesson-number]-[descriptive-name].mp4
```

Examples:
- `1-1-welcome.mp4`
- `2-3-compound-components.mp4`
- `3-1-custom-hooks-intro.mp4`

## Local Development

During development, place video files directly in the course folders:
```bash
public/videos/react-patterns/1-1-welcome.mp4
```

The app will serve them at: `http://localhost:3000/videos/react-patterns/1-1-welcome.mp4`

## Production Deployment

⚠️ **Important**: Do NOT deploy large video files to Vercel!

Vercel has strict file size limits. Instead:

### Option 1: Cloudflare R2 (Recommended ⭐)

**Why R2?**
- Zero egress fees (free bandwidth!)
- Low storage costs ($0.015/GB)
- Fast global CDN
- S3-compatible API

**Setup:**
1. Create Cloudflare R2 bucket at https://dash.cloudflare.com
2. Get API credentials
3. Add to `.env.local`:
   ```
   R2_ACCOUNT_ID=your_account_id
   R2_ACCESS_KEY_ID=your_access_key
   R2_SECRET_ACCESS_KEY=your_secret_key
   R2_BUCKET_NAME=phazur-academy-videos
   R2_PUBLIC_URL=https://videos.phazurlabs.com
   ```
4. Upload videos:
   ```bash
   npm run upload-videos
   ```

### Option 2: AWS S3 + CloudFront

**Setup:**
1. Create S3 bucket
2. Create CloudFront distribution
3. Add to `.env.local`:
   ```
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=phazur-academy-videos
   CLOUDFRONT_URL=https://d1234567890.cloudfront.net
   ```
4. Upload videos:
   ```bash
   npm run upload-videos:s3
   ```

## Video Management Commands

```bash
# List all videos
npm run videos:list

# Validate video files
npm run videos:validate

# Check for missing videos
npm run videos:missing

# Upload to Cloudflare R2
npm run upload-videos

# Upload to AWS S3
npm run upload-videos:s3

# Dry run (preview uploads)
npm run upload-videos:dry-run
```

## File Size Guidelines

Target sizes based on lesson length:

| Lesson Duration | Target Size | Max Size |
|----------------|-------------|----------|
| < 10 minutes   | 50-150 MB   | 200 MB   |
| 10-20 minutes  | 150-300 MB  | 400 MB   |
| 20-30 minutes  | 300-500 MB  | 600 MB   |

### If Videos Are Too Large

Use FFmpeg to compress:

```bash
# Compress to target bitrate
ffmpeg -i input.mp4 -c:v libx264 -b:v 2M -c:a aac -b:a 128k output.mp4

# Reduce resolution to 720p
ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -b:v 2M -c:a aac -b:a 128k output.mp4

# Fast compression preset
ffmpeg -i input.mp4 -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k output.mp4
```

## Video Production Workflow

### 1. Create Your Videos

**Screen Recording:**
- OBS Studio (free, open-source)
- Loom (easy, cloud-hosted)
- Camtasia (professional editing)

**AI Avatar Videos:**
- HeyGen (realistic AI avatars)
- Synthesia (professional AI presenters)
- D-ID (quick AI videos)

### 2. Edit & Export

- Edit in your preferred software
- Export as MP4 (H.264)
- Target 1080p, 30fps, 3-5 Mbps

### 3. Add to Project

**For local testing:**
```bash
cp my-video.mp4 public/videos/react-patterns/1-1-welcome.mp4
```

**For production:**
```bash
cp my-video.mp4 public/videos/react-patterns/1-1-welcome.mp4
npm run upload-videos
```

### 4. Update Course Data

After uploading, the URLs are automatically set in:
- `lib/data/course-content.ts`

The video player will use:
- Local files (`/videos/...`) for development
- CDN URLs for production

## Troubleshooting

### Videos not playing?

1. Check file format: Must be MP4 (H.264)
2. Check file size: Keep under 500MB each
3. Verify file path matches course data
4. Check browser console for errors

### Upload failed?

1. Verify credentials in `.env.local`
2. Check bucket permissions
3. Ensure bucket exists
4. Try dry run first: `npm run upload-videos:dry-run`

### Slow loading?

1. Reduce bitrate (target 2-3 Mbps)
2. Use 720p instead of 1080p
3. Ensure CDN is properly configured
4. Check CloudFront/R2 cache settings

## Cost Estimates

### Cloudflare R2 (Recommended)
- Storage: $0.015/GB/month
- Egress: **FREE** 🎉
- 100GB videos = ~$1.50/month
- 1TB videos = ~$15/month

### AWS S3 + CloudFront
- Storage: $0.023/GB/month
- Egress: $0.085/GB (expensive!)
- CloudFront: $0.085/GB
- 100GB videos + 1TB traffic = ~$90/month

**Winner: Cloudflare R2** - Save thousands on bandwidth!

## Need Help?

- Video encoding: Check FFmpeg docs
- Upload issues: Verify `.env.local` credentials
- Playback issues: Check browser console
- File sizes: Use compression tools

---

**Pro Tip**: Start with local files for testing, then upload to R2 before going live! 🚀
