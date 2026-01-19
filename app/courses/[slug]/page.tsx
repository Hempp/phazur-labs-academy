'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
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
  Infinity,
  Monitor,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge, LevelBadge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { UserAvatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

// Mock course data - would come from API
const mockCourseData = {
  id: '1',
  slug: 'advanced-react-patterns',
  title: 'Advanced React Patterns',
  subtitle: 'Master modern React development with advanced patterns and best practices',
  description: `
    Take your React skills to the next level with this comprehensive course on advanced patterns and techniques used by industry experts.

    You'll learn how to build reusable, maintainable, and scalable React applications using patterns like Compound Components, Render Props, Custom Hooks, and more.

    By the end of this course, you'll have the confidence to tackle complex React challenges and architect large-scale applications.
  `,
  instructor: {
    id: 'inst-1',
    name: 'Sarah Johnson',
    avatar: '/images/instructors/sarah.jpg',
    title: 'Senior Software Engineer at Meta',
    bio: 'Sarah has been building React applications for over 8 years and has contributed to several popular open-source libraries. She specializes in performance optimization and architectural patterns.',
    courses: 12,
    students: 125000,
    rating: 4.9,
  },
  thumbnail: '/images/courses/react-patterns.jpg',
  previewVideo: '/videos/react-patterns-preview.mp4',
  rating: 4.9,
  reviewCount: 2847,
  students: 15420,
  duration: 1440,
  lessons: 32,
  level: 'advanced' as const,
  price: 89.99,
  originalPrice: 149.99,
  category: 'Web Development',
  subcategory: 'React',
  language: 'English',
  lastUpdated: '2024-01-15',
  isBestseller: true,
  tags: ['React', 'JavaScript', 'Frontend', 'Hooks', 'TypeScript'],
  requirements: [
    'Solid understanding of JavaScript (ES6+)',
    'Basic React knowledge (components, props, state)',
    'Familiarity with React hooks (useState, useEffect)',
    'Node.js installed on your machine',
  ],
  whatYouWillLearn: [
    'Master Compound Components pattern for flexible APIs',
    'Implement Render Props for maximum reusability',
    'Create custom hooks for shared logic',
    'Build performant applications with React.memo and useMemo',
    'Understand and implement the Provider pattern',
    'Handle complex state with useReducer',
    'Build accessible components following ARIA best practices',
    'Write tests for React components and hooks',
  ],
  targetAudience: [
    'React developers looking to level up their skills',
    'Frontend engineers preparing for senior roles',
    'Developers who want to write cleaner, more maintainable code',
    'Anyone building complex React applications',
  ],
  modules: [
    {
      id: 'm1',
      title: 'Introduction to Advanced Patterns',
      duration: 45,
      lessons: [
        { id: 'l1', title: 'Course Overview', type: 'video' as const, duration: 8, isFree: true },
        { id: 'l2', title: 'Setting Up the Development Environment', type: 'video' as const, duration: 12, isFree: true },
        { id: 'l3', title: 'Understanding Pattern Categories', type: 'video' as const, duration: 15, isFree: false },
        { id: 'l4', title: 'When to Use Which Pattern', type: 'video' as const, duration: 10, isFree: false },
      ],
    },
    {
      id: 'm2',
      title: 'Compound Components Pattern',
      duration: 120,
      lessons: [
        { id: 'l5', title: 'What are Compound Components?', type: 'video' as const, duration: 18, isFree: false },
        { id: 'l6', title: 'Building a Tabs Component', type: 'video' as const, duration: 25, isFree: false },
        { id: 'l7', title: 'Using Context for Implicit State', type: 'video' as const, duration: 22, isFree: false },
        { id: 'l8', title: 'Flexible Compound Components', type: 'video' as const, duration: 20, isFree: false },
        { id: 'l9', title: 'Real-world Examples', type: 'video' as const, duration: 25, isFree: false },
        { id: 'l10', title: 'Exercise: Build a Menu Component', type: 'exercise' as const, duration: 10, isFree: false },
      ],
    },
    {
      id: 'm3',
      title: 'Custom Hooks Deep Dive',
      duration: 150,
      lessons: [
        { id: 'l11', title: 'Custom Hooks Fundamentals', type: 'video' as const, duration: 20, isFree: false },
        { id: 'l12', title: 'Building useToggle and useBoolean', type: 'video' as const, duration: 18, isFree: false },
        { id: 'l13', title: 'Data Fetching with Custom Hooks', type: 'video' as const, duration: 28, isFree: false },
        { id: 'l14', title: 'useLocalStorage Hook', type: 'video' as const, duration: 22, isFree: false },
        { id: 'l15', title: 'usePrevious and useDebounce', type: 'video' as const, duration: 20, isFree: false },
        { id: 'l16', title: 'Composing Hooks Together', type: 'video' as const, duration: 25, isFree: false },
        { id: 'l17', title: 'Testing Custom Hooks', type: 'video' as const, duration: 17, isFree: false },
      ],
    },
    {
      id: 'm4',
      title: 'Render Props & HOCs',
      duration: 90,
      lessons: [
        { id: 'l18', title: 'Understanding Render Props', type: 'video' as const, duration: 18, isFree: false },
        { id: 'l19', title: 'Building Reusable Render Props', type: 'video' as const, duration: 22, isFree: false },
        { id: 'l20', title: 'Higher-Order Components Explained', type: 'video' as const, duration: 20, isFree: false },
        { id: 'l21', title: 'HOCs vs Hooks: When to Use What', type: 'video' as const, duration: 15, isFree: false },
        { id: 'l22', title: 'Quiz: Patterns Review', type: 'quiz' as const, duration: 15, isFree: false },
      ],
    },
    {
      id: 'm5',
      title: 'Performance Optimization',
      duration: 135,
      lessons: [
        { id: 'l23', title: 'React Rendering Behavior', type: 'video' as const, duration: 25, isFree: false },
        { id: 'l24', title: 'React.memo Deep Dive', type: 'video' as const, duration: 22, isFree: false },
        { id: 'l25', title: 'useMemo and useCallback', type: 'video' as const, duration: 28, isFree: false },
        { id: 'l26', title: 'Virtualization Techniques', type: 'video' as const, duration: 25, isFree: false },
        { id: 'l27', title: 'React DevTools Profiler', type: 'video' as const, duration: 20, isFree: false },
        { id: 'l28', title: 'Performance Project', type: 'project' as const, duration: 15, isFree: false },
      ],
    },
    {
      id: 'm6',
      title: 'State Management Patterns',
      duration: 120,
      lessons: [
        { id: 'l29', title: 'useReducer for Complex State', type: 'video' as const, duration: 25, isFree: false },
        { id: 'l30', title: 'Context + useReducer Architecture', type: 'video' as const, duration: 30, isFree: false },
        { id: 'l31', title: 'State Machines in React', type: 'video' as const, duration: 28, isFree: false },
        { id: 'l32', title: 'Final Project: Building a Complex App', type: 'project' as const, duration: 37, isFree: false },
      ],
    },
  ],
}

const mockReviews = [
  {
    id: 'r1',
    user: { name: 'Alex Thompson', avatar: null },
    rating: 5,
    date: '2024-01-10',
    content: 'This course completely changed how I approach React development. Sarah explains complex patterns in a way that actually makes sense. The compound components section alone was worth the price.',
    helpful: 245,
  },
  {
    id: 'r2',
    user: { name: 'Maria Garcia', avatar: null },
    rating: 5,
    date: '2024-01-05',
    content: 'I\'ve been a React developer for 3 years and still learned so much. The custom hooks section is incredibly practical - I\'m already using several patterns from the course in my day job.',
    helpful: 189,
  },
  {
    id: 'r3',
    user: { name: 'James Wilson', avatar: null },
    rating: 4,
    date: '2024-01-02',
    content: 'Great course overall. The content is excellent and well-explained. Would have loved to see more about testing patterns, but the fundamentals covered are solid.',
    helpful: 134,
  },
]

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

function ModuleAccordion({
  module,
  index,
  isExpanded,
  onToggle,
}: {
  module: typeof mockCourseData.modules[0]
  index: number
  isExpanded: boolean
  onToggle: () => void
}) {
  const lessonTypeIcons = {
    video: PlayCircle,
    exercise: Code,
    quiz: FileText,
    project: Award,
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {index + 1}
          </span>
          <div className="text-left">
            <h3 className="font-medium">{module.title}</h3>
            <p className="text-sm text-muted-foreground">
              {module.lessons.length} lessons · {formatDuration(module.duration)}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      {isExpanded && (
        <div className="border-t bg-muted/30">
          {module.lessons.map((lesson) => {
            const Icon = lessonTypeIcons[lesson.type]
            return (
              <div
                key={lesson.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-sm">{lesson.title}</span>
                {lesson.isFree && (
                  <Badge variant="secondary" className="text-xs">
                    Preview
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground">
                  {formatDuration(lesson.duration)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ReviewCard({ review }: { review: typeof mockReviews[0] }) {
  return (
    <div className="border-b last:border-0 py-6">
      <div className="flex items-start gap-4">
        <UserAvatar
          user={{ name: review.user.name, avatar_url: review.user.avatar }}
          size="md"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{review.user.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-4 w-4',
                        i < review.rating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-muted-foreground'
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(review.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm mt-3">{review.content}</p>
          <div className="flex items-center gap-4 mt-3">
            <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              Helpful ({review.helpful})
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CourseDetailPage() {
  const params = useParams()
  const [expandedModules, setExpandedModules] = useState<string[]>(['m1'])
  const [isWishlisted, setIsWishlisted] = useState(false)

  const course = mockCourseData

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const expandAll = () => {
    setExpandedModules(course.modules.map((m) => m.id))
  }

  const collapseAll = () => {
    setExpandedModules([])
  }

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0)
  const discount = course.originalPrice
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0

  const ratingDistribution = [
    { stars: 5, percentage: 78 },
    { stars: 4, percentage: 15 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 1 },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 text-sm mb-4">
                <Link href="/courses" className="hover:underline">
                  Courses
                </Link>
                <span>/</span>
                <Link href={`/courses?category=${course.category.toLowerCase().replace(' ', '-')}`} className="hover:underline">
                  {course.category}
                </Link>
                <span>/</span>
                <span className="text-muted-foreground">{course.subcategory}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
              <p className="text-lg text-slate-300 mt-3">{course.subtitle}</p>

              <div className="flex flex-wrap items-center gap-4 mt-6">
                {course.isBestseller && (
                  <Badge className="bg-amber-500 hover:bg-amber-600">Bestseller</Badge>
                )}
                <div className="flex items-center gap-1">
                  <span className="font-bold text-amber-400">{course.rating}</span>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-4 w-4',
                          i < Math.floor(course.rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-500'
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-slate-400">
                    ({course.reviewCount.toLocaleString()} reviews)
                  </span>
                </div>
                <span className="text-slate-400">
                  {course.students.toLocaleString()} students
                </span>
              </div>

              <div className="flex items-center gap-4 mt-4 text-sm text-slate-300">
                <span>Created by <Link href={`/instructors/${course.instructor.id}`} className="text-primary hover:underline">{course.instructor.name}</Link></span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Last updated {new Date(course.lastUpdated).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  {course.language}
                </div>
              </div>
            </div>

            {/* Purchase Card - Shows on mobile */}
            <div className="lg:hidden">
              <Card className="bg-white text-foreground">
                <CardContent className="p-6">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold">${course.price}</span>
                    {course.originalPrice && (
                      <>
                        <span className="text-lg text-muted-foreground line-through">
                          ${course.originalPrice}
                        </span>
                        <Badge variant="destructive">{discount}% off</Badge>
                      </>
                    )}
                  </div>
                  <div className="space-y-3">
                    <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                      Add to Cart
                    </button>
                    <button className="w-full py-3 border rounded-lg font-medium hover:bg-muted transition-colors">
                      Buy Now
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <Card>
              <CardHeader>
                <CardTitle>What you&apos;ll learn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {course.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Content */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Course Content</h2>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    {course.modules.length} sections · {totalLessons} lectures · {formatDuration(course.duration)} total
                  </span>
                  <button
                    onClick={expandedModules.length === course.modules.length ? collapseAll : expandAll}
                    className="text-primary hover:underline"
                  >
                    {expandedModules.length === course.modules.length ? 'Collapse all' : 'Expand all'}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {course.modules.map((module, index) => (
                  <ModuleAccordion
                    key={module.id}
                    module={module}
                    index={index}
                    isExpanded={expandedModules.includes(module.id)}
                    onToggle={() => toggleModule(module.id)}
                  />
                ))}
              </div>
            </div>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {course.description.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph.trim()}</p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Target Audience */}
            <Card>
              <CardHeader>
                <CardTitle>Who this course is for</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {course.targetAudience.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Instructor */}
            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <UserAvatar
                    user={{ name: course.instructor.name, avatar_url: course.instructor.avatar }}
                    size="xl"
                  />
                  <div>
                    <Link
                      href={`/instructors/${course.instructor.id}`}
                      className="text-lg font-semibold text-primary hover:underline"
                    >
                      {course.instructor.name}
                    </Link>
                    <p className="text-muted-foreground">{course.instructor.title}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        {course.instructor.rating} rating
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {course.instructor.courses} courses
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {course.instructor.students.toLocaleString()} students
                      </div>
                    </div>
                    <p className="text-sm mt-3">{course.instructor.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Student Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div className="text-center md:border-r">
                    <div className="text-5xl font-bold text-amber-500">{course.rating}</div>
                    <div className="flex justify-center mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-5 w-5',
                            i < Math.floor(course.rating)
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-muted-foreground'
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Course Rating</p>
                  </div>
                  <div className="md:col-span-2">
                    {ratingDistribution.map((item) => (
                      <div key={item.stars} className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1 w-20">
                          {Array.from({ length: item.stars }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-amber-500 fill-amber-500" />
                          ))}
                        </div>
                        <Progress value={item.percentage} className="h-2 flex-1" />
                        <span className="text-sm text-muted-foreground w-12">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-0">
                  {mockReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>

                <button className="w-full mt-6 py-3 border rounded-lg font-medium hover:bg-muted transition-colors">
                  Show all reviews
                </button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Purchase Card */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <Card>
                <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                    <BookOpen className="h-16 w-16 text-primary/50" />
                  </div>
                  <button className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors group">
                    <div className="p-4 rounded-full bg-white/90 group-hover:scale-110 transition-transform">
                      <Play className="h-8 w-8 text-primary fill-primary" />
                    </div>
                  </button>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold">${course.price}</span>
                    {course.originalPrice && (
                      <>
                        <span className="text-lg text-muted-foreground line-through">
                          ${course.originalPrice}
                        </span>
                        <Badge variant="destructive">{discount}% off</Badge>
                      </>
                    )}
                  </div>

                  <div className="space-y-3">
                    <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                      Add to Cart
                    </button>
                    <button className="w-full py-3 border rounded-lg font-medium hover:bg-muted transition-colors">
                      Buy Now
                    </button>
                  </div>

                  <p className="text-center text-sm text-muted-foreground mt-4">
                    30-Day Money-Back Guarantee
                  </p>

                  <div className="border-t mt-6 pt-6">
                    <h4 className="font-medium mb-3">This course includes:</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <PlayCircle className="h-4 w-4 text-muted-foreground" />
                        {formatDuration(course.duration)} on-demand video
                      </div>
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-muted-foreground" />
                        Coding exercises
                      </div>
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-muted-foreground" />
                        Downloadable resources
                      </div>
                      <div className="flex items-center gap-2">
                        <Infinity className="h-4 w-4 text-muted-foreground" />
                        Full lifetime access
                      </div>
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-muted-foreground" />
                        Access on mobile and TV
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        Certificate of completion
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t">
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className="flex items-center gap-1 text-sm hover:text-primary transition-colors"
                    >
                      <Heart
                        className={cn(
                          'h-4 w-4',
                          isWishlisted && 'fill-red-500 text-red-500'
                        )}
                      />
                      Wishlist
                    </button>
                    <button className="flex items-center gap-1 text-sm hover:text-primary transition-colors">
                      <Share2 className="h-4 w-4" />
                      Share
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
