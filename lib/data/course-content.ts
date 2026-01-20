// Course Content Data - Sections, Lessons, Quizzes, and Assignments
// This provides the full educational content for each course

import type {
  CourseSection,
  Lesson,
  Quiz,
  Assignment,
  VideoContent,
} from '@/lib/types'

// ============================================
// COURSE 1: Advanced React Patterns
// ============================================

export const reactPatternsSections: CourseSection[] = [
  {
    id: 'section-react-1',
    course_id: 'course-1',
    title: 'Introduction to Design Patterns',
    description: 'Understanding the importance of patterns in React development',
    order: 1,
    lessons: [
      {
        id: 'lesson-react-1-1',
        section_id: 'section-react-1',
        title: 'Welcome & Course Overview',
        description: 'Get started with Advanced React Patterns',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/react-patterns/1-1-welcome.mp4',
        duration_minutes: 5,
        order: 1,
        is_preview: true,
        resources: [
          { id: 'res-1-1-1', lesson_id: 'lesson-react-1-1', title: 'Course Slides', type: 'pdf', url: '/resources/react-patterns/slides-intro.pdf' },
          { id: 'res-1-1-2', lesson_id: 'lesson-react-1-1', title: 'GitHub Repository', type: 'link', url: 'https://github.com/phazurlabs/react-patterns-course' },
        ],
      },
      {
        id: 'lesson-react-1-2',
        section_id: 'section-react-1',
        title: 'What are Design Patterns?',
        description: 'Learn about design patterns and why they matter',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/react-patterns/1-2-patterns.mp4',
        duration_minutes: 12,
        order: 2,
        is_preview: true,
        resources: [],
      },
      {
        id: 'lesson-react-1-3',
        section_id: 'section-react-1',
        title: 'Setting Up Your Environment',
        description: 'Configure your development environment',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/react-patterns/1-3-setup.mp4',
        duration_minutes: 10,
        order: 3,
        is_preview: false,
        resources: [
          { id: 'res-1-3-1', lesson_id: 'lesson-react-1-3', title: 'Starter Template', type: 'download', url: '/resources/react-patterns/starter-template.zip' },
        ],
      },
      {
        id: 'lesson-react-1-4',
        section_id: 'section-react-1',
        title: 'Quiz: Introduction to Patterns',
        description: 'Test your understanding of design patterns basics',
        type: 'quiz',
        duration_minutes: 10,
        order: 4,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-react-2',
    course_id: 'course-1',
    title: 'Compound Components Pattern',
    description: 'Build flexible component APIs with compound components',
    order: 2,
    lessons: [
      {
        id: 'lesson-react-2-1',
        section_id: 'section-react-2',
        title: 'Understanding Compound Components',
        description: 'Learn the theory behind compound components',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/react-patterns/2-1-compound-intro.mp4',
        duration_minutes: 15,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-react-2-2',
        section_id: 'section-react-2',
        title: 'Building a Tabs Component',
        description: 'Hands-on: Create a flexible tabs component',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/react-patterns/2-2-tabs.mp4',
        duration_minutes: 25,
        order: 2,
        is_preview: false,
        resources: [
          { id: 'res-2-2-1', lesson_id: 'lesson-react-2-2', title: 'Tabs Component Code', type: 'code', url: '/resources/react-patterns/tabs-component.tsx' },
        ],
      },
      {
        id: 'lesson-react-2-3',
        section_id: 'section-react-2',
        title: 'Building an Accordion Component',
        description: 'Hands-on: Create a compound accordion',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/react-patterns/2-3-accordion.mp4',
        duration_minutes: 20,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-react-2-4',
        section_id: 'section-react-2',
        title: 'Assignment: Build a Menu Component',
        description: 'Create a dropdown menu using compound components',
        type: 'assignment',
        duration_minutes: 60,
        order: 4,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-react-2-5',
        section_id: 'section-react-2',
        title: 'Quiz: Compound Components',
        description: 'Test your knowledge of compound components',
        type: 'quiz',
        duration_minutes: 15,
        order: 5,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-react-3',
    course_id: 'course-1',
    title: 'Render Props Pattern',
    description: 'Share code between components using render props',
    order: 3,
    lessons: [
      {
        id: 'lesson-react-3-1',
        section_id: 'section-react-3',
        title: 'What are Render Props?',
        description: 'Understanding the render props pattern',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/react-patterns/3-1-render-props.mp4',
        duration_minutes: 12,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-react-3-2',
        section_id: 'section-react-3',
        title: 'Building a Mouse Tracker',
        description: 'Practical example with render props',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/react-patterns/3-2-mouse-tracker.mp4',
        duration_minutes: 18,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-react-3-3',
        section_id: 'section-react-3',
        title: 'Assignment: Reusable Fetch Component',
        description: 'Build a data fetching component with render props',
        type: 'assignment',
        duration_minutes: 45,
        order: 3,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-react-4',
    course_id: 'course-1',
    title: 'Custom Hooks Pattern',
    description: 'Extract and share stateful logic with custom hooks',
    order: 4,
    lessons: [
      {
        id: 'lesson-react-4-1',
        section_id: 'section-react-4',
        title: 'Introduction to Custom Hooks',
        description: 'Why and when to create custom hooks',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/react-patterns/4-1-custom-hooks.mp4',
        duration_minutes: 10,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-react-4-2',
        section_id: 'section-react-4',
        title: 'Building useLocalStorage Hook',
        description: 'Create a hook for persistent state',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/react-patterns/4-2-localstorage.mp4',
        duration_minutes: 15,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-react-4-3',
        section_id: 'section-react-4',
        title: 'Building useDebounce Hook',
        description: 'Create a debounce hook for performance',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/react-patterns/4-3-debounce.mp4',
        duration_minutes: 12,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-react-4-4',
        section_id: 'section-react-4',
        title: 'Final Quiz: React Patterns Mastery',
        description: 'Comprehensive quiz covering all patterns',
        type: 'quiz',
        duration_minutes: 30,
        order: 4,
        is_preview: false,
        resources: [],
      },
    ],
  },
]

// ============================================
// COURSE 2: TypeScript Masterclass
// ============================================

export const typescriptSections: CourseSection[] = [
  {
    id: 'section-ts-1',
    course_id: 'course-2',
    title: 'TypeScript Fundamentals',
    description: 'Get started with TypeScript basics',
    order: 1,
    lessons: [
      {
        id: 'lesson-ts-1-1',
        section_id: 'section-ts-1',
        title: 'Welcome to TypeScript',
        description: 'Introduction to the course and TypeScript',
        type: 'video',
        duration_minutes: 8,
        order: 1,
        is_preview: true,
        resources: [],
      },
      {
        id: 'lesson-ts-1-2',
        section_id: 'section-ts-1',
        title: 'Setting Up TypeScript',
        description: 'Configure TypeScript in your project',
        type: 'video',
        duration_minutes: 15,
        order: 2,
        is_preview: true,
        resources: [],
      },
      {
        id: 'lesson-ts-1-3',
        section_id: 'section-ts-1',
        title: 'Basic Types',
        description: 'Learn about primitive and basic types',
        type: 'video',
        duration_minutes: 20,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-ts-1-4',
        section_id: 'section-ts-1',
        title: 'Quiz: TypeScript Basics',
        description: 'Test your TypeScript fundamentals',
        type: 'quiz',
        duration_minutes: 10,
        order: 4,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-ts-2',
    course_id: 'course-2',
    title: 'Advanced Types',
    description: 'Deep dive into TypeScript type system',
    order: 2,
    lessons: [
      {
        id: 'lesson-ts-2-1',
        section_id: 'section-ts-2',
        title: 'Union and Intersection Types',
        description: 'Combine types effectively',
        type: 'video',
        duration_minutes: 18,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-ts-2-2',
        section_id: 'section-ts-2',
        title: 'Generic Types',
        description: 'Create reusable type-safe components',
        type: 'video',
        duration_minutes: 25,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-ts-2-3',
        section_id: 'section-ts-2',
        title: 'Conditional Types',
        description: 'Build types that depend on other types',
        type: 'video',
        duration_minutes: 20,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-ts-2-4',
        section_id: 'section-ts-2',
        title: 'Assignment: Type Utility Library',
        description: 'Build your own type utilities',
        type: 'assignment',
        duration_minutes: 60,
        order: 4,
        is_preview: false,
        resources: [],
      },
    ],
  },
]

// ============================================
// QUIZZES
// ============================================

export const quizzes: Quiz[] = [
  // React Patterns Quiz 1 - Introduction
  {
    id: 'quiz-react-intro',
    lesson_id: 'lesson-react-1-4',
    course_id: 'course-1',
    title: 'Introduction to Design Patterns Quiz',
    description: 'Test your understanding of React design patterns fundamentals',
    time_limit_minutes: 10,
    passing_score: 70,
    max_attempts: 3,
    shuffle_questions: true,
    show_correct_answers: true,
    questions: [
      {
        id: 'q-react-1-1',
        quiz_id: 'quiz-react-intro',
        question: 'What is the main benefit of using design patterns in React?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-1-1-1', question_id: 'q-react-1-1', text: 'They make code run faster', is_correct: false },
          { id: 'opt-1-1-2', question_id: 'q-react-1-1', text: 'They provide reusable solutions to common problems', is_correct: true },
          { id: 'opt-1-1-3', question_id: 'q-react-1-1', text: 'They are required by React', is_correct: false },
          { id: 'opt-1-1-4', question_id: 'q-react-1-1', text: 'They automatically fix bugs', is_correct: false },
        ],
        explanation: 'Design patterns provide proven, reusable solutions to common software design problems, making code more maintainable and scalable.',
        points: 10,
        order: 1,
      },
      {
        id: 'q-react-1-2',
        quiz_id: 'quiz-react-intro',
        question: 'React Hooks were introduced in React version 16.8',
        question_type: 'true_false',
        options: [
          { id: 'opt-1-2-1', question_id: 'q-react-1-2', text: 'True', is_correct: true },
          { id: 'opt-1-2-2', question_id: 'q-react-1-2', text: 'False', is_correct: false },
        ],
        explanation: 'React Hooks were officially released in React 16.8 in February 2019, revolutionizing how we write functional components.',
        points: 10,
        order: 2,
      },
      {
        id: 'q-react-1-3',
        quiz_id: 'quiz-react-intro',
        question: 'Which pattern allows components to share logic without using inheritance?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-1-3-1', question_id: 'q-react-1-3', text: 'Class components', is_correct: false },
          { id: 'opt-1-3-2', question_id: 'q-react-1-3', text: 'Composition', is_correct: true },
          { id: 'opt-1-3-3', question_id: 'q-react-1-3', text: 'Inheritance', is_correct: false },
          { id: 'opt-1-3-4', question_id: 'q-react-1-3', text: 'Prototypes', is_correct: false },
        ],
        explanation: 'React favors composition over inheritance. Composition allows you to build complex UIs from smaller, reusable pieces.',
        points: 10,
        order: 3,
      },
      {
        id: 'q-react-1-4',
        quiz_id: 'quiz-react-intro',
        question: 'Which of the following are benefits of using design patterns? (Select all that apply)',
        question_type: 'multiple_select',
        options: [
          { id: 'opt-1-4-1', question_id: 'q-react-1-4', text: 'Improved code readability', is_correct: true },
          { id: 'opt-1-4-2', question_id: 'q-react-1-4', text: 'Easier maintenance', is_correct: true },
          { id: 'opt-1-4-3', question_id: 'q-react-1-4', text: 'Guaranteed performance', is_correct: false },
          { id: 'opt-1-4-4', question_id: 'q-react-1-4', text: 'Better team communication', is_correct: true },
        ],
        explanation: 'Design patterns improve readability, maintenance, and team communication by providing a shared vocabulary. However, they dont automatically guarantee performance.',
        points: 15,
        order: 4,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // React Patterns Quiz 2 - Compound Components
  {
    id: 'quiz-react-compound',
    lesson_id: 'lesson-react-2-5',
    course_id: 'course-1',
    title: 'Compound Components Quiz',
    description: 'Test your understanding of the compound components pattern',
    time_limit_minutes: 15,
    passing_score: 70,
    max_attempts: 3,
    shuffle_questions: true,
    show_correct_answers: true,
    questions: [
      {
        id: 'q-react-2-1',
        quiz_id: 'quiz-react-compound',
        question: 'What is the main purpose of compound components?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-2-1-1', question_id: 'q-react-2-1', text: 'To create faster components', is_correct: false },
          { id: 'opt-2-1-2', question_id: 'q-react-2-1', text: 'To provide flexible, declarative APIs', is_correct: true },
          { id: 'opt-2-1-3', question_id: 'q-react-2-1', text: 'To replace hooks', is_correct: false },
          { id: 'opt-2-1-4', question_id: 'q-react-2-1', text: 'To avoid using state', is_correct: false },
        ],
        explanation: 'Compound components provide flexible, declarative APIs that allow consumers to arrange and control components without prop drilling.',
        points: 10,
        order: 1,
      },
      {
        id: 'q-react-2-2',
        quiz_id: 'quiz-react-compound',
        question: 'Which React feature is commonly used to share state between compound component children?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-2-2-1', question_id: 'q-react-2-2', text: 'Redux', is_correct: false },
          { id: 'opt-2-2-2', question_id: 'q-react-2-2', text: 'Local Storage', is_correct: false },
          { id: 'opt-2-2-3', question_id: 'q-react-2-2', text: 'React Context', is_correct: true },
          { id: 'opt-2-2-4', question_id: 'q-react-2-2', text: 'Props only', is_correct: false },
        ],
        explanation: 'React Context is the preferred way to share state between compound component children without explicit prop passing.',
        points: 10,
        order: 2,
      },
      {
        id: 'q-react-2-3',
        quiz_id: 'quiz-react-compound',
        question: 'In a compound component, child components can access parent state without explicit props.',
        question_type: 'true_false',
        options: [
          { id: 'opt-2-3-1', question_id: 'q-react-2-3', text: 'True', is_correct: true },
          { id: 'opt-2-3-2', question_id: 'q-react-2-3', text: 'False', is_correct: false },
        ],
        explanation: 'Through Context, child components in a compound component pattern can access shared state without explicit prop drilling.',
        points: 10,
        order: 3,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // TypeScript Quiz 1
  {
    id: 'quiz-ts-basics',
    lesson_id: 'lesson-ts-1-4',
    course_id: 'course-2',
    title: 'TypeScript Basics Quiz',
    description: 'Test your TypeScript fundamentals knowledge',
    time_limit_minutes: 10,
    passing_score: 70,
    max_attempts: 3,
    shuffle_questions: true,
    show_correct_answers: true,
    questions: [
      {
        id: 'q-ts-1-1',
        quiz_id: 'quiz-ts-basics',
        question: 'What does TypeScript compile to?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-ts-1-1-1', question_id: 'q-ts-1-1', text: 'Machine code', is_correct: false },
          { id: 'opt-ts-1-1-2', question_id: 'q-ts-1-1', text: 'JavaScript', is_correct: true },
          { id: 'opt-ts-1-1-3', question_id: 'q-ts-1-1', text: 'WebAssembly', is_correct: false },
          { id: 'opt-ts-1-1-4', question_id: 'q-ts-1-1', text: 'Java', is_correct: false },
        ],
        explanation: 'TypeScript is a superset of JavaScript that compiles (transpiles) to plain JavaScript.',
        points: 10,
        order: 1,
      },
      {
        id: 'q-ts-1-2',
        quiz_id: 'quiz-ts-basics',
        question: 'Which keyword is used to define a type alias in TypeScript?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-ts-1-2-1', question_id: 'q-ts-1-2', text: 'typedef', is_correct: false },
          { id: 'opt-ts-1-2-2', question_id: 'q-ts-1-2', text: 'type', is_correct: true },
          { id: 'opt-ts-1-2-3', question_id: 'q-ts-1-2', text: 'alias', is_correct: false },
          { id: 'opt-ts-1-2-4', question_id: 'q-ts-1-2', text: 'define', is_correct: false },
        ],
        explanation: 'The "type" keyword is used to create type aliases in TypeScript.',
        points: 10,
        order: 2,
      },
      {
        id: 'q-ts-1-3',
        quiz_id: 'quiz-ts-basics',
        question: 'TypeScript type checking happens at runtime.',
        question_type: 'true_false',
        options: [
          { id: 'opt-ts-1-3-1', question_id: 'q-ts-1-3', text: 'True', is_correct: false },
          { id: 'opt-ts-1-3-2', question_id: 'q-ts-1-3', text: 'False', is_correct: true },
        ],
        explanation: 'TypeScript type checking happens at compile time, not runtime. All type information is erased when compiled to JavaScript.',
        points: 10,
        order: 3,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// ============================================
// ASSIGNMENTS
// ============================================

export const assignments: Assignment[] = [
  // React Patterns Assignment 1
  {
    id: 'assignment-react-menu',
    lesson_id: 'lesson-react-2-4',
    course_id: 'course-1',
    title: 'Build a Menu Component',
    description: 'Create a flexible dropdown menu using the compound components pattern',
    instructions: `## Objective
Create a reusable Menu component using the Compound Components pattern learned in this section.

## Requirements

### Component Structure
Your implementation should include:
- \`Menu\` - The root component that manages state
- \`Menu.Button\` - The trigger button
- \`Menu.Items\` - Container for menu items
- \`Menu.Item\` - Individual clickable item

### Functionality
1. **Toggle Behavior**: The menu should open/close when the button is clicked
2. **Click Outside**: Close the menu when clicking outside
3. **Keyboard Support**:
   - \`Escape\` closes the menu
   - \`Enter\` or \`Space\` on an item selects it
   - \`Arrow Down/Up\` navigates between items
4. **Accessibility**:
   - Proper ARIA attributes (\`aria-expanded\`, \`aria-haspopup\`, etc.)
   - Focus management

### Example Usage
\`\`\`tsx
<Menu>
  <Menu.Button>Options</Menu.Button>
  <Menu.Items>
    <Menu.Item onClick={() => console.log('Edit')}>Edit</Menu.Item>
    <Menu.Item onClick={() => console.log('Delete')}>Delete</Menu.Item>
    <Menu.Item disabled>Archive</Menu.Item>
  </Menu.Items>
</Menu>
\`\`\`

## Bonus Points
- Add animation for open/close transitions
- Support different positioning (top, bottom, left, right)
- Implement nested menus (sub-menus)

## Submission Guidelines
1. Create a GitHub repository or CodeSandbox
2. Include a README with setup instructions
3. Provide example usage in your submission
4. Submit the link below`,
    due_days_after_enrollment: 7,
    max_score: 100,
    submission_types: ['url', 'file'],
    allowed_file_types: ['.zip', '.tsx', '.jsx'],
    max_file_size_mb: 10,
    rubric: [
      { id: 'rubric-menu-1', criteria: 'Component Architecture', description: 'Proper compound component structure with Context', max_points: 25 },
      { id: 'rubric-menu-2', criteria: 'Core Functionality', description: 'Toggle, click outside, keyboard navigation work correctly', max_points: 30 },
      { id: 'rubric-menu-3', criteria: 'Accessibility', description: 'Proper ARIA attributes and focus management', max_points: 25 },
      { id: 'rubric-menu-4', criteria: 'Code Quality', description: 'Clean, typed, well-organized code', max_points: 20 },
    ],
    resources: [
      { id: 'res-menu-1', title: 'Starter Template', type: 'template', url: '/resources/assignments/menu-starter.zip' },
      { id: 'res-menu-2', title: 'WAI-ARIA Menu Pattern', type: 'link', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/' },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // React Patterns Assignment 2
  {
    id: 'assignment-react-fetch',
    lesson_id: 'lesson-react-3-3',
    course_id: 'course-1',
    title: 'Build a Reusable Fetch Component',
    description: 'Create a data fetching component using the render props pattern',
    instructions: `## Objective
Build a reusable \`Fetch\` component that handles data fetching and exposes loading, error, and data states to its children via render props.

## Requirements

### Component Props
\`\`\`tsx
interface FetchProps<T> {
  url: string
  options?: RequestInit
  children: (state: FetchState<T>) => React.ReactNode
}

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => void
}
\`\`\`

### Features
1. **Loading State**: Show loading state while fetching
2. **Error Handling**: Properly handle and expose errors
3. **Data Typing**: Support generic types for response data
4. **Refetch**: Provide a refetch function
5. **Abort**: Cancel requests on unmount or URL change

### Example Usage
\`\`\`tsx
<Fetch<User[]> url="/api/users">
  {({ data, loading, error, refetch }) => {
    if (loading) return <Spinner />
    if (error) return <Error message={error.message} />
    return (
      <>
        <UserList users={data} />
        <button onClick={refetch}>Refresh</button>
      </>
    )
  }}
</Fetch>
\`\`\`

## Bonus Points
- Add caching support
- Implement polling/interval refetch
- Add retry logic for failed requests

## Submission
Submit a GitHub repository link with your implementation.`,
    due_days_after_enrollment: 5,
    max_score: 100,
    submission_types: ['url'],
    rubric: [
      { id: 'rubric-fetch-1', criteria: 'Render Props Implementation', description: 'Correct render props pattern usage', max_points: 25 },
      { id: 'rubric-fetch-2', criteria: 'State Management', description: 'Proper handling of loading, error, data states', max_points: 30 },
      { id: 'rubric-fetch-3', criteria: 'TypeScript Usage', description: 'Proper generics and type safety', max_points: 25 },
      { id: 'rubric-fetch-4', criteria: 'Edge Cases', description: 'Abort, cleanup, error handling', max_points: 20 },
    ],
    resources: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // TypeScript Assignment
  {
    id: 'assignment-ts-utilities',
    lesson_id: 'lesson-ts-2-4',
    course_id: 'course-2',
    title: 'Build a Type Utility Library',
    description: 'Create custom TypeScript utility types',
    instructions: `## Objective
Build a collection of custom TypeScript utility types that solve real-world typing problems.

## Required Types

### 1. DeepReadonly<T>
Make all nested properties readonly:
\`\`\`tsx
type Original = { a: { b: { c: number } } }
type Result = DeepReadonly<Original>
// { readonly a: { readonly b: { readonly c: number } } }
\`\`\`

### 2. DeepPartial<T>
Make all nested properties optional:
\`\`\`tsx
type Result = DeepPartial<{ a: { b: number } }>
// { a?: { b?: number } }
\`\`\`

### 3. PickByType<T, U>
Pick properties of a certain type:
\`\`\`tsx
type Result = PickByType<{ a: string, b: number, c: string }, string>
// { a: string, c: string }
\`\`\`

### 4. Mutable<T>
Remove readonly from all properties:
\`\`\`tsx
type Result = Mutable<{ readonly a: string }>
// { a: string }
\`\`\`

### 5. RequiredKeys<T>
Get union of required keys:
\`\`\`tsx
type Result = RequiredKeys<{ a: string, b?: number }>
// "a"
\`\`\`

## Bonus Types
- \`Flatten<T>\` - Flatten nested objects
- \`UnionToIntersection<U>\` - Convert union to intersection
- \`TupleToUnion<T>\` - Convert tuple to union type

## Submission
Submit a TypeScript file with all utility types and test cases.`,
    due_days_after_enrollment: 10,
    max_score: 100,
    submission_types: ['file', 'url'],
    allowed_file_types: ['.ts', '.tsx'],
    rubric: [
      { id: 'rubric-ts-1', criteria: 'Required Types', description: 'All 5 required types implemented correctly', max_points: 50 },
      { id: 'rubric-ts-2', criteria: 'Type Safety', description: 'Types are properly constrained and safe', max_points: 25 },
      { id: 'rubric-ts-3', criteria: 'Bonus Types', description: 'Additional utility types implemented', max_points: 15 },
      { id: 'rubric-ts-4', criteria: 'Test Cases', description: 'Comprehensive test cases provided', max_points: 10 },
    ],
    resources: [
      { id: 'res-ts-1', title: 'TypeScript Utility Types Docs', type: 'link', url: 'https://www.typescriptlang.org/docs/handbook/utility-types.html' },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// ============================================
// VIDEO CONTENT (Generated with HeyGen)
// ============================================

export const videoContent: VideoContent[] = [
  {
    id: 'video-react-1-1',
    lesson_id: 'lesson-react-1-1',
    title: 'Welcome & Course Overview',
    description: 'Introduction to Advanced React Patterns course',
    script: `Hello and welcome to Advanced React Patterns and Best Practices!

I'm Sarah, and I'll be your instructor throughout this course. I'm a Senior Software Engineer with over 10 years of experience building React applications at scale.

In this course, you'll learn the patterns that separate good React developers from great ones:

First, we'll explore Compound Components, a pattern that lets you build flexible, declarative component APIs. Think of components like HTML's select and option elements.

Next, we'll dive into Render Props, a powerful technique for sharing code between components without inheritance.

Then, we'll master Custom Hooks, learning how to extract and share stateful logic across your entire application.

Throughout the course, you'll work on hands-on projects and assignments that reinforce what you learn. By the end, you'll have the skills to architect scalable React applications with confidence.

Before we begin, make sure you're comfortable with React basics, including functional components and the useState and useEffect hooks.

Let's get started on this exciting journey!`,
    avatar_id: 'anna_costume1_front',
    avatar_name: 'Anna - Professional',
    voice_id: 'en-US-AnnaNeural',
    status: 'ready',
    video_url: 'https://cdn.phazurlabs.com/videos/react-patterns/1-1-welcome.mp4',
    thumbnail_url: '/thumbnails/react-1-1.jpg',
    duration_seconds: 180,
    heygen_video_id: 'heygen-react-1-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'video-react-1-2',
    lesson_id: 'lesson-react-1-2',
    title: 'What are Design Patterns?',
    description: 'Understanding design patterns in software development',
    script: `Let's talk about design patterns and why they're so important in React development.

A design pattern is a reusable solution to a commonly occurring problem in software design. Think of it as a template or blueprint that you can customize to solve a particular design problem in your code.

Design patterns aren't specific to any programming language. They're concepts that experienced developers have identified over decades of building software.

In React specifically, patterns help us solve problems like:
- How do we share logic between components without code duplication?
- How do we build components with flexible, intuitive APIs?
- How do we manage complex state across our application?

The patterns we'll learn in this course have been battle-tested by thousands of developers in production applications. Companies like Facebook, Airbnb, and Netflix use these exact patterns.

Here's why patterns matter: When you join a new team or project that uses these patterns, you'll immediately understand the architecture. It's like speaking a shared language with other developers.

Remember, patterns are guidelines, not rules. You should always consider your specific use case and adapt patterns to fit your needs.

In the next lesson, we'll set up our development environment so you can follow along with the hands-on examples.`,
    avatar_id: 'anna_costume1_front',
    avatar_name: 'Anna - Professional',
    voice_id: 'en-US-AnnaNeural',
    status: 'ready',
    video_url: 'https://cdn.phazurlabs.com/videos/react-patterns/1-2-patterns.mp4',
    thumbnail_url: '/thumbnails/react-1-2.jpg',
    duration_seconds: 240,
    heygen_video_id: 'heygen-react-1-2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'video-ts-1-1',
    lesson_id: 'lesson-ts-1-1',
    title: 'Welcome to TypeScript',
    description: 'Introduction to TypeScript course',
    script: `Welcome to the TypeScript Masterclass!

I'm Michael, and I'll guide you from TypeScript beginner to expert. I've spent years working with TypeScript at Google and I'm excited to share everything I've learned.

TypeScript is a game-changer for JavaScript development. It's a superset of JavaScript that adds static typing to the language. This means you can catch bugs before your code even runs.

Here's what you'll learn in this course:

We'll start with the fundamentals: basic types, interfaces, and type inference. Even if you've never used TypeScript, you'll be writing typed code by the end of the first section.

Then we'll level up with advanced types: generics, conditional types, mapped types, and template literal types. This is where TypeScript really shines.

Finally, we'll apply everything to real-world scenarios: typing React components, working with APIs, and building type-safe libraries.

By the end of this course, you won't just know TypeScript syntax. You'll understand the type system deeply enough to solve any typing challenge you encounter.

The only prerequisite is JavaScript knowledge. If you can write JavaScript, you're ready for TypeScript.

Let's transform how you write code!`,
    avatar_id: 'josh_lite3_front',
    avatar_name: 'Josh - Friendly',
    voice_id: 'en-US-JoshNeural',
    status: 'ready',
    video_url: 'https://cdn.phazurlabs.com/videos/typescript/1-1-welcome.mp4',
    thumbnail_url: '/thumbnails/ts-1-1.jpg',
    duration_seconds: 160,
    heygen_video_id: 'heygen-ts-1-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getSectionsByCourseId(courseId: string): CourseSection[] {
  switch (courseId) {
    case 'course-1':
      return reactPatternsSections
    case 'course-2':
      return typescriptSections
    default:
      return []
  }
}

export function getQuizByLessonId(lessonId: string): Quiz | undefined {
  return quizzes.find(q => q.lesson_id === lessonId)
}

export function getAssignmentByLessonId(lessonId: string): Assignment | undefined {
  return assignments.find(a => a.lesson_id === lessonId)
}

export function getVideoContentByLessonId(lessonId: string): VideoContent | undefined {
  return videoContent.find(v => v.lesson_id === lessonId)
}

export function getQuizzesByCourseId(courseId: string): Quiz[] {
  return quizzes.filter(q => q.course_id === courseId)
}

export function getAssignmentsByCourseId(courseId: string): Assignment[] {
  return assignments.filter(a => a.course_id === courseId)
}
