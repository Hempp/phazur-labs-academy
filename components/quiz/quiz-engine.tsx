'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Trophy,
  AlertCircle,
  RotateCcw,
  BookOpen,
  Flag,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

// Question Types
export type QuestionType =
  | 'multiple_choice'
  | 'multiple_answer'
  | 'true_false'
  | 'fill_blank'
  | 'short_answer'
  | 'matching'
  | 'ordering'

export interface Answer {
  id: string
  text: string
  isCorrect: boolean
}

export interface Question {
  id: string
  type: QuestionType
  text: string
  points: number
  explanation?: string
  answers?: Answer[]
  correctAnswer?: string | string[]
  matchingPairs?: { left: string; right: string }[]
  orderItems?: string[]
}

export interface Quiz {
  id: string
  title: string
  description?: string
  timeLimit?: number // in minutes
  passingScore: number // percentage
  shuffleQuestions?: boolean
  showResults?: boolean
  allowRetry?: boolean
  questions: Question[]
}

export interface QuizAttempt {
  quizId: string
  answers: Record<string, string | string[]>
  startedAt: Date
  completedAt?: Date
  score?: number
  passed?: boolean
  correctCount?: number
  totalQuestions?: number
}

interface QuizEngineProps {
  quiz: Quiz
  onComplete?: (attempt: QuizAttempt) => void
  onExit?: () => void
}

// Helper Components
function QuestionIndicator({
  index,
  status,
  isCurrent,
  onClick,
}: {
  index: number
  status: 'unanswered' | 'answered' | 'flagged'
  isCurrent: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-8 h-8 rounded-lg text-sm font-medium transition-all',
        isCurrent && 'ring-2 ring-primary ring-offset-2',
        status === 'answered' && 'bg-primary text-primary-foreground',
        status === 'flagged' && 'bg-amber-500 text-white',
        status === 'unanswered' && 'bg-muted hover:bg-muted/80'
      )}
    >
      {index + 1}
    </button>
  )
}

function MultipleChoiceQuestion({
  question,
  selectedAnswer,
  onSelect,
  showResults,
}: {
  question: Question
  selectedAnswer?: string
  onSelect: (answerId: string) => void
  showResults?: boolean
}) {
  return (
    <div className="space-y-3">
      {question.answers?.map((answer) => {
        const isSelected = selectedAnswer === answer.id
        const isCorrect = answer.isCorrect
        const showCorrectness = showResults && isSelected

        return (
          <button
            key={answer.id}
            onClick={() => !showResults && onSelect(answer.id)}
            disabled={showResults}
            className={cn(
              'w-full flex items-center gap-3 p-4 rounded-lg border text-left transition-all',
              !showResults && 'hover:border-primary hover:bg-primary/5',
              isSelected && !showResults && 'border-primary bg-primary/10',
              showResults && isCorrect && 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30',
              showResults && isSelected && !isCorrect && 'border-red-500 bg-red-50 dark:bg-red-950/30'
            )}
          >
            <div
              className={cn(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                isSelected && !showResults && 'border-primary bg-primary',
                showResults && isCorrect && 'border-emerald-500 bg-emerald-500',
                showResults && isSelected && !isCorrect && 'border-red-500 bg-red-500'
              )}
            >
              {isSelected && !showResults && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
              {showResults && isCorrect && (
                <CheckCircle2 className="h-4 w-4 text-white" />
              )}
              {showResults && isSelected && !isCorrect && (
                <XCircle className="h-4 w-4 text-white" />
              )}
            </div>
            <span className="flex-1">{answer.text}</span>
          </button>
        )
      })}
    </div>
  )
}

function MultipleAnswerQuestion({
  question,
  selectedAnswers,
  onToggle,
  showResults,
}: {
  question: Question
  selectedAnswers: string[]
  onToggle: (answerId: string) => void
  showResults?: boolean
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground mb-4">
        Select all that apply
      </p>
      {question.answers?.map((answer) => {
        const isSelected = selectedAnswers.includes(answer.id)
        const isCorrect = answer.isCorrect

        return (
          <button
            key={answer.id}
            onClick={() => !showResults && onToggle(answer.id)}
            disabled={showResults}
            className={cn(
              'w-full flex items-center gap-3 p-4 rounded-lg border text-left transition-all',
              !showResults && 'hover:border-primary hover:bg-primary/5',
              isSelected && !showResults && 'border-primary bg-primary/10',
              showResults && isCorrect && 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30',
              showResults && isSelected && !isCorrect && 'border-red-500 bg-red-50 dark:bg-red-950/30'
            )}
          >
            <div
              className={cn(
                'w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0',
                isSelected && !showResults && 'border-primary bg-primary',
                showResults && isCorrect && 'border-emerald-500 bg-emerald-500',
                showResults && isSelected && !isCorrect && 'border-red-500 bg-red-500'
              )}
            >
              {isSelected && (
                <CheckCircle2 className="h-4 w-4 text-white" />
              )}
            </div>
            <span className="flex-1">{answer.text}</span>
          </button>
        )
      })}
    </div>
  )
}

function TrueFalseQuestion({
  question,
  selectedAnswer,
  onSelect,
  showResults,
}: {
  question: Question
  selectedAnswer?: string
  onSelect: (value: string) => void
  showResults?: boolean
}) {
  const options = [
    { id: 'true', text: 'True' },
    { id: 'false', text: 'False' },
  ]

  const correctAnswer = question.correctAnswer as string

  return (
    <div className="grid grid-cols-2 gap-4">
      {options.map((option) => {
        const isSelected = selectedAnswer === option.id
        const isCorrect = option.id === correctAnswer

        return (
          <button
            key={option.id}
            onClick={() => !showResults && onSelect(option.id)}
            disabled={showResults}
            className={cn(
              'p-6 rounded-lg border text-center font-medium text-lg transition-all',
              !showResults && 'hover:border-primary hover:bg-primary/5',
              isSelected && !showResults && 'border-primary bg-primary/10',
              showResults && isCorrect && 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30',
              showResults && isSelected && !isCorrect && 'border-red-500 bg-red-50 dark:bg-red-950/30'
            )}
          >
            {option.text}
          </button>
        )
      })}
    </div>
  )
}

function FillBlankQuestion({
  question,
  answer,
  onChange,
  showResults,
}: {
  question: Question
  answer: string
  onChange: (value: string) => void
  showResults?: boolean
}) {
  const correctAnswer = question.correctAnswer as string
  const isCorrect = showResults && answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()

  return (
    <div className="space-y-4">
      <div className="text-lg">
        {question.text.split('___').map((part, index, arr) => (
          <span key={index}>
            {part}
            {index < arr.length - 1 && (
              <input
                type="text"
                value={answer}
                onChange={(e) => onChange(e.target.value)}
                disabled={showResults}
                className={cn(
                  'inline-block w-40 mx-1 px-3 py-1 border-b-2 border-dashed bg-transparent text-center focus:outline-none focus:border-primary',
                  showResults && isCorrect && 'border-emerald-500 text-emerald-600',
                  showResults && !isCorrect && 'border-red-500 text-red-600'
                )}
                placeholder="Your answer"
              />
            )}
          </span>
        ))}
      </div>
      {showResults && !isCorrect && (
        <p className="text-sm text-muted-foreground">
          Correct answer: <span className="font-medium text-emerald-600">{correctAnswer}</span>
        </p>
      )}
    </div>
  )
}

function ShortAnswerQuestion({
  question,
  answer,
  onChange,
  showResults,
}: {
  question: Question
  answer: string
  onChange: (value: string) => void
  showResults?: boolean
}) {
  return (
    <div className="space-y-4">
      <textarea
        value={answer}
        onChange={(e) => onChange(e.target.value)}
        disabled={showResults}
        className="w-full h-32 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted"
        placeholder="Type your answer here..."
      />
      {showResults && question.correctAnswer && (
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-1">Sample Answer:</p>
          <p className="text-sm text-muted-foreground">{question.correctAnswer as string}</p>
        </div>
      )}
    </div>
  )
}

// Results Component
function QuizResults({
  quiz,
  attempt,
  onRetry,
  onExit,
}: {
  quiz: Quiz
  attempt: QuizAttempt
  onRetry?: () => void
  onExit?: () => void
}) {
  const score = attempt.score || 0
  const passed = attempt.passed || false
  const totalPoints = quiz.questions.reduce((acc, q) => acc + q.points, 0)

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <div
          className={cn(
            'w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center',
            passed ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'
          )}
        >
          {passed ? (
            <Trophy className="h-12 w-12 text-emerald-500" />
          ) : (
            <XCircle className="h-12 w-12 text-red-500" />
          )}
        </div>
        <h2 className="text-2xl font-bold mb-2">
          {passed ? 'Congratulations!' : 'Keep Practicing!'}
        </h2>
        <p className="text-muted-foreground">
          {passed
            ? 'You passed the quiz!'
            : `You need ${quiz.passingScore}% to pass.`}
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">{score}%</div>
              <div className="text-sm text-muted-foreground">Your Score</div>
            </div>
            <div>
              <div className="text-3xl font-bold">
                {quiz.questions.filter((q, i) => {
                  const answer = attempt.answers[q.id]
                  if (q.type === 'multiple_choice' || q.type === 'true_false') {
                    const correctAnswer = q.answers?.find((a) => a.isCorrect)?.id || q.correctAnswer
                    return answer === correctAnswer
                  }
                  return false
                }).length}
                /{quiz.questions.length}
              </div>
              <div className="text-sm text-muted-foreground">Correct Answers</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{quiz.passingScore}%</div>
              <div className="text-sm text-muted-foreground">Passing Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {quiz.allowRetry && !passed && onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>
        )}
        {onExit && (
          <button
            onClick={onExit}
            className="flex items-center justify-center gap-2 px-6 py-3 border rounded-lg font-medium hover:bg-muted transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            Back to Course
          </button>
        )}
      </div>
    </div>
  )
}

// Main Quiz Engine Component
export function QuizEngine({ quiz, onComplete, onExit }: QuizEngineProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [flagged, setFlagged] = useState<Set<string>>(new Set())
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : null)
  const [showResults, setShowResults] = useState(false)
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)
  const [startTime] = useState(new Date())

  const questions = useMemo(() => {
    if (quiz.shuffleQuestions) {
      return [...quiz.questions].sort(() => Math.random() - 0.5)
    }
    return quiz.questions
  }, [quiz.questions, quiz.shuffleQuestions])

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswer = useCallback((questionId: string, answer: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }, [])

  const toggleFlag = useCallback((questionId: string) => {
    setFlagged((prev) => {
      const newFlagged = new Set(prev)
      if (newFlagged.has(questionId)) {
        newFlagged.delete(questionId)
      } else {
        newFlagged.add(questionId)
      }
      return newFlagged
    })
  }, [])

  const calculateScore = useCallback(() => {
    let correctPoints = 0
    const totalPoints = questions.reduce((acc, q) => acc + q.points, 0)

    questions.forEach((question) => {
      const answer = answers[question.id]

      switch (question.type) {
        case 'multiple_choice':
        case 'true_false': {
          const correctAnswer = question.answers?.find((a) => a.isCorrect)?.id || question.correctAnswer
          if (answer === correctAnswer) {
            correctPoints += question.points
          }
          break
        }
        case 'multiple_answer': {
          const selectedAnswers = (answer as string[]) || []
          const correctAnswers = question.answers?.filter((a) => a.isCorrect).map((a) => a.id) || []
          const allCorrect =
            selectedAnswers.length === correctAnswers.length &&
            selectedAnswers.every((a) => correctAnswers.includes(a))
          if (allCorrect) {
            correctPoints += question.points
          }
          break
        }
        case 'fill_blank': {
          const correctAnswer = (question.correctAnswer as string).toLowerCase().trim()
          if ((answer as string)?.toLowerCase().trim() === correctAnswer) {
            correctPoints += question.points
          }
          break
        }
      }
    })

    return Math.round((correctPoints / totalPoints) * 100)
  }, [answers, questions])

  const handleSubmit = useCallback(() => {
    const score = calculateScore()
    const passed = score >= quiz.passingScore

    // Calculate correct count
    let correctCount = 0
    questions.forEach((question) => {
      const answer = answers[question.id]
      switch (question.type) {
        case 'multiple_choice':
        case 'true_false': {
          const correctAnswer = question.answers?.find((a) => a.isCorrect)?.id || question.correctAnswer
          if (answer === correctAnswer) correctCount++
          break
        }
        case 'multiple_answer': {
          const selectedAnswers = (answer as string[]) || []
          const correctAnswers = question.answers?.filter((a) => a.isCorrect).map((a) => a.id) || []
          if (selectedAnswers.length === correctAnswers.length &&
              selectedAnswers.every((a) => correctAnswers.includes(a))) {
            correctCount++
          }
          break
        }
        case 'fill_blank': {
          const correctAnswer = (question.correctAnswer as string).toLowerCase().trim()
          if ((answer as string)?.toLowerCase().trim() === correctAnswer) correctCount++
          break
        }
      }
    })

    const newAttempt: QuizAttempt = {
      quizId: quiz.id,
      answers,
      startedAt: startTime,
      completedAt: new Date(),
      score,
      passed,
      correctCount,
      totalQuestions: questions.length,
    }

    setAttempt(newAttempt)
    setShowResults(true)
    onComplete?.(newAttempt)
  }, [answers, calculateScore, onComplete, questions, quiz.id, quiz.passingScore, startTime])

  const handleRetry = useCallback(() => {
    setAnswers({})
    setFlagged(new Set())
    setCurrentQuestionIndex(0)
    setShowResults(false)
    setAttempt(null)
  }, [])

  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / questions.length) * 100

  // Show results
  if (showResults && attempt) {
    return (
      <QuizResults
        quiz={quiz}
        attempt={attempt}
        onRetry={quiz.allowRetry ? handleRetry : undefined}
        onExit={onExit}
      />
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">{quiz.title}</h1>
          {timeRemaining !== null && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Progress value={progress} className="flex-1" />
          <span className="text-sm text-muted-foreground">
            {answeredCount}/{questions.length} answered
          </span>
        </div>
      </div>

      {/* Question Navigation */}
      <div className="mb-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex flex-wrap gap-2">
          {questions.map((q, index) => (
            <QuestionIndicator
              key={q.id}
              index={index}
              status={
                flagged.has(q.id)
                  ? 'flagged'
                  : answers[q.id] !== undefined
                  ? 'answered'
                  : 'unanswered'
              }
              isCurrent={index === currentQuestionIndex}
              onClick={() => setCurrentQuestionIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <Badge variant="outline" className="mb-2">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Badge>
            <CardTitle className="text-lg">
              {currentQuestion.type === 'fill_blank'
                ? 'Fill in the blank'
                : currentQuestion.text}
            </CardTitle>
          </div>
          <button
            onClick={() => toggleFlag(currentQuestion.id)}
            className={cn(
              'p-2 rounded-lg transition-colors',
              flagged.has(currentQuestion.id)
                ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30'
                : 'hover:bg-muted'
            )}
            title="Flag for review"
          >
            <Flag className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent>
          {currentQuestion.type === 'multiple_choice' && (
            <MultipleChoiceQuestion
              question={currentQuestion}
              selectedAnswer={answers[currentQuestion.id] as string}
              onSelect={(id) => handleAnswer(currentQuestion.id, id)}
            />
          )}
          {currentQuestion.type === 'multiple_answer' && (
            <MultipleAnswerQuestion
              question={currentQuestion}
              selectedAnswers={(answers[currentQuestion.id] as string[]) || []}
              onToggle={(id) => {
                const current = (answers[currentQuestion.id] as string[]) || []
                const updated = current.includes(id)
                  ? current.filter((a) => a !== id)
                  : [...current, id]
                handleAnswer(currentQuestion.id, updated)
              }}
            />
          )}
          {currentQuestion.type === 'true_false' && (
            <TrueFalseQuestion
              question={currentQuestion}
              selectedAnswer={answers[currentQuestion.id] as string}
              onSelect={(value) => handleAnswer(currentQuestion.id, value)}
            />
          )}
          {currentQuestion.type === 'fill_blank' && (
            <FillBlankQuestion
              question={currentQuestion}
              answer={(answers[currentQuestion.id] as string) || ''}
              onChange={(value) => handleAnswer(currentQuestion.id, value)}
            />
          )}
          {currentQuestion.type === 'short_answer' && (
            <ShortAnswerQuestion
              question={currentQuestion}
              answer={(answers[currentQuestion.id] as string) || ''}
              onChange={(value) => handleAnswer(currentQuestion.id, value)}
            />
          )}

          <div className="flex items-center gap-2 mt-4 pt-4 border-t text-sm text-muted-foreground">
            <span>Points: {currentQuestion.points}</span>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Flagged Warning */}
      {flagged.size > 0 && (
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
          <AlertCircle className="h-4 w-4" />
          You have {flagged.size} question{flagged.size > 1 ? 's' : ''} flagged for review
        </div>
      )}
    </div>
  )
}
