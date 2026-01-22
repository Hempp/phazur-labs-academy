'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  courses,
  instructors,
  type Course,
} from '@/lib/data/store'
import type {
  CourseSection,
  Lesson,
  Quiz,
  QuizQuestion,
  Assignment,
  VideoContent,
} from '@/lib/types'

// Mock video avatars (would come from HeyGen API)
const videoAvatars = [
  { id: 'avatar-1', name: 'Sarah - Professional', preview_url: '/avatars/sarah-pro.jpg', gender: 'female' as const, style: 'professional' as const },
  { id: 'avatar-2', name: 'Michael - Friendly', preview_url: '/avatars/michael-friendly.jpg', gender: 'male' as const, style: 'friendly' as const },
  { id: 'avatar-3', name: 'Emma - Casual', preview_url: '/avatars/emma-casual.jpg', gender: 'female' as const, style: 'casual' as const },
  { id: 'avatar-4', name: 'Alex - Professional', preview_url: '/avatars/alex-pro.jpg', gender: 'male' as const, style: 'professional' as const },
]

// Mock course sections with lessons (for demo)
const mockCourseSections: Record<string, CourseSection[]> = {
  'course-1': [
    {
      id: 'section-1-1',
      course_id: 'course-1',
      title: 'Introduction to Advanced React Patterns',
      description: 'Learn the fundamentals of advanced React patterns',
      order: 1,
      lessons: [
        { id: 'lesson-1-1-1', section_id: 'section-1-1', title: 'Welcome & Course Overview', type: 'video', duration_minutes: 5, order: 1, is_preview: true, resources: [] },
        { id: 'lesson-1-1-2', section_id: 'section-1-1', title: 'What are Design Patterns?', type: 'video', duration_minutes: 12, order: 2, is_preview: false, resources: [] },
        { id: 'lesson-1-1-3', section_id: 'section-1-1', title: 'Section Quiz: Introduction', type: 'quiz', duration_minutes: 10, order: 3, is_preview: false, resources: [] },
      ],
    },
    {
      id: 'section-1-2',
      course_id: 'course-1',
      title: 'Compound Components Pattern',
      description: 'Master the compound components pattern for flexible APIs',
      order: 2,
      lessons: [
        { id: 'lesson-1-2-1', section_id: 'section-1-2', title: 'Understanding Compound Components', type: 'video', duration_minutes: 15, order: 1, is_preview: false, resources: [] },
        { id: 'lesson-1-2-2', section_id: 'section-1-2', title: 'Building a Tabs Component', type: 'video', duration_minutes: 20, order: 2, is_preview: false, resources: [] },
        { id: 'lesson-1-2-3', section_id: 'section-1-2', title: 'Practice: Build a Menu Component', type: 'assignment', duration_minutes: 45, order: 3, is_preview: false, resources: [] },
        { id: 'lesson-1-2-4', section_id: 'section-1-2', title: 'Section Quiz: Compound Components', type: 'quiz', duration_minutes: 15, order: 4, is_preview: false, resources: [] },
      ],
    },
    {
      id: 'section-1-3',
      course_id: 'course-1',
      title: 'Render Props Pattern',
      description: 'Learn to share code between components using render props',
      order: 3,
      lessons: [
        { id: 'lesson-1-3-1', section_id: 'section-1-3', title: 'What are Render Props?', type: 'video', duration_minutes: 12, order: 1, is_preview: false, resources: [] },
        { id: 'lesson-1-3-2', section_id: 'section-1-3', title: 'Building Reusable Components', type: 'video', duration_minutes: 18, order: 2, is_preview: false, resources: [] },
        { id: 'lesson-1-3-3', section_id: 'section-1-3', title: 'Practice: Mouse Tracker Component', type: 'assignment', duration_minutes: 30, order: 3, is_preview: false, resources: [] },
      ],
    },
  ],
  'course-2': [
    {
      id: 'section-2-1',
      course_id: 'course-2',
      title: 'TypeScript Fundamentals',
      description: 'Get started with TypeScript basics',
      order: 1,
      lessons: [
        { id: 'lesson-2-1-1', section_id: 'section-2-1', title: 'Welcome to TypeScript', type: 'video', duration_minutes: 8, order: 1, is_preview: true, resources: [] },
        { id: 'lesson-2-1-2', section_id: 'section-2-1', title: 'Setting Up Your Environment', type: 'video', duration_minutes: 15, order: 2, is_preview: true, resources: [] },
        { id: 'lesson-2-1-3', section_id: 'section-2-1', title: 'Basic Types in TypeScript', type: 'video', duration_minutes: 20, order: 3, is_preview: false, resources: [] },
        { id: 'lesson-2-1-4', section_id: 'section-2-1', title: 'Quiz: TypeScript Basics', type: 'quiz', duration_minutes: 10, order: 4, is_preview: false, resources: [] },
      ],
    },
    {
      id: 'section-2-2',
      course_id: 'course-2',
      title: 'Advanced Types',
      description: 'Deep dive into TypeScript type system',
      order: 2,
      lessons: [
        { id: 'lesson-2-2-1', section_id: 'section-2-2', title: 'Union and Intersection Types', type: 'video', duration_minutes: 18, order: 1, is_preview: false, resources: [] },
        { id: 'lesson-2-2-2', section_id: 'section-2-2', title: 'Generic Types', type: 'video', duration_minutes: 25, order: 2, is_preview: false, resources: [] },
        { id: 'lesson-2-2-3', section_id: 'section-2-2', title: 'Assignment: Create Generic Utilities', type: 'assignment', duration_minutes: 60, order: 3, is_preview: false, resources: [] },
      ],
    },
  ],
}

// Mock quizzes
const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    lesson_id: 'lesson-1-1-3',
    course_id: 'course-1',
    title: 'Introduction Quiz',
    description: 'Test your understanding of React design patterns basics',
    time_limit_minutes: 10,
    passing_score: 70,
    max_attempts: 3,
    shuffle_questions: true,
    show_correct_answers: true,
    questions: [
      {
        id: 'q-1-1',
        quiz_id: 'quiz-1',
        question: 'What is the main benefit of using design patterns in React?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-1-1-1', question_id: 'q-1-1', text: 'They make code run faster', is_correct: false },
          { id: 'opt-1-1-2', question_id: 'q-1-1', text: 'They provide reusable solutions to common problems', is_correct: true },
          { id: 'opt-1-1-3', question_id: 'q-1-1', text: 'They are required by React', is_correct: false },
          { id: 'opt-1-1-4', question_id: 'q-1-1', text: 'They reduce bundle size', is_correct: false },
        ],
        explanation: 'Design patterns provide proven, reusable solutions to common software design problems.',
        points: 10,
        order: 1,
      },
      {
        id: 'q-1-2',
        quiz_id: 'quiz-1',
        question: 'React hooks were introduced in React version 16.8',
        question_type: 'true_false',
        options: [
          { id: 'opt-1-2-1', question_id: 'q-1-2', text: 'True', is_correct: true },
          { id: 'opt-1-2-2', question_id: 'q-1-2', text: 'False', is_correct: false },
        ],
        explanation: 'React Hooks were officially released in React 16.8 in February 2019.',
        points: 10,
        order: 2,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Mock assignments
const mockAssignments: Assignment[] = [
  {
    id: 'assignment-1',
    lesson_id: 'lesson-1-2-3',
    course_id: 'course-1',
    title: 'Build a Menu Component',
    description: 'Create a flexible dropdown menu using the compound components pattern',
    instructions: `## Objective
Create a reusable Menu component using the Compound Components pattern.

## Requirements
1. Create a Menu component with the following sub-components:
   - Menu.Button - Triggers the dropdown
   - Menu.List - Contains menu items
   - Menu.Item - Individual menu item

2. The menu should:
   - Open/close on button click
   - Close when clicking outside
   - Support keyboard navigation (Arrow keys, Enter, Escape)
   - Be fully accessible with proper ARIA attributes

3. Bonus points:
   - Add animation for open/close
   - Support nested menus

## Submission
Submit a link to your GitHub repository or CodeSandbox with your implementation.`,
    due_days_after_enrollment: 7,
    max_score: 100,
    submission_types: ['url', 'file'],
    allowed_file_types: ['.zip', '.tsx', '.jsx'],
    max_file_size_mb: 10,
    rubric: [
      { id: 'rubric-1', criteria: 'Component Structure', description: 'Proper compound component architecture', max_points: 25 },
      { id: 'rubric-2', criteria: 'Functionality', description: 'All required features work correctly', max_points: 30 },
      { id: 'rubric-3', criteria: 'Accessibility', description: 'Proper ARIA attributes and keyboard support', max_points: 25 },
      { id: 'rubric-4', criteria: 'Code Quality', description: 'Clean, well-organized, typed code', max_points: 20 },
    ],
    resources: [
      { id: 'res-1', title: 'Starter Template', type: 'template', url: '/templates/menu-starter.zip' },
      { id: 'res-2', title: 'Design Mockup', type: 'file', url: '/resources/menu-design.figma' },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Mock video content
const mockVideoContent: VideoContent[] = [
  {
    id: 'video-1',
    lesson_id: 'lesson-1-1-1',
    title: 'Welcome & Course Overview',
    description: 'Introduction to the course',
    script: `Hello and welcome to Advanced React Patterns and Best Practices!

I'm Sarah, and I'll be your instructor throughout this course. Over the next several weeks, we're going to dive deep into the patterns that separate good React developers from great ones.

In this course, you'll learn:
- Compound Components for flexible component APIs
- Render Props for code sharing between components
- Custom Hooks for reusable stateful logic
- And much more!

By the end of this course, you'll be able to build scalable, maintainable React applications using industry-proven patterns.

Let's get started!`,
    avatar_id: 'avatar-1',
    avatar_name: 'Sarah - Professional',
    voice_id: 'voice-sarah-1',
    status: 'ready',
    video_url: 'https://cdn.phazurlabs.com/videos/lesson-1-1-1.mp4',
    thumbnail_url: '/thumbnails/lesson-1-1-1.jpg',
    duration_seconds: 180,
    heygen_video_id: 'heygen-abc123',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

type TabType = 'lessons' | 'videos' | 'quizzes' | 'assignments'

export default function AdminContentPage() {
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [activeTab, setActiveTab] = useState<TabType>('lessons')
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [videoGenerating, setVideoGenerating] = useState(false)

  // Video form state
  const [videoForm, setVideoForm] = useState({
    title: '',
    script: '',
    avatarId: 'avatar-1',
  })

  // Quiz form state
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    timeLimit: 15,
    passingScore: 70,
    maxAttempts: 3,
    questions: [] as QuizQuestion[],
  })

  // Assignment form state
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    instructions: '',
    maxScore: 100,
    dueDays: 7,
  })

  const publishedCourses = useMemo(() =>
    courses.filter(c => c.status === 'published'),
    []
  )

  const currentCourse = useMemo(() =>
    courses.find(c => c.id === selectedCourse),
    [selectedCourse]
  )

  const courseSections = useMemo(() =>
    mockCourseSections[selectedCourse] || [],
    [selectedCourse]
  )

  const currentSection = useMemo(() =>
    courseSections.find(s => s.id === selectedSection),
    [courseSections, selectedSection]
  )

  const handleGenerateVideo = async () => {
    if (!selectedLesson) return

    setVideoGenerating(true)
    // Simulate HeyGen API call
    await new Promise(resolve => setTimeout(resolve, 3000))

    alert(`Video generated successfully for "${selectedLesson.title}"!\n\nIn production, this would call the HeyGen API to generate an AI avatar video.`)
    setVideoGenerating(false)
    setShowVideoModal(false)
    setVideoForm({ title: '', script: '', avatarId: 'avatar-1' })
  }

  const handleSaveQuiz = () => {
    if (!selectedLesson) return

    alert(`Quiz "${quizForm.title}" saved for lesson "${selectedLesson.title}"!\n\n${quizForm.questions.length} questions added.`)
    setShowQuizModal(false)
    setQuizForm({
      title: '',
      description: '',
      timeLimit: 15,
      passingScore: 70,
      maxAttempts: 3,
      questions: [],
    })
  }

  const handleSaveAssignment = () => {
    if (!selectedLesson) return

    alert(`Assignment "${assignmentForm.title}" saved for lesson "${selectedLesson.title}"!`)
    setShowAssignmentModal(false)
    setAssignmentForm({
      title: '',
      description: '',
      instructions: '',
      maxScore: 100,
      dueDays: 7,
    })
  }

  const addQuizQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q-new-${Date.now()}`,
      quiz_id: '',
      question: '',
      question_type: 'multiple_choice',
      options: [
        { id: `opt-${Date.now()}-1`, question_id: '', text: '', is_correct: false },
        { id: `opt-${Date.now()}-2`, question_id: '', text: '', is_correct: false },
        { id: `opt-${Date.now()}-3`, question_id: '', text: '', is_correct: false },
        { id: `opt-${Date.now()}-4`, question_id: '', text: '', is_correct: false },
      ],
      points: 10,
      order: quizForm.questions.length + 1,
    }
    setQuizForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
                <p className="text-sm text-gray-500">Manage videos, quizzes, and assignments</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Course
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value)
              setSelectedSection('')
              setSelectedLesson(null)
            }}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Choose a course...</option>
            {publishedCourses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {selectedCourse && currentCourse && (
          <>
            {/* Course Info Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                  {currentCourse.title.charAt(0)}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">{currentCourse.title}</h2>
                  <p className="text-gray-500 text-sm mt-1">{currentCourse.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>{currentCourse.total_lessons} lessons</span>
                    <span>{currentCourse.total_videos} videos</span>
                    <span>{Math.round(currentCourse.total_duration_minutes / 60)}h content</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border mb-6">
              <div className="border-b">
                <nav className="flex -mb-px">
                  {[
                    { id: 'lessons', label: 'Lessons', icon: '📚' },
                    { id: 'videos', label: 'Videos', icon: '🎬' },
                    { id: 'quizzes', label: 'Quizzes', icon: '📝' },
                    { id: 'assignments', label: 'Assignments', icon: '📋' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Lessons Tab */}
                {activeTab === 'lessons' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Course Sections & Lessons</h3>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
                        + Add Section
                      </button>
                    </div>

                    {courseSections.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <p>No sections yet. Click &quot;Add Section&quot; to create your first section.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {courseSections.map((section, sectionIndex) => (
                          <div key={section.id} className="border rounded-lg overflow-hidden">
                            <div
                              className="bg-gray-50 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-100"
                              onClick={() => setSelectedSection(selectedSection === section.id ? '' : section.id)}
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
                                  {sectionIndex + 1}
                                </span>
                                <div>
                                  <h4 className="font-medium text-gray-900">{section.title}</h4>
                                  <p className="text-sm text-gray-500">{section.lessons.length} lessons</p>
                                </div>
                              </div>
                              <svg
                                className={`w-5 h-5 text-gray-400 transition-transform ${selectedSection === section.id ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>

                            {selectedSection === section.id && (
                              <div className="border-t">
                                {section.lessons.map((lesson, lessonIndex) => (
                                  <div
                                    key={lesson.id}
                                    className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 border-b last:border-b-0"
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="text-sm text-gray-400 w-6">{lessonIndex + 1}.</span>
                                      <span className="text-lg">
                                        {lesson.type === 'video' && '🎬'}
                                        {lesson.type === 'quiz' && '📝'}
                                        {lesson.type === 'assignment' && '📋'}
                                        {lesson.type === 'text' && '📄'}
                                        {lesson.type === 'live' && '🔴'}
                                      </span>
                                      <div>
                                        <p className="font-medium text-gray-900">{lesson.title}</p>
                                        <p className="text-xs text-gray-500">
                                          {lesson.type} • {lesson.duration_minutes} min
                                          {lesson.is_preview && ' • Preview'}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {lesson.type === 'video' && (
                                        <button
                                          onClick={() => {
                                            setSelectedLesson(lesson)
                                            setVideoForm({ title: lesson.title, script: '', avatarId: 'avatar-1' })
                                            setShowVideoModal(true)
                                          }}
                                          className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
                                        >
                                          Generate Video
                                        </button>
                                      )}
                                      {lesson.type === 'quiz' && (
                                        <button
                                          onClick={() => {
                                            setSelectedLesson(lesson)
                                            setQuizForm({
                                              title: lesson.title,
                                              description: '',
                                              timeLimit: 15,
                                              passingScore: 70,
                                              maxAttempts: 3,
                                              questions: [],
                                            })
                                            setShowQuizModal(true)
                                          }}
                                          className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200"
                                        >
                                          Edit Quiz
                                        </button>
                                      )}
                                      {lesson.type === 'assignment' && (
                                        <button
                                          onClick={() => {
                                            setSelectedLesson(lesson)
                                            setAssignmentForm({
                                              title: lesson.title,
                                              description: '',
                                              instructions: '',
                                              maxScore: 100,
                                              dueDays: 7,
                                            })
                                            setShowAssignmentModal(true)
                                          }}
                                          className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200"
                                        >
                                          Edit Assignment
                                        </button>
                                      )}
                                      <button className="p-1 text-gray-400 hover:text-gray-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                                <div className="px-4 py-3 bg-gray-50">
                                  <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                                    + Add Lesson
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Videos Tab */}
                {activeTab === 'videos' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-gray-900">Generated Videos</h3>
                      <div className="text-sm text-gray-500">
                        Powered by HeyGen AI
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {mockVideoContent.map(video => (
                        <div key={video.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <div className="aspect-video bg-gray-200 relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                            <span className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full ${
                              video.status === 'ready' ? 'bg-green-100 text-green-700' :
                              video.status === 'generating' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {video.status}
                            </span>
                          </div>
                          <div className="p-4">
                            <h4 className="font-medium text-gray-900 truncate">{video.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              Avatar: {video.avatar_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Duration: {Math.floor((video.duration_seconds || 0) / 60)}:{String((video.duration_seconds || 0) % 60).padStart(2, '0')}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Placeholder for new video */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-indigo-500 cursor-pointer transition-colors">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <p className="font-medium text-gray-900">Generate New Video</p>
                        <p className="text-sm text-gray-500 mt-1">Select a lesson to generate</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quizzes Tab */}
                {activeTab === 'quizzes' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-gray-900">Course Quizzes</h3>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
                        + Create Quiz
                      </button>
                    </div>

                    <div className="space-y-4">
                      {mockQuizzes.filter(q => q.course_id === selectedCourse).map(quiz => (
                        <div key={quiz.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{quiz.title}</h4>
                              <p className="text-sm text-gray-500 mt-1">{quiz.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <span>{quiz.questions.length} questions</span>
                                <span>{quiz.time_limit_minutes} min limit</span>
                                <span>{quiz.passing_score}% to pass</span>
                              </div>
                            </div>
                            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}

                      {mockQuizzes.filter(q => q.course_id === selectedCourse).length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <p>No quizzes yet. Click &quot;Create Quiz&quot; to add one.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Assignments Tab */}
                {activeTab === 'assignments' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-gray-900">Course Assignments</h3>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
                        + Create Assignment
                      </button>
                    </div>

                    <div className="space-y-4">
                      {mockAssignments.filter(a => a.course_id === selectedCourse).map(assignment => (
                        <div key={assignment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                              <p className="text-sm text-gray-500 mt-1">{assignment.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <span>Max Score: {assignment.max_score}</span>
                                <span>Due: {assignment.due_days_after_enrollment} days after enrollment</span>
                                <span>{assignment.rubric?.length || 0} rubric criteria</span>
                              </div>
                            </div>
                            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}

                      {mockAssignments.filter(a => a.course_id === selectedCourse).length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <p>No assignments yet. Click &quot;Create Assignment&quot; to add one.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {!selectedCourse && (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Select a Course</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Choose a course from the dropdown above to manage its content, videos, quizzes, and assignments.
            </p>
          </div>
        )}
      </main>

      {/* Video Generation Modal */}
      {showVideoModal && selectedLesson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Generate AI Video</h2>
                <button onClick={() => setShowVideoModal(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">For: {selectedLesson.title}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Avatar Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Avatar</label>
                <div className="grid grid-cols-2 gap-3">
                  {videoAvatars.map(avatar => (
                    <label
                      key={avatar.id}
                      className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                        videoForm.avatarId === avatar.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="avatar"
                        value={avatar.id}
                        checked={videoForm.avatarId === avatar.id}
                        onChange={(e) => setVideoForm(prev => ({ ...prev, avatarId: e.target.value }))}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {avatar.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{avatar.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{avatar.style} • {avatar.gender}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Video Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video Title</label>
                <input
                  type="text"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter video title..."
                />
              </div>

              {/* Script */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Script
                  <span className="text-gray-400 font-normal ml-2">({videoForm.script.length} characters)</span>
                </label>
                <textarea
                  value={videoForm.script}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, script: e.target.value }))}
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter the script for the AI avatar to speak..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Estimated duration: ~{Math.ceil(videoForm.script.split(' ').length / 150)} minutes
                </p>
              </div>

              {/* AI Script Helper */}
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600">✨</span>
                  </div>
                  <div>
                    <p className="font-medium text-purple-900">AI Script Assistant</p>
                    <p className="text-sm text-purple-700 mt-1">
                      Need help writing the script? Describe the lesson topic and we&apos;ll generate a professional script.
                    </p>
                    <button className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium">
                      Generate Script with AI →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowVideoModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateVideo}
                disabled={!videoForm.script || videoGenerating}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {videoGenerating ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>Generate Video</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuizModal && selectedLesson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Create/Edit Quiz</h2>
                <button onClick={() => setShowQuizModal(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">For: {selectedLesson.title}</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
                  <input
                    type="text"
                    value={quizForm.title}
                    onChange={(e) => setQuizForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
                  <input
                    type="number"
                    value={quizForm.timeLimit}
                    onChange={(e) => setQuizForm(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Passing Score (%)</label>
                  <input
                    type="number"
                    value={quizForm.passingScore}
                    onChange={(e) => setQuizForm(prev => ({ ...prev, passingScore: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Attempts</label>
                  <input
                    type="number"
                    value={quizForm.maxAttempts}
                    onChange={(e) => setQuizForm(prev => ({ ...prev, maxAttempts: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={quizForm.description}
                  onChange={(e) => setQuizForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Brief description of the quiz..."
                />
              </div>

              {/* Questions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">Questions ({quizForm.questions.length})</label>
                  <button
                    onClick={addQuizQuestion}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    + Add Question
                  </button>
                </div>

                {quizForm.questions.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-500">No questions yet. Click &quot;Add Question&quot; to create one.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quizForm.questions.map((question, qIndex) => (
                      <div key={question.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <span className="font-medium text-gray-900">Question {qIndex + 1}</span>
                          <button
                            onClick={() => {
                              setQuizForm(prev => ({
                                ...prev,
                                questions: prev.questions.filter((_, i) => i !== qIndex)
                              }))
                            }}
                            className="text-red-500 hover:text-red-600 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          type="text"
                          value={question.question}
                          onChange={(e) => {
                            const updated = [...quizForm.questions]
                            updated[qIndex].question = e.target.value
                            setQuizForm(prev => ({ ...prev, questions: updated }))
                          }}
                          placeholder="Enter question..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3"
                        />
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <div key={option.id} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${question.id}`}
                                checked={option.is_correct}
                                onChange={() => {
                                  const updated = [...quizForm.questions]
                                  updated[qIndex].options.forEach((o, i) => {
                                    o.is_correct = i === oIndex
                                  })
                                  setQuizForm(prev => ({ ...prev, questions: updated }))
                                }}
                                className="text-indigo-600"
                              />
                              <input
                                type="text"
                                value={option.text}
                                onChange={(e) => {
                                  const updated = [...quizForm.questions]
                                  updated[qIndex].options[oIndex].text = e.target.value
                                  setQuizForm(prev => ({ ...prev, questions: updated }))
                                }}
                                placeholder={`Option ${oIndex + 1}`}
                                className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowQuizModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuiz}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Save Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && selectedLesson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Create/Edit Assignment</h2>
                <button onClick={() => setShowAssignmentModal(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">For: {selectedLesson.title}</p>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Title</label>
                <input
                  type="text"
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Brief description of what students will build..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instructions (Markdown supported)</label>
                <textarea
                  value={assignmentForm.instructions}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, instructions: e.target.value }))}
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                  placeholder="## Objective&#10;&#10;## Requirements&#10;&#10;## Submission"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Score</label>
                  <input
                    type="number"
                    value={assignmentForm.maxScore}
                    onChange={(e) => setAssignmentForm(prev => ({ ...prev, maxScore: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due (days after enrollment)</label>
                  <input
                    type="number"
                    value={assignmentForm.dueDays}
                    onChange={(e) => setAssignmentForm(prev => ({ ...prev, dueDays: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAssignmentModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAssignment}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
