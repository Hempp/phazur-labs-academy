# Instructor Assets

This directory contains assets used for AI video generation.

## Required Files

### 1. voice-sample.wav
**Purpose:** Voice cloning for text-to-speech generation

**How to create:**
```bash
npm run record:voice
```

**Requirements:**
- Duration: 60+ seconds
- Format: WAV, 22050 Hz, mono
- Quality: Clear speech, minimal background noise
- Content: Natural teaching voice (read provided script)

**Tips for best results:**
- Record in a quiet room (closet works great)
- Use a good microphone (AirPods Pro or USB mic)
- Speak naturally, as if teaching a student
- Include varied intonation and pacing
- Avoid long pauses or mistakes

---

### 2. photo.jpg
**Purpose:** Source image for AI talking head generation

**How to add:**
```bash
cp your-headshot.jpg assets/instructor/photo.jpg
```

**Requirements:**
- Format: JPG or PNG
- Resolution: 1080p+ recommended (minimum 720p)
- Orientation: Portrait or square
- Subject: Clear front-facing view of instructor
- Background: Neutral, solid color preferred
- Lighting: Even, well-lit (no harsh shadows)
- Expression: Neutral or slight smile

**Tips for best results:**
- Professional headshot quality
- Look directly at camera
- Centered composition
- No sunglasses or hats
- Minimal accessories
- High contrast between subject and background
- Consider hiring a photographer for best quality

---

## File Locations

```
assets/instructor/
├── voice-sample.wav    (60s voice recording)
├── photo.jpg          (instructor headshot)
└── README.md          (this file)
```

## Privacy & Security

These files are:
- ✅ Stored locally on your Mac
- ✅ NOT uploaded to cloud services
- ✅ NOT shared with third parties
- ✅ Used only for local video generation
- ✅ Fully under your control

The files in this directory should be added to `.gitignore` to keep them private.

## Quality Examples

### ✅ Good Voice Sample
- Clear, consistent volume
- Natural speaking pace
- Minimal background noise
- Professional microphone quality
- Varied intonation (not monotone)

### ❌ Poor Voice Sample
- Inconsistent volume
- Background music or noise
- Too fast or too slow
- Low-quality phone mic
- Monotone delivery

### ✅ Good Photo
- High resolution (1080p+)
- Well-lit, even lighting
- Front-facing, centered
- Neutral background
- Professional appearance

### ❌ Poor Photo
- Low resolution (<720p)
- Dark or shadowy
- Side angle or looking away
- Busy background
- Blurry or out of focus

## Testing Your Assets

After adding both files, test the quality:

```bash
# Generate a quick test video
npm run generate:custom-video -- --lesson lesson-react-1-1 --test

# Review the output at:
# public/courses/lesson-react-1-1.mp4
```

If quality isn't satisfactory:
1. Re-record voice sample with better microphone
2. Use higher resolution photo with better lighting
3. Adjust generation settings in `scripts/custom-video-generator.py`

## Updating Assets

You can update these files anytime:

```bash
# Re-record voice
npm run record:voice

# Replace photo
cp new-photo.jpg assets/instructor/photo.jpg

# Test new assets
npm run generate:custom-video -- --lesson lesson-react-1-1 --test
```

New videos will automatically use the updated assets!
