# 🎬 AI Video Generation Guide for Phazur Labs Academy

## Overview

You have **THREE complete video generation systems** already built and ready to use:

1. **HeyGen Integration** (AI Avatar Videos) - Professional instructor videos
2. **Edge TTS System** (Audio-only) - Free Microsoft Neural Voices
3. **Manual Upload System** (Custom Videos) - Upload your own recordings

---

## 🌟 OPTION 1: HeyGen AI Avatar Videos (RECOMMENDED)

Generate professional instructor videos with AI avatars that look and sound like real teachers.

### Setup

1. **You already have:**
   - ✅ HeyGen API Key configured in `.env.local`
   - ✅ Scripts ready in `scripts/` folder
   - ✅ Lesson scripts with educational content

2. **Run from your Mac (outside the VM):**

```bash
cd /path/to/phazur-labs-academy

# Check available avatars and voices
npx tsx scripts/check-heygen-avatars.ts

# Generate a single test video
npx tsx scripts/generate-course-videos.ts --lesson=lesson-react-1-1

# Generate all videos for a course
npx tsx scripts/generate-course-videos.ts --course=react-patterns

# Generate ALL course videos
npx tsx scripts/generate-course-videos.ts --all
```

### How It Works

1. Script reads lesson data from `lib/data/course-content.ts`
2. Generates educational scripts using ADDIE model + Bloom's Taxonomy
3. Calls HeyGen API to create videos with:
   - AI avatar instructor
   - Natural voice synthesis
   - Professional 1080p quality
4. Downloads completed videos to `public/videos/{course-folder}/`
5. Videos automatically appear in your learning platform!

### Costs

- HeyGen Pricing: ~$0.50 - $1.00 per minute of video
- Your courses have ~200 lessons × 5 min average = 1000 minutes
- Estimated total: **$500-$1000** for all course videos

### Tips

- Use `--test` flag for free test generations (watermarked)
- Generate one lesson first to verify quality
- Batch generate overnight (takes ~2-3 hours for full course)

---

## 🎤 OPTION 2: Edge TTS (FREE Audio-Only)

Generate audio voiceovers for lessons using Microsoft's free Neural Voices.

### Setup

1. **Install Edge TTS (one-time):**

```bash
pip3 install edge-tts
```

2. **Generate audio for all lessons:**

```bash
cd /path/to/phazur-labs-academy

# Generate for lessons without videos
npm run generate:audio

# Regenerate all
npm run generate:audio -- --all
```

### How It Works

1. Reads lessons from database
2. Generates educational scripts
3. Converts text to speech using Microsoft Neural Voices
4. Uploads MP3 files to Supabase storage
5. Updates lesson records with audio URLs

### Pros & Cons

**Pros:**
- ✅ Completely FREE
- ✅ High-quality neural voices
- ✅ Fast generation (seconds per lesson)

**Cons:**
- ❌ Audio-only (no visual instructor)
- ❌ Less engaging than video
- ❌ Students see static interface

---

## 📹 OPTION 3: Record Your Own Videos

Use tools like Loom, OBS, or your phone to record custom instructor videos.

### Recommended Tools

1. **Loom** (loom.com) - Screen + face recording
   - Free for up to 25 videos
   - Export as MP4

2. **OBS Studio** (obsproject.com) - Professional recording
   - Completely free
   - Green screen support
   - Multiple scenes

3. **Mobile Phone** - Simple handheld recording
   - Use good lighting
   - Record horizontally (16:9)
   - Export/convert to MP4

### Workflow

1. **Record videos:**
   - Follow the lesson scripts in `scripts/generate-course-videos.ts`
   - Aim for 3-5 minutes per lesson
   - Use 1080p or 720p resolution

2. **Name files correctly:**
   ```
   public/videos/react-patterns/1-1-welcome.mp4
   public/videos/react-patterns/1-2-patterns.mp4
   public/videos/python-fundamentals/1-1-intro.mp4
   ```

3. **Upload to folder:**
   - Development: Place in `public/videos/`
   - Production: Run `npm run upload-videos`

4. **Videos automatically appear** in the learning interface!

---

## 📁 File Structure

Your videos should be organized like this:

```
public/videos/
├── react-patterns/
│   ├── 1-1-welcome.mp4
│   ├── 1-2-patterns.mp4
│   └── 2-1-compound-intro.mp4
├── python-fundamentals/
│   ├── 1-1-intro.mp4
│   └── 1-2-syntax.mp4
├── machine-learning/
│   └── 1-1-ml-basics.mp4
└── ...
```

---

## 🚀 Quick Start: Generate Your First Video

### Method 1: HeyGen (Best Quality)

```bash
# On your Mac
cd ~/projects/phazur-labs-academy

# Generate first lesson
npx tsx scripts/generate-course-videos.ts --lesson=lesson-react-1-1

# Wait 2-3 minutes for processing
# Video appears in public/videos/react-patterns/1-1-welcome.mp4
```

### Method 2: Edge TTS (FREE)

```bash
# Install edge-tts
pip3 install edge-tts

# Generate audio for first course
cd ~/projects/phazur-labs-academy
npm run generate:audio

# Audio files upload to Supabase automatically
```

### Method 3: Manual Recording

```bash
# Record a 3-minute video with Loom or your phone
# Save as: welcome.mp4

# Copy to correct location
cp ~/Downloads/welcome.mp4 public/videos/react-patterns/1-1-welcome.mp4

# Start dev server
npm run dev

# Open: http://localhost:3000/courses/advanced-react-patterns/learn
# Video plays automatically!
```

---

## 📊 Lesson Scripts Reference

Your video generation scripts include professional educational content for:

### React Patterns Course
- ✅ Lesson 1-1: Welcome & Course Overview (5 min)
- ✅ Lesson 1-2: What are Design Patterns? (12 min)
- ✅ Lesson 1-3: Setting Up Environment (10 min)
- ✅ Lesson 2-1: Understanding Compound Components (15 min)
- ✅ Lesson 2-2: Building a Tabs Component (25 min)

All scripts follow:
- **ADDIE Model** (Analysis, Design, Development, Implementation, Evaluation)
- **Bloom's Taxonomy** (Remember → Understand → Apply → Analyze → Evaluate → Create)
- **400-500 words per script** = 2-3 minute videos

---

## 🎯 Recommended Workflow

**For MVP/Testing (Fast & Free):**
1. Use Edge TTS for audio narration
2. Test with students
3. Gather feedback

**For Production (Professional):**
1. Generate with HeyGen for professional AI instructor videos
2. Or record yourself for authentic personal touch
3. Upload to Cloudflare R2 for fast CDN delivery

**Hybrid Approach:**
1. Use HeyGen for intro/concept lessons
2. Record yourself for hands-on coding lessons
3. Mix both for variety and authenticity

---

## 🔧 Troubleshooting

### "API Key Invalid"
- Check `.env.local` has correct `HEYGEN_API_KEY`
- Verify key hasn't expired at heygen.com

### "edge-tts not found"
```bash
pip3 install edge-tts
# or
pip install edge-tts
```

### "Videos not showing up"
- Check file path matches exactly: `public/videos/{course-slug}/{lesson-id}.mp4`
- Verify file is MP4 format (H.264 codec)
- Restart dev server: `npm run dev`

### "Network/Proxy Errors"
- Run scripts on your Mac (not in VM)
- Check internet connection
- Disable VPN if using one

---

## 📈 Next Steps

1. **Choose your method** (HeyGen recommended for quality)
2. **Generate 1 test video** to verify workflow
3. **Review quality** with your team
4. **Batch generate** all course videos
5. **Upload to production** with `npm run upload-videos`
6. **Launch your courses!** 🎉

---

## 💡 Pro Tips

- **Script Quality**: Your scripts are already professional-grade with educational frameworks built-in
- **Voice Variety**: Use different voices for different instructors (scripts support this)
- **Pacing**: Aim for 2.5 words/second = natural teaching pace
- **Thumbnails**: Generate thumbnail images from first frame using FFmpeg
- **Captions**: Use YouTube auto-captions or Rev.com for accessibility

---

## 📚 Additional Resources

- HeyGen API Docs: https://docs.heygen.com
- Edge TTS Voices: Run `edge-tts --list-voices`
- Loom Tutorial: https://loom.com/tutorials
- Your Scripts: `scripts/generate-course-videos.ts`

---

**You're all set! Your video infrastructure is production-ready. Pick a method and start generating! 🚀**
