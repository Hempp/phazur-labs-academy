# 🎬 Phazur Labs Academy - Production Video Generation

## Quick Start Guide for Your Courses

This guide shows you how to generate professional AI instructor videos for **your actual Phazur Labs courses** using the custom video system.

---

## 🚀 One-Time Setup (30 Minutes)

### Step 1: Install Dependencies

```bash
cd ~/projects/phazur-labs-academy
npm run setup:video-system
```

This installs:
- ✅ Coqui TTS (voice generation)
- ✅ SadTalker (AI talking head)
- ✅ FFmpeg (video processing)
- ✅ All Python dependencies

### Step 2: Record Your Instructor Voice

```bash
npm run record:voice
```

**Tips for best quality:**
- Find a quiet room (closet works great!)
- Use AirPods Pro or USB microphone
- Speak naturally, as if teaching
- 60+ seconds of clear speech

### Step 3: Add Instructor Photo

```bash
# Copy your professional headshot
cp /path/to/your-photo.jpg assets/instructor/photo.jpg
```

**Requirements:**
- High resolution (1080p+)
- Front-facing, centered
- Good lighting, neutral background
- Professional appearance

### Step 4: Extract Course Scripts

```bash
npm run videos:extract-scripts
```

This reads your `course-content.ts` and generates professional educational scripts for every video lesson!

---

## 📚 Your Available Courses

Run this to see all your lessons:

```bash
npm run videos:list-lessons
```

You should see:
- **Advanced React Patterns** (20+ lessons)
- **TypeScript Mastery** (15+ lessons)
- **Node.js Backend** (18+ lessons)
- And all other courses!

---

## 🎬 Generate Videos

### Option 1: Generate One Lesson (Test First!)

```bash
# Test mode (fast, lower quality) - perfect for testing
npm run videos:generate -- --lesson lesson-react-1-1 --test

# Production mode (full quality)
npm run videos:generate -- --lesson lesson-react-1-1
```

**Review your first video:**
```bash
open public/courses/lesson-react-1-1.mp4
```

### Option 2: Generate Entire Course

```bash
# All React lessons
npm run videos:generate -- --course react

# All TypeScript lessons
npm run videos:generate -- --course typescript

# All Node.js lessons
npm run videos:generate -- --course node
```

**Estimated time:**
- 20 lessons = 2-3 hours (automated)
- You can start it and walk away!

### Option 3: Generate ALL Courses (Overnight)

```bash
npm run videos:generate -- --all
```

**This generates videos for every course!**
- Estimated: 8-16 hours (overnight job)
- Keep Mac plugged in
- Disable sleep mode

---

## 📋 Complete Workflow

### Day 1: Setup & Test

```bash
# 1. Setup (30 min)
npm run setup:video-system
npm run record:voice
cp your-photo.jpg assets/instructor/photo.jpg

# 2. Extract scripts (2 min)
npm run videos:extract-scripts

# 3. Generate test video (3 min)
npm run videos:generate -- --lesson lesson-react-1-1 --test

# 4. Review
open public/courses/lesson-react-1-1.mp4
```

**If quality looks good, proceed to production!**

### Day 2: Generate First Course

```bash
# Generate all React lessons (2-3 hours)
npm run videos:generate -- --course react
```

**While it runs:**
- ☕ Take breaks
- 📧 Check email
- 💼 Do other work
- System runs automatically!

### Day 3+: Batch Generate Remaining Courses

```bash
# Generate TypeScript course
npm run videos:generate -- --course typescript

# Generate Node.js course
npm run videos:generate -- --course node

# Or generate everything overnight
npm run videos:generate -- --all
```

---

## 🎯 Your Generated Videos

Videos are saved to:
```
public/courses/
├── lesson-react-1-1.mp4       ← "Welcome & Course Overview"
├── lesson-react-1-2.mp4       ← "Compound Components Pattern"
├── lesson-react-1-3.mp4       ← "Render Props Deep Dive"
├── lesson-ts-1-1.mp4          ← TypeScript lessons
├── lesson-node-1-1.mp4        ← Node.js lessons
└── ...                        ← All your courses!
```

These match exactly with your course URLs in `course-content.ts`!

---

## 📊 What Gets Generated

Each video includes:

✅ **Professional Script** - Educational frameworks (ADDIE, Bloom's Taxonomy)
✅ **Your Cloned Voice** - Natural, human-like speech
✅ **AI Instructor** - Realistic talking head from your photo
✅ **Course Branding** - Title cards and professional quality
✅ **Perfect Timing** - 2-3 minutes per lesson (400-500 words)

### Script Types by Lesson

The system automatically generates appropriate scripts based on lesson type:

- **Introduction lessons**: Welcoming, course overview
- **Concept lessons**: Clear explanations with examples
- **Practice lessons**: Hands-on, step-by-step guidance
- **Advanced lessons**: Deep dives into complex topics
- **Project lessons**: Synthesis and real-world application
- **Summary lessons**: Recap and next steps

---

## 🔧 Customization

### Adjust Quality Settings

Edit `scripts/custom-video-generator.py`:

```python
# Higher resolution
"--size", "1024"  # Increase from 512

# Higher frame rate
"--fps=60"  # Increase from 30

# More enhancement
"--enhancer", "gfpgan"
```

### Custom Branding

Add your logo or custom intro:

```bash
# Create branded intro
ffmpeg -i assets/branding/intro.mp4 \
       -i public/courses/lesson-react-1-1.mp4 \
       -filter_complex "[0:v][1:v]concat=n=2:v=1:a=1" \
       output.mp4
```

### Different Voice/Photo

Update assets anytime:

```bash
# Re-record voice
npm run record:voice

# Replace photo
cp new-instructor.jpg assets/instructor/photo.jpg

# Regenerate videos use new assets automatically!
```

---

## 💰 Cost Savings for Phazur Labs

### If you used HeyGen:

| Courses | Videos | HeyGen Cost | Your Cost | Savings |
|---------|--------|-------------|-----------|---------|
| 1 course | 20 | $100-200 | $0 | $100-200 |
| 3 courses | 60 | $300-600 | $0 | $300-600 |
| 5 courses | 100 | $500-1,000 | $0 | $500-1,000 |
| **All courses** | **200+** | **$1,000-2,000** | **$0** | **$1,000-2,000** |

**Plus annual updates:** $500-1,000/year saved!

---

## 🐛 Troubleshooting

### "Scripts not found"

```bash
# Re-run extraction
npm run videos:extract-scripts
```

### "Voice sample missing"

```bash
# Re-record
npm run record:voice
```

### "Low quality output"

```bash
# 1. Don't use --test flag
# 2. Use high-res photo (1080p+)
# 3. Re-record voice in quiet room
# 4. Increase quality settings (see Customization above)
```

### "Generation is slow"

```bash
# Use test mode for quick preview
npm run videos:generate -- --lesson lesson-react-1-1 --test

# For production, let it run overnight
# M1/M2/M3 Macs are much faster than Intel
```

---

## 📈 Recommended Workflow

### Week 1: Setup + Test

- Day 1: Setup system, record voice, test first video
- Day 2: Refine quality, adjust settings
- Day 3: Generate 5 test videos, review quality

### Week 2: Production

- Day 1: Generate React course (overnight)
- Day 2: Generate TypeScript course (overnight)
- Day 3: Generate Node.js course (overnight)

### Week 3: Finish + Polish

- Generate remaining courses
- Review all videos
- Upload to CDN
- Update course URLs

### Week 4: Launch! 🚀

- Publish courses with videos
- Monitor student engagement
- Collect feedback

---

## ✅ Quality Checklist

Before generating all videos:

- [ ] Voice sample is clear and professional
- [ ] Instructor photo is high-resolution
- [ ] Test video looks good
- [ ] Audio quality is excellent
- [ ] Lip sync is accurate
- [ ] Branding matches your style
- [ ] Script content is appropriate

---

## 🎉 You're Ready!

You now have everything you need to generate **hundreds of professional AI instructor videos** for Phazur Labs Academy - completely free!

### Next Steps:

1. **Extract scripts**: `npm run videos:extract-scripts`
2. **Test one video**: `npm run videos:generate -- --lesson lesson-react-1-1 --test`
3. **Generate a course**: `npm run videos:generate -- --course react`
4. **Go big**: `npm run videos:generate -- --all` (overnight)

**Questions?** Check:
- [QUICK_START_CUSTOM_VIDEOS.md](QUICK_START_CUSTOM_VIDEOS.md) - Detailed setup guide
- [CUSTOM_VIDEO_SYSTEM_DESIGN.md](CUSTOM_VIDEO_SYSTEM_DESIGN.md) - Technical architecture
- [SYSTEM_COMPARISON.md](SYSTEM_COMPARISON.md) - Cost analysis

---

**Let's create amazing courses for your students! 🎓**
