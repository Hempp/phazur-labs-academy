# 🎬 Demo Instructions - Generate Your First Video!

## ⚠️ Important: Run on Your Mac

The video generation system **must run on your actual Mac** (not in the VM). Here's exactly what to do:

---

## 🚀 Step-by-Step Demo (45 Minutes Total)

### Step 1: Open Terminal on Your Mac

1. Press `Cmd + Space`
2. Type "Terminal"
3. Press Enter

### Step 2: Navigate to Project

```bash
cd ~/projects/phazur-labs-academy
```

### Step 3: Install Video System (30 minutes, ONE-TIME)

```bash
npm run setup:video-system
```

**What this does:**
- ✅ Installs Homebrew packages (Python, FFmpeg)
- ✅ Creates Python virtual environment
- ✅ Installs Coqui TTS (voice generation)
- ✅ Installs SadTalker (AI talking head)
- ✅ Downloads AI models (~50GB)
- ✅ Tests all installations

**Expected output:**
```
🎬 Setting up Phazur Labs Custom Video Generation System...
📋 Checking system requirements...
✓ Python version: 3.10.x
✓ Total RAM: 16GB
✓ Available storage: 200GB
📦 Installing dependencies...
→ Installing system packages via Homebrew...
→ Creating Python virtual environment...
→ Installing Coqui TTS...
→ Installing SadTalker dependencies...
→ Cloning SadTalker...
→ Downloading SadTalker models (this may take a while)...
🧪 Testing installations...
✓ Coqui TTS installed successfully
✓ PyTorch 2.x.x installed successfully
✓ MPS (Apple Silicon GPU) available
✓ ffmpeg version 6.x
✅ Setup complete!
```

**If you see errors:**
- Make sure you have 50GB+ free space
- Check internet connection
- Retry: `npm run setup:video-system`

---

### Step 4: Record Your Voice (5 minutes)

```bash
npm run record:voice
```

**What happens:**
1. Script displays text for you to read
2. Countdown: 3... 2... 1... RECORD!
3. You read the script naturally (60 seconds)
4. Recording stops automatically
5. Plays back your recording
6. Confirms quality

**Tips for best quality:**
- Use quiet room (closet works great!)
- AirPods Pro or USB microphone
- Speak naturally, like teaching
- Don't rush - normal pace

**Expected output:**
```
🎤 Phazur Labs Academy - Voice Sample Recorder

This will record a 60-second voice sample for AI voice cloning.
Tips for best results:
  • Use a quiet room with minimal background noise
  • Speak naturally, as if teaching a student
  • Maintain consistent volume and pace
  • Use a good microphone (USB mic or AirPods work well)

📝 Please read this script when recording starts:

"Welcome to Phazur Labs Academy. In this course, we'll explore..."

Press ENTER when ready to record...
🔴 RECORDING NOW! (60 seconds)
✅ Recording complete!
🔊 Playing back your recording...
Questions:
1. Was the recording clear? (y/n)
y
✅ Great! Voice sample saved successfully.
```

---

### Step 5: Add Instructor Photo (1 minute)

```bash
# Use your professional headshot
cp /path/to/your-headshot.jpg assets/instructor/photo.jpg

# For example:
# cp ~/Desktop/headshot.jpg assets/instructor/photo.jpg
```

**Photo requirements:**
- High resolution (1080p+)
- Front-facing, centered
- Good lighting
- Neutral background
- Professional appearance

---

### Step 6: Activate Python Environment

```bash
source venv/bin/activate
```

Your prompt should now show `(venv)`:
```
(venv) user@mac phazur-labs-academy %
```

---

### Step 7: Generate TEST Video (3 minutes - Fast!)

```bash
# Quick test (lower quality, faster)
python3 scripts/generate-phazur-videos.py --extract --lesson lesson-react-1-1 --test
```

**What this does:**
1. Extracts lesson scripts from course content
2. Generates audio from script using YOUR voice
3. Creates talking head video from YOUR photo
4. Adds branding and effects
5. Saves final video

**Expected output:**
```
📚 Extracting lesson scripts from course content...
✅ Scripts extracted successfully!
✅ Loaded 5 lesson scripts

============================================================
🎬 Generating: Welcome & Course Overview
   Course: Advanced React Patterns
   Lesson ID: lesson-react-1-1
============================================================

🎤 Loading Coqui TTS model...
🎵 Generating audio with TTS...
   Using voice clone from: assets/instructor/voice-sample.wav
✅ Audio generated: /tmp/lesson-react-1-1_audio.wav

🎬 Generating talking head video with SadTalker...
   Running in TEST mode (faster, lower quality)
   Running: python tools/SadTalker/inference.py --driven_audio ...
✅ Video generated successfully

✨ Adding branding and effects...
✅ Branding added: public/courses/lesson-react-1-1.mp4

============================================================
✅ VIDEO GENERATION COMPLETE!
============================================================
📁 Output: public/courses/lesson-react-1-1.mp4
📊 Size: 15.4 MB
```

**Timing:**
- Audio generation: 10-30 seconds
- Video generation: 1-2 minutes (test mode)
- Post-processing: 10-20 seconds
- **Total: ~2-3 minutes**

---

### Step 8: Review Your Video!

```bash
open public/courses/lesson-react-1-1.mp4
```

**What to check:**
- ✅ Voice sounds natural and clear
- ✅ Lip sync matches audio
- ✅ Facial expressions look realistic
- ✅ Video quality acceptable
- ✅ Title card displays lesson name

**If quality is good, proceed to production!**
**If not, adjust settings (see Troubleshooting below)**

---

### Step 9: Generate PRODUCTION Quality Video (5-10 minutes)

```bash
# Remove --test flag for full quality
python3 scripts/generate-phazur-videos.py --lesson lesson-react-1-1
```

**Differences from test mode:**
- Higher resolution (1024 vs 512)
- Higher frame rate (30fps vs 15fps)
- Better face enhancement
- Slower but much better quality

**Expected timing:**
- Audio: 10-30 seconds
- Video: 5-8 minutes (production mode)
- Post-processing: 30-60 seconds
- **Total: ~6-10 minutes**

**Review again:**
```bash
open public/courses/lesson-react-1-1.mp4
```

Now you should see **professional, HeyGen-quality video!**

---

### Step 10: Generate More Videos!

Once satisfied with quality:

#### Generate One More Lesson

```bash
python3 scripts/generate-phazur-videos.py --lesson lesson-react-1-2
```

#### List All Available Lessons

```bash
python3 scripts/generate-phazur-videos.py --list
```

#### Generate Entire React Course (2-3 hours)

```bash
python3 scripts/generate-phazur-videos.py --course react
```

**This runs automatically!** You can:
- ☕ Take breaks
- 💼 Do other work
- 🎮 Play games
- System generates videos continuously

#### Generate ALL Courses (Overnight)

```bash
python3 scripts/generate-phazur-videos.py --all
```

**Perfect for overnight:**
- Start before bed
- Keep Mac plugged in
- Disable sleep: System Preferences → Energy Saver → Prevent sleeping
- Wake up to 100+ videos!

---

## 📁 Where Are My Videos?

All generated videos are saved to:

```
public/courses/
├── lesson-react-1-1.mp4    ← Welcome & Course Overview
├── lesson-react-1-2.mp4    ← Compound Components
├── lesson-react-1-3.mp4    ← Flexible Components
├── lesson-ts-1-1.mp4       ← TypeScript lessons
└── ...                     ← All your courses!
```

**These are ready to:**
- ✅ Upload to your CDN
- ✅ Use in production
- ✅ Share with students

---

## 🐛 Troubleshooting

### "Command not found: npm"

```bash
# Install Node.js first
brew install node
```

### "Permission denied"

```bash
# Make scripts executable
chmod +x scripts/*.sh scripts/*.py
```

### "Module not found: TTS"

```bash
# Activate virtual environment
source venv/bin/activate

# Reinstall Coqui TTS
pip install coqui-tts --break-system-packages
```

### "Voice sounds robotic"

```bash
# Re-record with more emotion
npm run record:voice

# Speak naturally, vary your tone
```

### "Lip sync is off"

```bash
# Check voice sample quality
afplay assets/instructor/voice-sample.wav

# Re-record if needed
npm run record:voice
```

### "Low video quality"

```bash
# 1. Don't use --test flag
# 2. Use high-res photo (1080p+)
# 3. Increase quality in custom-video-generator.py:
#    "--size", "1024"  # Higher resolution
#    "--fps=60"        # Higher frame rate
```

### "Generation is slow"

**This is normal!** Production videos take 5-10 minutes each.

**If you want faster:**
- Use `--test` flag for previews
- M1/M2/M3 Macs are 2-3x faster than Intel
- Let batch jobs run overnight

### "SadTalker not found"

```bash
# Re-run setup
npm run setup:video-system

# Or manually:
cd tools
git clone https://github.com/OpenTalker/SadTalker.git
cd SadTalker
bash scripts/download_models.sh
```

---

## ✅ Success Checklist

After completing demo:

- [ ] Setup completed successfully
- [ ] Voice sample recorded and sounds good
- [ ] Instructor photo added
- [ ] Test video generated (2-3 min)
- [ ] Test video reviewed and looks good
- [ ] Production video generated (6-10 min)
- [ ] Production video quality is excellent
- [ ] Ready to batch generate courses!

---

## 🎉 What's Next?

### Today
- ✅ Complete this demo (45 minutes)
- ✅ Verify quality
- ✅ Generate 2-3 more test videos

### This Week
- Generate React course (2-3 hours, automated)
- Review all videos
- Adjust settings if needed

### Next Week
- Generate remaining courses (overnight)
- Upload to CDN
- Launch to students! 🚀

---

## 💡 Pro Tips

### Best Results
1. **Voice**: Record in closet (soft surfaces absorb echo)
2. **Photo**: Professional headshot, well-lit, neutral background
3. **Testing**: Generate 5 test videos before batch processing
4. **Batch**: Run overnight jobs on weekends
5. **Storage**: Keep Mac plugged in during generation

### Customization
- Edit `scripts/custom-video-generator.py` for quality settings
- Modify script templates in `scripts/extract-lesson-scripts.mjs`
- Add custom branding with FFmpeg commands
- Create intro/outro videos to concatenate

### Workflow
1. **Test mode** → Quick preview (2-3 min)
2. **Review** → Check quality
3. **Production** → Full quality (6-10 min)
4. **Batch** → Generate entire course (automated)

---

## 📊 Expected Timeline

| Task | Time | When |
|------|------|------|
| **Setup** | 30 min | One-time only |
| **Voice + Photo** | 6 min | One-time only |
| **First test** | 3 min | Today |
| **First production** | 10 min | Today |
| **5 test videos** | 15 min | Today |
| **Course (20 videos)** | 2-3 hours | This week |
| **All courses (100 videos)** | 8-16 hours | Next week (overnight) |

---

## 🎬 You're Ready!

Follow these steps on your Mac and you'll have your first video in **45 minutes**!

**Questions?** Check the other documentation files:
- [PRODUCTION_VIDEO_GUIDE.md](PRODUCTION_VIDEO_GUIDE.md) - Full workflow
- [QUICK_START_CUSTOM_VIDEOS.md](QUICK_START_CUSTOM_VIDEOS.md) - Detailed setup
- [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) - Architecture

**Let's create amazing course videos! 🚀**
