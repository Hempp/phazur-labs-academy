# Phazur Labs Academy - Custom AI Video Generation System

## 🎯 Overview

A **completely free, open-source, high-quality** AI video generation system custom-built for Phazur Labs Academy. No subscriptions, no API costs, runs locally on your Mac.

## 🏗️ Architecture

```
Lesson Script (Text)
    ↓
[1] Text-to-Speech (Coqui TTS / Piper)
    ↓
Audio File (.wav)
    ↓
[2] AI Avatar Generation (SadTalker)
    ↓
Talking Head Video (.mp4)
    ↓
[3] Post-Processing (FFmpeg)
    ↓
Final Course Video (1080p)
    ↓
[4] Upload to CDN
```

## 🔧 Technology Stack

### 1. **Text-to-Speech: Coqui TTS (Primary) + Piper (Backup)**

**Coqui TTS** - Best quality, voice cloning support
- XTTSv2 with 17 languages
- Voice cloning from 30-60 seconds of audio
- Most human-like speech quality
- <200ms latency for streaming

**Piper TTS** - Fast, lightweight backup
- Optimized for local processing
- Natural VITS-based voices
- Privacy-focused (no cloud)

### 2. **Talking Head Generation: SadTalker**

**SadTalker** - Single image → animated talking head
- Generates realistic 3D motion (head pose, expressions)
- Includes Wav2Lip for accurate lip-sync
- Single instructor photo → unlimited videos
- CVPR 2023 research-grade quality

### 3. **Post-Processing: FFmpeg**

- Add title cards, transitions
- Overlay course branding
- Adjust resolution (1080p/720p)
- Compress for web delivery

### 4. **Storage: Existing Supabase + CDN**

- Automated upload to your existing infrastructure
- No changes needed to frontend

## 💰 Cost Comparison

| Solution | Setup Cost | Per Video | 100 Videos |
|----------|-----------|-----------|------------|
| **HeyGen** | $0 | $5-10 | $500-1000 |
| **Our Custom System** | $0 | $0 | **$0** |

## 🎨 Quality Features

✅ **Professional Instructor Avatar**
- Use your photo or hire voice actor for 1 session
- Record 60 seconds of speech → clone voice forever
- Consistent instructor across all courses

✅ **Natural Speech & Expressions**
- Human-like intonation and pacing
- Realistic head movements and eye contact
- Synchronized lip movements

✅ **Customizable Branding**
- Add Phazur Labs intro/outro
- Custom backgrounds and overlays
- Course-specific styling

## 📋 Setup Requirements

### Hardware
- Mac with 16GB+ RAM (you have this)
- ~50GB storage for models
- GPU recommended but not required

### Software
- Python 3.10+
- FFmpeg
- Node.js (already installed)

### Time Investment
- Initial setup: 2-3 hours
- First video: 15-30 minutes
- Subsequent videos: 5-10 minutes each (automated)

## 🚀 Workflow

### One-Time Setup
1. Install Coqui TTS + SadTalker
2. Record instructor voice sample (60 seconds)
3. Choose/create instructor photo
4. Test first video generation

### Per-Video Process (Automated)
```bash
# Run single command:
npm run generate:custom-video -- --lesson=lesson-react-1-1

# Behind the scenes:
# 1. Extract lesson script from course-content.ts
# 2. Generate audio with Coqui TTS (cloned voice)
# 3. Generate talking head with SadTalker
# 4. Add branding/effects with FFmpeg
# 5. Upload to Supabase/CDN
# 6. Update database with video URL
```

## 📊 Performance Estimates

### Generation Speed (per 3-minute video)
- TTS Audio: 10-30 seconds
- SadTalker Video: 3-8 minutes
- Post-processing: 1-2 minutes
- **Total: ~5-10 minutes per video**

### Batch Processing
- Generate overnight: 50-100 videos
- Fully automated queue system
- Email notification when complete

## 🎯 Next Steps

1. **Phase 1: Setup** (Today)
   - Install dependencies
   - Configure tools
   - Record voice sample

2. **Phase 2: Test** (Tomorrow)
   - Generate first test video
   - Refine quality settings
   - Test upload pipeline

3. **Phase 3: Production** (This Week)
   - Batch generate all React course videos
   - Review and publish
   - Expand to other courses

## 📚 Technical Resources

### Open Source Tools
- [Coqui TTS](https://github.com/idiap/coqui-ai-TTS) - Text-to-Speech
- [Piper](https://github.com/rhasspy/piper) - Backup TTS
- [SadTalker](https://github.com/OpenTalker/SadTalker) - Talking head generation
- [FFmpeg](https://ffmpeg.org/) - Video processing

### Alternative Commercial Options (for reference)
- [HeyGen Alternatives](https://www.synthesia.io/post/heygen-alternatives-competitors)
- [Best Open Source Lip-Sync Models](https://www.pixazo.ai/blog/best-open-source-lip-sync-models)
- [Open Source TTS Models 2026](https://www.bentoml.com/blog/exploring-the-world-of-open-source-text-to-speech-models)

## 🔒 Privacy & Control

✅ All processing runs locally on your Mac
✅ No data sent to third-party APIs
✅ Full control over voice and avatar
✅ No usage limits or quotas
✅ Own all generated content forever

## 🎓 Educational Quality

Your lesson scripts already use:
- **ADDIE Model** (Analysis, Design, Development, Implementation, Evaluation)
- **Bloom's Taxonomy** (Learning objectives hierarchy)
- Professional 400-500 word scripts
- Structured introduction → concept → practice → summary

The custom system will preserve all this educational rigor while adding:
- Visual instructor presence
- Natural vocal delivery
- Consistent professional quality

---

**Ready to build this?** Let's start with Phase 1 setup!
