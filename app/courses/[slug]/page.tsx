'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Header, Footer } from '@/components/layout'
import {
  Star,
  Clock,
  Users,
  BookOpen,
  Play,
  Award,
  Globe,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Heart,
  Share2,
  PlayCircle,
  FileText,
  Code,
  Download,
  Calendar,
  BarChart,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AddToCartButton } from '@/components/cart'
import { courses } from '@/lib/data/store'

// Fallback mock course data (used when course not found)
const mockCourseData = {
  id: '1',
  slug: 'full-stack-web-development',
  title: 'Full-Stack Web Development Professional Certificate',
  subtitle: 'Launch your career as a full-stack developer. Master React, Node.js, TypeScript, and PostgreSQL to build production-ready applications.',
  partner: 'Phazur Labs',
  partnerLogo: null,
  description: `
    Become a job-ready full-stack developer in this comprehensive program. You'll learn to build complete web applications from the ground up, using modern technologies and best practices employed by top tech companies.

    This program is designed for beginners and those looking to transition into software development. No prior programming experience is required - we'll start from the fundamentals and build up to advanced concepts.

    By completing this certificate, you'll have a portfolio of real-world projects demonstrating your skills to potential employers.
  `,
  instructor: {
    id: 'inst-1',
    name: 'Sarah Johnson',
    avatar: null,
    title: 'Principal Software Engineer',
    company: 'Phazur Labs',
    bio: 'Sarah has been building web applications for over 12 years and has led engineering teams at multiple startups. She specializes in React architecture and has contributed to several popular open-source libraries.',
    courses: 8,
    students: 185000,
    rating: 4.9,
  },
  rating: 4.9,
  reviewCount: 12500,
  enrolledCount: 158420,
  duration: '6 months',
  hoursPerWeek: '10 hours/week',
  level: 'Beginner',
  language: 'English',
  lastUpdated: '2024-01-15',
  price: 49,
  originalPrice: null,
  category: 'Development',
  subcategory: 'Web Development',
  badge: 'Professional Certificate',
  skills: [
    'React',
    'Node.js',
    'TypeScript',
    'PostgreSQL',
    'GraphQL',
    'Docker',
    'AWS',
    'Git',
  ],
  outcomes: [
    { metric: '87%', label: 'of learners started a new career after completing' },
    { metric: '45%', label: 'got a pay increase or promotion' },
    { metric: '$85,000', label: 'median salary for entry-level developers' },
  ],
  whatYouWillLearn: [
    'Build responsive web applications using React and TypeScript',
    'Design and implement RESTful APIs with Node.js and Express',
    'Work with relational databases using PostgreSQL and Prisma',
    'Deploy applications using Docker and cloud platforms',
    'Implement authentication and authorization patterns',
    'Write tests and maintain code quality standards',
    'Collaborate using Git and modern development workflows',
    'Build a portfolio of production-ready projects',
  ],
  modules: [
    {
      id: 'm1',
      title: 'Foundations of Web Development',
      subtitle: 'Course 1',
      duration: '4 weeks',
      lessons: 24,
      description: 'Learn HTML, CSS, and JavaScript fundamentals',
    },
    {
      id: 'm2',
      title: 'React Development',
      subtitle: 'Course 2',
      duration: '5 weeks',
      lessons: 32,
      description: 'Build interactive user interfaces with React',
    },
    {
      id: 'm3',
      title: 'TypeScript Fundamentals',
      subtitle: 'Course 3',
      duration: '3 weeks',
      lessons: 18,
      description: 'Add type safety to your JavaScript applications',
    },
    {
      id: 'm4',
      title: 'Backend Development with Node.js',
      subtitle: 'Course 4',
      duration: '5 weeks',
      lessons: 28,
      description: 'Build scalable server-side applications',
    },
    {
      id: 'm5',
      title: 'Database Design & PostgreSQL',
      subtitle: 'Course 5',
      duration: '4 weeks',
      lessons: 22,
      description: 'Design and query relational databases',
    },
    {
      id: 'm6',
      title: 'Full-Stack Capstone Project',
      subtitle: 'Course 6',
      duration: '6 weeks',
      lessons: 15,
      description: 'Build a complete application from scratch',
    },
  ],
  requirements: [
    'No programming experience required',
    'Basic computer literacy',
    'Access to a computer with internet connection',
    'Commitment of 10+ hours per week',
  ],
  targetAudience: [
    'Beginners with no coding experience',
    'Career changers looking to enter tech',
    'Self-taught developers wanting structured learning',
    'Students preparing for software development roles',
  ],
}

const mockReviews = [
  {
    id: 'r1',
    user: { name: 'Alex Thompson', avatar: null, country: 'United States' },
    rating: 5,
    date: '2024-01-10',
    content: 'This certificate program completely changed my career trajectory. I went from working in retail to landing a junior developer position within 3 months of completing the program. The projects are practical and the instructors are incredibly supportive.',
    helpful: 892,
  },
  {
    id: 'r2',
    user: { name: 'Maria Garcia', avatar: null, country: 'Spain' },
    rating: 5,
    date: '2024-01-05',
    content: 'Excellent curriculum that covers everything you need to know. The pace is perfect for beginners, and the advanced modules are challenging enough for those with some experience. Highly recommend!',
    helpful: 654,
  },
  {
    id: 'r3',
    user: { name: 'James Wilson', avatar: null, country: 'United Kingdom' },
    rating: 4,
    date: '2024-01-02',
    content: 'Great content and well-structured courses. The capstone project was particularly valuable for building my portfolio. Only wish there was more content on DevOps practices.',
    helpful: 423,
  },
]

// Sticky navigation sections
const navSections = [
  { id: 'about', label: 'About' },
  { id: 'outcomes', label: 'Outcomes' },
  { id: 'courses', label: 'Courses' },
  { id: 'instructors', label: 'Instructors' },
  { id: 'reviews', label: 'Reviews' },
]

function CourseModuleCard({ module, index }: { module: typeof mockCourseData.modules[0]; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold flex-shrink-0">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground font-medium">{module.subtitle}</p>
          <h3 className="font-semibold text-foreground mt-0.5">{module.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {module.duration} · {module.lessons} lessons
          </p>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      {isExpanded && (
        <div className="border-t bg-muted/30 px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Course content includes video lectures, hands-on exercises, quizzes, and a course project.
          </p>
          <Link
            href={`/courses/${mockCourseData.slug}/modules/${module.id}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-3 hover:underline"
          >
            View course details
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}

function ReviewCard({ review }: { review: typeof mockReviews[0] }) {
  return (
    <div className="py-6 border-b last:border-0">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
          {review.user.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{review.user.name}</span>
            <span className="text-xs text-muted-foreground">· {review.user.country}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-3.5 h-3.5',
                    i < review.rating ? 'text-warning fill-warning' : 'text-muted-foreground'
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <p className="text-sm text-foreground mt-3 leading-relaxed">{review.content}</p>
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3 hover:text-foreground transition-colors">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Helpful ({review.helpful})
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CourseDetailPage() {
  const params = useParams()
  const [activeSection, setActiveSection] = useState('about')
  const [showStickyNav, setShowStickyNav] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  // Find course by slug from the store
  const slug = params?.slug as string
  const storeCourseLookup = courses.find(c => c.slug === slug)

  // Map store course to page format, or fallback to mock data
  const course = storeCourseLookup ? {
    id: storeCourseLookup.id,
    slug: storeCourseLookup.slug,
    title: storeCourseLookup.title,
    subtitle: storeCourseLookup.description?.slice(0, 150) || '',
    partner: 'Phazur Labs',
    partnerLogo: null,
    description: storeCourseLookup.description,
    instructor: {
      id: storeCourseLookup.instructor?.id || '',
      name: storeCourseLookup.instructor?.full_name || 'Instructor',
      avatar: storeCourseLookup.instructor?.avatar_url,
      title: 'Senior Instructor',
      company: 'Phazur Labs',
      bio: storeCourseLookup.instructor?.bio || `Expert instructor teaching ${storeCourseLookup.title}`,
      courses: storeCourseLookup.instructor?.courses_created?.length || 8,
      students: storeCourseLookup.instructor?.total_students || 185000,
      rating: storeCourseLookup.instructor?.rating || 4.9,
    },
    rating: storeCourseLookup.rating,
    reviewCount: storeCourseLookup.reviews_count || 1000,
    enrolledCount: storeCourseLookup.enrolled_students || 50000,
    duration: `${Math.floor(storeCourseLookup.total_duration_minutes / 60)} hours`,
    hoursPerWeek: '10 hours/week',
    level: storeCourseLookup.level,
    language: 'English',
    lastUpdated: storeCourseLookup.updated_at,
    price: storeCourseLookup.price,
    originalPrice: storeCourseLookup.discount_price ? storeCourseLookup.price : null,
    category: storeCourseLookup.category,
    subcategory: storeCourseLookup.category,
    badge: 'Professional Certificate',
    skills: storeCourseLookup.tags || [],
    outcomes: [
      { metric: '87%', label: 'of learners started a new career after completing' },
      { metric: '45%', label: 'got a pay increase or promotion' },
      { metric: '$85,000', label: 'median salary for entry-level developers' },
    ],
    whatYouWillLearn: storeCourseLookup.learning_outcomes || [],
    modules: storeCourseLookup.sections?.map((section: { id: string; title: string; description?: string; lessons?: { id: string }[] }, index: number) => ({
      id: section.id,
      title: section.title,
      subtitle: `Course ${index + 1}`,
      duration: `${Math.ceil((section.lessons?.length || 1) / 2)} weeks`,
      lessons: section.lessons?.length || 0,
      description: section.description || `Learn ${section.title}`,
    })) || mockCourseData.modules,
    requirements: storeCourseLookup.prerequisites || mockCourseData.requirements,
    targetAudience: mockCourseData.targetAudience,
  } : mockCourseData

  // Handle scroll for sticky nav
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom
        setShowStickyNav(heroBottom < 0)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = showStickyNav ? 120 : 80
      const top = element.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
      setActiveSection(sectionId)
    }
  }

  const ratingDistribution = [
    { stars: 5, percentage: 82 },
    { stars: 4, percentage: 12 },
    { stars: 3, percentage: 4 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 1 },
  ]

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons, 0)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Sticky Navigation */}
      <div
        className={cn(
          'fixed top-0 left-0 right-0 z-40 bg-background border-b transition-transform duration-300',
          showStickyNav ? 'translate-y-0' : '-translate-y-full'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center h-14 gap-8">
            <h2 className="font-semibold text-foreground truncate max-w-xs">
              {course.title}
            </h2>
            <nav className="hidden md:flex items-center gap-1">
              {navSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    activeSection === section.id
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {section.label}
                </button>
              ))}
            </nav>
            <div className="ml-auto">
              <button className="h-9 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                Enroll for Free
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div ref={heroRef} className="bg-surface-secondary border-b">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/courses" className="text-primary hover:underline">
              Browse
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link href={`/courses?category=${course.category.toLowerCase()}`} className="text-primary hover:underline">
              {course.category}
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{course.subcategory}</span>
          </nav>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left Column - Course Info */}
            <div className="lg:col-span-3">
              {/* Partner */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-foreground">{course.partner}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {course.title}
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-muted-foreground mt-3">
                {course.subtitle}
              </p>

              {/* Badge */}
              <div className="flex items-center gap-3 mt-4">
                <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                  {course.badge}
                </span>
                <span className="text-sm text-muted-foreground">
                  {course.modules.length} course series
                </span>
              </div>

              {/* Rating & Stats */}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-warning fill-warning" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-muted-foreground">
                    ({course.reviewCount.toLocaleString()} reviews)
                  </span>
                </div>
                <span className="text-muted-foreground">
                  {course.enrolledCount.toLocaleString()} already enrolled
                </span>
              </div>

              {/* Instructor */}
              {course.instructor && (
                <div className="flex items-center gap-3 mt-6 pt-6 border-t">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {course.instructor.name?.charAt(0) || 'I'}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Taught by</p>
                    <Link
                      href={`/instructors/${course.instructor.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {course.instructor.name || 'Instructor'}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - CTA Card */}
            <div className="lg:col-span-2">
              <div className="bg-background border rounded-lg shadow-sm overflow-hidden">
                {/* Preview Video Placeholder */}
                <div className="relative aspect-video bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <button className="p-4 rounded-full bg-white/90 shadow-lg hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-primary fill-primary" />
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  {/* Key Info */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">Flexible deadlines</p>
                        <p className="text-muted-foreground">Reset deadlines in accordance to your schedule.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">Shareable Certificate</p>
                        <p className="text-muted-foreground">Earn a Certificate upon completion</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">100% online</p>
                        <p className="text-muted-foreground">Start instantly and learn at your own schedule.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <BarChart className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">{course.level} Level</p>
                        <p className="text-muted-foreground">{course.requirements[0]}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">{course.duration} to complete</p>
                        <p className="text-muted-foreground">{course.hoursPerWeek} suggested</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="mt-6 space-y-3">
                    <AddToCartButton
                      course={{
                        id: course.id,
                        title: course.title,
                        slug: course.slug,
                        instructor: course.instructor.name,
                        price: course.price,
                        originalPrice: course.originalPrice ?? undefined,
                        image: '/images/courses/default-course.jpg',
                        category: course.category,
                      }}
                      variant="primary"
                      showIcon={true}
                      className="w-full h-11"
                    />
                    <button className="w-full h-11 border rounded-md font-medium hover:bg-muted transition-colors">
                      Try for Free
                    </button>
                  </div>

                  {/* Financial Aid */}
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    <Link href="/financial-aid" className="text-primary hover:underline">
                      Financial aid available
                    </Link>
                  </p>

                  {/* Share & Wishlist */}
                  <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t">
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Heart className={cn('w-4 h-4', isWishlisted && 'fill-red-500 text-red-500')} />
                      Save
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Navigation (Non-sticky) */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1 overflow-x-auto py-1">
            {navSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                  activeSection === section.id
                    ? 'text-primary border-primary'
                    : 'text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground'
                )}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl">
          {/* About Section */}
          <section id="about" className="scroll-mt-32">
            <h2 className="text-xl font-bold text-foreground mb-6">What you&apos;ll learn</h2>
            <div className="grid sm:grid-cols-2 gap-3 p-5 border rounded-lg">
              {course.whatYouWillLearn.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>

            {/* Skills */}
            <h3 className="text-lg font-bold text-foreground mt-10 mb-4">Skills you&apos;ll gain</h3>
            <div className="flex flex-wrap gap-2">
              {course.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-surface-secondary text-sm text-foreground rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Description */}
            <div className="mt-10 prose prose-sm max-w-none">
              {course.description.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-foreground leading-relaxed">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </section>

          {/* Outcomes Section */}
          <section id="outcomes" className="mt-16 scroll-mt-32">
            <h2 className="text-xl font-bold text-foreground mb-6">Career outcomes</h2>
            <div className="grid sm:grid-cols-3 gap-6 p-6 bg-surface-secondary rounded-lg">
              {course.outcomes.map((outcome, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl font-bold text-primary">{outcome.metric}</p>
                  <p className="text-sm text-muted-foreground mt-2">{outcome.label}</p>
                </div>
              ))}
            </div>

            {/* Target Audience */}
            <h3 className="text-lg font-bold text-foreground mt-10 mb-4">Who this program is for</h3>
            <ul className="space-y-2">
              {course.targetAudience.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Courses Section */}
          <section id="courses" className="mt-16 scroll-mt-32">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Program curriculum</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {course.modules.length} courses · {totalLessons} total lessons
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {course.modules.map((module, index) => (
                <CourseModuleCard key={module.id} module={module} index={index} />
              ))}
            </div>
          </section>

          {/* Instructors Section */}
          <section id="instructors" className="mt-16 scroll-mt-32">
            <h2 className="text-xl font-bold text-foreground mb-6">Meet your instructors</h2>
            <div className="border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-semibold flex-shrink-0">
                  {course.instructor.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <Link
                    href={`/instructors/${course.instructor.id}`}
                    className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {course.instructor.name}
                  </Link>
                  <p className="text-muted-foreground">
                    {course.instructor.title} at {course.instructor.company}
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      {course.instructor.rating} Instructor Rating
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.instructor.students.toLocaleString()} Students
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {course.instructor.courses} Courses
                    </div>
                  </div>

                  <p className="text-sm text-foreground mt-4 leading-relaxed">
                    {course.instructor.bio}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Reviews Section */}
          <section id="reviews" className="mt-16 scroll-mt-32">
            <h2 className="text-xl font-bold text-foreground mb-6">Learner reviews</h2>

            {/* Rating Summary */}
            <div className="grid sm:grid-cols-3 gap-8 p-6 border rounded-lg mb-8">
              <div className="text-center">
                <p className="text-5xl font-bold text-foreground">{course.rating}</p>
                <div className="flex justify-center mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-5 h-5',
                        i < Math.floor(course.rating) ? 'text-warning fill-warning' : 'text-muted-foreground'
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {course.reviewCount.toLocaleString()} reviews
                </p>
              </div>
              <div className="sm:col-span-2">
                {ratingDistribution.map((item) => (
                  <div key={item.stars} className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-muted-foreground w-16">
                      {item.stars} stars
                    </span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-warning rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="border rounded-lg divide-y">
              {mockReviews.map((review) => (
                <div key={review.id} className="px-6">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>

            <button className="w-full mt-4 h-11 border rounded-md font-medium hover:bg-muted transition-colors">
              View all reviews
            </button>
          </section>

          {/* Requirements */}
          <section className="mt-16">
            <h2 className="text-xl font-bold text-foreground mb-6">Requirements</h2>
            <ul className="space-y-2">
              {course.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3 text-foreground">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
