# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev              # Start Next.js dev server (port 3000)
npm run build            # Production build
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking

# Database
npm run db:migrate       # Push migrations to Supabase
npm run db:generate      # Generate TypeScript types from schema
npm run db:seed          # Seed database with sample data

# Testing
npm run test             # Run Vitest tests
npm run test:coverage    # Run tests with coverage report
```

## Architecture

### Tech Stack
- **Framework**: Next.js 14 App Router
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS with dark mode (`dark:` variants)
- **UI Components**: Radix UI primitives + custom components in `/components/ui`
- **Icons**: lucide-react
- **Payments**: Stripe
- **State**: React Query for server state, useState for local state

### Route Structure

```
app/
├── (marketing)/         # Public marketing pages (uses route group)
├── admin/               # Admin dashboard (20+ pages)
├── api/                 # API routes organized by domain
├── auth/                # Authentication flows
├── checkout/            # Payment/checkout flow
├── courses/             # Public course listings
└── dashboard/           # Student dashboard
```

### Key Patterns

**Supabase Client Creation**
```typescript
// Server components/API routes - use this for authenticated requests
import { createServerSupabaseClient } from '@/lib/supabase/server'
const supabase = await createServerSupabaseClient()

// Admin operations bypassing RLS
import { createServerSupabaseAdmin } from '@/lib/supabase/server'
const supabaseAdmin = await createServerSupabaseAdmin()
```

**API Route Pattern**
```typescript
// app/api/admin/[resource]/route.ts
interface RouteParams {
  params: Promise<{ resourceId: string }>  // Next.js 14 async params
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { resourceId } = await params  // Must await params
  const supabase = await createServerSupabaseClient()
  // Verify auth, check role, perform operation
}
```

**Admin Page Pattern**
- Client components with `'use client'`
- Mock data in local arrays for UI development
- State config objects for status colors/labels
- Search + dropdown filters
- Tables with checkbox selection and bulk actions

### Data Model

Core entities in `/supabase/migrations/`:
- `users` - Students, instructors, admins (role enum)
- `courses` - Course metadata with status (draft/published/archived)
- `modules` - Course sections with display_order
- `lessons` - Video/article content within modules
- `enrollments` - User-course relationships with progress
- `quizzes` / `questions` / `quiz_attempts` - Assessment system
- `certificates` - Completion certificates with verification

Types defined in `/types/index.ts` - import from `@/types`.

### Authentication Flow

Middleware (`middleware.ts`) handles:
- Session refresh via Supabase SSR
- Protected route redirects (`/dashboard`, `/courses/create`)
- Auth route redirects for logged-in users
- DEV_AUTH_BYPASS for local testing

Role-based access in API routes:
```typescript
const { data: profile } = await supabase
  .from('users')
  .select('role')
  .eq('id', user.id)
  .single()

if (profile?.role !== 'admin') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

### Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Optional integrations: Stripe, Resend (email), BunnyCDN (video), HeyGen (AI video).

## Services

`/lib/services/` contains AI-powered course generation:
- `course-creator.ts` - Main course generation orchestrator
- `heygen.ts` - HeyGen avatar video integration
- `edge-tts.ts` - Text-to-speech for narration
- `draft-video.ts` - Draft video assembly
