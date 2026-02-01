# 🤖 n8n Automated Video Generation System

## 🎬 What This Is

A **fully automated cloud-based workflow** that generates professional course videos using:
- **Google Cloud Text-to-Speech** for AI voices
- **Google Veo 3.1** for AI video generation
- **n8n** for workflow automation
- **Auto-upload** to Phazur Labs admin portal

**Zero manual intervention required!**

---

## 📦 Files in This Directory

| File | Purpose |
|------|---------|
| **QUICK_START.md** | ⚡ Start here - 15-minute setup guide |
| **N8N_SETUP_GUIDE.md** | 📚 Complete documentation |
| **phazur-video-automation.json** | 🔧 n8n workflow file (import this) |
| **README.md** | 📖 This file - overview |

---

## 🚀 Quick Start (3 Steps)

### 1. Import Workflow to n8n
```
1. Sign up at https://n8n.io/
2. Import: phazur-video-automation.json
3. Configure credentials (15 min)
```

### 2. Generate Video
```bash
export N8N_WEBHOOK_URL=https://your-n8n.com/webhook/phazur-video-webhook
node scripts/trigger-n8n-video.js lesson-react-1-1
```

### 3. Monitor Progress
```
Check n8n dashboard → Executions
Video ready in 5-10 minutes
Auto-uploaded to Phazur Labs
```

---

## 🎯 What It Does (Automatic)

```
┌─────────────────────────────────────────────────────────┐
│  1. Receive lesson script (via webhook)                 │
│     ↓                                                    │
│  2. Generate AI voice (Google Cloud TTS)                │
│     • Instructor-specific voice                         │
│     • Natural speech synthesis                          │
│     ↓                                                    │
│  3. Generate AI video (Google Veo 3.1)                  │
│     • 1080p talking head video                          │
│     • Perfect lip sync                                  │
│     • 8-second clips                                    │
│     ↓                                                    │
│  4. Save to Google Drive                                │
│     • Shareable video link                              │
│     ↓                                                    │
│  5. Upload to Phazur Labs admin portal                  │
│     • Automatic course integration                      │
│     • Published immediately                             │
└─────────────────────────────────────────────────────────┘
```

---

## 💰 Cost Comparison

### This System (Cloud Automation)
```
Per Video:           ~$0.50-2.00
Per Month:           $20 (n8n) + usage
Per Year (50 videos): ~$300-$400
```

### HeyGen/Synthesia
```
Per Video:           $5-10
Per Month:           $200-400
Per Year (50 videos): $2,400-4,800
```

**💸 Savings: $2,000-4,400 annually!**

---

## 🎭 Instructor Voices

Each instructor has a unique Google Cloud TTS voice:

| Instructor | Voice | Style |
|------------|-------|-------|
| Dr. Sarah Chen | en-US-Neural2-F | Energetic female (pitch +2.0) |
| Marcus Williams | en-US-Neural2-D | Authoritative male (pitch -2.0) |
| Elena Rodriguez | en-US-Neural2-G | Dynamic female (neutral) |
| Dr. James Park | en-US-Neural2-A | Academic male (pitch -1.0) |
| Aisha Kumar | en-US-Neural2-C | Creative female (pitch +3.0) |
| Alex Thompson | en-US-Neural2-I | Serious male (pitch -1.5) |

---

## 📊 Workflow Specifications

### Input
```json
{
  "lesson_id": "lesson-react-1-1",
  "script": "Welcome to React development...",
  "instructor": "sarah-chen",
  "course": "react-patterns"
}
```

### Output
```json
{
  "success": true,
  "lesson_id": "lesson-react-1-1",
  "video_url": "https://drive.google.com/file/d/...",
  "instructor": "sarah-chen",
  "message": "Video generated and uploaded successfully!"
}
```

### Processing Time
- Voice generation: 30-60 seconds
- Video generation: 5-8 minutes
- Upload & cleanup: 30 seconds
- **Total: 6-10 minutes per video**

---

## 🔧 Technical Stack

### Cloud Services
- **n8n** - Workflow automation
- **Google Cloud TTS** - Voice synthesis
- **Google Veo 3.1** - Video generation (Vertex AI)
- **Google Drive** - Storage
- **Phazur Admin API** - Upload integration

### Node.js Scripts
- `trigger-n8n-video.js` - Generate single video
- `batch-n8n-videos.js` - Batch processing

---

## 📚 Documentation

### For Setup
→ [QUICK_START.md](QUICK_START.md) - 15-minute setup

### For Details
→ [N8N_SETUP_GUIDE.md](N8N_SETUP_GUIDE.md) - Complete guide

### For Workflow
→ [phazur-video-automation.json](phazur-video-automation.json) - Import this

---

## ✅ Prerequisites

- n8n account (free or $20/month)
- Google Cloud account (free $300 credit)
- APIs enabled:
  - ✅ Cloud Text-to-Speech API
  - ✅ Vertex AI API
  - ✅ Google Drive API
- Phazur Labs admin API token

---

## 🎬 Usage Examples

### Single Video
```bash
node scripts/trigger-n8n-video.js lesson-react-1-1
```

### Batch All Lessons
```bash
node scripts/batch-n8n-videos.js
```

### Specific Course
```bash
node scripts/batch-n8n-videos.js --course react
```

### Parallel Processing
```bash
node scripts/batch-n8n-videos.js --parallel 5
```

---

## 🌟 Key Features

✅ **Fully Automated** - No manual intervention
✅ **Cloud-Based** - Works from anywhere
✅ **Multi-Instructor** - 6 unique voices
✅ **High Quality** - 1080p video with perfect lip sync
✅ **Cost Effective** - 60-80% cheaper than HeyGen
✅ **Scalable** - Generate 100+ videos easily
✅ **Integrated** - Auto-uploads to admin portal

---

## 🐛 Troubleshooting

**Issue:** Webhook not responding
- **Fix:** Check workflow is Active in n8n

**Issue:** Authentication failed
- **Fix:** Re-download Google Cloud JSON key

**Issue:** Video generation timeout
- **Fix:** Veo 3 takes 5-10 minutes - be patient

**Issue:** Upload to admin failed
- **Fix:** Check API token and endpoint URL

---

## 📞 Support

For detailed troubleshooting, see:
- [N8N_SETUP_GUIDE.md](N8N_SETUP_GUIDE.md) - Section: "Troubleshooting"

---

## 🎉 Success Metrics

After setup, you can:
- ✅ Generate videos in 6-10 minutes
- ✅ Process 5-10 videos in parallel
- ✅ Save 60-80% vs commercial services
- ✅ Fully automated uploads
- ✅ 100% cloud-based (no local processing)

---

## 🚀 Get Started

**Next Steps:**
1. Read: [QUICK_START.md](QUICK_START.md)
2. Import: phazur-video-automation.json
3. Configure: Credentials
4. Test: Generate one video
5. Launch: Batch generate all courses

**Estimated Time:**
- Setup: 15-20 minutes
- First video: 10 minutes
- Batch processing: Automated!

---

**Built for Phazur Labs Academy**
*Automated video generation powered by Google Cloud + n8n*

---

## 📖 Additional Resources

**Google Cloud Documentation:**
- [Veo 3 API](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/veo/3-0-generate)
- [Cloud Text-to-Speech](https://cloud.google.com/text-to-speech/docs)

**n8n Resources:**
- [n8n Workflows](https://n8n.io/workflows/)
- [Google Cloud TTS Integration](https://n8n.io/workflows/5779-generate-natural-voices-with-google-text-to-speech-drive-and-airtable/)

**API Pricing:**
- [Vertex AI Pricing](https://cloud.google.com/vertex-ai/pricing)
- [TTS Pricing](https://cloud.google.com/text-to-speech/pricing)
