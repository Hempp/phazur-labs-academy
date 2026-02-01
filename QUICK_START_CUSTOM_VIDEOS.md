# Quick Start: Custom AI Video Generation System

## 🚀 Get Started in 3 Steps

### Step 1: Setup (One-Time, ~30 minutes)

```bash
# Run the automated setup script
npm run setup:video-system

# This installs:
# - Coqui TTS (voice generation)
# - SadTalker (talking head AI)
# - FFmpeg (video processing)
# - All Python dependencies
```

### Step 2: Record Your Voice (5 minutes)

```bash
# Record a 60-second voice sample
npm run record:voice

# Follow the prompts:
# 1. Read the provided script naturally
# 2. Listen to playback
# 3. Re-record if needed
```

### Step 3: Add Instructor Photo

```bash
# Add a clear, front-facing photo of the instructor
# Recommended: Professional headshot, neutral background
cp your-photo.jpg assets/instructor/photo.jpg
```

## 🎬 Generate Your First Video

### Test Video (Fast, Lower Quality)

```bash
npm run generate:custom-video -- --lesson lesson-react-1-1 --test
```

### Production Video (Full Quality)

```bash
npm run generate:custom-video -- --lesson lesson-react-1-1
```

### Custom Script

```bash
npm run generate:custom-video -- \
  --script "Welcome to this custom lesson. Today we'll explore advanced concepts..." \
  --title "Custom Lesson Title"
```

## 📦 Batch Generation

### Single Course

```bash
# Generate all videos for React Patterns course
npm run generate:batch -- --course react-patterns
```

### All Courses

```bash
# Generate ALL course videos (runs overnight)
npm run generate:batch -- --all
```

### Specific Lessons

```bash
npm run generate:batch -- --lessons lesson-react-1-1,lesson-react-1-2,lesson-ts-1-1
```

## 📁 Output Locations

Videos are automatically saved to:
```
public/courses/
├── lesson-react-1-1.mp4
├── lesson-react-1-2.mp4
└── ...
```

## ⚙️ Configuration

### Voice Settings

Edit `scripts/custom-video-generator.py`:

```python
# Use different TTS model
self.tts = TTS("tts_models/en/vctk/vits")  # Different voice model

# Adjust voice cloning
self.tts.tts_to_file(
    text=text,
    speaker_wav=str(self.voice_sample),
    language="en",
    emotion="happy"  # Add emotion (if model supports)
)
```

### Video Quality

Edit SadTalker settings in `custom-video-generator.py`:

```python
# Higher quality (slower)
"--size", "1024"  # Increase from 512
"--fps=60"        # Increase from 30

# Professional settings
"--still"         # Minimal head movement
"--enhancer", "gfpgan"  # Face enhancement
```

### Branding

Customize title cards and effects:

```python
# Add logo overlay
drawtext_filter = (
    f"drawtext=text='Phazur Labs Academy':"
    "fontsize=36:fontcolor=white:x=50:y=50"
)

# Add intro/outro videos
ffmpeg -i intro.mp4 -i main.mp4 -i outro.mp4 \
  -filter_complex "[0:v][1:v][2:v]concat=n=3:v=1:a=1" \
  output.mp4
```

## 🐛 Troubleshooting

### "Coqui TTS not found"

```bash
source venv/bin/activate
pip install coqui-tts --break-system-packages
```

### "SadTalker models missing"

```bash
cd tools/SadTalker
bash scripts/download_models.sh
```

### "Voice sample not found"

```bash
# Re-record voice sample
npm run record:voice

# Or manually place at:
# assets/instructor/voice-sample.wav
```

### "Low quality output"

```bash
# 1. Use production mode (not --test)
# 2. Increase resolution in config
# 3. Use better source photo (high-res, well-lit)
# 4. Re-record voice sample in quiet room
```

### "Generation too slow"

```bash
# Use Apple Silicon GPU (if available)
# Runs automatically on M1/M2/M3 Macs

# Or reduce quality for faster processing
npm run generate:custom-video -- --lesson lesson-react-1-1 --test
```

## 📊 Performance Estimates

| Task | Duration | Hardware |
|------|----------|----------|
| Voice recording | 5 min | Any Mac |
| Setup (one-time) | 30 min | Any Mac |
| Test video | 2-3 min | M1 Mac |
| Production video | 5-10 min | M1 Mac |
| Batch 10 videos | 1-2 hours | M1 Mac |
| Batch all courses (100 videos) | Overnight | M1 Mac |

## 🎯 Quality Checklist

Before generating production videos:

- [ ] Voice sample recorded in quiet room
- [ ] Voice sample is 60+ seconds
- [ ] Instructor photo is high-resolution (1080p+)
- [ ] Photo has neutral background
- [ ] Photo shows clear front-facing view
- [ ] Photo has good lighting
- [ ] Lesson scripts are finalized
- [ ] Test video looks good
- [ ] Audio quality is clear

## 💡 Pro Tips

### Best Voice Sample
- Record in a closet (soft surfaces absorb echo)
- Use AirPods Pro or USB microphone
- Speak as if teaching a student (natural, friendly)
- Include varied intonation and pacing

### Best Instructor Photo
- Professional headshot or webcam screenshot
- Look directly at camera
- Neutral expression or slight smile
- Solid color background (blue/grey works well)
- Good lighting from front (avoid shadows)

### Batch Processing
- Start batch jobs before bed (runs overnight)
- Keep Mac plugged in (prevent sleep)
- Use test mode first to verify quality
- Generate 5 videos → review → generate rest

### Custom Branding
- Create intro.mp4 (5 seconds)
- Create outro.mp4 (5 seconds)
- Modify FFmpeg commands to concat

## 📞 Support

Issues? Check these resources:

- [Coqui TTS Docs](https://github.com/idiap/coqui-ai-TTS)
- [SadTalker GitHub](https://github.com/OpenTalker/SadTalker)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)

## 🎉 Next Steps

Once your first video is generated:

1. Review quality and adjust settings
2. Generate a few more test videos
3. Batch generate full course
4. Upload to CDN (existing scripts)
5. Update course content URLs
6. Launch! 🚀

---

**Questions?** Review the detailed [CUSTOM_VIDEO_SYSTEM_DESIGN.md](CUSTOM_VIDEO_SYSTEM_DESIGN.md) for architecture and technical details.
