# Talking Head Video Generation Service

Generate lip-synced avatar videos for free using open-source AI models (SadTalker or Wav2Lip).

## Overview

This service provides a middle tier between basic audio drafts and paid HeyGen production videos:

| Mode | Cost | Quality | Speed | Features |
|------|------|---------|-------|----------|
| **Draft** | Free | Audio only | Fast (~5s) | Script preview with TTS |
| **Animated** | Free | Good | Medium (~2-15x realtime) | Lip-sync + head motion |
| **Production** | Paid | Professional | Medium | HeyGen AI avatars |

## Supported Backends

### SadTalker (Recommended)
- **Quality**: High - full head motion, expressions, and lip sync
- **Speed**: ~2x realtime with GPU, ~15x without
- **Input**: Single portrait image + audio
- **Best for**: Professional-looking animated avatars

### Wav2Lip
- **Quality**: Good - accurate lip sync only (no head motion)
- **Speed**: ~1.5x realtime with GPU, ~10x without
- **Input**: Image or video + audio
- **Best for**: Quick lip-sync when you have existing footage

## Quick Start

### 1. Run the Setup Script

```bash
# From project root
./scripts/setup-talking-head.sh
```

This will:
- Check Python 3.8+ installation
- Check GPU availability
- Install SadTalker and/or Wav2Lip
- Download required model checkpoints

### 2. Set Environment Variables (Optional)

Add to your shell profile (~/.zshrc or ~/.bashrc):

```bash
export SADTALKER_PATH="~/.local/share/sadtalker"
export WAV2LIP_PATH="~/.local/share/wav2lip"
```

### 3. Verify Installation

The Video Studio will automatically detect available backends and show the "Animated" mode when setup is complete.

## Manual Installation

### SadTalker

```bash
# Clone repository
git clone https://github.com/OpenTalker/SadTalker.git ~/.local/share/sadtalker
cd ~/.local/share/sadtalker

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install torch torchvision torchaudio
pip install -r requirements.txt

# Download checkpoints (see SadTalker docs)
# Place in checkpoints/ directory:
# - SadTalker_V0.0.2_256.safetensors
# - SadTalker_V0.0.2_512.safetensors
# - mapping_00109-model.pth.tar
# - mapping_00229-model.pth.tar
```

### Wav2Lip

```bash
# Clone repository
git clone https://github.com/Rudrabha/Wav2Lip.git ~/.local/share/wav2lip
cd ~/.local/share/wav2lip

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install torch torchvision torchaudio
pip install -r requirements.txt

# Download checkpoints (see Wav2Lip docs)
# Place in checkpoints/ directory:
# - wav2lip.pth (or wav2lip_gan.pth for better quality)
```

## Architecture

```
lib/services/talking-head/
├── index.ts          # Main service orchestration
├── types.ts          # TypeScript interfaces
├── sadtalker.ts      # SadTalker backend integration
├── wav2lip.ts        # Wav2Lip backend integration
└── README.md         # This file

app/api/admin/videos/talking-head/
├── status/route.ts   # GET - Check backend availability
└── generate/route.ts # POST - Generate animated video
```

## API Usage

### Check Status

```typescript
// GET /api/admin/videos/talking-head/status
const response = await fetch('/api/admin/videos/talking-head/status')
const status = await response.json()
// {
//   available: true,
//   bestBackend: 'sadtalker',
//   backends: {
//     sadtalker: { installed: true, gpuAvailable: true, modelsDownloaded: true },
//     wav2lip: { installed: false, ... }
//   },
//   avatars: [...]
// }
```

### Generate Video

```typescript
// POST /api/admin/videos/talking-head/generate
const response = await fetch('/api/admin/videos/talking-head/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    script: 'Your video script text here...',
    avatarId: 'professional-female-1', // or avatarImagePath for custom
    voiceId: 'en-US-AriaNeural',       // Edge TTS voice
    backend: 'sadtalker',              // or 'wav2lip'
    options: {
      expressionScale: 1.0,            // 0-2, default 1
      stillMode: false,                // Reduce head motion
      resolution: '512',               // '256' or '512'
    }
  })
})

const result = await response.json()
// {
//   success: true,
//   video: {
//     base64: '...',
//     format: 'video/mp4',
//     durationSeconds: 15,
//     backend: 'sadtalker',
//     processingTimeMs: 30000
//   }
// }
```

## Default Avatars

The service includes 4 default avatars optimized for educational content:

| ID | Name | Style | Gender | Voice |
|----|------|-------|--------|-------|
| professional-female-1 | Sarah | Professional | Female | en-US-AriaNeural |
| professional-male-1 | James | Professional | Male | en-US-GuyNeural |
| casual-female-1 | Maya | Casual | Female | en-US-JennyNeural |
| friendly-male-1 | Alex | Friendly | Male | en-US-ChristopherNeural |

To use custom avatars, place portrait images in `public/avatars/talking-head/` and reference by path.

## Processing Time Estimates

| Script Length | GPU (SadTalker) | CPU (SadTalker) | GPU (Wav2Lip) |
|--------------|-----------------|-----------------|---------------|
| 30 seconds | ~1 minute | ~7 minutes | ~45 seconds |
| 1 minute | ~2 minutes | ~15 minutes | ~1.5 minutes |
| 5 minutes | ~10 minutes | ~75 minutes | ~7 minutes |

## Troubleshooting

### "Talking head generation is not available"
- Run `./scripts/setup-talking-head.sh` to install backends
- Check that model checkpoints are downloaded

### "CUDA out of memory"
- Reduce resolution to '256' in options
- Use Wav2Lip instead (smaller model)
- Process shorter scripts

### Lip sync is off
- Ensure audio quality is good
- Try SadTalker instead of Wav2Lip for static images
- Check that face is clearly visible in avatar image

### No head motion (SadTalker)
- Set `stillMode: false` in options
- Increase `expressionScale` (try 1.2-1.5)
- Use a front-facing portrait with visible shoulders

## Resources

- [SadTalker GitHub](https://github.com/OpenTalker/SadTalker)
- [Wav2Lip GitHub](https://github.com/Rudrabha/Wav2Lip)
- [Edge TTS Voices](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support)
