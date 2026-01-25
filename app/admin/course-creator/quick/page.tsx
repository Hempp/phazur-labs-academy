'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  Check,
  ChevronDown,
  ChevronRight,
  Play,
  BookOpen,
  FileQuestion,
  ClipboardList,
  Video,
  AlertCircle,
  Save,
  ExternalLink,
} from 'lucide-react'

// Types matching our generator
interface VideoScript {
  intro: { hook: string; learningOutcome: string; duration: string }
  content: { sections: { title: string; content: string; duration: string }[]; totalDuration: string }
  recap: { keyTakeaways: string[]; duration: string }
  next: { preview: string; duration: string }
  fullScript: string
}

interface QuizQuestion {
  text: string
  type: 'multiple_choice' | 'true_false'
  options?: string[]
  answer: string | boolean
  explanation: string
}

interface GeneratedLesson {
  title: string
  description: string
  videoScript: VideoScript
  quiz: { questions: QuizQuestion[]; passingScore: number }
  assignment: {
    title: string
    description: string
    steps: string[]
    deliverables: string[]
    rubric: Record<string, number>
    totalPoints: number
  }
  order: number
}

interface FullCourseContent {
  courseTitle: string
  courseDescription: string
  targetAudience: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  totalDuration: string
  lessons: GeneratedLesson[]
  generatedAt: string
}

interface GenerationStats {
  totalLessons: number
  totalQuizQuestions: number
  totalAssignments: number
  estimatedVideoMinutes: number
}

type GenerationStep = 'input' | 'generating' | 'review' | 'saving' | 'complete'

export default function QuickCourseGeneratorPage() {
  const router = useRouter()

  // Form state
  const [topic, setTopic] = useState('')
  const [audience, setAudience] = useState('General learners')
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [lessonCount, setLessonCount] = useState(6)
  const [generateVideos, setGenerateVideos] = useState(false)

  // Generation state
  const [step, setStep] = useState<GenerationStep>('input')
  const [course, setCourse] = useState<FullCourseContent | null>(null)
  const [stats, setStats] = useState<GenerationStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedLessons, setExpandedLessons] = useState<Set<number>>(new Set())
  const [savedCourse, setSavedCourse] = useState<{ id: string; slug: string } | null>(null)

  // Generate course
  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a course topic')
      return
    }

    setError(null)
    setStep('generating')

    try {
      const response = await fetch('/api/admin/course-creator/generate-full-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          audience,
          difficulty,
          lessonCount,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate course')
      }

      setCourse(data.course)
      setStats(data.stats)
      setStep('review')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
      setStep('input')
    }
  }

  // Save course to database
  const handleSave = async () => {
    if (!course) return

    setStep('saving')
    setError(null)

    try {
      const response = await fetch('/api/admin/course-creator/save-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course,
          generateVideos,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save course')
      }

      setSavedCourse({ id: data.course.id, slug: data.course.slug })
      setStep('complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
      setStep('review')
    }
  }

  // Toggle lesson expansion
  const toggleLesson = (index: number) => {
    const newExpanded = new Set(expandedLessons)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedLessons(newExpanded)
  }

  // Expand all lessons
  const expandAll = () => {
    if (course) {
      setExpandedLessons(new Set(course.lessons.map((_, i) => i)))
    }
  }

  // Collapse all lessons
  const collapseAll = () => {
    setExpandedLessons(new Set())
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/course-creator"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Quick Course Generator
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Generate a complete course with one click
                </p>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="hidden sm:flex items-center gap-2">
              {['Input', 'Generate', 'Review', 'Save'].map((label, i) => {
                const stepOrder = ['input', 'generating', 'review', 'saving', 'complete']
                const currentIndex = stepOrder.indexOf(step)
                const isActive = i <= currentIndex
                const isCurrent = i === currentIndex || (step === 'complete' && i === 3)

                return (
                  <div key={label} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        isCurrent
                          ? 'bg-purple-600 text-white'
                          : isActive
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                      }`}
                    >
                      {isActive && !isCurrent ? <Check className="w-4 h-4" /> : i + 1}
                    </div>
                    {i < 3 && (
                      <div
                        className={`w-12 h-1 mx-1 rounded ${
                          i < currentIndex ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 dark:text-red-200 font-medium">Error</p>
              <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Step 1: Input */}
        {step === 'input' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Course Details
              </h2>

              <div className="space-y-6">
                {/* Topic */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Topic *
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Introduction to Machine Learning"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Audience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g., Software developers, Business professionals"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Difficulty & Lessons */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Number of Lessons
                    </label>
                    <select
                      value={lessonCount}
                      onChange={(e) => setLessonCount(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {[4, 5, 6, 7, 8, 10, 12].map((n) => (
                        <option key={n} value={n}>{n} lessons</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Video generation toggle */}
                <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Generate AI Videos
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Create videos with HeyGen AI presenter
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={generateVideos}
                      onChange={(e) => setGenerateVideos(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600" />
                  </label>
                </div>

                {/* Generate button */}
                <button
                  onClick={handleGenerate}
                  disabled={!topic.trim()}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Complete Course
                </button>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  This will generate {lessonCount} lessons with video scripts, quizzes, and assignments
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Generating */}
        {step === 'generating' && (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6">
              <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Generating Your Course
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Creating {lessonCount} lessons with video scripts, quizzes, and assignments...
            </p>

            <div className="space-y-3 text-left max-w-sm mx-auto">
              {[
                'Designing curriculum structure',
                'Writing video scripts (500-800 words each)',
                'Creating quiz questions (5 per lesson)',
                'Building practical assignments',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 'review' && course && stats && (
          <div className="space-y-6">
            {/* Course header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {course.courseTitle}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {course.courseDescription}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                      {course.difficulty}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                      {course.totalDuration}
                    </span>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                      {course.targetAudience}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4">
                  <div className="text-center px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{stats.totalLessons}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Lessons</p>
                  </div>
                  <div className="text-center px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{stats.totalQuizQuestions}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Questions</p>
                  </div>
                  <div className="text-center px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{stats.estimatedVideoMinutes}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Min Video</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lessons */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Course Lessons ({course.lessons.length})
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={expandAll}
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    Expand All
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={collapseAll}
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {course.lessons.map((lesson, index) => (
                  <div key={index} className="p-4">
                    {/* Lesson header */}
                    <button
                      onClick={() => toggleLesson(index)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg font-medium text-sm">
                          {lesson.order}
                        </span>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {lesson.title}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {lesson.description.substring(0, 100)}...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                          <BookOpen className="w-4 h-4" />
                          <span>Script</span>
                          <FileQuestion className="w-4 h-4 ml-2" />
                          <span>{lesson.quiz.questions.length} Q</span>
                          <ClipboardList className="w-4 h-4 ml-2" />
                          <span>Assignment</span>
                        </div>
                        {expandedLessons.has(index) ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {/* Expanded content */}
                    {expandedLessons.has(index) && (
                      <div className="mt-4 pl-11 space-y-4">
                        {/* Video Script */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <Play className="w-4 h-4 text-purple-500" />
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              Video Script
                            </h5>
                          </div>

                          <div className="space-y-3 text-sm">
                            <div>
                              <span className="text-purple-600 font-medium">[INTRO - {lesson.videoScript.intro.duration}]</span>
                              <p className="text-gray-600 dark:text-gray-300 mt-1">
                                {lesson.videoScript.intro.hook}
                              </p>
                            </div>

                            <div>
                              <span className="text-purple-600 font-medium">[CONTENT - {lesson.videoScript.content.totalDuration}]</span>
                              {lesson.videoScript.content.sections.map((section, si) => (
                                <div key={si} className="mt-2 ml-4">
                                  <p className="font-medium text-gray-700 dark:text-gray-200">
                                    {section.title} ({section.duration})
                                  </p>
                                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                                    {section.content.substring(0, 200)}...
                                  </p>
                                </div>
                              ))}
                            </div>

                            <div>
                              <span className="text-purple-600 font-medium">[RECAP - {lesson.videoScript.recap.duration}]</span>
                              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mt-1">
                                {lesson.videoScript.recap.keyTakeaways.map((t, ti) => (
                                  <li key={ti}>{t}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Quiz */}
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <FileQuestion className="w-4 h-4 text-blue-500" />
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              Quiz ({lesson.quiz.questions.length} questions, passing: {lesson.quiz.passingScore}%)
                            </h5>
                          </div>

                          <div className="space-y-3">
                            {lesson.quiz.questions.map((q, qi) => (
                              <div key={qi} className="text-sm">
                                <p className="font-medium text-gray-700 dark:text-gray-200">
                                  Q{qi + 1}: {q.text}
                                </p>
                                {q.type === 'multiple_choice' && q.options && (
                                  <div className="ml-4 mt-1 space-y-1">
                                    {q.options.map((opt, oi) => (
                                      <p
                                        key={oi}
                                        className={`text-gray-600 dark:text-gray-300 ${
                                          q.answer === ['A', 'B', 'C', 'D'][oi]
                                            ? 'text-green-600 dark:text-green-400 font-medium'
                                            : ''
                                        }`}
                                      >
                                        {['A', 'B', 'C', 'D'][oi]}. {opt}
                                      </p>
                                    ))}
                                  </div>
                                )}
                                {q.type === 'true_false' && (
                                  <p className="ml-4 mt-1 text-green-600 dark:text-green-400">
                                    Answer: {q.answer ? 'True' : 'False'}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Assignment */}
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <ClipboardList className="w-4 h-4 text-green-500" />
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              Assignment: {lesson.assignment.title} ({lesson.assignment.totalPoints} points)
                            </h5>
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            {lesson.assignment.description}
                          </p>

                          <div className="text-sm">
                            <p className="font-medium text-gray-700 dark:text-gray-200 mb-1">Steps:</p>
                            <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-1">
                              {lesson.assignment.steps.map((s, si) => (
                                <li key={si}>{s}</li>
                              ))}
                            </ol>
                          </div>

                          <div className="mt-3 text-sm">
                            <p className="font-medium text-gray-700 dark:text-gray-200 mb-1">Rubric:</p>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(lesson.assignment.rubric).map(([criteria, points]) => (
                                <div key={criteria} className="flex justify-between text-gray-600 dark:text-gray-300">
                                  <span>{criteria}</span>
                                  <span className="font-medium">{points} pts</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <button
                onClick={() => {
                  setCourse(null)
                  setStats(null)
                  setStep('input')
                }}
                className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Start Over
              </button>

              <button
                onClick={handleSave}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Create Course
                {generateVideos && ' & Generate Videos'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Saving */}
        {step === 'saving' && (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
              <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Creating Your Course
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Saving to database and {generateVideos ? 'queueing video generation...' : 'finishing up...'}
            </p>
          </div>
        )}

        {/* Step 5: Complete */}
        {step === 'complete' && savedCourse && (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Course Created Successfully!
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Your course has been saved{generateVideos ? ' and videos are being generated' : ''}.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/admin/courses/${savedCourse.id}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View Course
              </Link>

              <button
                onClick={() => {
                  setTopic('')
                  setCourse(null)
                  setStats(null)
                  setSavedCourse(null)
                  setStep('input')
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Create Another Course
              </button>
            </div>

            {generateVideos && (
              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <Video className="w-4 h-4 inline mr-2" />
                  Videos are being generated in the background. Check the course dashboard for status updates.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
