'use client'

import { useState } from 'react'
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  FileText,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Wand2,
  Brain,
  Target,
  Users,
  Clock,
  BookOpenCheck,
  Video,
  ClipboardList,
  PenTool,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Edit3,
  Save,
  Play,
  Plus,
  Check,
  AlertCircle,
} from 'lucide-react'
import type {
  GeneratedCourseOutline,
  GeneratedModule,
  GeneratedLesson,
  GeneratedLessonScript,
  GeneratedQuiz,
  GeneratedAssignment,
} from '@/lib/services/course-creator'

type Step = 1 | 2 | 3 | 4

export default function CourseCreatorPage() {
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Step 1: Topic & Settings
  const [topic, setTopic] = useState('')
  const [audience, setAudience] = useState('')
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [duration, setDuration] = useState('6-8 lessons')

  // Step 2: Outline
  const [outline, setOutline] = useState<GeneratedCourseOutline | null>(null)
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]))

  // Step 3: Content
  const [scripts, setScripts] = useState<Record<string, GeneratedLessonScript>>({})
  const [quizzes, setQuizzes] = useState<Record<string, GeneratedQuiz>>({})
  const [assignments, setAssignments] = useState<Record<string, GeneratedAssignment>>({})
  const [generatingContent, setGeneratingContent] = useState<string | null>(null)

  // Step 4: Creation
  const [createdCourse, setCreatedCourse] = useState<{
    id: string
    slug: string
    title: string
    totalLessons: number
    totalDuration: number
  } | null>(null)

  // Step 1: Generate Outline
  const generateOutline = async () => {
    if (!topic.trim()) {
      setError('Please enter a course topic')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/course-creator/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, audience, level, duration }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate outline')
      }

      setOutline(data.outline)
      setStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate outline')
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Generate individual content
  const generateLessonContent = async (module: GeneratedModule, lesson: GeneratedLesson) => {
    if (!outline) return

    const key = lesson.title
    setGeneratingContent(key)
    setError(null)

    try {
      if (lesson.contentType === 'video' || lesson.contentType === 'article') {
        const response = await fetch('/api/admin/course-creator/generate-lesson', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseName: outline.courseTitle,
            moduleName: module.title,
            lessonTitle: lesson.title,
            duration: lesson.durationMinutes,
            objectives: lesson.learningObjectives,
          }),
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error)

        setScripts(prev => ({ ...prev, [key]: data.script }))
      } else if (lesson.contentType === 'quiz') {
        const response = await fetch('/api/admin/course-creator/generate-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseName: outline.courseTitle,
            moduleName: module.title,
            lessonTitle: lesson.title,
            objectives: lesson.learningObjectives,
            keyConcepts: lesson.learningObjectives,
            questionCount: 5,
          }),
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error)

        setQuizzes(prev => ({ ...prev, [key]: data.quiz }))
      } else if (lesson.contentType === 'assignment') {
        const response = await fetch('/api/admin/course-creator/generate-assignment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseName: outline.courseTitle,
            moduleName: module.title,
            lessonTitle: lesson.title,
            objectives: lesson.learningObjectives,
            skills: lesson.learningObjectives,
          }),
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error)

        setAssignments(prev => ({ ...prev, [key]: data.assignment }))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content')
    } finally {
      setGeneratingContent(null)
    }
  }

  // Generate all content for a module
  const generateModuleContent = async (module: GeneratedModule) => {
    for (const lesson of module.lessons) {
      await generateLessonContent(module, lesson)
    }
  }

  // Step 4: Create course
  const createCourse = async () => {
    if (!outline) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/course-creator/create-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outline,
          scripts,
          quizzes,
          assignments,
          settings: {
            status: 'draft',
          },
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setCreatedCourse(data.course)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course')
    } finally {
      setLoading(false)
    }
  }

  // Helper to count generated content
  const getContentProgress = () => {
    if (!outline) return { total: 0, generated: 0 }

    let total = 0
    let generated = 0

    for (const module of outline.modules) {
      for (const lesson of module.lessons) {
        total++
        if (
          scripts[lesson.title] ||
          quizzes[lesson.title] ||
          assignments[lesson.title]
        ) {
          generated++
        }
      }
    }

    return { total, generated }
  }

  const toggleModule = (index: number) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Creator</h1>
              <p className="text-gray-500">AI-Powered Education Guru</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Topic & Settings', icon: Target },
              { num: 2, label: 'Review Outline', icon: BookOpen },
              { num: 3, label: 'Generate Content', icon: FileText },
              { num: 4, label: 'Create Course', icon: CheckCircle2 },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className={`flex items-center gap-2 ${step >= s.num ? 'text-indigo-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step > s.num
                      ? 'bg-indigo-600 text-white'
                      : step === s.num
                      ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > s.num ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <s.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="hidden md:block font-medium">{s.label}</span>
                </div>
                {i < 3 && (
                  <div className={`w-12 md:w-24 h-1 mx-2 rounded ${
                    step > s.num ? 'bg-indigo-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Step 1: Topic & Settings */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-indigo-500" />
                <h2 className="text-xl font-semibold">What would you like to teach?</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Topic *
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Introduction to Machine Learning, Web Development Fundamentals"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g., Beginners with no coding experience, Marketing professionals"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value as typeof level)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Length
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="3-4 lessons">Short (3-4 lessons)</option>
                      <option value="6-8 lessons">Medium (6-8 lessons)</option>
                      <option value="10-15 lessons">Long (10-15 lessons)</option>
                      <option value="20+ lessons">Comprehensive (20+ lessons)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={generateOutline}
                  disabled={loading || !topic.trim()}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating Outline...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Generate Course Outline
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: GraduationCap, label: 'Expert Curriculum Design', desc: "Bloom's Taxonomy" },
                { icon: ClipboardList, label: 'Auto Assessments', desc: 'Quizzes & Assignments' },
                { icon: Video, label: 'Video Integration', desc: 'Direct to Video Studio' },
              ].map((f) => (
                <div key={f.label} className="bg-white rounded-lg border p-4 text-center">
                  <f.icon className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">{f.label}</p>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Review Outline */}
        {step === 2 && outline && (
          <div className="grid grid-cols-3 gap-6">
            {/* Outline */}
            <div className="col-span-2 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-2">{outline.courseTitle}</h2>
                <p className="text-gray-600 mb-4">{outline.courseDescription}</p>

                <div className="flex gap-4 text-sm text-gray-500 mb-6">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {outline.targetAudience}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {outline.estimatedDuration}
                  </span>
                </div>

                {/* Learning Outcomes */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Learning Outcomes</h3>
                  <ul className="space-y-1">
                    {outline.learningOutcomes.map((outcome, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Modules */}
              {outline.modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <button
                    onClick={() => toggleModule(moduleIndex)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-medium">
                        {moduleIndex + 1}
                      </span>
                      <div className="text-left">
                        <h3 className="font-medium text-gray-900">{module.title}</h3>
                        <p className="text-sm text-gray-500">{module.lessons.length} lessons</p>
                      </div>
                    </div>
                    {expandedModules.has(moduleIndex) ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {expandedModules.has(moduleIndex) && (
                    <div className="border-t px-6 py-4">
                      <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                      <div className="space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lessonIndex}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {lesson.contentType === 'video' && <Video className="w-4 h-4 text-blue-500" />}
                              {lesson.contentType === 'article' && <FileText className="w-4 h-4 text-gray-500" />}
                              {lesson.contentType === 'quiz' && <ClipboardList className="w-4 h-4 text-orange-500" />}
                              {lesson.contentType === 'assignment' && <PenTool className="w-4 h-4 text-purple-500" />}
                              <span className="text-sm font-medium text-gray-700">{lesson.title}</span>
                            </div>
                            <span className="text-xs text-gray-500">{lesson.durationMinutes} min</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-4">
                <h3 className="font-medium text-gray-900 mb-4">Course Summary</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Modules</span>
                    <span className="font-medium">{outline.modules.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Lessons</span>
                    <span className="font-medium">
                      {outline.modules.reduce((acc, m) => acc + m.lessons.length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Estimated Duration</span>
                    <span className="font-medium">{outline.estimatedDuration}</span>
                  </div>
                </div>

                {outline.prerequisites.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Prerequisites</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {outline.prerequisites.map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-2">
                  <button
                    onClick={() => setStep(3)}
                    className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-indigo-700"
                  >
                    Continue to Content
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setStep(1)}
                    className="w-full py-2.5 border text-gray-700 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Settings
                  </button>
                  <button
                    onClick={generateOutline}
                    disabled={loading}
                    className="w-full py-2.5 text-indigo-600 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-indigo-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Regenerate Outline
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Generate Content */}
        {step === 3 && outline && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              {outline.modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-medium">
                        {moduleIndex + 1}
                      </span>
                      <h3 className="font-medium text-gray-900">{module.title}</h3>
                    </div>
                    <button
                      onClick={() => generateModuleContent(module)}
                      disabled={generatingContent !== null}
                      className="text-sm px-3 py-1.5 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 disabled:opacity-50"
                    >
                      Generate All
                    </button>
                  </div>

                  <div className="divide-y">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const hasContent =
                        scripts[lesson.title] ||
                        quizzes[lesson.title] ||
                        assignments[lesson.title]
                      const isGenerating = generatingContent === lesson.title

                      return (
                        <div key={lessonIndex} className="px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {lesson.contentType === 'video' && <Video className="w-4 h-4 text-blue-500" />}
                              {lesson.contentType === 'article' && <FileText className="w-4 h-4 text-gray-500" />}
                              {lesson.contentType === 'quiz' && <ClipboardList className="w-4 h-4 text-orange-500" />}
                              {lesson.contentType === 'assignment' && <PenTool className="w-4 h-4 text-purple-500" />}
                              <div>
                                <p className="font-medium text-gray-900">{lesson.title}</p>
                                <p className="text-xs text-gray-500 capitalize">
                                  {lesson.contentType} • {lesson.durationMinutes} min
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {hasContent ? (
                                <span className="flex items-center gap-1 text-sm text-green-600">
                                  <CheckCircle2 className="w-4 h-4" />
                                  Generated
                                </span>
                              ) : isGenerating ? (
                                <span className="flex items-center gap-1 text-sm text-indigo-600">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Generating...
                                </span>
                              ) : (
                                <button
                                  onClick={() => generateLessonContent(module, lesson)}
                                  disabled={generatingContent !== null}
                                  className="text-sm px-3 py-1.5 border text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                                >
                                  Generate
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Preview generated content */}
                          {scripts[lesson.title] && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800 line-clamp-2">
                                {scripts[lesson.title].hook}
                              </p>
                              <p className="text-xs text-blue-600 mt-1">
                                {scripts[lesson.title].sections.length} sections •{' '}
                                {scripts[lesson.title].keyTerms.length} key terms
                              </p>
                            </div>
                          )}

                          {quizzes[lesson.title] && (
                            <div className="mt-3 p-3 bg-orange-50 rounded-lg">
                              <p className="text-sm text-orange-800">
                                {quizzes[lesson.title].questions.length} questions generated
                              </p>
                              <p className="text-xs text-orange-600 mt-1">
                                Passing score: {quizzes[lesson.title].passingScore}%
                              </p>
                            </div>
                          )}

                          {assignments[lesson.title] && (
                            <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                              <p className="text-sm text-purple-800">
                                {assignments[lesson.title].assignmentTitle}
                              </p>
                              <p className="text-xs text-purple-600 mt-1">
                                {assignments[lesson.title].rubric.length} rubric criteria •{' '}
                                {assignments[lesson.title].points} points
                              </p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-4">
                <h3 className="font-medium text-gray-900 mb-4">Content Progress</h3>

                {(() => {
                  const { total, generated } = getContentProgress()
                  const percentage = total > 0 ? Math.round((generated / total) * 100) : 0

                  return (
                    <>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">Generated</span>
                          <span className="font-medium">{generated} / {total}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Scripts</span>
                          <span className="font-medium">{Object.keys(scripts).length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Quizzes</span>
                          <span className="font-medium">{Object.keys(quizzes).length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Assignments</span>
                          <span className="font-medium">{Object.keys(assignments).length}</span>
                        </div>
                      </div>
                    </>
                  )
                })()}

                <div className="space-y-2">
                  <button
                    onClick={() => setStep(4)}
                    disabled={getContentProgress().generated === 0}
                    className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Create
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-2.5 border text-gray-700 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Outline
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Create Course */}
        {step === 4 && outline && (
          <div className="max-w-2xl mx-auto">
            {!createdCourse ? (
              <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpenCheck className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Create!</h2>
                <p className="text-gray-600 mb-6">
                  Your course "{outline.courseTitle}" is ready to be created with all generated content.
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-medium text-gray-900 mb-3">Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Modules:</span>
                      <span className="ml-2 font-medium">{outline.modules.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Lessons:</span>
                      <span className="ml-2 font-medium">
                        {outline.modules.reduce((acc, m) => acc + m.lessons.length, 0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Scripts:</span>
                      <span className="ml-2 font-medium">{Object.keys(scripts).length}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Quizzes:</span>
                      <span className="ml-2 font-medium">{Object.keys(quizzes).length}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={createCourse}
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Course...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Create Course
                    </>
                  )}
                </button>

                <button
                  onClick={() => setStep(3)}
                  className="w-full mt-3 py-2.5 text-gray-600 hover:text-gray-900"
                >
                  ← Back to Content
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Created!</h2>
                <p className="text-gray-600 mb-6">
                  "{createdCourse.title}" has been created successfully.
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Lessons:</span>
                      <span className="ml-2 font-medium">{createdCourse.totalLessons}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <span className="ml-2 font-medium">{createdCourse.totalDuration} min</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <a
                    href={`/admin/courses/${createdCourse.id}/content`}
                    className="block w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                  >
                    View & Edit Course
                  </a>
                  <a
                    href="/admin/videos"
                    className="block w-full py-3 border text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Generate Videos in Video Studio
                  </a>
                  <button
                    onClick={() => {
                      setStep(1)
                      setTopic('')
                      setOutline(null)
                      setScripts({})
                      setQuizzes({})
                      setAssignments({})
                      setCreatedCourse(null)
                    }}
                    className="w-full py-3 text-indigo-600 hover:text-indigo-700"
                  >
                    <Plus className="w-4 h-4 inline mr-1" />
                    Create Another Course
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
