# Course Training

Enterprise-grade Learning Management System (LMS) built with Next.js 14.

**Live Site:** [https://pla-ten-eosin.vercel.app](https://pla-ten-eosin.vercel.app)

## Features

- **Course Management** - Create, organize, and deliver courses with modules and lessons
- **Video Content** - AI-powered video generation with HeyGen integration and Edge TTS
- **Student Dashboard** - Track progress, complete lessons, and earn certifications
- **Admin Dashboard** - 20+ admin pages for content, users, analytics, and settings
- **Authentication** - Supabase Auth with role-based access (student, instructor, admin)
- **Payments** - Stripe integration for course purchases and subscriptions
- **Certifications** - Issue verifiable completion certificates
- **Quizzes & Assessments** - Built-in quiz system with multiple question types

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage / BunnyCDN |
| Styling | Tailwind CSS |
| UI Components | Radix UI + shadcn/ui patterns |
| State | React Query + Zustand |
| Payments | Stripe |
| Video | HeyGen AI + Edge TTS |
| Icons | Lucide React |

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Public marketing pages
│   ├── admin/              # Admin dashboard (20+ pages)
│   ├── api/                # API routes
│   ├── auth/               # Authentication flows
│   ├── checkout/           # Payment flow
│   ├── courses/            # Course listings & viewer
│   ├── dashboard/          # Student dashboard
│   └── page.tsx            # Landing page
├── components/             # React components
│   ├── layout/             # Header, Footer, Navigation
│   ├── ui/                 # Base UI components
│   └── ...                 # Feature components
├── lib/                    # Utilities & services
│   ├── services/           # AI video generation, course creation
│   └── supabase/           # Database clients
├── supabase/               # Database migrations & config
├── public/                 # Static assets
├── scripts/                # Build & utility scripts
└── types/                  # TypeScript definitions
```

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Stripe account (for payments)

### Installation

```bash
# Clone the repository
git clone https://github.com/Hempp/phazur-labs-academy.git
cd phazur-labs-academy

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

### Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

Optional integrations:

```env
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
BUNNY_CDN_API_KEY=
HEYGEN_API_KEY=
```

## Commands

```bash
# Development
npm run dev              # Start dev server (port 3000)
npm run build            # Production build
npm run lint             # Run ESLint
npm run type-check       # TypeScript checking

# Database
npm run db:migrate       # Push migrations to Supabase
npm run db:generate      # Generate TypeScript types
npm run db:seed          # Seed sample data

# Testing
npm run test             # Run Vitest tests
npm run test:coverage    # Tests with coverage

# Video System
npm run videos:list      # List all videos
npm run videos:validate  # Validate video files
npm run upload-videos    # Upload to CDN
```

## Key Features Detail

### Admin Dashboard

Comprehensive admin interface with:
- Course creator (standard & quick modes)
- Video library management
- User management (students, instructors, admins)
- Analytics & reporting
- Email templates
- Settings & integrations

### AI Video Generation

Automated lesson video creation:
- HeyGen avatar integration
- Edge TTS for narration
- Custom video assembly pipeline
- Batch processing support

### Authentication Flow

- Email/password registration
- Session management via Supabase SSR
- Role-based access control
- Protected route middleware
- Dev bypass for local testing

## Deployment

Deployed on Vercel with automatic deployments from the `main` branch.

```bash
# Deploy to Vercel
vercel --prod
```

## License

Private - All rights reserved.
