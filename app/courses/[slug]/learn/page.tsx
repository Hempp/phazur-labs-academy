'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
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
  Bookmark,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { VideoPlayer } from '@/components/video-player'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { UserAvatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

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
      avatar: '/images/instructors/sarah.jpg',
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
  notes: [
    {
      id: 'n1',
      timestamp: 125,
      content: 'Important: Compound components share state implicitly through context',
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: 'n2',
      timestamp: 340,
      content: 'Look into React.Children API for iterating over children',
      createdAt: '2024-01-15T10:35:00Z',
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
}: {
  isOpen: boolean
  onClose: () => void
  modules: typeof mockLessonData.modules
  currentLessonId: string
  courseProgress: number
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
  }

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0)
  const completedLessons = modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
    0
  )

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
            const moduleCompleted = module.lessons.every((l) => l.completed)
            const moduleInProgress = module.lessons.some((l) => l.completed)
            const isExpanded = expandedModules.includes(module.id)

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
                        moduleCompleted
                          ? 'bg-emerald-500 text-white'
                          : moduleInProgress
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {moduleCompleted ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                    </span>
                    <div className="text-left">
                      <div className="font-medium text-sm">{module.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {module.lessons.length} lessons · {formatDuration(module.duration)}
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
                          {lesson.completed ? (
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [noteText, setNoteText] = useState('')
  const [notes, setNotes] = useState(mockLessonData.notes)

  const lessonId = searchParams.get('lesson') || 'l5'
  const { lesson, course, modules } = mockLessonData

  // Find current lesson index for prev/next navigation
  const allLessons = modules.flatMap((m) => m.lessons)
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  const handleProgress = (progress: number, currentTime: number) => {
    setVideoProgress(progress)
  }

  const handleComplete = () => {
    console.log('Lesson completed!')
    // Would trigger API call to mark lesson as complete
  }

  const addNote = () => {
    if (!noteText.trim()) return
    const newNote = {
      id: `n${Date.now()}`,
      timestamp: 0, // Would use current video time
      content: noteText,
      createdAt: new Date().toISOString(),
    }
    setNotes([newNote, ...notes])
    setNoteText('')
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <LessonSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        modules={modules}
        currentLessonId={lessonId}
        courseProgress={course.progress}
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

            {/* Next Lesson */}
            {nextLesson ? (
              <Link
                href={`/courses/${course.slug}/learn?lesson=${nextLesson.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <button disabled className="flex items-center gap-2 px-4 py-2 bg-primary/50 text-primary-foreground rounded-lg text-sm font-medium cursor-not-allowed">
                Complete <CheckCircle2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </header>

        {/* Video Section */}
        <div className="bg-black">
          <div className="max-w-5xl mx-auto">
            <VideoPlayer
              src={lesson.videoUrl}
              title={lesson.title}
              chapters={lesson.chapters}
              initialProgress={videoProgress}
              onProgress={handleProgress}
              onComplete={handleComplete}
              className="aspect-video"
            />
          </div>
        </div>

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
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Bookmark className="h-5 w-5" />
                </button>
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="flex items-center gap-1 px-3 py-2 hover:bg-muted rounded-lg transition-colors">
                  <ThumbsUp className="h-5 w-5" />
                  <span className="text-sm">Like</span>
                </button>
              </div>
            </div>

            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
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
                    <div className="mb-6">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add a note..."
                        className="w-full h-24 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        onClick={addNote}
                        disabled={!noteText.trim()}
                        className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add Note
                      </button>
                    </div>

                    {notes.length > 0 ? (
                      <div className="space-y-4">
                        {notes.map((note) => (
                          <div
                            key={note.id}
                            className="p-4 rounded-lg bg-muted/50 border"
                          >
                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                              <button className="text-primary hover:underline">
                                {formatTime(note.timestamp)}
                              </button>
                              <span>
                                {new Date(note.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm">{note.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No notes yet. Start taking notes!
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discussion" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Discussion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                      <h3 className="font-medium mb-1">Join the discussion</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Ask questions and interact with other students
                      </p>
                      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                        Start a Discussion
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
