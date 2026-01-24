# Video Generation System Setup

This guide walks you through setting up the AI video generation system for Phazur Labs Academy.

## Overview

The video system allows admins to:
- Generate AI avatar videos using HeyGen
- Automatically assign videos to lessons
- Upload videos to Supabase storage for CDN delivery
- Track video generation status and history

## Prerequisites

- A Supabase project (free tier works)
- A HeyGen account with API access
- Node.js 18+

---

## Step 1: Supabase Configuration

### 1.1 Create a Supabase Project

If you don't have a Supabase project yet:
1. Go to [supabase.com](https://supabase.com)
2. Sign in and create a new project
3. Wait for the project to be provisioned

### 1.2 Get Your API Keys

1. Go to your project's **Settings > API**
2. Copy these values to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ Keep the Service Role Key secret! Never expose it in client-side code.

### 1.3 Apply Database Migrations

**Option A: Using Supabase Dashboard (Recommended)**

1. Go to your project's **SQL Editor**
2. Run each migration file in order:
   - `supabase/migrations/20240101000000_initial_schema.sql`
   - `supabase/migrations/20240115000000_assignments.sql`
   - `supabase/migrations/20240116000000_seed_assignments.sql`
   - `supabase/migrations/20240117000000_bookmarks.sql`
   - `supabase/migrations/20240118000000_video_generations.sql` ← Video table
   - `supabase/migrations/20240119000000_storage_buckets.sql` ← Storage buckets

**Option B: Using Supabase CLI**

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push all migrations
supabase db push
```

### 1.4 Verify Storage Buckets

After running migrations, verify in **Storage** that these buckets exist:
- `course-videos` - For lesson videos (public, 500MB limit)
- `video-thumbnails` - For video thumbnails (public, 5MB limit)

---

## Step 2: HeyGen Configuration

### 2.1 Get Your API Key

1. Go to [HeyGen Settings](https://app.heygen.com/settings?nav=API)
2. Generate or copy your API key
3. Add to `.env.local`:

```bash
HEYGEN_API_KEY=your-heygen-api-key-here
```

### 2.2 Verify API Access

Run the verification script:

```bash
npm run verify:video-setup
```

This will check:
- ✅ Supabase connection
- ✅ HeyGen API connectivity
- ✅ Database tables exist
- ✅ Storage buckets configured

---

## Step 3: Create an Admin User

You need an admin user to access the Video Studio.

### Option A: Via Supabase Dashboard

1. Go to **Authentication > Users**
2. Create a new user
3. In **SQL Editor**, run:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'your-admin@example.com';
```

### Option B: Sign Up and Promote

1. Sign up through the app
2. Promote yourself to admin via SQL Editor (same as above)

---

## Step 4: Access the Video Studio

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Log in as your admin user

3. Navigate to: `http://localhost:3000/admin/videos`

---

## Using the Video Studio

### Generate a Video

1. Enter a video title
2. Write or use a template for the script
3. Select an avatar and voice
4. Click "Generate Video"
5. Wait for processing (typically 1-5 minutes)

### Assign to Lesson

1. Find a completed video in the list
2. Click "Assign to Lesson"
3. Select the target lesson
4. Choose whether to upload to Supabase storage (recommended for CDN)
5. Confirm assignment

---

## Troubleshooting

### "Unauthorized" errors
- Verify you're logged in as an admin
- Check that your user has `role = 'admin'` in the database

### "Supabase not configured"
- Verify `.env.local` has correct credentials
- Restart the dev server after changes

### "HeyGen API error"
- Verify your API key is correct
- Check your HeyGen account has credits
- Some avatars require paid plans

### "Storage upload failed"
- Verify the `course-videos` bucket exists
- Check bucket policies allow authenticated uploads
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set

---

## API Reference

### POST `/api/admin/videos`
Generate a new video

```json
{
  "title": "Introduction to Python",
  "script": "Hello, welcome to this lesson...",
  "avatarId": "optional-avatar-id",
  "voiceId": "optional-voice-id",
  "backgroundColor": "#1e3a5f",
  "aspectRatio": "16:9",
  "lessonId": "optional-lesson-uuid",
  "testMode": false
}
```

### GET `/api/admin/videos`
List generated videos or get avatars/voices

- `?type=avatars` - List available avatars
- `?type=voices` - List available voices
- (no params) - List video generations

### GET `/api/admin/videos/[videoId]`
Check video generation status

### POST `/api/admin/videos/[videoId]`
Assign video to lesson

```json
{
  "lessonId": "lesson-uuid",
  "uploadToStorage": true
}
```

---

## File Structure

```
├── app/
│   ├── admin/videos/
│   │   └── page.tsx          # Video Studio UI
│   └── api/
│       ├── admin/videos/
│       │   ├── route.ts      # Video generation & listing
│       │   └── [videoId]/
│       │       └── route.ts  # Status & assignment
│       └── lessons/
│           └── route.ts      # Lesson listing
├── lib/services/
│   └── heygen.ts             # HeyGen API service
├── supabase/migrations/
│   ├── 20240118000000_video_generations.sql
│   └── 20240119000000_storage_buckets.sql
└── scripts/
    └── verify-video-setup.ts  # Setup verification
```

---

## Support

If you encounter issues:
1. Run `npm run verify:video-setup` to diagnose
2. Check browser console for client-side errors
3. Check terminal for server-side errors
4. Verify all environment variables are set correctly
