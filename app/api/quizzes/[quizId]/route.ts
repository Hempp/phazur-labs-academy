// Quiz Detail API
// Get specific quiz with questions

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(
    url && key &&
    !url.includes('placeholder') &&
    !url.includes('your-project') &&
    !key.includes('your-') &&
    key !== 'your-anon-key'
  )
}

// Full mock quiz with questions
const mockQuizzes: Record<string, {
  id: string
  course_id: string
  lesson_id: string | null
  title: string
  description: string
  time_limit: number
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
}> = {
  'quiz-1': {
    id: 'quiz-1',
    course_id: '1',
    lesson_id: 'l5',
    title: 'Compound Components Quiz',
    description: 'Test your understanding of the compound components pattern covered in this lesson.',
    time_limit: 15,
    passing_score: 70,
    shuffle_questions: true,
    allow_retry: true,
    show_results: true,
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
        correctAnswer: 'Compound components provide a more flexible and declarative API, allowing users to compose components in different ways without needing to understand internal implementation details.',
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
  },
  'quiz-2': {
    id: 'quiz-2',
    course_id: '1',
    lesson_id: 'l6',
    title: 'Custom Hooks Mastery',
    description: 'Demonstrate your knowledge of custom React hooks and their best practices.',
    time_limit: 20,
    passing_score: 75,
    shuffle_questions: false,
    allow_retry: true,
    show_results: true,
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        text: 'What is the primary purpose of custom hooks?',
        points: 10,
        answers: [
          { id: 'a1', text: 'To replace class components', isCorrect: false },
          { id: 'a2', text: 'To extract and reuse stateful logic between components', isCorrect: true },
          { id: 'a3', text: 'To improve rendering performance', isCorrect: false },
          { id: 'a4', text: 'To manage global state', isCorrect: false },
        ],
      },
      {
        id: 'q2',
        type: 'true_false',
        text: 'Custom hooks can only call other hooks at the top level.',
        points: 10,
        correctAnswer: 'true',
      },
      {
        id: 'q3',
        type: 'multiple_choice',
        text: 'Which hook would you typically use inside a custom hook for side effects?',
        points: 10,
        answers: [
          { id: 'a1', text: 'useState', isCorrect: false },
          { id: 'a2', text: 'useEffect', isCorrect: true },
          { id: 'a3', text: 'useMemo', isCorrect: false },
          { id: 'a4', text: 'useRef', isCorrect: false },
        ],
      },
      {
        id: 'q4',
        type: 'fill_blank',
        text: 'A custom hook that tracks window size would typically use a ___ listener.',
        points: 10,
        correctAnswer: 'resize',
      },
      {
        id: 'q5',
        type: 'multiple_answer',
        text: 'Which of the following are good practices for custom hooks? (Select all that apply)',
        points: 15,
        answers: [
          { id: 'a1', text: 'Start the name with "use"', isCorrect: true },
          { id: 'a2', text: 'Return an object or array with values and functions', isCorrect: true },
          { id: 'a3', text: 'Always use Redux inside', isCorrect: false },
          { id: 'a4', text: 'Handle cleanup in useEffect', isCorrect: true },
        ],
      },
      {
        id: 'q6',
        type: 'multiple_choice',
        text: 'If two components use the same custom hook, do they share the same state?',
        points: 10,
        answers: [
          { id: 'a1', text: 'Yes, always', isCorrect: false },
          { id: 'a2', text: 'No, each gets its own isolated state', isCorrect: true },
          { id: 'a3', text: 'Only if using Context', isCorrect: false },
          { id: 'a4', text: 'Depends on the hook implementation', isCorrect: false },
        ],
      },
      {
        id: 'q7',
        type: 'true_false',
        text: 'Custom hooks can return JSX elements.',
        points: 10,
        correctAnswer: 'false',
        explanation: 'While technically possible, hooks should return data and functions, not JSX. Returning JSX would make it a component.',
      },
      {
        id: 'q8',
        type: 'short_answer',
        text: 'Name one advantage of extracting logic into a custom hook instead of keeping it in the component.',
        points: 15,
        correctAnswer: 'Reusability - the logic can be shared across multiple components without duplication.',
      },
    ],
  },
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params

    // Return mock data if Supabase is not configured
    if (!isSupabaseConfigured()) {
      const quiz = mockQuizzes[quizId]

      if (!quiz) {
        return NextResponse.json(
          { error: 'Quiz not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ quiz })
    }

    const supabase = await createServerSupabaseClient()

    const { data: quiz, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .eq('is_published', true)
      .single()

    if (error || !quiz) {
      // Fallback to mock data if database has no quiz data
      const mockQuiz = mockQuizzes[quizId]
      if (mockQuiz) {
        console.log('Using mock quiz data for:', quizId)
        return NextResponse.json({ quiz: mockQuiz })
      }

      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ quiz })
  } catch (error) {
    console.error('Quiz GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
