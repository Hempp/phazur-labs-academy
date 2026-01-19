'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeft,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  Play,
} from 'lucide-react'
import { QuizEngine, Quiz, QuizAttempt } from '@/components/quiz'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Mock quiz data
const mockQuiz: Quiz = {
  id: 'quiz-1',
  title: 'React Patterns Quiz',
  description: 'Test your understanding of the compound components pattern and custom hooks concepts covered in this module.',
  timeLimit: 15,
  passingScore: 70,
  shuffleQuestions: true,
  showResults: true,
  allowRetry: true,
  questions: [
    {
      id: 'q1',
      type: 'multiple_choice',
      text: 'What is the main benefit of the Compound Components pattern?',
      points: 10,
      explanation: 'Compound components allow for flexible, implicit state sharing between related components.',
      answers: [
        { id: 'a1', text: 'Better performance through memoization', isCorrect: false },
        { id: 'a2', text: 'Flexible component API with implicit state sharing', isCorrect: true },
        { id: 'a3', text: 'Reduced bundle size', isCorrect: false },
        { id: 'a4', text: 'Automatic error boundaries', isCorrect: false },
      ],
    },
    {
      id: 'q2',
      type: 'multiple_choice',
      text: 'Which React API is commonly used in Compound Components to share state?',
      points: 10,
      answers: [
        { id: 'a1', text: 'React.memo', isCorrect: false },
        { id: 'a2', text: 'React.forwardRef', isCorrect: false },
        { id: 'a3', text: 'React.createContext', isCorrect: true },
        { id: 'a4', text: 'React.lazy', isCorrect: false },
      ],
    },
    {
      id: 'q3',
      type: 'true_false',
      text: 'Custom hooks must always start with the word "use".',
      points: 10,
      correctAnswer: 'true',
      explanation: 'This is a convention that React follows to identify hooks and apply the rules of hooks.',
    },
    {
      id: 'q4',
      type: 'multiple_answer',
      text: 'Which of the following are valid use cases for custom hooks? (Select all that apply)',
      points: 15,
      answers: [
        { id: 'a1', text: 'Encapsulating fetch logic', isCorrect: true },
        { id: 'a2', text: 'Managing form state', isCorrect: true },
        { id: 'a3', text: 'Rendering JSX directly', isCorrect: false },
        { id: 'a4', text: 'Subscribing to browser events', isCorrect: true },
      ],
    },
    {
      id: 'q5',
      type: 'fill_blank',
      text: 'The ___ hook is used to access context values in a functional component.',
      points: 10,
      correctAnswer: 'useContext',
    },
    {
      id: 'q6',
      type: 'multiple_choice',
      text: 'What happens when you call a hook conditionally?',
      points: 10,
      answers: [
        { id: 'a1', text: 'It works fine as long as you memoize it', isCorrect: false },
        { id: 'a2', text: 'React throws an error due to rules of hooks', isCorrect: true },
        { id: 'a3', text: 'It automatically becomes an effect', isCorrect: false },
        { id: 'a4', text: 'It only runs on the first render', isCorrect: false },
      ],
    },
    {
      id: 'q7',
      type: 'multiple_choice',
      text: 'In the Compound Components pattern, how does a child component typically access shared state?',
      points: 10,
      answers: [
        { id: 'a1', text: 'Through props drilling', isCorrect: false },
        { id: 'a2', text: 'Through Redux store', isCorrect: false },
        { id: 'a3', text: 'Through React Context', isCorrect: true },
        { id: 'a4', text: 'Through local storage', isCorrect: false },
      ],
    },
    {
      id: 'q8',
      type: 'true_false',
      text: 'The useCallback hook returns a memoized callback function.',
      points: 10,
      correctAnswer: 'true',
    },
    {
      id: 'q9',
      type: 'short_answer',
      text: 'Briefly explain why you might choose the Compound Components pattern over a single component with many props.',
      points: 15,
      correctAnswer: 'Compound components provide a more flexible and declarative API, allowing users to compose components in different ways without needing to understand internal implementation details. It reduces prop drilling and makes the code more readable.',
    },
    {
      id: 'q10',
      type: 'multiple_choice',
      text: 'Which approach would you use to iterate over children and clone them with additional props?',
      points: 10,
      answers: [
        { id: 'a1', text: 'Array.map()', isCorrect: false },
        { id: 'a2', text: 'React.Children.map() with React.cloneElement()', isCorrect: true },
        { id: 'a3', text: 'Object.values()', isCorrect: false },
        { id: 'a4', text: 'for...of loop', isCorrect: false },
      ],
    },
  ],
}

const mockCourse = {
  slug: 'advanced-react-patterns',
  title: 'Advanced React Patterns',
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const [hasStarted, setHasStarted] = useState(false)
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)

  const handleComplete = (completedAttempt: QuizAttempt) => {
    setAttempt(completedAttempt)
    // Would save to API here
    console.log('Quiz completed:', completedAttempt)
  }

  const handleExit = () => {
    router.push(`/courses/${mockCourse.slug}/learn`)
  }

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-background">
        <header className="h-14 border-b flex items-center px-4 bg-card">
          <Link
            href={`/courses/${mockCourse.slug}/learn`}
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
              <CardTitle className="text-2xl">{mockQuiz.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {mockQuiz.description && (
                <p className="text-muted-foreground text-center">
                  {mockQuiz.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <div className="text-2xl font-bold">{mockQuiz.questions.length}</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <div className="text-2xl font-bold">{mockQuiz.passingScore}%</div>
                  <div className="text-sm text-muted-foreground">Passing Score</div>
                </div>
                {mockQuiz.timeLimit && (
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <div className="text-2xl font-bold flex items-center justify-center gap-1">
                      <Clock className="h-5 w-5" />
                      {mockQuiz.timeLimit}
                    </div>
                    <div className="text-sm text-muted-foreground">Minutes</div>
                  </div>
                )}
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <div className="text-2xl font-bold">
                    {mockQuiz.questions.reduce((acc, q) => acc + q.points, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Points</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Before you begin:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    You need to score at least {mockQuiz.passingScore}% to pass
                  </li>
                  {mockQuiz.timeLimit && (
                    <li className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-primary mt-0.5" />
                      You have {mockQuiz.timeLimit} minutes to complete the quiz
                    </li>
                  )}
                  {mockQuiz.allowRetry && (
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
                  Start Quiz
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

  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b flex items-center justify-between px-4 bg-card">
        <div className="flex items-center gap-4">
          <span className="font-medium">{mockQuiz.title}</span>
          <Badge variant="outline">{mockCourse.title}</Badge>
        </div>
      </header>

      <div className="p-4 md:p-6">
        <QuizEngine
          quiz={mockQuiz}
          onComplete={handleComplete}
          onExit={handleExit}
        />
      </div>
    </div>
  )
}
