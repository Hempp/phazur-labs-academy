# 🎬 Phazur Labs Academy - Video Infrastructure

## Complete Video System Overview

This document provides a complete overview of the video infrastructure for Phazur Labs Academy.

---

## 📁 What We've Built

### 1. Folder Structure
```
public/videos/
├── react-patterns/          # Advanced React Patterns
├── python-fundamentals/     # Python Fundamentals
├── machine-learning/        # Machine Learning
├── web-security/            # Web Security
├── cloud-architecture/      # Cloud Architecture
├── data-science/            # Data Science
└── README.md                # Video folder documentation
```

### 2. Upload Scripts

#### Cloudflare R2 (Recommended)
- **File**: `scripts/upload-videos-r2.ts`
- **Command**: `npm run upload-videos`
- **Features**:
  - Automatic duplicate detection
  - Progress tracking
  - Dry-run mode
  - Zero egress fees!

#### AWS S3 + CloudFront
- **File**: `scripts/upload-videos-s3.ts`
- **Command**: `npm run upload-videos:s3`
- **Features**:
  - S3 bucket integration
  - CloudFront CDN support
  - Public ACL configuration

### 3. Management Tools

**Video Manager** (`scripts/manage-videos.ts`):
```bash
npm run videos:list      # List all videos and sizes
npm run videos:validate  # Check for issues
npm run videos:missing   # Find missing videos
```

### 4. Utilities

- **Video URL Resolver** (`lib/utils/video-urls.ts`)
  - Smart local/CDN switching
  - Automatic environment detection
  - Support for R2, S3, BunnyCDN

- **Sample Video Downloader** (`scripts/download-sample-video.sh`)
  - Download test videos
  - Quick setup for development

### 5. Documentation

- **Setup Guide**: `docs/VIDEO_SETUP_GUIDE.md`
  - Complete production setup
  - Troubleshooting guide
  - Best practices

- **Videos README**: `public/videos/README.md`
  - Quick reference
  - Naming conventions
  - Compression tips

---

## 🚀 Quick Start Workflows

### Development Workflow

```bash
# 1. Download a sample video for testing
bash scripts/download-sample-video.sh

# 2. Start development server
npm run dev

# 3. View video at:
# http://localhost:3000/courses/advanced-react-patterns/learn
```

### Production Workflow

```bash
# 1. Set up Cloudflare R2 (or S3)
# - Create bucket
# - Get API credentials
# - Add to .env.local

# 2. Place your videos in public/videos/
cp ~/my-videos/*.mp4 public/videos/react-patterns/

# 3. Validate videos
npm run videos:validate

# 4. Test upload (dry run)
npm run upload-videos:dry-run

# 5. Upload to CDN
npm run upload-videos

# 6. Deploy to Vercel
git add .
git commit -m "Add course videos"
git push
```

---

## 📊 NPM Scripts Reference

| Command | Purpose |
|---------|---------|
| `npm run videos:list` | List all videos with sizes |
| `npm run videos:validate` | Check video files for issues |
| `npm run videos:missing` | Find missing videos |
| `npm run upload-videos` | Upload to Cloudflare R2 |
| `npm run upload-videos:s3` | Upload to AWS S3 |
| `npm run upload-videos:dry-run` | Preview upload without uploading |

---

## 🔧 Environment Variables

Add these to `.env.local` based on your chosen provider:

### Cloudflare R2 (Recommended)
```env
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=phazur-academy-videos
R2_PUBLIC_URL=https://videos.phazurlabs.com
```

### AWS S3 + CloudFront
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=phazur-academy-videos
CLOUDFRONT_URL=https://d1234567890.cloudfront.net
```

---

## 💰 Cost Analysis

### Monthly Costs (100GB storage, 1TB bandwidth)

| Provider | Storage | Bandwidth | **Total** |
|----------|---------|-----------|-----------|
| **Cloudflare R2** | $1.50 | **FREE** 🎉 | **$1.50** |
| AWS S3 + CloudFront | $2.30 | $85.00 | $87.30 |
| BunnyCDN | $1.00 | $10.00 | $11.00 |

**Recommendation**: Cloudflare R2 saves you $1,000+/year!

---

## 🎯 Video Specifications

### Required Specs
- **Format**: MP4 (H.264 codec)
- **Resolution**: 1080p (1920x1080) or 720p (1280x720)
- **Frame Rate**: 30fps
- **Video Bitrate**: 2-5 Mbps
- **Audio**: AAC codec, 128kbps

### File Size Guidelines
- Short (< 10 min): 50-150 MB
- Medium (10-20 min): 150-300 MB
- Long (20-30 min): 300-500 MB

### Naming Convention
```
[section]-[lesson]-[descriptive-name].mp4

Examples:
- 1-1-welcome.mp4
- 2-3-compound-components.mp4
- 4-2-custom-hooks-advanced.mp4
```

---

## 📝 Course Content Integration

Videos are referenced in `lib/data/course-content.ts`:

```typescript
{
  id: 'lesson-react-1-1',
  title: 'Welcome & Course Overview',
  type: 'video',
  content_url: 'https://cdn.phazurlabs.com/courses/react-patterns/1-1-welcome.mp4',
  duration_minutes: 5,
}
```

The `resolveVideoUrl()` utility automatically:
- Uses `/videos/...` in development
- Uses CDN URLs in production
- No code changes needed!

---

## 🎨 How It Works

### Development
```
User → Next.js → /videos/react-patterns/1-1-welcome.mp4 → Video Player
                 (served from public/videos/)
```

### Production
```
User → Next.js → https://videos.phazurlabs.com/courses/react-patterns/1-1-welcome.mp4 → Video Player
                 (served from Cloudflare R2 CDN)
```

### Smart Resolution
```typescript
// Automatically resolves based on environment
const videoUrl = resolveVideoUrl(
  'https://cdn.phazurlabs.com/courses/react-patterns/1-1-welcome.mp4',
  'react-patterns',
  '1-1-welcome.mp4'
)

// Development: '/videos/react-patterns/1-1-welcome.mp4'
// Production:  'https://videos.phazurlabs.com/courses/react-patterns/1-1-welcome.mp4'
```

---

## 🛠️ Recommended Tools

### Video Production
- **OBS Studio** - Free screen recording
- **Camtasia** - Professional editing
- **HeyGen** - AI avatar videos (integrated!)

### Video Processing
- **HandBrake** - GUI compression
- **FFmpeg** - Command-line processing
```bash
# Compress video
ffmpeg -i input.mp4 -b:v 2M -c:a aac -b:a 128k output.mp4

# Reduce to 720p
ffmpeg -i input.mp4 -vf scale=1280:720 -b:v 2M output.mp4
```

---

## 🚨 Common Issues & Solutions

### "Videos not playing locally"
**Solution**: Ensure videos are in `public/videos/{course}/` and are MP4 format

### "Upload failed"
**Solution**: Check `.env.local` credentials and bucket permissions

### "Videos load slowly"
**Solutions**:
1. Reduce bitrate to 2-3 Mbps
2. Use 720p instead of 1080p
3. Enable CDN caching

### "File too large (>500MB)"
**Solution**: Compress with FFmpeg:
```bash
ffmpeg -i large.mp4 -b:v 2M -c:a aac -b:a 128k compressed.mp4
```

---

## ✅ Best Practices

### Do's ✅
- Use MP4 (H.264) format
- Keep videos under 500MB
- Use descriptive filenames
- Test locally before uploading
- Use Cloudflare R2 for production
- Enable 1-year CDN caching
- Compress appropriately

### Don'ts ❌
- Don't commit videos to Git
- Don't deploy videos to Vercel
- Don't use AVI/MOV formats
- Don't exceed 1GB per file
- Don't skip compression
- Don't hardcode URLs

---

## 🎓 Next Steps

### For Local Testing
```bash
# 1. Get a sample video
bash scripts/download-sample-video.sh

# 2. Start dev server
npm run dev

# 3. Test playback
open http://localhost:3000/courses/advanced-react-patterns/learn
```

### For Production
```bash
# 1. Set up Cloudflare R2 (recommended)
# See: docs/VIDEO_SETUP_GUIDE.md

# 2. Upload your videos
npm run upload-videos

# 3. Deploy
git push
```

---

## 📚 Documentation

- **Setup Guide**: `docs/VIDEO_SETUP_GUIDE.md`
- **Videos README**: `public/videos/README.md`
- **Environment Example**: `.env.example`

---

## 🤝 Support

Need help? Check:
1. Browser console for errors
2. Upload script output
3. Environment variables
4. Sample video test

---

## 📦 Files Created

### Scripts
- `scripts/upload-videos-r2.ts` - Cloudflare R2 uploader
- `scripts/upload-videos-s3.ts` - AWS S3 uploader
- `scripts/manage-videos.ts` - Video management utility
- `scripts/download-sample-video.sh` - Sample video downloader

### Utilities
- `lib/utils/video-urls.ts` - URL resolution utility

### Documentation
- `docs/VIDEO_SETUP_GUIDE.md` - Complete setup guide
- `public/videos/README.md` - Quick reference
- `VIDEO_INFRASTRUCTURE.md` - This file!

### Configuration
- `.env.example` - Environment variables template
- `package.json` - Added video management scripts

---

**You're all set! 🎉**

Start by downloading a sample video or placing your own videos in `public/videos/`, then follow the production workflow when ready to deploy!
