# 🤖 n8n Automated Video Generation - Complete Setup Guide

## 🎯 What This Workflow Does

This n8n workflow **fully automates** your video generation using **Google Cloud APIs**:

```
Course Script → Google TTS (Voice) → Google Veo 3 (Video) → Upload to Phazur Labs
     (input)        (AI voice)           (AI video)            (automatic)
```

**No local processing needed!** Everything runs in the cloud.

---

## 💰 Cost Comparison

### Previous System (Local Processing)
- ❌ Requires powerful Mac
- ❌ Manual setup per instructor
- ❌ 8-12 minutes per video
- ❌ Must run on your machine
- ✅ Cost: $0 per video

### New System (Cloud Automation with n8n)
- ✅ Runs entirely in cloud
- ✅ Fully automated workflow
- ✅ 2-3 minutes per video (parallel processing)
- ✅ Works from anywhere
- 💵 Cost: **~$0.50-2 per video**

**Cost Breakdown per Video:**
- Google Cloud TTS: ~$0.016 per 1000 characters (~$0.08 per 2min script)
- Google Veo 3 Video Generation: ~$0.40-1.50 per 8-second clip
- Google Drive Storage: ~$0.02/GB/month
- n8n Cloud (optional): $20/month (unlimited workflows)

---

## 📋 Prerequisites

### 1. n8n Account
- **Option A:** Self-hosted (free) - Install on your server
- **Option B:** n8n Cloud ($20/month) - Managed service

### 2. Google Cloud Account
- Enable billing (free tier available)
- $300 free credit for new users

### 3. APIs to Enable
- ✅ Google Cloud Text-to-Speech API
- ✅ Vertex AI API (for Veo 3)
- ✅ Google Drive API

### 4. Phazur Labs Admin Portal
- Admin API endpoint
- API authentication token

---

## 🚀 Setup Instructions

### Step 1: Install n8n (Choose One)

#### Option A: n8n Cloud (Recommended - Easiest)
```bash
1. Visit: https://n8n.io/
2. Click "Start Free"
3. Create account
4. Done! ✅
```

#### Option B: Self-Hosted (Free)
```bash
# Install n8n locally with npm
npm install -g n8n

# Or with Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Start n8n
n8n start

# Access at: http://localhost:5678
```

---

### Step 2: Enable Google Cloud APIs

#### 2.1 Create Google Cloud Project
```
1. Visit: https://console.cloud.google.com/
2. Click "Create Project"
3. Name: "phazur-labs-video-gen"
4. Click "Create"
```

#### 2.2 Enable Required APIs
```
1. Go to: APIs & Services → Library
2. Search and enable:
   - "Cloud Text-to-Speech API"
   - "Vertex AI API"
   - "Google Drive API"
3. Click "Enable" for each
```

#### 2.3 Create Service Account
```
1. Go to: IAM & Admin → Service Accounts
2. Click "Create Service Account"
3. Name: "n8n-video-automation"
4. Grant roles:
   - Cloud Text-to-Speech User
   - Vertex AI User
   - Drive File Access
5. Click "Done"
6. Click on service account → Keys tab
7. Click "Add Key" → "Create new key"
8. Choose JSON format
9. Download the JSON key file
```

#### 2.4 Set Up OAuth2 (for Google Drive)
```
1. Go to: APIs & Services → Credentials
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. Name: "n8n-phazur-labs"
5. Authorized redirect URIs:
   - https://your-n8n-instance.com/rest/oauth2-credential/callback
6. Click "Create"
7. Download OAuth2 credentials
```

---

### Step 3: Import Workflow to n8n

#### 3.1 Access n8n Dashboard
```
n8n Cloud: https://app.n8n.cloud/
Self-hosted: http://localhost:5678/
```

#### 3.2 Import Workflow
```
1. Click "Workflows" in sidebar
2. Click "Add Workflow" dropdown
3. Select "Import from File"
4. Upload: phazur-video-automation.json
5. Click "Import"
```

---

### Step 4: Configure Credentials

#### 4.1 Google Cloud Text-to-Speech OAuth2
```
1. In workflow, click "Google Cloud Text-to-Speech" node
2. Click "Create New Credential"
3. Name: "Google Cloud TTS OAuth2"
4. Upload service account JSON key file
5. Click "Create"
```

#### 4.2 Google Drive OAuth2
```
1. Click "Save Audio to Google Drive" node
2. Click "Create New Credential"
3. Choose "OAuth2"
4. Enter Client ID and Client Secret from Step 2.4
5. Click "Connect my account"
6. Authorize access
7. Click "Create"
```

#### 4.3 Google Cloud API (for Veo 3)
```
1. Click "Google Veo 3 - Generate Video" node
2. Click "Create New Credential"
3. Name: "Google Cloud API"
4. Upload service account JSON key file
5. Add environment variable:
   GOOGLE_PROJECT_ID = your-project-id
6. Click "Create"
```

#### 4.4 Phazur Labs Admin API
```
1. Click "Upload to Phazur Labs Admin Portal" node
2. Click "Create New Credential"
3. Choose "Header Auth"
4. Name: "Phazur Labs Admin API"
5. Header Name: "Authorization"
6. Header Value: "Bearer YOUR_ADMIN_API_TOKEN"
7. Click "Create"
```

---

### Step 5: Setup Google Drive Folders

#### 5.1 Create Required Folders
```
1. Open Google Drive
2. Create folders:
   - "phazur-labs-temp-audio" (for temporary audio files)
   - "phazur-labs-course-videos" (for final videos)
   - "phazur-labs-instructor-photos" (for instructor images)
```

#### 5.2 Upload Instructor Photos
```
1. Open "phazur-labs-instructor-photos" folder
2. Upload 6 instructor photos:
   - sarah-chen.jpg
   - marcus-williams.jpg
   - elena-rodriguez.jpg
   - james-park.jpg
   - aisha-kumar.jpg
   - alex-thompson.jpg
3. For each photo, right-click → "Get link" → "Anyone with the link"
4. Copy the file ID from the URL:
   https://drive.google.com/file/d/FILE_ID_HERE/view
```

#### 5.3 Update Workflow with Photo IDs
```
1. In n8n workflow, click "Prepare Video Generation Data" node
2. Edit the instructorPhotos object
3. Replace placeholder IDs with your actual file IDs
4. Example:
   'sarah-chen': 'https://drive.google.com/uc?id=1ABC123XYZ',
5. Click "Save"
```

---

### Step 6: Configure Webhook

#### 6.1 Get Webhook URL
```
1. Click "Webhook Trigger" node
2. Copy the "Production URL":
   https://your-n8n.app.n8n.cloud/webhook/phazur-video-webhook
```

#### 6.2 Test Webhook
```bash
# Test with curl
curl -X POST https://your-n8n.app.n8n.cloud/webhook/phazur-video-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "lesson_id": "lesson-react-1-1",
    "script": "Welcome to React development! In this comprehensive course...",
    "instructor": "sarah-chen",
    "course": "react-patterns"
  }'
```

---

### Step 7: Activate Workflow

```
1. In n8n workflow editor
2. Click "Inactive" toggle at top-right
3. Switch to "Active"
4. Workflow is now live! ✅
```

---

## 🎬 Usage Examples

### Generate Single Video

#### Using Node.js Script
```javascript
// scripts/trigger-n8n-video.js
const axios = require('axios');

async function generateVideo(lessonData) {
  const response = await axios.post(
    'https://your-n8n.app.n8n.cloud/webhook/phazur-video-webhook',
    {
      lesson_id: lessonData.id,
      script: lessonData.script,
      instructor: lessonData.instructor || 'sarah-chen',
      course: lessonData.course
    }
  );

  console.log('Video generation started:', response.data);
  return response.data;
}

// Use extracted lesson scripts
const lessonScripts = require('../temp/lesson-scripts.json');
const lesson = lessonScripts['lesson-react-1-1'];

generateVideo({
  id: 'lesson-react-1-1',
  script: lesson.script,
  instructor: 'sarah-chen',
  course: 'react-patterns'
});
```

#### Run It
```bash
cd /path/to/phazur-labs-academy
node scripts/trigger-n8n-video.js
```

---

### Batch Generate All Lessons

```javascript
// scripts/batch-n8n-videos.js
const axios = require('axios');
const lessonScripts = require('../temp/lesson-scripts.json');

const WEBHOOK_URL = 'https://your-n8n.app.n8n.cloud/webhook/phazur-video-webhook';

// Instructor assignments
const courseInstructors = {
  'react': 'sarah-chen',
  'typescript': 'marcus-williams',
  'fullstack': 'elena-rodriguez',
  'algorithms': 'james-park',
  'design': 'aisha-kumar',
  'security': 'alex-thompson'
};

async function generateAllVideos() {
  const lessons = Object.entries(lessonScripts);

  for (const [lessonId, lessonData] of lessons) {
    console.log(`\n🎬 Generating: ${lessonId}...`);

    // Detect course from lesson ID
    const course = lessonId.split('-')[1]; // e.g., "react" from "lesson-react-1-1"
    const instructor = courseInstructors[course] || 'sarah-chen';

    try {
      const response = await axios.post(WEBHOOK_URL, {
        lesson_id: lessonId,
        script: lessonData.script,
        instructor: instructor,
        course: course
      });

      console.log(`✅ ${lessonId} queued successfully`);
      console.log(`   Instructor: ${instructor}`);

      // Wait 30 seconds between requests to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 30000));

    } catch (error) {
      console.error(`❌ Failed to queue ${lessonId}:`, error.message);
    }
  }

  console.log('\n🎉 All videos queued for generation!');
  console.log('Videos will be uploaded to Phazur Labs admin portal automatically.');
}

generateAllVideos();
```

#### Run Batch Generation
```bash
node scripts/batch-n8n-videos.js
```

---

## 🎯 Workflow Steps Explained

### 1. Webhook Trigger
- Receives lesson data (script, instructor, course)
- Validates input
- Starts workflow

### 2. Prepare Lesson Data
- Maps instructor to Google TTS voice profile
- Configures voice characteristics (pitch, speed)
- Prepares file names

### 3. Google Cloud Text-to-Speech
- Generates AI voice from script
- Uses instructor-specific voice settings:
  - **Sarah Chen**: Female, energetic (pitch +2.0, speed 1.05x)
  - **Marcus Williams**: Male, authoritative (pitch -2.0, speed 0.95x)
  - **Elena Rodriguez**: Female, dynamic (neutral pitch, normal speed)
  - **James Park**: Male, academic (pitch -1.0, speed 0.9x)
  - **Aisha Kumar**: Female, creative (pitch +3.0, speed 1.1x)
  - **Alex Thompson**: Male, serious (pitch -1.5, speed 0.92x)
- Outputs MP3 audio file

### 4. Save Audio to Google Drive
- Uploads audio temporarily
- Gets shareable link for Veo 3

### 5. Prepare Video Generation Data
- Loads instructor photo from Google Drive
- Creates video prompt for Veo 3
- Prepares reference image

### 6. Google Veo 3 - Generate Video
- Sends request to Vertex AI Veo 3.1 API
- Configuration:
  - Resolution: 1080p (1920x1080)
  - Duration: 8 seconds
  - Aspect ratio: 16:9
  - Audio: Enabled (syncs with TTS audio)
  - Reference image: Instructor photo
- Returns operation ID

### 7. Wait for Video Generation
- Polls operation status every 10 seconds
- Max wait time: 10 minutes
- Returns video URL when complete

### 8. Download Generated Video
- Downloads video from Google Cloud Storage
- Stores as binary data

### 9. Save Video to Google Drive
- Uploads final video to course videos folder
- Gets shareable link

### 10. Upload to Phazur Labs Admin Portal
- POSTs video metadata to admin API:
  - lesson_id
  - video_url (Google Drive link)
  - instructor
  - course
  - duration
  - status: "published"
- Updates course platform automatically

### 11. Cleanup Temp Files
- Deletes temporary audio file from Google Drive
- Keeps final video

### 12. Respond to Webhook
- Returns success response with video details
- Or error response if failed

---

## 📊 Monitoring & Debugging

### View Workflow Executions
```
1. In n8n, click "Executions" in sidebar
2. See all workflow runs
3. Click any execution to see:
   - Input data
   - Output from each node
   - Errors (if any)
   - Processing time
```

### Check Google Cloud Logs
```
1. Visit: https://console.cloud.google.com/logs
2. Filter by:
   - Resource: "Vertex AI"
   - Severity: "Error"
3. View detailed error messages
```

### Test Individual Nodes
```
1. In workflow editor, click any node
2. Click "Execute Node"
3. View output in right panel
4. Fix issues before activating workflow
```

---

## 🐛 Troubleshooting

### "Authentication failed" Error
**Solution:**
```
1. Check service account has correct roles
2. Re-download JSON key
3. Update credentials in n8n
4. Test with: gcloud auth list
```

### "Video generation timeout"
**Solution:**
```
1. Veo 3 can take 5-10 minutes for 8-second clips
2. Increase timeout in "Wait for Video Generation" node
3. Check Vertex AI quota limits
```

### "Instructor photo not found"
**Solution:**
```
1. Verify photo uploaded to Google Drive
2. Check sharing settings: "Anyone with the link"
3. Update file ID in workflow
4. Test URL in browser
```

### "Phazur admin API error"
**Solution:**
```
1. Check API token is valid
2. Verify endpoint URL
3. Check admin portal logs
4. Test with curl first
```

---

## 💡 Pro Tips

### Tip 1: Parallel Processing
Generate multiple videos simultaneously:
```javascript
// Generate 5 videos in parallel
const promises = lessons.slice(0, 5).map(lesson =>
  axios.post(WEBHOOK_URL, lessonData)
);

await Promise.all(promises);
```

### Tip 2: Cost Optimization
- Use Veo 3 Fast for quicker, cheaper videos
- Generate 4-second clips instead of 8 (half cost)
- Batch process during off-peak hours

### Tip 3: Quality Improvement
- Use high-quality instructor photos (1080p+)
- Write detailed video prompts
- Test different voice pitch/speed settings
- Use professional lighting in reference photos

### Tip 4: Monitoring
Set up n8n error alerts:
```
1. Add "Send Email" node after error handler
2. Send to: your-email@example.com
3. Subject: "Video generation failed: {{ $json.lesson_id }}"
4. Get notified of failures immediately
```

---

## 🎉 What You Achieved

✅ **Fully automated video generation**
- No manual intervention needed
- Cloud-based (works from anywhere)
- Parallel processing (5-10 videos simultaneously)

✅ **Professional quality**
- Google Cloud TTS voices
- Google Veo 3 video generation
- 1080p resolution
- 8-second clips

✅ **Complete integration**
- Auto-uploads to Phazur Labs
- Updates admin portal automatically
- Stores videos in Google Drive

✅ **Cost-effective**
- ~$0.50-2 per video
- vs $5-10 for HeyGen
- 60-80% cost savings

---

## 📚 Additional Resources

**n8n Documentation:**
- [n8n Workflows](https://n8n.io/workflows/)
- [Google Cloud TTS Integration](https://n8n.io/workflows/5779-generate-natural-voices-with-google-text-to-speech-drive-and-airtable/)

**Google Cloud:**
- [Veo 3 API Docs](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/veo/3-0-generate)
- [Text-to-Speech Pricing](https://cloud.google.com/text-to-speech/pricing)
- [Vertex AI Pricing](https://cloud.google.com/vertex-ai/pricing)

---

## 🚀 Next Steps

1. ✅ Import workflow to n8n
2. ✅ Configure credentials
3. ✅ Upload instructor photos
4. ✅ Test with one lesson
5. ✅ Batch generate all courses
6. 🎉 Launch your video academy!

---

**You now have a fully automated, cloud-based video generation system!** 🎬

Sources:
- [Generate natural voices with Google Text-to-Speech | n8n workflow template](https://n8n.io/workflows/5779-generate-natural-voices-with-google-text-to-speech-drive-and-airtable/)
- [Veo 3 on Vertex AI | Google Cloud Documentation](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/veo/3-0-generate)
- [Generate videos with Veo 3.1 in Gemini API | Google AI for Developers](https://ai.google.dev/gemini-api/docs/video)
