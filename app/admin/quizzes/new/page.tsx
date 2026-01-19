'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  GripVertical,
  Trash2,
  Copy,
  Settings,
  Save,
  Eye,
  CheckCircle,
  Circle,
  Square,
  AlignLeft,
  ListOrdered,
  Image,
  Code,
  Clock,
  Target,
  Award,
  Shuffle,
  ChevronDown,
  ChevronUp,
  X,
  HelpCircle
} from 'lucide-react'

const questionTypes = [
  { id: 'multiple', label: 'Multiple Choice', icon: Circle, description: 'Single correct answer' },
  { id: 'checkbox', label: 'Multiple Select', icon: Square, description: 'Multiple correct answers' },
  { id: 'true-false', label: 'True/False', icon: CheckCircle, description: 'Binary choice' },
  { id: 'short', label: 'Short Answer', icon: AlignLeft, description: 'Text response' },
  { id: 'ordering', label: 'Ordering', icon: ListOrdered, description: 'Sequence items' },
]

interface Question {
  id: string
  type: string
  question: string
  options: { id: string; text: string; isCorrect: boolean }[]
  explanation?: string
  points: number
  expanded: boolean
}

export default function NewQuizPage() {
  const [quizTitle, setQuizTitle] = useState('')
  const [quizDescription, setQuizDescription] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [passingScore, setPassingScore] = useState(70)
  const [timeLimit, setTimeLimit] = useState(30)
  const [allowRetakes, setAllowRetakes] = useState(true)
  const [shuffleQuestions, setShuffleQuestions] = useState(false)
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(true)

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      type: 'multiple',
      question: '',
      options: [
        { id: 'a', text: '', isCorrect: true },
        { id: 'b', text: '', isCorrect: false },
        { id: 'c', text: '', isCorrect: false },
        { id: 'd', text: '', isCorrect: false },
      ],
      explanation: '',
      points: 1,
      expanded: true
    }
  ])

  const [showTypeSelector, setShowTypeSelector] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const addQuestion = (type: string) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      question: '',
      options: type === 'true-false'
        ? [
            { id: 'true', text: 'True', isCorrect: true },
            { id: 'false', text: 'False', isCorrect: false },
          ]
        : type === 'short'
        ? []
        : [
            { id: 'a', text: '', isCorrect: true },
            { id: 'b', text: '', isCorrect: false },
            { id: 'c', text: '', isCorrect: false },
            { id: 'd', text: '', isCorrect: false },
          ],
      explanation: '',
      points: 1,
      expanded: true
    }
    setQuestions([...questions, newQuestion])
    setShowTypeSelector(false)
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q))
  }

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const duplicateQuestion = (question: Question) => {
    const newQuestion = {
      ...question,
      id: Date.now().toString(),
      options: question.options.map(o => ({ ...o, id: `${o.id}-${Date.now()}` }))
    }
    const index = questions.findIndex(q => q.id === question.id)
    const newQuestions = [...questions]
    newQuestions.splice(index + 1, 0, newQuestion)
    setQuestions(newQuestions)
  }

  const toggleQuestionExpand = (id: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, expanded: !q.expanded } : q))
  }

  const updateOption = (questionId: string, optionId: string, text: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: q.options.map(o => o.id === optionId ? { ...o, text } : o)
        }
      }
      return q
    }))
  }

  const toggleCorrectOption = (questionId: string, optionId: string, type: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        if (type === 'multiple' || type === 'true-false') {
          return {
            ...q,
            options: q.options.map(o => ({ ...o, isCorrect: o.id === optionId }))
          }
        } else {
          return {
            ...q,
            options: q.options.map(o => o.id === optionId ? { ...o, isCorrect: !o.isCorrect } : o)
          }
        }
      }
      return q
    }))
  }

  const addOption = (questionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: [...q.options, { id: Date.now().toString(), text: '', isCorrect: false }]
        }
      }
      return q
    }))
  }

  const removeOption = (questionId: string, optionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: q.options.filter(o => o.id !== optionId)
        }
      }
      return q
    }))
  }

  const totalPoints = questions.reduce((acc, q) => acc + q.points, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/quizzes"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Create Quiz</h1>
            <p className="text-muted-foreground">Build an interactive assessment</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Eye className="h-4 w-4" />
            Preview
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <Save className="h-4 w-4" />
            Save Quiz
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quiz Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Quiz Title *</label>
              <input
                type="text"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="e.g., Introduction to Machine Learning Quiz"
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <textarea
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                rows={3}
                placeholder="Brief description of what this quiz covers..."
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Course *</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a course</option>
                <option value="1">Complete AI & Machine Learning Bootcamp</option>
                <option value="2">Advanced React & Next.js Development</option>
                <option value="3">AWS Certified Solutions Architect</option>
                <option value="4">UI/UX Design Masterclass</option>
              </select>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Question Header */}
                <div
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 cursor-pointer"
                  onClick={() => toggleQuestionExpand(question.id)}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">
                        {question.question || 'New Question'}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {questionTypes.find(t => t.id === question.type)?.label} &bull; {question.points} point{question.points !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); duplicateQuestion(question); }}
                      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteQuestion(question.id); }}
                      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {question.expanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Question Content */}
                {question.expanded && (
                  <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
                    {/* Question Text */}
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Question *</label>
                      <textarea
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                        rows={2}
                        placeholder="Enter your question..."
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>

                    {/* Options */}
                    {question.type !== 'short' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {question.type === 'checkbox' ? 'Options (select all correct answers)' : 'Options (select correct answer)'}
                        </label>
                        <div className="space-y-2">
                          {question.options.map((option) => (
                            <div key={option.id} className="flex items-center gap-3">
                              <button
                                onClick={() => toggleCorrectOption(question.id, option.id, question.type)}
                                className={`w-6 h-6 rounded-${question.type === 'checkbox' ? 'md' : 'full'} border-2 flex items-center justify-center transition-colors ${
                                  option.isCorrect
                                    ? 'border-green-500 bg-green-500 text-white'
                                    : 'border-gray-300 hover:border-green-500'
                                }`}
                              >
                                {option.isCorrect && <CheckCircle className="h-4 w-4" />}
                              </button>
                              <input
                                type="text"
                                value={option.text}
                                onChange={(e) => updateOption(question.id, option.id, e.target.value)}
                                placeholder={`Option ${option.id.toUpperCase()}`}
                                disabled={question.type === 'true-false'}
                                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                              />
                              {question.type !== 'true-false' && question.options.length > 2 && (
                                <button
                                  onClick={() => removeOption(question.id, option.id)}
                                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400 hover:text-red-500"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        {question.type !== 'true-false' && (
                          <button
                            onClick={() => addOption(question.id)}
                            className="mt-2 flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            <Plus className="h-4 w-4" />
                            Add Option
                          </button>
                        )}
                      </div>
                    )}

                    {/* Short Answer */}
                    {question.type === 'short' && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-muted-foreground">
                        Students will enter their answer in a text field. You can review and grade their responses manually.
                      </div>
                    )}

                    {/* Explanation */}
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Explanation (shown after answering)</label>
                      <textarea
                        value={question.explanation}
                        onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                        rows={2}
                        placeholder="Explain why the correct answer is right..."
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>

                    {/* Points */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Points:</label>
                        <input
                          type="number"
                          value={question.points}
                          onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) || 1 })}
                          min="1"
                          max="100"
                          className="w-20 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Add Question Button */}
            <div className="relative">
              <button
                onClick={() => setShowTypeSelector(!showTypeSelector)}
                className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add Question
              </button>

              {/* Question Type Selector */}
              {showTypeSelector && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-10">
                  <p className="text-sm font-medium mb-3">Select Question Type</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {questionTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => addQuestion(type.id)}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
                      >
                        <type.icon className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{type.label}</p>
                          <p className="text-xs text-muted-foreground">{type.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quiz Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold mb-4">Quiz Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  Questions
                </div>
                <span className="font-semibold">{questions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="h-4 w-4" />
                  Total Points
                </div>
                <span className="font-semibold">{totalPoints}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Time Limit
                </div>
                <span className="font-semibold">{timeLimit} min</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4" />
                  Pass Score
                </div>
                <span className="font-semibold">{passingScore}%</span>
              </div>
            </div>
          </div>

          {/* Quick Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold mb-4">Quick Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Time Limit (minutes)</label>
                <input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">Set to 0 for no limit</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Passing Score (%)</label>
                <input
                  type="number"
                  value={passingScore}
                  onChange={(e) => setPassingScore(parseInt(e.target.value) || 0)}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">Allow retakes</span>
                <div className={`w-10 h-6 rounded-full transition-colors ${allowRetakes ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white mt-1 transition-transform ${allowRetakes ? 'translate-x-5' : 'translate-x-1'}`} />
                </div>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">Shuffle questions</span>
                <div className={`w-10 h-6 rounded-full transition-colors ${shuffleQuestions ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white mt-1 transition-transform ${shuffleQuestions ? 'translate-x-5' : 'translate-x-1'}`} />
                </div>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">Show correct answers</span>
                <div className={`w-10 h-6 rounded-full transition-colors ${showCorrectAnswers ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white mt-1 transition-transform ${showCorrectAnswers ? 'translate-x-5' : 'translate-x-1'}`} />
                </div>
              </label>
            </div>
          </div>

          {/* Help */}
          <div className="bg-gradient-to-br from-primary/10 to-violet-500/10 rounded-xl border border-primary/20 p-6">
            <div className="flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Need Help?</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Check our guide on creating effective quizzes.
                </p>
                <button className="text-sm text-primary hover:underline">
                  View Documentation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold">Quiz Settings</h2>
              <button
                onClick={() => setSettingsOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Time Limit</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg"
                    />
                    <span className="text-sm text-muted-foreground">minutes</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Passing Score</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={passingScore}
                      onChange={(e) => setPassingScore(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                  <div>
                    <p className="font-medium">Allow Retakes</p>
                    <p className="text-sm text-muted-foreground">Students can retake the quiz</p>
                  </div>
                  <input type="checkbox" checked={allowRetakes} onChange={() => setAllowRetakes(!allowRetakes)} className="w-5 h-5" />
                </label>
                <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                  <div>
                    <p className="font-medium">Shuffle Questions</p>
                    <p className="text-sm text-muted-foreground">Randomize question order</p>
                  </div>
                  <input type="checkbox" checked={shuffleQuestions} onChange={() => setShuffleQuestions(!shuffleQuestions)} className="w-5 h-5" />
                </label>
                <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                  <div>
                    <p className="font-medium">Show Correct Answers</p>
                    <p className="text-sm text-muted-foreground">Display answers after submission</p>
                  </div>
                  <input type="checkbox" checked={showCorrectAnswers} onChange={() => setShowCorrectAnswers(!showCorrectAnswers)} className="w-5 h-5" />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setSettingsOpen(false)}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
