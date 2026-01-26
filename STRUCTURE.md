# Phazur Labs Academy - Project Structure

> **Technical Architecture Documentation**
>
> *A comprehensive guide to the codebase organization*

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14.2.4 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **UI Components** | shadcn/ui + Radix UI |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Payments** | Stripe |
| **State** | Zustand |
| **Icons** | Lucide React |

---

## Directory Overview

```
phazur-labs-academy/
├── app/                    # Next.js App Router pages
│   ├── (marketing)/        # Marketing/public pages
│   ├── admin/              # Admin dashboard
│   ├── api/                # API routes
│   ├── auth/               # Authentication pages
│   ├── checkout/           # Payment/checkout flow
│   ├── courses/            # Course pages & learning
│   ├── dashboard/          # User dashboards
│   ├── skills/             # Skills catalog
│   ├── teams/              # Team management
│   └── tracks/             # Learning tracks
├── components/             # React components
│   ├── assignment/         # Assignment components
│   ├── cart/               # Shopping cart
│   ├── certificate/        # Certificate display
│   ├── layout/             # Layout components
│   ├── lesson/             # Lesson UI (notes, bookmarks, discussion)
│   ├── quiz/               # Quiz components
│   ├── ui/                 # shadcn/ui components
│   └── video-player/       # Video player
├── lib/                    # Utilities & services
│   ├── data/               # Static/mock data
│   ├── hooks/              # Custom React hooks
│   ├── services/           # External service integrations
│   ├── stores/             # Zustand state stores
│   ├── supabase/           # Supabase client config
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   └── validators/         # Validation schemas
└── public/                 # Static assets
```

---

## App Router Structure

### Marketing Pages (`/app/(marketing)/`)

Public-facing pages with shared marketing layout.

| Route | Purpose |
|-------|---------|
| `/about` | About the platform |
| `/blog` | Blog/articles |
| `/careers` | Job listings |
| `/certifications` | Certification info |
| `/community/*` | Community pages |
| `/contact` | Contact form |
| `/enterprise` | Enterprise sales |
| `/help` | Help center |
| `/leadership` | Team bios |
| `/partners` | Partner info |
| `/press` | Press releases |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/verify` | Certificate verification |

### Course System (`/app/courses/`)

The core learning experience.

```
/courses
├── page.tsx                    # Course catalog
└── [slug]/
    ├── page.tsx                # Course detail/landing
    ├── learn/
    │   └── page.tsx            # Learning interface (video, notes, discussion)
    ├── quiz/
    │   └── [quizId]/page.tsx   # Quiz taking
    └── discussions/
        ├── page.tsx            # Course discussions list
        └── [discussionId]/     # Single discussion thread
```

### Dashboard (`/app/dashboard/`)

Role-based user dashboards.

```
/dashboard
├── layout.tsx              # Dashboard shell
├── student/                # Student dashboard
│   ├── page.tsx            # Overview
│   └── courses/            # Enrolled courses
├── instructor/             # Instructor dashboard
│   ├── page.tsx            # Overview
│   └── courses/            # Course management
├── admin/                  # Admin dashboard
│   ├── page.tsx            # Overview
│   ├── users/              # User management
│   └── courses/            # All courses
└── certificates/           # User certificates
```

### Admin Panel (`/app/admin/`)

Administrative interfaces.

| Route | Purpose |
|-------|---------|
| `/admin` | Admin overview |
| `/admin/students` | Student management |
| `/admin/instructors` | Instructor management |
| `/admin/courses` | Course management |
| `/admin/courses/[id]/content` | Content editing |
| `/admin/quizzes` | Quiz management |
| `/admin/assignments` | Assignment management |
| `/admin/content` | Content library |
| `/admin/live-training` | Live sessions |

---

## API Routes (`/app/api/`)

RESTful API endpoints for all backend operations.

### Core APIs

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/auth` | POST | Authentication |
| `/api/users` | GET, POST, PATCH | User CRUD |
| `/api/courses` | GET, POST, PATCH | Course CRUD |
| `/api/enrollments` | GET, POST | Enrollment management |
| `/api/progress` | GET, POST, PATCH | Learning progress |
| `/api/quizzes` | GET, POST | Quiz operations |

### Student Learning APIs

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/lessons/notes` | GET, POST, PATCH, DELETE | Personal notes |
| `/api/bookmarks` | GET, POST, DELETE | Lesson bookmarks |
| `/api/discussions` | GET, POST | Course discussions |

### Commerce APIs

| Endpoint | Purpose |
|----------|---------|
| `/api/payments/checkout` | Stripe checkout session |
| `/api/webhooks/stripe` | Stripe webhook handler |

### Admin APIs

| Endpoint | Purpose |
|----------|---------|
| `/api/admin/*` | Admin-only operations |
| `/api/analytics` | Platform analytics |
| `/api/certificates` | Certificate generation |

### Live Training APIs

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/live-trainings` | GET, POST | List/create trainings |
| `/api/live-trainings/[id]` | GET, PATCH, DELETE, POST | Training CRUD & registration |

### Team APIs

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/teams` | GET, POST | List/create teams |
| `/api/teams/[id]` | GET, PATCH, DELETE | Team management |
| `/api/teams/[id]/members` | GET, POST, PATCH, DELETE | Member management |
| `/api/teams/[id]/invitations` | GET, POST, DELETE | Invitation management |

### Gamification APIs

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/achievements` | GET | List all achievements |
| `/api/achievements/user` | GET, PATCH, POST | User achievements & check |
| `/api/gamification/stats` | GET, POST | User points, streaks, activity |
| `/api/gamification/leaderboard` | GET, POST | Leaderboards & cache refresh |

### Recommendations API

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/recommendations` | GET | AI-powered course recommendations |

---

## Component Architecture

### UI Components (`/components/ui/`)

Base shadcn/ui components:

| Component | Purpose |
|-----------|---------|
| `avatar.tsx` | User avatars |
| `badge.tsx` | Status badges |
| `button.tsx` | Buttons |
| `card.tsx` | Content cards |
| `dialog.tsx` | Modal dialogs |
| `input.tsx` | Form inputs |
| `progress.tsx` | Progress bars |
| `tabs.tsx` | Tab navigation |
| `textarea.tsx` | Multi-line input |

### Lesson Components (`/components/lesson/`)

Learning experience components:

| Component | Purpose |
|-----------|---------|
| `lesson-notes.tsx` | Personal note-taking with auto-save |
| `bookmark-toggle.tsx` | Bookmark lessons for later |
| `lesson-discussion.tsx` | Discussion threads per lesson |

### Layout Components (`/components/layout/`)

| Component | Purpose |
|-----------|---------|
| `header.tsx` | Main navigation |
| `footer.tsx` | Site footer |
| `sidebar.tsx` | Dashboard sidebar |

### Gamification Components (`/components/gamification/`)

| Component | Purpose |
|-----------|---------|
| `achievement-badge.tsx` | Display achievement badges with progress |
| `achievements-grid.tsx` | Grid view of all achievements |
| `streak-display.tsx` | Streak display card and badge |
| `leaderboard.tsx` | Points leaderboard with tabs |
| `points-display.tsx` | User points display (card, compact, inline) |

---

## Library Structure

### Supabase (`/lib/supabase/`)

```
supabase/
├── client.ts       # Browser client
├── server.ts       # Server client (for API routes)
└── middleware.ts   # Auth middleware
```

### Hooks (`/lib/hooks/`)

Custom React hooks for common operations.

### Stores (`/lib/stores/`)

Zustand state management stores.

### Services (`/lib/services/`)

External service integrations (HeyGen, etc.).

### Data (`/lib/data/`)

Static data and mock content for development.

---

## Key Features Status

### Implemented

- [x] Course catalog & detail pages
- [x] Learning interface with video player
- [x] Tabbed navigation (Overview, Resources, Notes, Discussion)
- [x] Personal notes system with auto-save
- [x] Bookmark functionality
- [x] Discussion system with mock data
- [x] Checkout flow (Stripe integration)
- [x] Admin dashboard structure
- [x] User authentication (Supabase)
- [x] Certificate system
- [x] Real-time discussions (Supabase Realtime)
- [x] Quiz system with scoring
- [x] Progress tracking & analytics
- [x] Live training sessions (scheduling, registration, management)
- [x] Team management (members, invitations, course access)
- [x] AI-powered course recommendations
- [x] Gamification system (badges, achievements, streaks, points, leaderboards)

### Planned

- [ ] Mobile app (React Native)
- [ ] Offline mode (PWA)
- [ ] Advanced analytics dashboard
- [ ] Social features (follow instructors, share progress)

---

## Environment Configuration

Required environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=
```

---

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Mock Data Mode

When Supabase is not configured, APIs return mock data automatically:
- Discussions API returns sample discussion threads
- Notes API uses local storage fallback
- Bookmarks use session storage

---

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Pages | `page.tsx` | `app/courses/page.tsx` |
| Layouts | `layout.tsx` | `app/dashboard/layout.tsx` |
| API Routes | `route.ts` | `app/api/courses/route.ts` |
| Components | `kebab-case.tsx` | `lesson-notes.tsx` |
| Hooks | `use-{name}.ts` | `use-auth.ts` |
| Types | `{name}.types.ts` | `course.types.ts` |
| Utils | `{name}.ts` | `format-date.ts` |

---

## Stats

| Metric | Count |
|--------|-------|
| Page Components | 66 |
| React Components | 28 |
| API Routes | 26 |
| Database Migrations | 10 |
| Total TypeScript Files | 120+ |

---

*Last Updated: January 26, 2026*
