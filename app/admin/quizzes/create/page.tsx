'use client'

import { useState } from 'react'
import {
  FileQuestion,
  Plus,
  Trash2,
  GripVertical,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Clock,
  Shuffle,
  Eye,
  Save,
  Play,
  Settings,
  AlertCircle,
  CheckCircle2,
  Circle,
  Square,
  Type,
  Hash,
  BookOpen
} from 'lucide-react'
import toast from 'react-hot-toast'

// Mock courses for assignment
const courses = [
  { id: 1, title: 'Advanced React Patterns', lessons: [
    { id: 101, title: 'Introduction to Advanced Patterns' },
    { id: 102, title: 'Compound Components' }
  ]},
  { id: 2, title: 'Node.js Masterclass', lessons: [
    { id: 201, title: 'Getting Started with Node' },
    { id: 202, title: 'Express Framework' }
  ]},
  { id: 3, title: 'TypeScript Deep Dive', lessons: [
    { id: 301, title: 'Type System Fundamentals' },
    { id: 302, title: 'Advanced Types' }
  ]}
]

type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer' | 'multiple-select'

interface Option {
  id: string
  text: string
  isCorrect: boolean
}

interface Question {
  id: string
  type: QuestionType
  text: string
  options: Option[]
  correctAnswer?: string // For short answer
  points: number
  explanation?: string
  expanded: boolean
}

const questionTypes: { type: QuestionType; label: string; icon: React.ComponentType<{className?: string}> }[] = [
  { type: 'multiple-choice', label: 'Multiple Choice', icon: Circle },
  { type: 'true-false', label: 'True/False', icon: CheckCircle2 },
  { type: 'short-answer', label: 'Short Answer', icon: Type },
  { type: 'multiple-select', label: 'Multiple Select', icon: Square }
]

export default function CreateQuizPage() {
  const [quizTitle, setQuizTitle] = useState('')
  const [quizDescription, setQuizDescription] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [settings, setSettings] = useState({
    timeLimit: 0,
    passingScore: 70,
    randomizeQuestions: false,
    randomizeOptions: false,
    showResults: true,
    allowRetake: true,
    retakeLimit: 3,
    courseId: '',
    lessonId: ''
  })
  const [showSettings, setShowSettings] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(0)

  const selectedCourse = courses.find(c => c.id === Number(settings.courseId))

  const createNewQuestion = (type: QuestionType): Question => ({
    id: Math.random().toString(36).substring(7),
    type,
    text: '',
    options: type === 'true-false'
      ? [
          { id: '1', text: 'True', isCorrect: false },
          { id: '2', text: 'False', isCorrect: false }
        ]
      : type === 'short-answer'
      ? []
      : [
          { id: '1', text: '', isCorrect: false },
          { id: '2', text: '', isCorrect: false },
          { id: '3', text: '', isCorrect: false },
          { id: '4', text: '', isCorrect: false }
        ],
    points: 10,
    expanded: true
  })

  const addQuestion = (type: QuestionType) => {
    const newQuestion = createNewQuestion(type)
    setQuestions(prev => [...prev.map(q => ({ ...q, expanded: false })), newQuestion])
  }

  const removeQuestion = (questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId))
  }

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuestions(prev => prev.map(q =>
      q.id === questionId ? { ...q, ...updates } : q
    ))
  }

  const toggleQuestionExpanded = (questionId: string) => {
    setQuestions(prev => prev.map(q =>
      q.id === questionId ? { ...q, expanded: !q.expanded } : q
    ))
  }

  const updateOption = (questionId: string, optionId: string, updates: Partial<Option>) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q

      const newOptions = q.options.map(opt => {
        if (opt.id !== optionId) {
          // For single-choice, uncheck other options when one is selected
          if (updates.isCorrect && q.type !== 'multiple-select') {
            return { ...opt, isCorrect: false }
          }
          return opt
        }
        return { ...opt, ...updates }
      })

      return { ...q, options: newOptions }
    }))
  }

  const addOption = (questionId: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q
      return {
        ...q,
        options: [...q.options, {
          id: Math.random().toString(36).substring(7),
          text: '',
          isCorrect: false
        }]
      }
    }))
  }

  const removeOption = (questionId: string, optionId: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q
      return {
        ...q,
        options: q.options.filter(opt => opt.id !== optionId)
      }
    }))
  }

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === questions.length - 1)
    ) return

    const newQuestions = [...questions]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    ;[newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]]
    setQuestions(newQuestions)
  }

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)

  const validateQuiz = (): string[] => {
    const errors: string[] = []

    if (!quizTitle.trim()) {
      errors.push('Quiz title is required')
    }

    if (questions.length === 0) {
      errors.push('Add at least one question')
    }

    questions.forEach((q, idx) => {
      if (!q.text.trim()) {
        errors.push(`Question ${idx + 1} has no text`)
      }

      if (q.type === 'short-answer' && !q.correctAnswer?.trim()) {
        errors.push(`Question ${idx + 1} needs a correct answer`)
      }

      if (q.type !== 'short-answer') {
        const hasCorrect = q.options.some(opt => opt.isCorrect)
        if (!hasCorrect) {
          errors.push(`Question ${idx + 1} has no correct answer selected`)
        }

        const emptyOptions = q.options.filter(opt => !opt.text.trim())
        if (emptyOptions.length > 0) {
          errors.push(`Question ${idx + 1} has empty options`)
        }
      }
    })

    return errors
  }

  const handleSave = (publish: boolean) => {
    const errors = validateQuiz()

    if (errors.length > 0) {
      errors.forEach(err => toast.error(err))
      return
    }

    if (publish) {
      toast.success('Quiz published successfully!')
    } else {
      toast.success('Quiz saved as draft')
    }
  }

  const getQuestionTypeIcon = (type: QuestionType) => {
    const found = questionTypes.find(qt => qt.type === type)
    return found?.icon || Circle
  }

  if (previewMode) {
    const currentQuestion = questions[previewIndex]
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{quizTitle || 'Untitled Quiz'}</h1>
          <button
            onClick={() => setPreviewMode(false)}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent"
          >
            <X className="h-4 w-4" />
            Exit Preview
          </button>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">
              Question {previewIndex + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-primary">{currentQuestion?.points} points</span>
          </div>

          {currentQuestion && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-foreground">{currentQuestion.text}</h2>

              {currentQuestion.type === 'short-answer' ? (
                <input
                  type="text"
                  placeholder="Type your answer..."
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background"
                  disabled
                />
              ) : (
                <div className="space-y-2">
                  {currentQuestion.options.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-accent/50"
                    >
                      {currentQuestion.type === 'multiple-select' ? (
                        <Square className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className="text-foreground">{option.text}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
            <button
              onClick={() => setPreviewIndex(prev => Math.max(0, prev - 1))}
              disabled={previewIndex === 0}
              className="px-4 py-2 border border-border rounded-lg hover:bg-accent disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex gap-2">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPreviewIndex(idx)}
                  className={`w-8 h-8 rounded-full text-sm ${
                    idx === previewIndex
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent hover:bg-accent/80'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPreviewIndex(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={previewIndex === questions.length - 1}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileQuestion className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create Quiz</h1>
            <p className="text-muted-foreground">
              Build assessments with multiple question types
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => questions.length > 0 && setPreviewMode(true)}
            disabled={questions.length === 0}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent disabled:opacity-50"
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
          <button
            onClick={() => handleSave(false)}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <Play className="h-4 w-4" />
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Questions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quiz Title & Description */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Quiz Title *</label>
                <input
                  type="text"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="Enter quiz title"
                  className="w-full mt-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  value={quizDescription}
                  onChange={(e) => setQuizDescription(e.target.value)}
                  rows={2}
                  placeholder="Brief description of this quiz..."
                  className="w-full mt-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>
          </div>

          {/* Add Question Buttons */}
          <div className="flex flex-wrap gap-2">
            {questionTypes.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => addQuestion(type)}
                className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 rounded-lg transition-colors"
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Questions List */}
          {questions.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium">No questions yet</p>
              <p className="text-sm text-muted-foreground">
                Click the buttons above to add your first question
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => {
                const TypeIcon = getQuestionTypeIcon(question.type)
                return (
                  <div
                    key={question.id}
                    className="bg-card border border-border rounded-xl overflow-hidden"
                  >
                    {/* Question Header */}
                    <div
                      className="flex items-center gap-4 px-4 py-3 bg-accent/30 cursor-pointer"
                      onClick={() => toggleQuestionExpanded(question.id)}
                    >
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                      <div className="flex items-center gap-2 flex-1">
                        <span className="flex items-center justify-center w-6 h-6 bg-primary/10 text-primary text-sm font-medium rounded">
                          {index + 1}
                        </span>
                        <TypeIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground truncate">
                          {question.text || 'Untitled question'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{question.points} pts</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            moveQuestion(index, 'up')
                          }}
                          disabled={index === 0}
                          className="p-1 hover:bg-accent rounded disabled:opacity-30"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            moveQuestion(index, 'down')
                          }}
                          disabled={index === questions.length - 1}
                          className="p-1 hover:bg-accent rounded disabled:opacity-30"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeQuestion(question.id)
                          }}
                          className="p-1 hover:bg-red-500/10 hover:text-red-500 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {question.expanded ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {/* Question Content */}
                    {question.expanded && (
                      <div className="p-4 space-y-4">
                        {/* Question Text */}
                        <div>
                          <label className="text-sm font-medium text-foreground">Question *</label>
                          <textarea
                            value={question.text}
                            onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                            rows={2}
                            placeholder="Enter your question..."
                            className="w-full mt-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          />
                        </div>

                        {/* Options or Answer */}
                        {question.type === 'short-answer' ? (
                          <div>
                            <label className="text-sm font-medium text-foreground">
                              Correct Answer *
                            </label>
                            <input
                              type="text"
                              value={question.correctAnswer || ''}
                              onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
                              placeholder="Enter the correct answer"
                              className="w-full mt-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Answers will be compared case-insensitively
                            </p>
                          </div>
                        ) : (
                          <div>
                            <label className="text-sm font-medium text-foreground">
                              Options {question.type === 'multiple-select' && '(select all correct)'}
                            </label>
                            <div className="space-y-2 mt-2">
                              {question.options.map((option) => (
                                <div key={option.id} className="flex items-center gap-2">
                                  <button
                                    onClick={() => updateOption(question.id, option.id, { isCorrect: !option.isCorrect })}
                                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                      option.isCorrect
                                        ? 'border-green-500 bg-green-500 text-white'
                                        : 'border-border hover:border-green-500/50'
                                    }`}
                                  >
                                    {option.isCorrect && <Check className="h-4 w-4" />}
                                  </button>
                                  <input
                                    type="text"
                                    value={option.text}
                                    onChange={(e) => updateOption(question.id, option.id, { text: e.target.value })}
                                    placeholder="Option text"
                                    disabled={question.type === 'true-false'}
                                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                                  />
                                  {question.type !== 'true-false' && question.options.length > 2 && (
                                    <button
                                      onClick={() => removeOption(question.id, option.id)}
                                      className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                            {question.type !== 'true-false' && question.options.length < 6 && (
                              <button
                                onClick={() => addOption(question.id)}
                                className="flex items-center gap-2 mt-2 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded"
                              >
                                <Plus className="h-4 w-4" />
                                Add option
                              </button>
                            )}
                          </div>
                        )}

                        {/* Points & Explanation */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-foreground">Points</label>
                            <input
                              type="number"
                              value={question.points}
                              onChange={(e) => updateQuestion(question.id, { points: Number(e.target.value) })}
                              min={1}
                              className="w-full mt-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground">
                              Explanation (shown after answer)
                            </label>
                            <input
                              type="text"
                              value={question.explanation || ''}
                              onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                              placeholder="Optional explanation"
                              className="w-full mt-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Column - Settings */}
        <div className="space-y-6">
          {/* Quiz Stats */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{questions.length}</p>
                <p className="text-sm text-muted-foreground">Questions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{totalPoints}</p>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
            </div>
          </div>

          {/* Course Assignment */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Assignment
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Course</label>
                <div className="relative mt-1">
                  <select
                    value={settings.courseId}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      courseId: e.target.value,
                      lessonId: ''
                    }))}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background appearance-none cursor-pointer pr-10"
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {selectedCourse && (
                <div>
                  <label className="text-sm font-medium text-foreground">Lesson</label>
                  <div className="relative mt-1">
                    <select
                      value={settings.lessonId}
                      onChange={(e) => setSettings(prev => ({ ...prev, lessonId: e.target.value }))}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background appearance-none cursor-pointer pr-10"
                    >
                      <option value="">Select a lesson</option>
                      {selectedCourse.lessons.map((lesson) => (
                        <option key={lesson.id} value={lesson.id}>
                          {lesson.title}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quiz Settings */}
          <div className="bg-card border border-border rounded-xl p-6">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center justify-between w-full"
            >
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quiz Settings
              </h2>
              {showSettings ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>

            {showSettings && (
              <div className="space-y-4 mt-4 pt-4 border-t border-border">
                {/* Time Limit */}
                <div>
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.timeLimit}
                    onChange={(e) => setSettings(prev => ({ ...prev, timeLimit: Number(e.target.value) }))}
                    min={0}
                    placeholder="0 = no limit"
                    className="w-full mt-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Passing Score */}
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    value={settings.passingScore}
                    onChange={(e) => setSettings(prev => ({ ...prev, passingScore: Number(e.target.value) }))}
                    min={0}
                    max={100}
                    className="w-full mt-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Toggles */}
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-foreground flex items-center gap-2">
                      <Shuffle className="h-4 w-4 text-muted-foreground" />
                      Randomize questions
                    </span>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, randomizeQuestions: !prev.randomizeQuestions }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        settings.randomizeQuestions ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          settings.randomizeQuestions ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-foreground flex items-center gap-2">
                      <Shuffle className="h-4 w-4 text-muted-foreground" />
                      Randomize options
                    </span>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, randomizeOptions: !prev.randomizeOptions }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        settings.randomizeOptions ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          settings.randomizeOptions ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-foreground">Show results immediately</span>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, showResults: !prev.showResults }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        settings.showResults ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          settings.showResults ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-foreground">Allow retakes</span>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, allowRetake: !prev.allowRetake }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        settings.allowRetake ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          settings.allowRetake ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </label>

                  {settings.allowRetake && (
                    <div className="pl-6">
                      <label className="text-sm text-muted-foreground">Retake limit</label>
                      <input
                        type="number"
                        value={settings.retakeLimit}
                        onChange={(e) => setSettings(prev => ({ ...prev, retakeLimit: Number(e.target.value) }))}
                        min={1}
                        className="w-full mt-1 px-3 py-1.5 text-sm border border-border rounded-lg bg-background"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-accent/50 border border-border rounded-xl p-4">
            <h3 className="font-medium text-foreground mb-2">Quiz Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                Mix question types for better engagement
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                Add explanations to help learning
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                Use preview to test before publishing
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
