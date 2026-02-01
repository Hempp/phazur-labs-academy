# ⚡ n8n Video Automation - Quick Start

## 🎯 Goal

Generate course videos automatically using Google Cloud APIs via n8n workflow.

---

## ✅ What You Need (5 Minutes Setup)

### 1. n8n Account
```
Visit: https://n8n.io/
Click: "Start Free"
Duration: 2 minutes
```

### 2. Google Cloud Account
```
Visit: https://console.cloud.google.com/
Enable billing (free $300 credit)
Enable APIs:
  - Cloud Text-to-Speech
  - Vertex AI (for Veo 3)
  - Google Drive
Duration: 3 minutes
```

---

## 🚀 Setup (15 Minutes)

### Step 1: Import Workflow

```bash
# 1. Open n8n dashboard
# 2. Click "Workflows" → "Import from File"
# 3. Upload: n8n-workflows/phazur-video-automation.json
# 4. Click "Import"
```

### Step 2: Add Credentials

**Google Cloud TTS OAuth2:**
```
1. In workflow, click "Google Cloud Text-to-Speech" node
2. Click "Create New Credential"
3. Upload service account JSON key
4. Click "Save"
```

**Google Drive OAuth2:**
```
1. Click "Save Audio to Google Drive" node
2. Click "Create New Credential"
3. Choose "OAuth2"
4. Connect your Google account
5. Authorize access
```

**Phazur Admin API:**
```
1. Click "Upload to Phazur Labs Admin Portal" node
2. Click "Create New Credential"
3. Choose "Header Auth"
4. Header: "Authorization"
5. Value: "Bearer YOUR_TOKEN"
```

### Step 3: Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env file
nano .env

# Add your values:
N8N_WEBHOOK_URL=https://your-n8n.app.n8n.cloud/webhook/phazur-video-webhook
GOOGLE_PROJECT_ID=your-project-123
PHAZUR_API_TOKEN=your-secret-token
```

### Step 4: Upload Instructor Photos

```
1. Open Google Drive
2. Create folder: "phazur-labs-instructor-photos"
3. Upload 6 instructor photos:
   - sarah-chen.jpg
   - marcus-williams.jpg
   - elena-rodriguez.jpg
   - james-park.jpg
   - aisha-kumar.jpg
   - alex-thompson.jpg
4. Share each photo: "Anyone with the link"
5. Copy file IDs from URLs
6. Update workflow node "Prepare Video Generation Data"
```

### Step 5: Activate Workflow

```
1. In n8n workflow editor
2. Toggle "Inactive" → "Active"
3. Done! ✅
```

---

## 🎬 Usage

### Generate Single Video

```bash
# Set webhook URL
export N8N_WEBHOOK_URL=https://your-n8n.com/webhook/phazur-video-webhook

# Trigger video generation
node scripts/trigger-n8n-video.js lesson-react-1-1
```

**Expected Output:**
```
🎬 Generating video for: lesson-react-1-1

📝 Lesson: Welcome & Course Overview
📚 Course: react-patterns
👤 Instructor: sarah-chen
📄 Script length: 1842 characters
⏱️  Duration: 2-3 minutes

🚀 Sending to n8n workflow...

✅ Video generation started successfully!

⏳ Estimated completion: 5-10 minutes
💡 Check n8n dashboard for progress
```

### Generate All Videos

```bash
# Generate all lessons
node scripts/batch-n8n-videos.js

# Generate specific course only
node scripts/batch-n8n-videos.js --course react

# Process 5 at a time (faster)
node scripts/batch-n8n-videos.js --parallel 5
```

---

## 📊 Monitor Progress

### n8n Dashboard
```
1. Open n8n
2. Click "Executions"
3. See real-time workflow runs
4. Click any execution for details
```

### Check Output
```
1. Google Drive → "phazur-labs-course-videos" folder
2. Phazur Admin Portal → Videos section
3. View generated videos
```

---

## 💰 Cost Per Video

```
Google Cloud TTS:     ~$0.08
Google Veo 3:         ~$0.40-1.50
Google Drive:         ~$0.01
n8n Cloud:            $20/month (unlimited)
─────────────────────────────────
Total:                ~$0.50-2.00 per video
```

**vs HeyGen:** $5-10 per video (60-80% savings!)

---

## 🐛 Troubleshooting

### "Webhook not found"
```
✓ Check workflow is Active
✓ Copy webhook URL from "Webhook Trigger" node
✓ Update N8N_WEBHOOK_URL in .env
```

### "Authentication failed"
```
✓ Re-download Google Cloud service account JSON
✓ Update credentials in n8n
✓ Check API is enabled in Google Cloud Console
```

### "Video generation timeout"
```
✓ Veo 3 takes 5-10 minutes
✓ Increase timeout in workflow if needed
✓ Check Vertex AI quota in Google Cloud
```

---

## ✨ Pro Tips

**Tip 1:** Generate during off-hours for faster processing

**Tip 2:** Use parallel processing for multiple videos:
```bash
node scripts/batch-n8n-videos.js --parallel 5
```

**Tip 3:** Monitor costs in Google Cloud Console

**Tip 4:** Set up email alerts in n8n for failures

---

## 🎉 Success Checklist

- [ ] n8n account created
- [ ] Workflow imported
- [ ] Google Cloud APIs enabled
- [ ] Credentials configured
- [ ] Instructor photos uploaded
- [ ] Workflow activated
- [ ] Test video generated
- [ ] Batch processing tested

---

## 📚 Full Documentation

For detailed instructions, see:
- [N8N_SETUP_GUIDE.md](N8N_SETUP_GUIDE.md) - Complete setup guide
- [phazur-video-automation.json](phazur-video-automation.json) - Workflow file

---

**You're ready to generate unlimited videos automatically!** 🚀

**Estimated setup time:** 15-20 minutes
**Video generation time:** 5-10 minutes per video
**Cost:** ~$0.50-2 per video
**Automation level:** 100% (fully automated)
