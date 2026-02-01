# 🎬 Video Quick Start - 5 Minutes to Working Videos

## Immediate Testing (2 minutes)

```bash
# 1. Download a sample video
bash scripts/download-sample-video.sh

# 2. Start dev server
npm run dev

# 3. Open in browser
open http://localhost:3000/courses/advanced-react-patterns/learn
```

✅ Done! Video should be playing.

---

## Add Your Own Videos (5 minutes)

### Step 1: Place Video Files
```bash
# Copy your videos
cp ~/my-videos/*.mp4 public/videos/react-patterns/
```

### Step 2: Verify
```bash
npm run videos:list
```

### Step 3: Test
```bash
npm run dev
```

Videos appear instantly! ✨

---

## Deploy to Production (15 minutes)

### Option A: Cloudflare R2 (Recommended - FREE bandwidth!)

```bash
# 1. Create R2 bucket at https://dash.cloudflare.com
#    Bucket name: phazur-academy-videos

# 2. Get API credentials (R2 → Manage Tokens)

# 3. Add to .env.local:
cat >> .env.local << EOF
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_key
R2_SECRET_ACCESS_KEY=your_secret
R2_BUCKET_NAME=phazur-academy-videos
R2_PUBLIC_URL=https://pub-xxx.r2.dev
EOF

# 4. Upload videos
npm run upload-videos

# 5. Deploy
git push
```

Done! Videos now served from CDN. 🚀

### Option B: AWS S3

```bash
# Same as above, but use:
npm run upload-videos:s3
```

---

## Quick Commands

```bash
# List videos
npm run videos:list

# Validate videos
npm run videos:validate

# Upload to R2
npm run upload-videos

# Upload to S3
npm run upload-videos:s3

# Test upload (no actual upload)
npm run upload-videos:dry-run
```

---

## Video Requirements

✅ **Format**: MP4 (H.264)
✅ **Size**: Under 500MB
✅ **Resolution**: 1080p or 720p
✅ **Bitrate**: 2-5 Mbps

---

## Compress Large Videos

```bash
# Simple compression
ffmpeg -i large.mp4 -b:v 2M -c:a copy small.mp4

# High quality, smaller size
ffmpeg -i large.mp4 -c:v libx264 -crf 23 -preset slow small.mp4

# 720p conversion
ffmpeg -i 1080p.mp4 -vf scale=1280:720 -b:v 2M 720p.mp4
```

---

## Troubleshooting

### Videos not playing?
```bash
# Check format
file public/videos/react-patterns/1-1-welcome.mp4
# Should say: "ISO Media, MP4 v2"

# Verify files exist
ls -lh public/videos/react-patterns/
```

### Upload failed?
```bash
# Test connection
npm run upload-videos:dry-run

# Check credentials
grep R2_ .env.local
```

---

## Need More Help?

📖 **Full Documentation**: `docs/VIDEO_SETUP_GUIDE.md`
📁 **Video Folder Info**: `public/videos/README.md`
🏗️ **Architecture**: `VIDEO_INFRASTRUCTURE.md`

---

**That's it! Start adding videos to your courses! 🎥**
