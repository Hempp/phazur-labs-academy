'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  PlayCircle,
  FileText,
  Code,
  Award,
  CheckCircle2,
  Lock,
  MessageSquare,
  BookOpen,
  Clock,
  Download,
  Share2,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  Loader2,
  Trophy,
  ClipboardList,
  GraduationCap,
  Timer,
  Target,
  ArrowRight,
} from 'lucide-react'
import { VideoPlayer } from '@/components/video-player'
import { AudioPlayer } from '@/components/audio-player'
import { AssignmentSubmission, Assignment, Submission, SubmissionType } from '@/components/assignment/assignment-submission'
import { LessonNotes } from '@/components/lesson/lesson-notes'
import { BookmarkToggle } from '@/components/lesson/bookmark-toggle'
import { LessonDiscussion } from '@/components/lesson/lesson-discussion'
import { assignments as mockAssignments } from '@/lib/data/course-content'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { UserAvatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/hooks/use-auth'
import { useProgress } from '@/lib/hooks/use-progress'

// Mock lesson data
const mockLessonData = {
  lesson: {
    id: 'l5',
    title: 'What are Compound Components?',
    type: 'video' as const,
    duration: 18,
    videoUrl: '/videos/compound-components.mp4',
    description: `
      In this lesson, we'll explore the Compound Components pattern in React. This pattern allows you to create components with an implicit API that works together as a cohesive unit.

      We'll look at real-world examples like Reach UI's Tabs component and understand how to implement this pattern in your own projects.
    `,
    resources: [
      { id: 'r1', title: 'Lesson Slides', type: 'pdf', url: '/resources/slides.pdf' },
      { id: 'r2', title: 'Code Examples', type: 'zip', url: '/resources/code.zip' },
    ],
    chapters: [
      { id: 'c1', title: 'Introduction', startTime: 0, endTime: 180 },
      { id: 'c2', title: 'The Problem', startTime: 180, endTime: 420 },
      { id: 'c3', title: 'Compound Components Solution', startTime: 420, endTime: 720 },
      { id: 'c4', title: 'Implementation', startTime: 720, endTime: 960 },
      { id: 'c5', title: 'Summary', startTime: 960, endTime: 1080 },
    ],
  },
  course: {
    id: '1',
    slug: 'advanced-react-patterns',
    title: 'Advanced React Patterns',
    instructor: {
      id: 'inst-1',
      name: 'Sarah Johnson',
      avatar: null, // Uses initials fallback in UserAvatar
    },
    progress: 42,
  },
  modules: [
    {
      id: 'm1',
      title: 'Introduction to Advanced Patterns',
      duration: 45,
      lessons: [
        { id: 'l1', title: 'Course Overview', type: 'video' as const, duration: 8, completed: true },
        { id: 'l2', title: 'Setting Up the Development Environment', type: 'video' as const, duration: 12, completed: true },
        { id: 'l3', title: 'Understanding Pattern Categories', type: 'video' as const, duration: 15, completed: true },
        { id: 'l4', title: 'When to Use Which Pattern', type: 'video' as const, duration: 10, completed: true },
      ],
    },
    {
      id: 'm2',
      title: 'Compound Components Pattern',
      duration: 120,
      lessons: [
        { id: 'l5', title: 'What are Compound Components?', type: 'video' as const, duration: 18, completed: false },
        { id: 'l6', title: 'Building a Tabs Component', type: 'video' as const, duration: 25, completed: false },
        { id: 'l7', title: 'Using Context for Implicit State', type: 'video' as const, duration: 22, completed: false },
        { id: 'l8', title: 'Flexible Compound Components', type: 'video' as const, duration: 20, completed: false },
        { id: 'l9', title: 'Real-world Examples', type: 'video' as const, duration: 25, completed: false },
        { id: 'l10', title: 'Exercise: Build a Menu Component', type: 'exercise' as const, duration: 10, completed: false },
        { id: 'lesson-react-2-4', title: 'Assignment: Build a Menu Component', type: 'assignment' as const, duration: 60, completed: false },
      ],
    },
    {
      id: 'm3',
      title: 'Custom Hooks Deep Dive',
      duration: 150,
      lessons: [
        { id: 'l11', title: 'Custom Hooks Fundamentals', type: 'video' as const, duration: 20, completed: false },
        { id: 'l12', title: 'Building useToggle and useBoolean', type: 'video' as const, duration: 18, completed: false },
        { id: 'l13', title: 'Data Fetching with Custom Hooks', type: 'video' as const, duration: 28, completed: false },
      ],
    },
  ],
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatDuration = (minutes: number): string => {
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hrs > 0) return `${hrs}h ${mins}m`
  return `${mins}m`
}

function LessonSidebar({
  isOpen,
  onClose,
  modules,
  currentLessonId,
  courseProgress,
  completedLessonIds = [],
}: {
  isOpen: boolean
  onClose: () => void
  modules: typeof mockLessonData.modules
  currentLessonId: string
  courseProgress: number
  completedLessonIds?: string[]
}) {
  const [expandedModules, setExpandedModules] = useState<string[]>(['m1', 'm2'])

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const lessonTypeIcons = {
    video: PlayCircle,
    exercise: Code,
    quiz: FileText,
    project: Award,
    assignment: ClipboardList,
  }

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0)
  const completedLessons = completedLessonIds.length

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-80 bg-card border-r transform transition-transform duration-300 lg:transform-none flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="font-semibold">Course Content</h2>
            <p className="text-sm text-muted-foreground">
              {completedLessons}/{totalLessons} lessons completed
            </p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-muted rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-4 py-3 border-b">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Progress</span>
            <span className="font-medium">{courseProgress}%</span>
          </div>
          <Progress value={courseProgress} size="sm" />
        </div>

        {/* Modules */}
        <div className="flex-1 overflow-y-auto">
          {modules.map((module, index) => {
            const isExpanded = expandedModules.includes(module.id)
            // Check module completion using completedLessonIds
            const moduleLessonIds = module.lessons.map(l => l.id)
            const moduleCompletedLessons = moduleLessonIds.filter(id => completedLessonIds.includes(id))
            const isModuleCompleted = moduleCompletedLessons.length === moduleLessonIds.length
            const isModuleInProgress = moduleCompletedLessons.length > 0

            return (
              <div key={module.id} className="border-b">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium',
                        isModuleCompleted
                          ? 'bg-emerald-500 text-white'
                          : isModuleInProgress
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {isModuleCompleted ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                    </span>
                    <div className="text-left">
                      <div className="font-medium text-sm">{module.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {moduleCompletedLessons.length}/{module.lessons.length} lessons · {formatDuration(module.duration)}
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {isExpanded && (
                  <div className="pb-2">
                    {module.lessons.map((lesson) => {
                      const Icon = lessonTypeIcons[lesson.type]
                      const isCurrent = lesson.id === currentLessonId
                      const isCompleted = completedLessonIds.includes(lesson.id)

                      return (
                        <Link
                          key={lesson.id}
                          href={`/courses/${mockLessonData.course.slug}/learn?lesson=${lesson.id}`}
                          className={cn(
                            'flex items-center gap-3 px-4 py-2 mx-2 rounded-lg text-sm transition-colors',
                            isCurrent
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                          ) : (
                            <Icon className={cn(
                              'h-4 w-4 flex-shrink-0',
                              isCurrent ? 'text-primary-foreground' : 'text-muted-foreground'
                            )} />
                          )}
                          <span className="flex-1 line-clamp-1">{lesson.title}</span>
                          <span className={cn(
                            'text-xs',
                            isCurrent ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          )}>
                            {formatDuration(lesson.duration)}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </aside>
    </>
  )
}

export default function CourseLearnPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [currentCourseProgress, setCurrentCourseProgress] = useState(mockLessonData.course.progress)
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(
    mockLessonData.modules.flatMap(m => m.lessons.filter(l => l.completed).map(l => l.id))
  )
  const [showCourseComplete, setShowCourseComplete] = useState(false)
  const [earnedCertificate, setEarnedCertificate] = useState<{
    certificateNumber: string
    verificationUrl: string
  } | null>(null)
  const [assignmentData, setAssignmentData] = useState<{
    assignment: Assignment
    submission: Submission | null
    enrollmentId: string
  } | null>(null)
  const [loadingAssignment, setLoadingAssignment] = useState(false)
  const [lessonQuizzes, setLessonQuizzes] = useState<Array<{
    id: string
    title: string
    description: string
    time_limit: number | null
    passing_score: number
    question_count: number
    total_points: number
    allow_retry: boolean
  }>>([])
  const [quizAttempts, setQuizAttempts] = useState<Record<string, {
    bestScore: number | null
    attemptCount: number
    hasPassed: boolean
  }>>({})

  // Real lesson data state (with mock data as fallback)
  const [lessonData, setLessonData] = useState<{
    lesson: typeof mockLessonData.lesson
    course: typeof mockLessonData.course
    modules: typeof mockLessonData.modules
  }>(mockLessonData)
  const [isLoadingLesson, setIsLoadingLesson] = useState(true)

  const lessonId = searchParams.get('lesson') || 'l5'
  const activeTab = searchParams.get('tab') || 'overview'
  const courseSlug = params.slug as string

  // Fetch lesson data from API
  useEffect(() => {
    const fetchLessonData = async () => {
      if (!courseSlug || !lessonId) return

      setIsLoadingLesson(true)
      try {
        const response = await fetch(`/api/courses/${courseSlug}/lessons/${lessonId}`)
        if (response.ok) {
          const data = await response.json()

          // Transform API response to match component expectations
          setLessonData({
            lesson: {
              id: data.lesson.id,
              title: data.lesson.title,
              type: data.lesson.type as 'video' | 'exercise' | 'quiz' | 'assignment',
              duration: data.lesson.duration,
              videoUrl: data.lesson.videoUrl,
              description: data.lesson.description || '',
              resources: data.lesson.resources || [],
              chapters: data.lesson.chapters?.map((c: { id: string; title: string; startTime: number }) => ({
                id: c.id,
                title: c.title,
                startTime: c.startTime,
                endTime: c.startTime + 180, // Estimate end time
              })) || [],
            },
            course: {
              id: data.course.id,
              slug: data.course.slug,
              title: data.course.title,
              instructor: data.course.instructor || { id: '', name: 'Instructor', avatar: '' },
              progress: data.progress?.progress_percent || 0,
            },
            modules: data.modules.map((m: {
              id: string
              title: string
              lessons: Array<{
                id: string
                title: string
                type: string
                duration: number
                completed: boolean
              }>
            }) => ({
              id: m.id,
              title: m.title,
              duration: m.lessons.reduce((acc: number, l: { duration: number }) => acc + l.duration, 0),
              lessons: m.lessons.map(l => ({
                id: l.id,
                title: l.title,
                type: l.type as 'video' | 'exercise' | 'quiz' | 'assignment',
                duration: l.duration,
                completed: l.completed,
              })),
            })),
          })

          // Update completed lessons
          if (data.completedLessons) {
            setCompletedLessonIds(data.completedLessons)
          }

          // Update course progress
          if (data.progress?.progress_percent) {
            setCurrentCourseProgress(data.progress.progress_percent)
          }
        } else {
          console.log('Using mock data - API returned:', response.status)
        }
      } catch (err) {
        console.log('Using mock data - fetch error:', err)
      } finally {
        setIsLoadingLesson(false)
      }
    }

    fetchLessonData()
  }, [courseSlug, lessonId])

  const { lesson, course, modules } = lessonData

  // Find the current lesson to check its type
  const currentLesson = modules.flatMap(m => m.lessons).find(l => l.id === lessonId)
  const isAssignmentLesson = currentLesson?.type === 'assignment'

  // Progress tracking hook
  const {
    updateWatchTime,
    completeLesson,
    isCompleting,
    error: progressError,
  } = useProgress({
    lessonId,
    onComplete: (response) => {
      if (response.progress) {
        setCurrentCourseProgress(response.progress.percentage)
        // Update completed lessons list
        if (!completedLessonIds.includes(lessonId)) {
          setCompletedLessonIds(prev => [...prev, lessonId])
        }
      }
    },
    onCourseComplete: (certificate) => {
      if (certificate) {
        setEarnedCertificate({
          certificateNumber: certificate.certificateNumber,
          verificationUrl: certificate.verificationUrl,
        })
        setShowCourseComplete(true)
      }
    },
  })

  // Fetch assignment data when lesson is an assignment
  useEffect(() => {
    const fetchAssignmentData = async () => {
      if (!isAssignmentLesson || !currentLesson) return

      setLoadingAssignment(true)
      try {
        // Try API first
        const response = await fetch(`/api/assignments/${lessonId}`)
        if (response.ok) {
          const data = await response.json()
          setAssignmentData({
            assignment: data.assignment,
            submission: data.submission,
            enrollmentId: data.enrollmentId || '',
          })
          return
        }
      } catch (err) {
        console.error('API fetch failed, using mock data:', err)
      }

      // Fallback to mock data
      const mockAssignment = mockAssignments.find(
        a => a.lesson_id === lessonId || a.id === lessonId
      )
      if (mockAssignment) {
        // Transform mock assignment to match expected Assignment type
        const assignment: Assignment = {
          id: mockAssignment.id,
          title: mockAssignment.title,
          description: mockAssignment.description,
          instructions: mockAssignment.instructions,
          due_days_after_enrollment: mockAssignment.due_days_after_enrollment || 7,
          max_score: mockAssignment.max_score,
          submission_types: mockAssignment.submission_types as SubmissionType[],
          allowed_file_types: mockAssignment.allowed_file_types || ['.pdf', '.doc', '.docx', '.zip'],
          max_file_size_mb: mockAssignment.max_file_size_mb || 10,
          rubric: (mockAssignment.rubric || []).map(r => ({
            id: r.id,
            criteria: r.criteria,
            description: r.description,
            max_points: r.max_points,
          })),
          resources: mockAssignment.resources || [],
        }
        setAssignmentData({
          assignment,
          submission: null,
          enrollmentId: 'mock-enrollment-id',
        })
      }
      setLoadingAssignment(false)
    }

    fetchAssignmentData()
  }, [lessonId, isAssignmentLesson, currentLesson])

  // Fetch quizzes for the current lesson
  useEffect(() => {
    const fetchLessonQuizzes = async () => {
      try {
        const response = await fetch(`/api/quizzes?courseId=${course.id}&lessonId=${lessonId}`)
        if (response.ok) {
          const data = await response.json()
          setLessonQuizzes(data.quizzes || [])

          // Fetch attempt data for each quiz
          const attemptPromises = (data.quizzes || []).map(async (quiz: { id: string }) => {
            try {
              const attemptRes = await fetch(`/api/quizzes/${quiz.id}/attempts`)
              if (attemptRes.ok) {
                const attemptData = await attemptRes.json()
                return { quizId: quiz.id, data: attemptData }
              }
            } catch {
              // Ignore fetch errors for attempts
            }
            return { quizId: quiz.id, data: { bestScore: null, attemptCount: 0, hasPassed: false } }
          })

          const attemptResults = await Promise.all(attemptPromises)
          const attemptsMap: Record<string, { bestScore: number | null; attemptCount: number; hasPassed: boolean }> = {}
          attemptResults.forEach(({ quizId, data }) => {
            attemptsMap[quizId] = {
              bestScore: data.bestScore,
              attemptCount: data.attemptCount,
              hasPassed: data.hasPassed,
            }
          })
          setQuizAttempts(attemptsMap)
        }
      } catch (err) {
        console.error('Failed to fetch lesson quizzes:', err)
      }
    }

    fetchLessonQuizzes()
  }, [course.id, lessonId])

  // Find current lesson index for prev/next navigation
  const allLessons = modules.flatMap((m) => m.lessons)
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
  const isLessonCompleted = completedLessonIds.includes(lessonId)

  const handleProgress = (progress: number, currentTime: number) => {
    setVideoProgress(progress)
    updateWatchTime(currentTime)
  }

  const handleComplete = useCallback(async () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      router.push(`/auth/signin?redirect=/courses/${course.slug}/learn?lesson=${lessonId}`)
      return
    }

    try {
      await completeLesson()
    } catch (err) {
      console.error('Failed to complete lesson:', err)
    }
  }, [isAuthenticated, completeLesson, router, course.slug, lessonId])

  // Mark lesson complete when video finishes
  const handleVideoComplete = useCallback(() => {
    if (!isLessonCompleted) {
      handleComplete()
    }
  }, [isLessonCompleted, handleComplete])

  // Show loading state while fetching lesson data
  if (isLoadingLesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Course Completion Modal */}
      {showCourseComplete && earnedCertificate && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-8 max-w-md w-full text-center animate-in zoom-in-95">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
            <p className="text-muted-foreground mb-6">
              You&apos;ve successfully completed <strong>{course.title}</strong>!
              Your certificate is ready.
            </p>
            <div className="space-y-3">
              <Link
                href={`/dashboard/certificates`}
                className="block w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                View My Certificate
              </Link>
              <button
                onClick={() => setShowCourseComplete(false)}
                className="block w-full px-6 py-3 border rounded-lg font-medium hover:bg-muted transition-colors"
              >
                Continue Learning
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Certificate #{earnedCertificate.certificateNumber}
            </p>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <LessonSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        modules={modules}
        currentLessonId={lessonId}
        courseProgress={currentCourseProgress}
        completedLessonIds={completedLessonIds}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 border-b flex items-center justify-between px-4 bg-card">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link
              href={`/courses/${course.slug}`}
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Course</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden md:block">
              {course.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Prev Lesson */}
            {prevLesson ? (
              <Link
                href={`/courses/${course.slug}/learn?lesson=${prevLesson.id}`}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Previous Lesson"
              >
                <ChevronLeft className="h-5 w-5" />
              </Link>
            ) : (
              <button disabled className="p-2 opacity-30 cursor-not-allowed">
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            {/* Mark Complete / Next Lesson */}
            {!isLessonCompleted && (
              <button
                onClick={handleComplete}
                disabled={isCompleting}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {isCompleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Mark Complete
                  </>
                )}
              </button>
            )}
            {isLessonCompleted && !nextLesson && (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 text-emerald-600 rounded-lg text-sm font-medium">
                <CheckCircle2 className="h-4 w-4" />
                Completed
              </div>
            )}
            {nextLesson && (
              <Link
                href={`/courses/${course.slug}/learn?lesson=${nextLesson.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </header>

        {/* Content Section - Video or Assignment */}
        {isAssignmentLesson ? (
          <div className="bg-muted/30">
            <div className="max-w-5xl mx-auto p-4 md:p-6">
              {loadingAssignment ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading assignment...</span>
                </div>
              ) : assignmentData ? (
                <AssignmentSubmission
                  assignment={assignmentData.assignment}
                  submission={assignmentData.submission}
                  enrollmentId={assignmentData.enrollmentId}
                  onSubmitSuccess={(submission) => {
                    setAssignmentData(prev => prev ? {
                      ...prev,
                      submission,
                    } : null)
                    // If submitted, mark lesson as complete
                    if (!isLessonCompleted && submission.status === 'submitted') {
                      handleComplete()
                    }
                  }}
                />
              ) : (
                <div className="text-center py-12">
                  <ClipboardList className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <h3 className="font-medium mb-1">Assignment Not Found</h3>
                  <p className="text-sm text-muted-foreground">
                    This assignment may not be available yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-black">
            <div className="max-w-5xl mx-auto">
              {/* Check if the media URL is an audio file */}
              {lesson.videoUrl?.toLowerCase().endsWith('.mp3') ? (
                <AudioPlayer
                  src={lesson.videoUrl}
                  title={lesson.title}
                  initialProgress={videoProgress}
                  onProgress={handleProgress}
                  onComplete={handleVideoComplete}
                  className="aspect-video"
                />
              ) : (
                <VideoPlayer
                  src={lesson.videoUrl}
                  title={lesson.title}
                  chapters={lesson.chapters}
                  initialProgress={videoProgress}
                  onProgress={handleProgress}
                  onComplete={handleVideoComplete}
                  className="aspect-video"
                />
              )}
            </div>
          </div>
        )}

        {/* Lesson Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">{lesson.title}</h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <UserAvatar
                      user={{
                        name: course.instructor.name,
                        avatar_url: course.instructor.avatar,
                      }}
                      size="sm"
                    />
                    <span>{course.instructor.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDuration(lesson.duration)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <BookmarkToggle
                  lessonId={lessonId}
                  isAuthenticated={isAuthenticated}
                />
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="flex items-center gap-1 px-3 py-2 hover:bg-muted rounded-lg transition-colors">
                  <ThumbsUp className="h-5 w-5" />
                  <span className="text-sm">Like</span>
                </button>
              </div>
            </div>

            <Tabs defaultValue={activeTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About this lesson</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      {lesson.description.split('\n\n').map((p, i) => (
                        <p key={i}>{p.trim()}</p>
                      ))}
                    </div>

                    {lesson.chapters.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium mb-3">Chapters</h4>
                        <div className="space-y-2">
                          {lesson.chapters.map((chapter) => (
                            <button
                              key={chapter.id}
                              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors text-left"
                            >
                              <span className="text-sm">{chapter.title}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatTime(chapter.startTime)}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quiz Section */}
                {lessonQuizzes.length > 0 && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        Lesson Quiz
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {lessonQuizzes.map((quiz) => {
                          const attempts = quizAttempts[quiz.id]
                          const hasPassed = attempts?.hasPassed || false
                          const bestScore = attempts?.bestScore
                          const attemptCount = attempts?.attemptCount || 0

                          return (
                            <div
                              key={quiz.id}
                              className={cn(
                                'p-4 rounded-lg border-2 transition-colors',
                                hasPassed
                                  ? 'border-emerald-500/50 bg-emerald-500/5'
                                  : 'border-border hover:border-primary/50'
                              )}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold">{quiz.title}</h4>
                                    {hasPassed && (
                                      <Badge className="bg-emerald-500 text-white">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Passed
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-3">
                                    {quiz.description}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <FileText className="h-4 w-4" />
                                      {quiz.question_count} questions
                                    </div>
                                    {quiz.time_limit && (
                                      <div className="flex items-center gap-1">
                                        <Timer className="h-4 w-4" />
                                        {quiz.time_limit} min
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                      <Target className="h-4 w-4" />
                                      {quiz.passing_score}% to pass
                                    </div>
                                  </div>

                                  {attemptCount > 0 && (
                                    <div className="mt-3 pt-3 border-t flex items-center gap-4 text-sm">
                                      <span className="text-muted-foreground">
                                        {attemptCount} attempt{attemptCount !== 1 ? 's' : ''}
                                      </span>
                                      {bestScore !== null && (
                                        <span className={cn(
                                          'font-medium',
                                          bestScore >= quiz.passing_score ? 'text-emerald-600' : 'text-amber-600'
                                        )}>
                                          Best: {bestScore}%
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>

                                <Link
                                  href={`/courses/${course.slug}/quiz/${quiz.id}`}
                                  className={cn(
                                    'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors',
                                    hasPassed
                                      ? 'bg-muted hover:bg-muted/80 text-foreground'
                                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                                  )}
                                >
                                  {hasPassed ? 'Review' : attemptCount > 0 ? 'Retry' : 'Start Quiz'}
                                  <ArrowRight className="h-4 w-4" />
                                </Link>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="resources" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Downloadable Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {lesson.resources.length > 0 ? (
                      <div className="space-y-3">
                        {lesson.resources.map((resource) => (
                          <a
                            key={resource.id}
                            href={resource.url}
                            download
                            className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-primary" />
                              <div>
                                <div className="font-medium">{resource.title}</div>
                                <div className="text-xs text-muted-foreground uppercase">
                                  {resource.type}
                                </div>
                              </div>
                            </div>
                            <Download className="h-5 w-5 text-muted-foreground" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No resources available for this lesson
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LessonNotes
                      lessonId={lessonId}
                      isAuthenticated={isAuthenticated}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discussion" className="mt-6">
                <LessonDiscussion
                  courseId={course.id}
                  lessonId={lessonId}
                  isAuthenticated={isAuthenticated}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
