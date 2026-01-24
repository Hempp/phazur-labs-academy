'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeft,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  Play,
  Loader2,
  Trophy,
  RotateCcw,
} from 'lucide-react'
import { QuizEngine, Quiz, QuizAttempt } from '@/components/quiz'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Transform API quiz format to QuizEngine format
function transformQuizData(apiQuiz: {
  id: string
  title: string
  description: string
  time_limit: number | null
  passing_score: number
  shuffle_questions: boolean
  allow_retry: boolean
  show_results: boolean
  questions: Array<{
    id: string
    type: string
    text: string
    points: number
    explanation?: string
    answers?: Array<{ id: string; text: string; isCorrect: boolean }>
    correctAnswer?: string | string[]
  }>
}): Quiz {
  return {
    id: apiQuiz.id,
    title: apiQuiz.title,
    description: apiQuiz.description,
    timeLimit: apiQuiz.time_limit || undefined,
    passingScore: apiQuiz.passing_score,
    shuffleQuestions: apiQuiz.shuffle_questions,
    allowRetry: apiQuiz.allow_retry,
    showResults: apiQuiz.show_results,
    questions: apiQuiz.questions.map((q) => ({
      id: q.id,
      type: q.type as Quiz['questions'][0]['type'],
      text: q.text,
      points: q.points,
      explanation: q.explanation,
      answers: q.answers,
      correctAnswer: q.correctAnswer,
    })),
  }
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const quizId = params.quizId as string

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedAttempt, setSavedAttempt] = useState<QuizAttempt | null>(null)

  // Previous attempts state
  const [previousAttempts, setPreviousAttempts] = useState<{
    bestScore: number | null
    attemptCount: number
    hasPassed: boolean
  }>({ bestScore: null, attemptCount: 0, hasPassed: false })

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/quizzes/${quizId}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError('Quiz not found')
          } else {
            setError('Failed to load quiz')
          }
          return
        }

        const data = await response.json()
        if (data.quiz) {
          setQuiz(transformQuizData(data.quiz))
        } else {
          setError('Quiz data is invalid')
        }
      } catch (err) {
        console.error('Error fetching quiz:', err)
        setError('Failed to load quiz')
      } finally {
        setLoading(false)
      }
    }

    const fetchAttempts = async () => {
      try {
        const response = await fetch(`/api/quizzes/${quizId}/attempts`)
        if (response.ok) {
          const data = await response.json()
          setPreviousAttempts({
            bestScore: data.bestScore,
            attemptCount: data.attemptCount,
            hasPassed: data.hasPassed,
          })
        }
      } catch (err) {
        console.error('Error fetching attempts:', err)
      }
    }

    fetchQuiz()
    fetchAttempts()
  }, [quizId])

  const handleComplete = async (completedAttempt: QuizAttempt) => {
    setSaving(true)

    try {
      const response = await fetch(`/api/quizzes/${quizId}/attempts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: completedAttempt.answers,
          score: completedAttempt.score,
          passed: completedAttempt.passed,
          startedAt: completedAttempt.startedAt,
          completedAt: completedAttempt.completedAt,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Quiz attempt saved:', data)
        setSavedAttempt(completedAttempt)

        // Update previous attempts
        setPreviousAttempts((prev) => ({
          bestScore: prev.bestScore
            ? Math.max(prev.bestScore, completedAttempt.score)
            : completedAttempt.score,
          attemptCount: prev.attemptCount + 1,
          hasPassed: prev.hasPassed || completedAttempt.passed,
        }))
      } else {
        console.error('Failed to save quiz attempt')
      }
    } catch (err) {
      console.error('Error saving quiz attempt:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleExit = () => {
    router.push(`/courses/${slug}/learn`)
  }

  const handleRetry = () => {
    setSavedAttempt(null)
    setHasStarted(false)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading quiz...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-background">
        <header className="h-14 border-b flex items-center px-4 bg-card">
          <Link
            href={`/courses/${slug}/learn`}
            className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Course
          </Link>
        </header>

        <div className="max-w-2xl mx-auto p-6 py-12 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Quiz Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || "The quiz you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            href={`/courses/${slug}/learn`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Return to Course
          </Link>
        </div>
      </div>
    )
  }

  // Pre-quiz instructions screen
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-background">
        <header className="h-14 border-b flex items-center px-4 bg-card">
          <Link
            href={`/courses/${slug}/learn`}
            className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Course
          </Link>
        </header>

        <div className="max-w-2xl mx-auto p-6 py-12">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">{quiz.title}</CardTitle>
              {previousAttempts.hasPassed && (
                <Badge className="mx-auto mt-2 bg-emerald-500 text-white">
                  <Trophy className="h-3 w-3 mr-1" />
                  Already Passed
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {quiz.description && (
                <p className="text-muted-foreground text-center">
                  {quiz.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <div className="text-2xl font-bold">{quiz.questions.length}</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <div className="text-2xl font-bold">{quiz.passingScore}%</div>
                  <div className="text-sm text-muted-foreground">Passing Score</div>
                </div>
                {quiz.timeLimit && (
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <div className="text-2xl font-bold flex items-center justify-center gap-1">
                      <Clock className="h-5 w-5" />
                      {quiz.timeLimit}
                    </div>
                    <div className="text-sm text-muted-foreground">Minutes</div>
                  </div>
                )}
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <div className="text-2xl font-bold">
                    {quiz.questions.reduce((acc, q) => acc + q.points, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Points</div>
                </div>
              </div>

              {/* Previous attempts info */}
              {previousAttempts.attemptCount > 0 && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Previous Attempts</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{previousAttempts.attemptCount} attempt{previousAttempts.attemptCount !== 1 ? 's' : ''}</span>
                    {previousAttempts.bestScore !== null && (
                      <span className={previousAttempts.bestScore >= quiz.passingScore ? 'text-emerald-600' : 'text-amber-600'}>
                        Best: {previousAttempts.bestScore}%
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-medium">Before you begin:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    You need to score at least {quiz.passingScore}% to pass
                  </li>
                  {quiz.timeLimit && (
                    <li className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-primary mt-0.5" />
                      You have {quiz.timeLimit} minutes to complete the quiz
                    </li>
                  )}
                  {quiz.allowRetry && (
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
                      You can retry the quiz if you don&apos;t pass
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
                    Make sure you have a stable internet connection
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={() => setHasStarted(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <Play className="h-5 w-5" />
                  {previousAttempts.attemptCount > 0 ? 'Retake Quiz' : 'Start Quiz'}
                </button>
                <button
                  onClick={handleExit}
                  className="w-full py-3 border rounded-lg font-medium hover:bg-muted transition-colors"
                >
                  Return to Lesson
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Quiz completed - show results overlay if attempt was saved
  if (savedAttempt && saving === false) {
    return (
      <div className="min-h-screen bg-background">
        <header className="h-14 border-b flex items-center justify-between px-4 bg-card">
          <div className="flex items-center gap-4">
            <span className="font-medium">{quiz.title}</span>
          </div>
        </header>

        <div className="max-w-2xl mx-auto p-6 py-12">
          <Card>
            <CardHeader className="text-center">
              <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                savedAttempt.passed ? 'bg-emerald-500/20' : 'bg-amber-500/20'
              }`}>
                {savedAttempt.passed ? (
                  <Trophy className="h-10 w-10 text-emerald-500" />
                ) : (
                  <RotateCcw className="h-10 w-10 text-amber-500" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {savedAttempt.passed ? 'Congratulations!' : 'Keep Practicing!'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground text-center">
                {savedAttempt.passed
                  ? 'You passed the quiz! Your progress has been saved.'
                  : `You scored ${savedAttempt.score}%. You need ${quiz.passingScore}% to pass.`}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <div className={`text-3xl font-bold ${
                    savedAttempt.passed ? 'text-emerald-500' : 'text-amber-500'
                  }`}>
                    {savedAttempt.score}%
                  </div>
                  <div className="text-sm text-muted-foreground">Your Score</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <div className="text-3xl font-bold">
                    {savedAttempt.correctCount}/{savedAttempt.totalQuestions}
                  </div>
                  <div className="text-sm text-muted-foreground">Correct Answers</div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                {!savedAttempt.passed && quiz.allowRetry && (
                  <button
                    onClick={handleRetry}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    <RotateCcw className="h-5 w-5" />
                    Try Again
                  </button>
                )}
                <button
                  onClick={handleExit}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    savedAttempt.passed
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border hover:bg-muted'
                  }`}
                >
                  Return to Lesson
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Active quiz
  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b flex items-center justify-between px-4 bg-card">
        <div className="flex items-center gap-4">
          <span className="font-medium">{quiz.title}</span>
          <Badge variant="outline">Quiz</Badge>
        </div>
        {saving && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </div>
        )}
      </header>

      <div className="p-4 md:p-6">
        <QuizEngine
          quiz={quiz}
          onComplete={handleComplete}
          onExit={handleExit}
        />
      </div>
    </div>
  )
}
