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
// COURSE 3: Node.js Backend Development
// ============================================

export const nodejsSections: CourseSection[] = [
  {
    id: 'section-node-1',
    course_id: 'course-3',
    title: 'Getting Started with Node.js',
    description: 'Introduction to Node.js and setting up your environment',
    order: 1,
    lessons: [
      {
        id: 'lesson-node-1-1',
        section_id: 'section-node-1',
        title: 'Welcome to Node.js Development',
        description: 'Course overview and introduction to backend development',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nodejs/1-1-welcome.mp4',
        duration_minutes: 8,
        order: 1,
        is_preview: true,
        resources: [
          { id: 'res-node-1-1-1', lesson_id: 'lesson-node-1-1', title: 'Course Resources', type: 'pdf', url: '/resources/nodejs/course-resources.pdf' },
          { id: 'res-node-1-1-2', lesson_id: 'lesson-node-1-1', title: 'GitHub Repo', type: 'link', url: 'https://github.com/phazurlabs/nodejs-course' },
        ],
      },
      {
        id: 'lesson-node-1-2',
        section_id: 'section-node-1',
        title: 'What is Node.js?',
        description: 'Understanding Node.js architecture and event loop',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nodejs/1-2-what-is-node.mp4',
        duration_minutes: 15,
        order: 2,
        is_preview: true,
        resources: [],
      },
      {
        id: 'lesson-node-1-3',
        section_id: 'section-node-1',
        title: 'Setting Up Your Development Environment',
        description: 'Installing Node.js, npm, and essential tools',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nodejs/1-3-setup.mp4',
        duration_minutes: 12,
        order: 3,
        is_preview: false,
        resources: [
          { id: 'res-node-1-3-1', lesson_id: 'lesson-node-1-3', title: 'Setup Guide', type: 'pdf', url: '/resources/nodejs/setup-guide.pdf' },
        ],
      },
      {
        id: 'lesson-node-1-4',
        section_id: 'section-node-1',
        title: 'Your First Node.js Application',
        description: 'Creating and running a simple Node.js program',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nodejs/1-4-first-app.mp4',
        duration_minutes: 18,
        order: 4,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-node-1-5',
        section_id: 'section-node-1',
        title: 'Quiz: Node.js Fundamentals',
        description: 'Test your understanding of Node.js basics',
        type: 'quiz',
        duration_minutes: 10,
        order: 5,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-node-2',
    course_id: 'course-3',
    title: 'Node.js Core Modules',
    description: 'Working with built-in Node.js modules',
    order: 2,
    lessons: [
      {
        id: 'lesson-node-2-1',
        section_id: 'section-node-2',
        title: 'File System Module (fs)',
        description: 'Reading and writing files with Node.js',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nodejs/2-1-fs.mp4',
        duration_minutes: 22,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-node-2-2',
        section_id: 'section-node-2',
        title: 'Path Module',
        description: 'Working with file paths across platforms',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nodejs/2-2-path.mp4',
        duration_minutes: 12,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-node-2-3',
        section_id: 'section-node-2',
        title: 'HTTP Module',
        description: 'Creating a basic HTTP server',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nodejs/2-3-http.mp4',
        duration_minutes: 25,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-node-2-4',
        section_id: 'section-node-2',
        title: 'Events and EventEmitter',
        description: 'Understanding event-driven programming',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nodejs/2-4-events.mp4',
        duration_minutes: 18,
        order: 4,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-node-2-5',
        section_id: 'section-node-2',
        title: 'Assignment: CLI File Manager',
        description: 'Build a command-line file manager',
        type: 'assignment',
        duration_minutes: 60,
        order: 5,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-node-3',
    course_id: 'course-3',
    title: 'Express.js Framework',
    description: 'Building web applications with Express',
    order: 3,
    lessons: [
      {
        id: 'lesson-node-3-1',
        section_id: 'section-node-3',
        title: 'Introduction to Express.js',
        description: 'What is Express and why use it',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nodejs/3-1-express-intro.mp4',
        duration_minutes: 15,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-node-3-2',
        section_id: 'section-node-3',
        title: 'Routing in Express',
        description: 'Creating routes and handling requests',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nodejs/3-2-routing.mp4',
        duration_minutes: 25,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-node-3-3',
        section_id: 'section-node-3',
        title: 'Middleware',
        description: 'Understanding and creating middleware',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nodejs/3-3-middleware.mp4',
        duration_minutes: 28,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-node-3-4',
        section_id: 'section-node-3',
        title: 'Error Handling',
        description: 'Handling errors gracefully in Express',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nodejs/3-4-errors.mp4',
        duration_minutes: 20,
        order: 4,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-node-3-5',
        section_id: 'section-node-3',
        title: 'Quiz: Express.js Mastery',
        description: 'Test your Express.js knowledge',
        type: 'quiz',
        duration_minutes: 15,
        order: 5,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-node-4',
    course_id: 'course-3',
    title: 'Building REST APIs',
    description: 'Design and implement RESTful APIs',
    order: 4,
    lessons: [
      {
        id: 'lesson-node-4-1',
        section_id: 'section-node-4',
        title: 'REST API Principles',
        description: 'Understanding RESTful architecture',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nodejs/4-1-rest-principles.mp4',
        duration_minutes: 18,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-node-4-2',
        section_id: 'section-node-4',
        title: 'CRUD Operations',
        description: 'Implementing Create, Read, Update, Delete',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nodejs/4-2-crud.mp4',
        duration_minutes: 30,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-node-4-3',
        section_id: 'section-node-4',
        title: 'Request Validation',
        description: 'Validating API inputs with Joi and Zod',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nodejs/4-3-validation.mp4',
        duration_minutes: 22,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-node-4-4',
        section_id: 'section-node-4',
        title: 'Assignment: Build a Task API',
        description: 'Create a complete task management API',
        type: 'assignment',
        duration_minutes: 90,
        order: 4,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-node-5',
    course_id: 'course-3',
    title: 'Database Integration',
    description: 'Working with MongoDB and PostgreSQL',
    order: 5,
    lessons: [
      {
        id: 'lesson-node-5-1',
        section_id: 'section-node-5',
        title: 'Introduction to Databases',
        description: 'SQL vs NoSQL databases',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nodejs/5-1-databases.mp4',
        duration_minutes: 15,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-node-5-2',
        section_id: 'section-node-5',
        title: 'MongoDB with Mongoose',
        description: 'Working with MongoDB and ODM',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nodejs/5-2-mongodb.mp4',
        duration_minutes: 35,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-node-5-3',
        section_id: 'section-node-5',
        title: 'PostgreSQL with Prisma',
        description: 'Using Prisma ORM with PostgreSQL',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nodejs/5-3-postgresql.mp4',
        duration_minutes: 38,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-node-5-4',
        section_id: 'section-node-5',
        title: 'Quiz: Database Integration',
        description: 'Test your database knowledge',
        type: 'quiz',
        duration_minutes: 15,
        order: 4,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-node-6',
    course_id: 'course-3',
    title: 'Authentication & Security',
    description: 'Securing your Node.js applications',
    order: 6,
    lessons: [
      {
        id: 'lesson-node-6-1',
        section_id: 'section-node-6',
        title: 'Authentication Concepts',
        description: 'Understanding authentication vs authorization',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nodejs/6-1-auth-concepts.mp4',
        duration_minutes: 15,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-node-6-2',
        section_id: 'section-node-6',
        title: 'JWT Authentication',
        description: 'Implementing JSON Web Tokens',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nodejs/6-2-jwt.mp4',
        duration_minutes: 30,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-node-6-3',
        section_id: 'section-node-6',
        title: 'Password Hashing with bcrypt',
        description: 'Secure password storage',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nodejs/6-3-bcrypt.mp4',
        duration_minutes: 18,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-node-6-4',
        section_id: 'section-node-6',
        title: 'Security Best Practices',
        description: 'OWASP guidelines and security headers',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nodejs/6-4-security.mp4',
        duration_minutes: 25,
        order: 4,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-node-6-5',
        section_id: 'section-node-6',
        title: 'Final Assignment: Full API Project',
        description: 'Build a complete authenticated API',
        type: 'assignment',
        duration_minutes: 120,
        order: 5,
        is_preview: false,
        resources: [],
      },
    ],
  },
]

// ============================================
// COURSE 4: AI & Machine Learning Bootcamp
// ============================================

export const aimlSections: CourseSection[] = [
  {
    id: 'section-aiml-1',
    course_id: 'course-4',
    title: 'Introduction to Machine Learning',
    description: 'Foundations of machine learning and AI',
    order: 1,
    lessons: [
      {
        id: 'lesson-aiml-1-1',
        section_id: 'section-aiml-1',
        title: 'Welcome to AI & Machine Learning',
        description: 'Course overview and the AI landscape',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aiml/1-1-welcome.mp4',
        duration_minutes: 12,
        order: 1,
        is_preview: true,
        resources: [
          { id: 'res-aiml-1-1-1', lesson_id: 'lesson-aiml-1-1', title: 'Course Syllabus', type: 'pdf', url: '/resources/aiml/syllabus.pdf' },
          { id: 'res-aiml-1-1-2', lesson_id: 'lesson-aiml-1-1', title: 'GitHub Notebooks', type: 'link', url: 'https://github.com/phazurlabs/aiml-bootcamp' },
        ],
      },
      {
        id: 'lesson-aiml-1-2',
        section_id: 'section-aiml-1',
        title: 'What is Machine Learning?',
        description: 'Understanding ML fundamentals',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aiml/1-2-what-is-ml.mp4',
        duration_minutes: 20,
        order: 2,
        is_preview: true,
        resources: [],
      },
      {
        id: 'lesson-aiml-1-3',
        section_id: 'section-aiml-1',
        title: 'Types of Machine Learning',
        description: 'Supervised, unsupervised, and reinforcement learning',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aiml/1-3-ml-types.mp4',
        duration_minutes: 25,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aiml-1-4',
        section_id: 'section-aiml-1',
        title: 'Setting Up Python Environment',
        description: 'Installing Python, Jupyter, and ML libraries',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aiml/1-4-setup.mp4',
        duration_minutes: 18,
        order: 4,
        is_preview: false,
        resources: [
          { id: 'res-aiml-1-4-1', lesson_id: 'lesson-aiml-1-4', title: 'Environment Setup Guide', type: 'pdf', url: '/resources/aiml/setup-guide.pdf' },
        ],
      },
      {
        id: 'lesson-aiml-1-5',
        section_id: 'section-aiml-1',
        title: 'Quiz: ML Fundamentals',
        description: 'Test your understanding of ML basics',
        type: 'quiz',
        duration_minutes: 10,
        order: 5,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-aiml-2',
    course_id: 'course-4',
    title: 'Python for Data Science',
    description: 'Essential Python libraries for ML',
    order: 2,
    lessons: [
      {
        id: 'lesson-aiml-2-1',
        section_id: 'section-aiml-2',
        title: 'NumPy Fundamentals',
        description: 'Working with numerical arrays',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aiml/2-1-numpy.mp4',
        duration_minutes: 30,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aiml-2-2',
        section_id: 'section-aiml-2',
        title: 'Pandas for Data Manipulation',
        description: 'DataFrames and data analysis',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aiml/2-2-pandas.mp4',
        duration_minutes: 35,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aiml-2-3',
        section_id: 'section-aiml-2',
        title: 'Data Visualization with Matplotlib',
        description: 'Creating charts and visualizations',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aiml/2-3-matplotlib.mp4',
        duration_minutes: 28,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aiml-2-4',
        section_id: 'section-aiml-2',
        title: 'Assignment: Data Analysis Project',
        description: 'Analyze a real dataset with Python',
        type: 'assignment',
        duration_minutes: 90,
        order: 4,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-aiml-3',
    course_id: 'course-4',
    title: 'Supervised Learning',
    description: 'Classification and regression algorithms',
    order: 3,
    lessons: [
      {
        id: 'lesson-aiml-3-1',
        section_id: 'section-aiml-3',
        title: 'Linear Regression',
        description: 'Understanding regression and predictions',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aiml/3-1-linear-regression.mp4',
        duration_minutes: 35,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aiml-3-2',
        section_id: 'section-aiml-3',
        title: 'Logistic Regression',
        description: 'Binary and multi-class classification',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aiml/3-2-logistic-regression.mp4',
        duration_minutes: 30,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aiml-3-3',
        section_id: 'section-aiml-3',
        title: 'Decision Trees & Random Forests',
        description: 'Tree-based algorithms',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aiml/3-3-trees.mp4',
        duration_minutes: 40,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aiml-3-4',
        section_id: 'section-aiml-3',
        title: 'Support Vector Machines',
        description: 'SVM for classification',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aiml/3-4-svm.mp4',
        duration_minutes: 32,
        order: 4,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aiml-3-5',
        section_id: 'section-aiml-3',
        title: 'Quiz: Supervised Learning',
        description: 'Test your supervised learning knowledge',
        type: 'quiz',
        duration_minutes: 20,
        order: 5,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-aiml-4',
    course_id: 'course-4',
    title: 'Unsupervised Learning',
    description: 'Clustering and dimensionality reduction',
    order: 4,
    lessons: [
      {
        id: 'lesson-aiml-4-1',
        section_id: 'section-aiml-4',
        title: 'K-Means Clustering',
        description: 'Grouping data with K-Means',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aiml/4-1-kmeans.mp4',
        duration_minutes: 28,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aiml-4-2',
        section_id: 'section-aiml-4',
        title: 'Hierarchical Clustering',
        description: 'Building cluster hierarchies',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aiml/4-2-hierarchical.mp4',
        duration_minutes: 25,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aiml-4-3',
        section_id: 'section-aiml-4',
        title: 'Principal Component Analysis (PCA)',
        description: 'Dimensionality reduction techniques',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aiml/4-3-pca.mp4',
        duration_minutes: 35,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aiml-4-4',
        section_id: 'section-aiml-4',
        title: 'Assignment: Customer Segmentation',
        description: 'Segment customers using clustering',
        type: 'assignment',
        duration_minutes: 90,
        order: 4,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-aiml-5',
    course_id: 'course-4',
    title: 'Deep Learning Fundamentals',
    description: 'Introduction to neural networks',
    order: 5,
    lessons: [
      {
        id: 'lesson-aiml-5-1',
        section_id: 'section-aiml-5',
        title: 'Introduction to Neural Networks',
        description: 'Understanding how neural networks work',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aiml/5-1-neural-intro.mp4',
        duration_minutes: 30,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aiml-5-2',
        section_id: 'section-aiml-5',
        title: 'Building Neural Networks with TensorFlow',
        description: 'Creating your first neural network',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aiml/5-2-tensorflow.mp4',
        duration_minutes: 45,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aiml-5-3',
        section_id: 'section-aiml-5',
        title: 'Convolutional Neural Networks (CNN)',
        description: 'Image classification with CNNs',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aiml/5-3-cnn.mp4',
        duration_minutes: 50,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aiml-5-4',
        section_id: 'section-aiml-5',
        title: 'Recurrent Neural Networks (RNN)',
        description: 'Sequential data and time series',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aiml/5-4-rnn.mp4',
        duration_minutes: 45,
        order: 4,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aiml-5-5',
        section_id: 'section-aiml-5',
        title: 'Quiz: Deep Learning',
        description: 'Test your deep learning knowledge',
        type: 'quiz',
        duration_minutes: 20,
        order: 5,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-aiml-6',
    course_id: 'course-4',
    title: 'Final Project',
    description: 'Build and deploy an ML application',
    order: 6,
    lessons: [
      {
        id: 'lesson-aiml-6-1',
        section_id: 'section-aiml-6',
        title: 'Project Overview',
        description: 'Planning your ML capstone project',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aiml/6-1-project.mp4',
        duration_minutes: 15,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aiml-6-2',
        section_id: 'section-aiml-6',
        title: 'Model Deployment with Flask',
        description: 'Deploying ML models as APIs',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aiml/6-2-deployment.mp4',
        duration_minutes: 35,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aiml-6-3',
        section_id: 'section-aiml-6',
        title: 'Final Assignment: ML Application',
        description: 'Build a complete ML-powered application',
        type: 'assignment',
        duration_minutes: 180,
        order: 3,
        is_preview: false,
        resources: [],
      },
    ],
  },
]

// ============================================
// COURSE 5: UI/UX Design Masterclass
// ============================================

export const uiuxSections: CourseSection[] = [
  {
    id: 'section-uiux-1',
    course_id: 'course-5',
    title: 'Introduction to UI/UX Design',
    description: 'Understanding the fundamentals of design',
    order: 1,
    lessons: [
      {
        id: 'lesson-uiux-1-1',
        section_id: 'section-uiux-1',
        title: 'Welcome to UI/UX Design',
        description: 'Course overview and design career paths',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/uiux/1-1-welcome.mp4',
        duration_minutes: 10,
        order: 1,
        is_preview: true,
        resources: [
          { id: 'res-uiux-1-1-1', lesson_id: 'lesson-uiux-1-1', title: 'Design Resources', type: 'pdf', url: '/resources/uiux/resources.pdf' },
        ],
      },
      {
        id: 'lesson-uiux-1-2',
        section_id: 'section-uiux-1',
        title: 'UI vs UX: What\'s the Difference?',
        description: 'Understanding the distinction and overlap',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/uiux/1-2-ui-vs-ux.mp4',
        duration_minutes: 15,
        order: 2,
        is_preview: true,
        resources: [],
      },
      {
        id: 'lesson-uiux-1-3',
        section_id: 'section-uiux-1',
        title: 'The Design Thinking Process',
        description: 'From empathy to prototype',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/uiux/1-3-design-thinking.mp4',
        duration_minutes: 22,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-uiux-1-4',
        section_id: 'section-uiux-1',
        title: 'Setting Up Figma',
        description: 'Getting started with the design tool',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/uiux/1-4-figma-setup.mp4',
        duration_minutes: 12,
        order: 4,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-uiux-1-5',
        section_id: 'section-uiux-1',
        title: 'Quiz: Design Fundamentals',
        description: 'Test your understanding of design basics',
        type: 'quiz',
        duration_minutes: 10,
        order: 5,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-uiux-2',
    course_id: 'course-5',
    title: 'User Research',
    description: 'Understanding your users',
    order: 2,
    lessons: [
      {
        id: 'lesson-uiux-2-1',
        section_id: 'section-uiux-2',
        title: 'Introduction to User Research',
        description: 'Why research matters in design',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/uiux/2-1-research-intro.mp4',
        duration_minutes: 18,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-uiux-2-2',
        section_id: 'section-uiux-2',
        title: 'Conducting User Interviews',
        description: 'Asking the right questions',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/uiux/2-2-interviews.mp4',
        duration_minutes: 25,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-uiux-2-3',
        section_id: 'section-uiux-2',
        title: 'Creating User Personas',
        description: 'Building data-driven personas',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/uiux/2-3-personas.mp4',
        duration_minutes: 22,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-uiux-2-4',
        section_id: 'section-uiux-2',
        title: 'User Journey Mapping',
        description: 'Visualizing the user experience',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/uiux/2-4-journey-maps.mp4',
        duration_minutes: 28,
        order: 4,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-uiux-2-5',
        section_id: 'section-uiux-2',
        title: 'Assignment: User Research Project',
        description: 'Conduct research for a real product',
        type: 'assignment',
        duration_minutes: 120,
        order: 5,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-uiux-3',
    course_id: 'course-5',
    title: 'Visual Design Principles',
    description: 'Creating beautiful and functional interfaces',
    order: 3,
    lessons: [
      {
        id: 'lesson-uiux-3-1',
        section_id: 'section-uiux-3',
        title: 'Color Theory for UI',
        description: 'Choosing and applying colors effectively',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/uiux/3-1-color.mp4',
        duration_minutes: 30,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-uiux-3-2',
        section_id: 'section-uiux-3',
        title: 'Typography in Design',
        description: 'Font selection and hierarchy',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/uiux/3-2-typography.mp4',
        duration_minutes: 28,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-uiux-3-3',
        section_id: 'section-uiux-3',
        title: 'Layout and Grid Systems',
        description: 'Structuring your designs',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/uiux/3-3-layout.mp4',
        duration_minutes: 32,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-uiux-3-4',
        section_id: 'section-uiux-3',
        title: 'Visual Hierarchy',
        description: 'Guiding user attention',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/uiux/3-4-hierarchy.mp4',
        duration_minutes: 25,
        order: 4,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-uiux-3-5',
        section_id: 'section-uiux-3',
        title: 'Quiz: Visual Design',
        description: 'Test your visual design knowledge',
        type: 'quiz',
        duration_minutes: 15,
        order: 5,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-uiux-4',
    course_id: 'course-5',
    title: 'Figma Mastery',
    description: 'Becoming proficient in Figma',
    order: 4,
    lessons: [
      {
        id: 'lesson-uiux-4-1',
        section_id: 'section-uiux-4',
        title: 'Figma Interface Deep Dive',
        description: 'Mastering the Figma workspace',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/uiux/4-1-figma-interface.mp4',
        duration_minutes: 25,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-uiux-4-2',
        section_id: 'section-uiux-4',
        title: 'Components and Variants',
        description: 'Building reusable design elements',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/uiux/4-2-components.mp4',
        duration_minutes: 35,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-uiux-4-3',
        section_id: 'section-uiux-4',
        title: 'Auto Layout',
        description: 'Creating responsive designs',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/uiux/4-3-auto-layout.mp4',
        duration_minutes: 30,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-uiux-4-4',
        section_id: 'section-uiux-4',
        title: 'Prototyping and Interactions',
        description: 'Creating interactive prototypes',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/uiux/4-4-prototyping.mp4',
        duration_minutes: 40,
        order: 4,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-uiux-4-5',
        section_id: 'section-uiux-4',
        title: 'Assignment: Mobile App Design',
        description: 'Design a complete mobile app in Figma',
        type: 'assignment',
        duration_minutes: 180,
        order: 5,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-uiux-5',
    course_id: 'course-5',
    title: 'Design Systems',
    description: 'Building scalable design systems',
    order: 5,
    lessons: [
      {
        id: 'lesson-uiux-5-1',
        section_id: 'section-uiux-5',
        title: 'What is a Design System?',
        description: 'Understanding design systems',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/uiux/5-1-design-systems.mp4',
        duration_minutes: 20,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-uiux-5-2',
        section_id: 'section-uiux-5',
        title: 'Creating Design Tokens',
        description: 'Colors, spacing, and typography tokens',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/uiux/5-2-tokens.mp4',
        duration_minutes: 28,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-uiux-5-3',
        section_id: 'section-uiux-5',
        title: 'Component Libraries',
        description: 'Building a comprehensive component library',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/uiux/5-3-component-library.mp4',
        duration_minutes: 40,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-uiux-5-4',
        section_id: 'section-uiux-5',
        title: 'Final Assignment: Design System',
        description: 'Build a complete design system',
        type: 'assignment',
        duration_minutes: 240,
        order: 4,
        is_preview: false,
        resources: [],
      },
    ],
  },
]

// ============================================
// COURSE 6: AWS Solutions Architect
// ============================================

export const awsSections: CourseSection[] = [
  {
    id: 'section-aws-1',
    course_id: 'course-6',
    title: 'AWS Fundamentals',
    description: 'Getting started with Amazon Web Services',
    order: 1,
    lessons: [
      {
        id: 'lesson-aws-1-1',
        section_id: 'section-aws-1',
        title: 'Welcome to AWS',
        description: 'Course overview and AWS ecosystem',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aws/1-1-welcome.mp4',
        duration_minutes: 12,
        order: 1,
        is_preview: true,
        resources: [
          { id: 'res-aws-1-1-1', lesson_id: 'lesson-aws-1-1', title: 'AWS Study Guide', type: 'pdf', url: '/resources/aws/study-guide.pdf' },
        ],
      },
      {
        id: 'lesson-aws-1-2',
        section_id: 'section-aws-1',
        title: 'AWS Global Infrastructure',
        description: 'Regions, availability zones, and edge locations',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aws/1-2-infrastructure.mp4',
        duration_minutes: 18,
        order: 2,
        is_preview: true,
        resources: [],
      },
      {
        id: 'lesson-aws-1-3',
        section_id: 'section-aws-1',
        title: 'Creating Your AWS Account',
        description: 'Setting up and securing your account',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aws/1-3-account.mp4',
        duration_minutes: 15,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aws-1-4',
        section_id: 'section-aws-1',
        title: 'IAM: Identity and Access Management',
        description: 'Managing users, roles, and policies',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aws/1-4-iam.mp4',
        duration_minutes: 35,
        order: 4,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aws-1-5',
        section_id: 'section-aws-1',
        title: 'Quiz: AWS Fundamentals',
        description: 'Test your AWS basics knowledge',
        type: 'quiz',
        duration_minutes: 15,
        order: 5,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-aws-2',
    course_id: 'course-6',
    title: 'Compute Services',
    description: 'EC2, Lambda, and compute options',
    order: 2,
    lessons: [
      {
        id: 'lesson-aws-2-1',
        section_id: 'section-aws-2',
        title: 'Amazon EC2 Deep Dive',
        description: 'Virtual servers in the cloud',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aws/2-1-ec2.mp4',
        duration_minutes: 45,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aws-2-2',
        section_id: 'section-aws-2',
        title: 'EC2 Instance Types & Pricing',
        description: 'Choosing the right instance',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aws/2-2-ec2-types.mp4',
        duration_minutes: 30,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aws-2-3',
        section_id: 'section-aws-2',
        title: 'AWS Lambda',
        description: 'Serverless computing',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aws/2-3-lambda.mp4',
        duration_minutes: 40,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aws-2-4',
        section_id: 'section-aws-2',
        title: 'Elastic Beanstalk',
        description: 'Easy application deployment',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aws/2-4-beanstalk.mp4',
        duration_minutes: 28,
        order: 4,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aws-2-5',
        section_id: 'section-aws-2',
        title: 'Assignment: Deploy a Web Application',
        description: 'Deploy an app using EC2 and Lambda',
        type: 'assignment',
        duration_minutes: 90,
        order: 5,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-aws-3',
    course_id: 'course-6',
    title: 'Storage Services',
    description: 'S3, EBS, and storage solutions',
    order: 3,
    lessons: [
      {
        id: 'lesson-aws-3-1',
        section_id: 'section-aws-3',
        title: 'Amazon S3 Deep Dive',
        description: 'Object storage in the cloud',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aws/3-1-s3.mp4',
        duration_minutes: 40,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aws-3-2',
        section_id: 'section-aws-3',
        title: 'S3 Storage Classes & Lifecycle',
        description: 'Optimizing storage costs',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aws/3-2-s3-classes.mp4',
        duration_minutes: 25,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aws-3-3',
        section_id: 'section-aws-3',
        title: 'Amazon EBS',
        description: 'Block storage for EC2',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aws/3-3-ebs.mp4',
        duration_minutes: 28,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aws-3-4',
        section_id: 'section-aws-3',
        title: 'Quiz: Storage Services',
        description: 'Test your storage knowledge',
        type: 'quiz',
        duration_minutes: 15,
        order: 4,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-aws-4',
    course_id: 'course-6',
    title: 'Database Services',
    description: 'RDS, DynamoDB, and database options',
    order: 4,
    lessons: [
      {
        id: 'lesson-aws-4-1',
        section_id: 'section-aws-4',
        title: 'Amazon RDS',
        description: 'Managed relational databases',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aws/4-1-rds.mp4',
        duration_minutes: 38,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aws-4-2',
        section_id: 'section-aws-4',
        title: 'Amazon DynamoDB',
        description: 'NoSQL database service',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aws/4-2-dynamodb.mp4',
        duration_minutes: 42,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aws-4-3',
        section_id: 'section-aws-4',
        title: 'ElastiCache & Database Caching',
        description: 'Improving database performance',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aws/4-3-elasticache.mp4',
        duration_minutes: 25,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aws-4-4',
        section_id: 'section-aws-4',
        title: 'Assignment: Database Architecture',
        description: 'Design a multi-tier database solution',
        type: 'assignment',
        duration_minutes: 90,
        order: 4,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-aws-5',
    course_id: 'course-6',
    title: 'Networking & VPC',
    description: 'Virtual private cloud and networking',
    order: 5,
    lessons: [
      {
        id: 'lesson-aws-5-1',
        section_id: 'section-aws-5',
        title: 'VPC Fundamentals',
        description: 'Understanding VPC architecture',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aws/5-1-vpc.mp4',
        duration_minutes: 40,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aws-5-2',
        section_id: 'section-aws-5',
        title: 'Subnets, Route Tables & Gateways',
        description: 'VPC networking components',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aws/5-2-subnets.mp4',
        duration_minutes: 35,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aws-5-3',
        section_id: 'section-aws-5',
        title: 'Security Groups & NACLs',
        description: 'Network security in AWS',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aws/5-3-security.mp4',
        duration_minutes: 30,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aws-5-4',
        section_id: 'section-aws-5',
        title: 'Quiz: Networking',
        description: 'Test your VPC knowledge',
        type: 'quiz',
        duration_minutes: 20,
        order: 4,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-aws-6',
    course_id: 'course-6',
    title: 'High Availability & Scaling',
    description: 'Building resilient architectures',
    order: 6,
    lessons: [
      {
        id: 'lesson-aws-6-1',
        section_id: 'section-aws-6',
        title: 'Elastic Load Balancing',
        description: 'Distributing traffic across instances',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aws/6-1-elb.mp4',
        duration_minutes: 35,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aws-6-2',
        section_id: 'section-aws-6',
        title: 'Auto Scaling',
        description: 'Automatic capacity management',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aws/6-2-autoscaling.mp4',
        duration_minutes: 32,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aws-6-3',
        section_id: 'section-aws-6',
        title: 'Route 53 DNS',
        description: 'Global traffic routing',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/aws/6-3-route53.mp4',
        duration_minutes: 28,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-aws-6-4',
        section_id: 'section-aws-6',
        title: 'Final Assignment: Highly Available Architecture',
        description: 'Design and document a production-ready architecture',
        type: 'assignment',
        duration_minutes: 120,
        order: 4,
        is_preview: false,
        resources: [],
      },
    ],
  },
]

// ============================================
// COURSE 7: Next.js 14 Full Course
// ============================================

export const nextjsSections: CourseSection[] = [
  {
    id: 'section-next-1',
    course_id: 'course-7',
    title: 'Getting Started with Next.js 14',
    description: 'Introduction to the Next.js framework',
    order: 1,
    lessons: [
      {
        id: 'lesson-next-1-1',
        section_id: 'section-next-1',
        title: 'Welcome to Next.js 14',
        description: 'Course overview and Next.js introduction',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nextjs/1-1-welcome.mp4',
        duration_minutes: 10,
        order: 1,
        is_preview: true,
        resources: [
          { id: 'res-next-1-1-1', lesson_id: 'lesson-next-1-1', title: 'Course Repo', type: 'link', url: 'https://github.com/phazurlabs/nextjs-course' },
        ],
      },
      {
        id: 'lesson-next-1-2',
        section_id: 'section-next-1',
        title: 'Next.js vs React: When to Use What',
        description: 'Understanding framework benefits',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nextjs/1-2-nextjs-vs-react.mp4',
        duration_minutes: 12,
        order: 2,
        is_preview: true,
        resources: [],
      },
      {
        id: 'lesson-next-1-3',
        section_id: 'section-next-1',
        title: 'Creating Your First Next.js App',
        description: 'Project setup and structure',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nextjs/1-3-create-app.mp4',
        duration_minutes: 15,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-next-1-4',
        section_id: 'section-next-1',
        title: 'Quiz: Next.js Basics',
        description: 'Test your Next.js fundamentals',
        type: 'quiz',
        duration_minutes: 10,
        order: 4,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-next-2',
    course_id: 'course-7',
    title: 'App Router & Routing',
    description: 'Next.js 14 App Router deep dive',
    order: 2,
    lessons: [
      {
        id: 'lesson-next-2-1',
        section_id: 'section-next-2',
        title: 'App Router Fundamentals',
        description: 'Understanding file-based routing',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nextjs/2-1-app-router.mp4',
        duration_minutes: 25,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-next-2-2',
        section_id: 'section-next-2',
        title: 'Dynamic Routes & Params',
        description: 'Creating dynamic pages',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nextjs/2-2-dynamic-routes.mp4',
        duration_minutes: 22,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-next-2-3',
        section_id: 'section-next-2',
        title: 'Layouts and Templates',
        description: 'Nested layouts and shared UI',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nextjs/2-3-layouts.mp4',
        duration_minutes: 20,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-next-2-4',
        section_id: 'section-next-2',
        title: 'Loading, Error, and Not Found',
        description: 'Special file conventions',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nextjs/2-4-special-files.mp4',
        duration_minutes: 18,
        order: 4,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-next-2-5',
        section_id: 'section-next-2',
        title: 'Assignment: Multi-Page Application',
        description: 'Build a complete routed application',
        type: 'assignment',
        duration_minutes: 60,
        order: 5,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-next-3',
    course_id: 'course-7',
    title: 'Server Components & Data Fetching',
    description: 'React Server Components and data patterns',
    order: 3,
    lessons: [
      {
        id: 'lesson-next-3-1',
        section_id: 'section-next-3',
        title: 'Server vs Client Components',
        description: 'Understanding the component model',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nextjs/3-1-server-components.mp4',
        duration_minutes: 28,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-next-3-2',
        section_id: 'section-next-3',
        title: 'Data Fetching in Server Components',
        description: 'Fetching data on the server',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nextjs/3-2-data-fetching.mp4',
        duration_minutes: 25,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-next-3-3',
        section_id: 'section-next-3',
        title: 'Caching and Revalidation',
        description: 'Optimizing data fetching',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nextjs/3-3-caching.mp4',
        duration_minutes: 22,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-next-3-4',
        section_id: 'section-next-3',
        title: 'Quiz: Data Fetching',
        description: 'Test your data fetching knowledge',
        type: 'quiz',
        duration_minutes: 15,
        order: 4,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-next-4',
    course_id: 'course-7',
    title: 'Server Actions & Mutations',
    description: 'Server-side mutations in Next.js',
    order: 4,
    lessons: [
      {
        id: 'lesson-next-4-1',
        section_id: 'section-next-4',
        title: 'Introduction to Server Actions',
        description: 'Mutating data with server actions',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nextjs/4-1-server-actions.mp4',
        duration_minutes: 25,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-next-4-2',
        section_id: 'section-next-4',
        title: 'Forms and Validation',
        description: 'Handling form submissions',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nextjs/4-2-forms.mp4',
        duration_minutes: 30,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-next-4-3',
        section_id: 'section-next-4',
        title: 'Optimistic Updates',
        description: 'Improving perceived performance',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nextjs/4-3-optimistic.mp4',
        duration_minutes: 20,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-next-4-4',
        section_id: 'section-next-4',
        title: 'Assignment: CRUD Application',
        description: 'Build a full CRUD app with server actions',
        type: 'assignment',
        duration_minutes: 90,
        order: 4,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-next-5',
    course_id: 'course-7',
    title: 'Authentication & Deployment',
    description: 'Auth patterns and production deployment',
    order: 5,
    lessons: [
      {
        id: 'lesson-next-5-1',
        section_id: 'section-next-5',
        title: 'Authentication with NextAuth.js',
        description: 'Implementing authentication',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nextjs/5-1-auth.mp4',
        duration_minutes: 35,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-next-5-2',
        section_id: 'section-next-5',
        title: 'Middleware & Protected Routes',
        description: 'Securing your application',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nextjs/5-2-middleware.mp4',
        duration_minutes: 22,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-next-5-3',
        section_id: 'section-next-5',
        title: 'Deploying to Vercel',
        description: 'Production deployment',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/nextjs/5-3-deployment.mp4',
        duration_minutes: 18,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-next-5-4',
        section_id: 'section-next-5',
        title: 'Final Project: Full-Stack App',
        description: 'Build and deploy a complete application',
        type: 'assignment',
        duration_minutes: 180,
        order: 4,
        is_preview: false,
        resources: [],
      },
    ],
  },
]

// ============================================
// COURSE 8: Python for Data Science
// ============================================

export const pythonDataScienceSections: CourseSection[] = [
  {
    id: 'section-pyds-1',
    course_id: 'course-8',
    title: 'Python Fundamentals for Data Science',
    description: 'Core Python skills for data work',
    order: 1,
    lessons: [
      {
        id: 'lesson-pyds-1-1',
        section_id: 'section-pyds-1',
        title: 'Welcome to Python for Data Science',
        description: 'Course overview and Python ecosystem',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/python-ds/1-1-welcome.mp4',
        duration_minutes: 10,
        order: 1,
        is_preview: true,
        resources: [
          { id: 'res-pyds-1-1-1', lesson_id: 'lesson-pyds-1-1', title: 'Jupyter Notebooks', type: 'link', url: 'https://github.com/phazurlabs/python-ds' },
        ],
      },
      {
        id: 'lesson-pyds-1-2',
        section_id: 'section-pyds-1',
        title: 'Python Data Structures',
        description: 'Lists, dictionaries, sets, and tuples',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/python-ds/1-2-data-structures.mp4',
        duration_minutes: 25,
        order: 2,
        is_preview: true,
        resources: [],
      },
      {
        id: 'lesson-pyds-1-3',
        section_id: 'section-pyds-1',
        title: 'Functions and Modules',
        description: 'Writing reusable Python code',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/python-ds/1-3-functions.mp4',
        duration_minutes: 20,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-pyds-1-4',
        section_id: 'section-pyds-1',
        title: 'Quiz: Python Basics',
        description: 'Test your Python fundamentals',
        type: 'quiz',
        duration_minutes: 10,
        order: 4,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-pyds-2',
    course_id: 'course-8',
    title: 'NumPy for Numerical Computing',
    description: 'Working with numerical arrays',
    order: 2,
    lessons: [
      {
        id: 'lesson-pyds-2-1',
        section_id: 'section-pyds-2',
        title: 'NumPy Array Basics',
        description: 'Creating and manipulating arrays',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/python-ds/2-1-numpy-basics.mp4',
        duration_minutes: 28,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-pyds-2-2',
        section_id: 'section-pyds-2',
        title: 'Array Operations and Broadcasting',
        description: 'Mathematical operations on arrays',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/python-ds/2-2-operations.mp4',
        duration_minutes: 25,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-pyds-2-3',
        section_id: 'section-pyds-2',
        title: 'Indexing and Slicing',
        description: 'Accessing array elements',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/python-ds/2-3-indexing.mp4',
        duration_minutes: 22,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-pyds-2-4',
        section_id: 'section-pyds-2',
        title: 'Assignment: NumPy Exercises',
        description: 'Practice NumPy operations',
        type: 'assignment',
        duration_minutes: 45,
        order: 4,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-pyds-3',
    course_id: 'course-8',
    title: 'Pandas for Data Analysis',
    description: 'DataFrames and data manipulation',
    order: 3,
    lessons: [
      {
        id: 'lesson-pyds-3-1',
        section_id: 'section-pyds-3',
        title: 'Introduction to Pandas',
        description: 'Series and DataFrames',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/python-ds/3-1-pandas-intro.mp4',
        duration_minutes: 25,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-pyds-3-2',
        section_id: 'section-pyds-3',
        title: 'Data Selection and Filtering',
        description: 'Selecting and querying data',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/python-ds/3-2-selection.mp4',
        duration_minutes: 28,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-pyds-3-3',
        section_id: 'section-pyds-3',
        title: 'Data Cleaning and Preprocessing',
        description: 'Handling missing data and outliers',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/python-ds/3-3-cleaning.mp4',
        duration_minutes: 32,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-pyds-3-4',
        section_id: 'section-pyds-3',
        title: 'Grouping and Aggregation',
        description: 'GroupBy operations',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/python-ds/3-4-groupby.mp4',
        duration_minutes: 25,
        order: 4,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-pyds-3-5',
        section_id: 'section-pyds-3',
        title: 'Quiz: Pandas Mastery',
        description: 'Test your Pandas knowledge',
        type: 'quiz',
        duration_minutes: 15,
        order: 5,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-pyds-4',
    course_id: 'course-8',
    title: 'Data Visualization',
    description: 'Creating insightful visualizations',
    order: 4,
    lessons: [
      {
        id: 'lesson-pyds-4-1',
        section_id: 'section-pyds-4',
        title: 'Matplotlib Fundamentals',
        description: 'Creating basic charts',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/python-ds/4-1-matplotlib.mp4',
        duration_minutes: 28,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-pyds-4-2',
        section_id: 'section-pyds-4',
        title: 'Seaborn for Statistical Visualization',
        description: 'Beautiful statistical charts',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/python-ds/4-2-seaborn.mp4',
        duration_minutes: 30,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-pyds-4-3',
        section_id: 'section-pyds-4',
        title: 'Interactive Visualizations with Plotly',
        description: 'Creating interactive dashboards',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/python-ds/4-3-plotly.mp4',
        duration_minutes: 32,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-pyds-4-4',
        section_id: 'section-pyds-4',
        title: 'Assignment: Data Visualization Project',
        description: 'Create a comprehensive visualization dashboard',
        type: 'assignment',
        duration_minutes: 90,
        order: 4,
        is_preview: false,
        resources: [],
      },
    ],
  },
  {
    id: 'section-pyds-5',
    course_id: 'course-8',
    title: 'Exploratory Data Analysis',
    description: 'Complete EDA workflow',
    order: 5,
    lessons: [
      {
        id: 'lesson-pyds-5-1',
        section_id: 'section-pyds-5',
        title: 'EDA Process and Best Practices',
        description: 'Systematic data exploration',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/python-ds/5-1-eda-process.mp4',
        duration_minutes: 22,
        order: 1,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-pyds-5-2',
        section_id: 'section-pyds-5',
        title: 'Statistical Analysis',
        description: 'Descriptive statistics and distributions',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/python-ds/5-2-statistics.mp4',
        duration_minutes: 30,
        order: 2,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-pyds-5-3',
        section_id: 'section-pyds-5',
        title: 'Correlation Analysis',
        description: 'Finding relationships in data',
        type: 'video',
        content_url: 'https://cdn.phazurlabs.com/courses/python-ds/5-3-correlation.mp4',
        duration_minutes: 25,
        order: 3,
        is_preview: false,
        resources: [],
      },
      {
        id: 'lesson-pyds-5-4',
        section_id: 'section-pyds-5',
        title: 'Final Project: Complete EDA',
        description: 'Perform EDA on a real-world dataset',
        type: 'assignment',
        duration_minutes: 120,
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
  // ============================================
  // COURSE 3: Node.js Backend Development Quizzes
  // ============================================
  {
    id: 'quiz-node-fundamentals',
    lesson_id: 'lesson-node-1-5',
    course_id: 'course-3',
    title: 'Node.js Fundamentals Quiz',
    description: 'Test your understanding of Node.js core concepts',
    time_limit_minutes: 15,
    passing_score: 70,
    max_attempts: 3,
    shuffle_questions: true,
    show_correct_answers: true,
    questions: [
      {
        id: 'q-node-1-1',
        quiz_id: 'quiz-node-fundamentals',
        question: 'What is Node.js built on?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-node-1-1-1', question_id: 'q-node-1-1', text: 'Python interpreter', is_correct: false },
          { id: 'opt-node-1-1-2', question_id: 'q-node-1-1', text: 'Chrome V8 JavaScript engine', is_correct: true },
          { id: 'opt-node-1-1-3', question_id: 'q-node-1-1', text: 'Java Virtual Machine', is_correct: false },
          { id: 'opt-node-1-1-4', question_id: 'q-node-1-1', text: '.NET runtime', is_correct: false },
        ],
        explanation: 'Node.js is built on Chrome V8 JavaScript engine, allowing JavaScript to run server-side.',
        points: 10,
        order: 1,
      },
      {
        id: 'q-node-1-2',
        quiz_id: 'quiz-node-fundamentals',
        question: 'Node.js uses a single-threaded event loop for handling requests.',
        question_type: 'true_false',
        options: [
          { id: 'opt-node-1-2-1', question_id: 'q-node-1-2', text: 'True', is_correct: true },
          { id: 'opt-node-1-2-2', question_id: 'q-node-1-2', text: 'False', is_correct: false },
        ],
        explanation: 'Node.js uses a single-threaded event loop architecture, which makes it efficient for I/O-bound operations.',
        points: 10,
        order: 2,
      },
      {
        id: 'q-node-1-3',
        quiz_id: 'quiz-node-fundamentals',
        question: 'Which module system does modern Node.js support?',
        question_type: 'multiple_select',
        options: [
          { id: 'opt-node-1-3-1', question_id: 'q-node-1-3', text: 'CommonJS (require)', is_correct: true },
          { id: 'opt-node-1-3-2', question_id: 'q-node-1-3', text: 'ES Modules (import/export)', is_correct: true },
          { id: 'opt-node-1-3-3', question_id: 'q-node-1-3', text: 'AMD', is_correct: false },
          { id: 'opt-node-1-3-4', question_id: 'q-node-1-3', text: 'SystemJS', is_correct: false },
        ],
        explanation: 'Node.js supports both CommonJS and ES Modules for organizing code.',
        points: 15,
        order: 3,
      },
      {
        id: 'q-node-1-4',
        quiz_id: 'quiz-node-fundamentals',
        question: 'What command initializes a new Node.js project?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-node-1-4-1', question_id: 'q-node-1-4', text: 'node create', is_correct: false },
          { id: 'opt-node-1-4-2', question_id: 'q-node-1-4', text: 'npm init', is_correct: true },
          { id: 'opt-node-1-4-3', question_id: 'q-node-1-4', text: 'node init', is_correct: false },
          { id: 'opt-node-1-4-4', question_id: 'q-node-1-4', text: 'npm create', is_correct: false },
        ],
        explanation: 'npm init creates a new package.json file, which initializes a Node.js project.',
        points: 10,
        order: 4,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'quiz-node-express',
    lesson_id: 'lesson-node-3-5',
    course_id: 'course-3',
    title: 'Express.js Mastery Quiz',
    description: 'Test your Express.js framework knowledge',
    time_limit_minutes: 15,
    passing_score: 70,
    max_attempts: 3,
    shuffle_questions: true,
    show_correct_answers: true,
    questions: [
      {
        id: 'q-node-3-1',
        quiz_id: 'quiz-node-express',
        question: 'What is middleware in Express.js?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-node-3-1-1', question_id: 'q-node-3-1', text: 'A database connector', is_correct: false },
          { id: 'opt-node-3-1-2', question_id: 'q-node-3-1', text: 'Functions that execute during the request-response cycle', is_correct: true },
          { id: 'opt-node-3-1-3', question_id: 'q-node-3-1', text: 'A templating engine', is_correct: false },
          { id: 'opt-node-3-1-4', question_id: 'q-node-3-1', text: 'A routing protocol', is_correct: false },
        ],
        explanation: 'Middleware functions have access to request and response objects and can execute code, modify req/res, or end the cycle.',
        points: 10,
        order: 1,
      },
      {
        id: 'q-node-3-2',
        quiz_id: 'quiz-node-express',
        question: 'Which method is used to handle POST requests in Express?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-node-3-2-1', question_id: 'q-node-3-2', text: 'app.receive()', is_correct: false },
          { id: 'opt-node-3-2-2', question_id: 'q-node-3-2', text: 'app.post()', is_correct: true },
          { id: 'opt-node-3-2-3', question_id: 'q-node-3-2', text: 'app.send()', is_correct: false },
          { id: 'opt-node-3-2-4', question_id: 'q-node-3-2', text: 'app.submit()', is_correct: false },
        ],
        explanation: 'app.post() is the method used to handle POST HTTP requests in Express.',
        points: 10,
        order: 2,
      },
      {
        id: 'q-node-3-3',
        quiz_id: 'quiz-node-express',
        question: 'express.json() middleware is used to parse JSON request bodies.',
        question_type: 'true_false',
        options: [
          { id: 'opt-node-3-3-1', question_id: 'q-node-3-3', text: 'True', is_correct: true },
          { id: 'opt-node-3-3-2', question_id: 'q-node-3-3', text: 'False', is_correct: false },
        ],
        explanation: 'express.json() is built-in middleware that parses incoming JSON payloads.',
        points: 10,
        order: 3,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'quiz-node-database',
    lesson_id: 'lesson-node-5-4',
    course_id: 'course-3',
    title: 'Database Integration Quiz',
    description: 'Test your knowledge of database integration with Node.js',
    time_limit_minutes: 15,
    passing_score: 70,
    max_attempts: 3,
    shuffle_questions: true,
    show_correct_answers: true,
    questions: [
      {
        id: 'q-node-5-1',
        quiz_id: 'quiz-node-database',
        question: 'What is an ORM?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-node-5-1-1', question_id: 'q-node-5-1', text: 'Object-Relational Mapping', is_correct: true },
          { id: 'opt-node-5-1-2', question_id: 'q-node-5-1', text: 'Object-Request Module', is_correct: false },
          { id: 'opt-node-5-1-3', question_id: 'q-node-5-1', text: 'Open Resource Manager', is_correct: false },
          { id: 'opt-node-5-1-4', question_id: 'q-node-5-1', text: 'Optimized Runtime Memory', is_correct: false },
        ],
        explanation: 'ORM stands for Object-Relational Mapping, which maps database tables to programming language objects.',
        points: 10,
        order: 1,
      },
      {
        id: 'q-node-5-2',
        quiz_id: 'quiz-node-database',
        question: 'Which of these is a popular MongoDB ODM for Node.js?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-node-5-2-1', question_id: 'q-node-5-2', text: 'Sequelize', is_correct: false },
          { id: 'opt-node-5-2-2', question_id: 'q-node-5-2', text: 'Mongoose', is_correct: true },
          { id: 'opt-node-5-2-3', question_id: 'q-node-5-2', text: 'TypeORM', is_correct: false },
          { id: 'opt-node-5-2-4', question_id: 'q-node-5-2', text: 'Knex', is_correct: false },
        ],
        explanation: 'Mongoose is the most popular ODM (Object Document Mapper) for MongoDB in Node.js.',
        points: 10,
        order: 2,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // ============================================
  // COURSE 4: AI & ML Bootcamp Quizzes
  // ============================================
  {
    id: 'quiz-aiml-foundations',
    lesson_id: 'lesson-aiml-1-5',
    course_id: 'course-4',
    title: 'AI/ML Foundations Quiz',
    description: 'Test your understanding of AI and ML fundamentals',
    time_limit_minutes: 15,
    passing_score: 70,
    max_attempts: 3,
    shuffle_questions: true,
    show_correct_answers: true,
    questions: [
      {
        id: 'q-aiml-1-1',
        quiz_id: 'quiz-aiml-foundations',
        question: 'What is the main difference between AI and Machine Learning?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-aiml-1-1-1', question_id: 'q-aiml-1-1', text: 'They are the same thing', is_correct: false },
          { id: 'opt-aiml-1-1-2', question_id: 'q-aiml-1-1', text: 'ML is a subset of AI focused on learning from data', is_correct: true },
          { id: 'opt-aiml-1-1-3', question_id: 'q-aiml-1-1', text: 'AI is a subset of ML', is_correct: false },
          { id: 'opt-aiml-1-1-4', question_id: 'q-aiml-1-1', text: 'ML only works with images', is_correct: false },
        ],
        explanation: 'Machine Learning is a subset of Artificial Intelligence that focuses on systems learning from data.',
        points: 10,
        order: 1,
      },
      {
        id: 'q-aiml-1-2',
        quiz_id: 'quiz-aiml-foundations',
        question: 'Supervised learning requires labeled training data.',
        question_type: 'true_false',
        options: [
          { id: 'opt-aiml-1-2-1', question_id: 'q-aiml-1-2', text: 'True', is_correct: true },
          { id: 'opt-aiml-1-2-2', question_id: 'q-aiml-1-2', text: 'False', is_correct: false },
        ],
        explanation: 'Supervised learning uses labeled data to train models to make predictions.',
        points: 10,
        order: 2,
      },
      {
        id: 'q-aiml-1-3',
        quiz_id: 'quiz-aiml-foundations',
        question: 'Which type of learning is used for clustering similar items?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-aiml-1-3-1', question_id: 'q-aiml-1-3', text: 'Supervised Learning', is_correct: false },
          { id: 'opt-aiml-1-3-2', question_id: 'q-aiml-1-3', text: 'Unsupervised Learning', is_correct: true },
          { id: 'opt-aiml-1-3-3', question_id: 'q-aiml-1-3', text: 'Reinforcement Learning', is_correct: false },
          { id: 'opt-aiml-1-3-4', question_id: 'q-aiml-1-3', text: 'Transfer Learning', is_correct: false },
        ],
        explanation: 'Unsupervised learning finds patterns in unlabeled data, including clustering.',
        points: 10,
        order: 3,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'quiz-aiml-neural',
    lesson_id: 'lesson-aiml-3-5',
    course_id: 'course-4',
    title: 'Neural Networks Quiz',
    description: 'Test your neural network knowledge',
    time_limit_minutes: 15,
    passing_score: 70,
    max_attempts: 3,
    shuffle_questions: true,
    show_correct_answers: true,
    questions: [
      {
        id: 'q-aiml-3-1',
        quiz_id: 'quiz-aiml-neural',
        question: 'What is an activation function?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-aiml-3-1-1', question_id: 'q-aiml-3-1', text: 'A function that starts training', is_correct: false },
          { id: 'opt-aiml-3-1-2', question_id: 'q-aiml-3-1', text: 'A function that introduces non-linearity to neurons', is_correct: true },
          { id: 'opt-aiml-3-1-3', question_id: 'q-aiml-3-1', text: 'A function that loads data', is_correct: false },
          { id: 'opt-aiml-3-1-4', question_id: 'q-aiml-3-1', text: 'A function that saves models', is_correct: false },
        ],
        explanation: 'Activation functions introduce non-linearity, allowing neural networks to learn complex patterns.',
        points: 10,
        order: 1,
      },
      {
        id: 'q-aiml-3-2',
        quiz_id: 'quiz-aiml-neural',
        question: 'Which activation function is commonly used in the output layer for binary classification?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-aiml-3-2-1', question_id: 'q-aiml-3-2', text: 'ReLU', is_correct: false },
          { id: 'opt-aiml-3-2-2', question_id: 'q-aiml-3-2', text: 'Sigmoid', is_correct: true },
          { id: 'opt-aiml-3-2-3', question_id: 'q-aiml-3-2', text: 'Tanh', is_correct: false },
          { id: 'opt-aiml-3-2-4', question_id: 'q-aiml-3-2', text: 'Linear', is_correct: false },
        ],
        explanation: 'Sigmoid outputs values between 0 and 1, making it ideal for binary classification.',
        points: 10,
        order: 2,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'quiz-aiml-deployment',
    lesson_id: 'lesson-aiml-5-5',
    course_id: 'course-4',
    title: 'ML Deployment Quiz',
    description: 'Test your ML deployment knowledge',
    time_limit_minutes: 15,
    passing_score: 70,
    max_attempts: 3,
    shuffle_questions: true,
    show_correct_answers: true,
    questions: [
      {
        id: 'q-aiml-5-1',
        quiz_id: 'quiz-aiml-deployment',
        question: 'What is MLOps?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-aiml-5-1-1', question_id: 'q-aiml-5-1', text: 'A programming language', is_correct: false },
          { id: 'opt-aiml-5-1-2', question_id: 'q-aiml-5-1', text: 'DevOps practices for ML systems', is_correct: true },
          { id: 'opt-aiml-5-1-3', question_id: 'q-aiml-5-1', text: 'A type of neural network', is_correct: false },
          { id: 'opt-aiml-5-1-4', question_id: 'q-aiml-5-1', text: 'A database system', is_correct: false },
        ],
        explanation: 'MLOps combines DevOps practices with machine learning to streamline the ML lifecycle.',
        points: 10,
        order: 1,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // ============================================
  // COURSE 5: UI/UX Design Quizzes
  // ============================================
  {
    id: 'quiz-uiux-principles',
    lesson_id: 'lesson-uiux-1-5',
    course_id: 'course-5',
    title: 'Design Principles Quiz',
    description: 'Test your understanding of UX design principles',
    time_limit_minutes: 15,
    passing_score: 70,
    max_attempts: 3,
    shuffle_questions: true,
    show_correct_answers: true,
    questions: [
      {
        id: 'q-uiux-1-1',
        quiz_id: 'quiz-uiux-principles',
        question: 'What does UX stand for?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-uiux-1-1-1', question_id: 'q-uiux-1-1', text: 'Universal Experience', is_correct: false },
          { id: 'opt-uiux-1-1-2', question_id: 'q-uiux-1-1', text: 'User Experience', is_correct: true },
          { id: 'opt-uiux-1-1-3', question_id: 'q-uiux-1-1', text: 'Unified Exchange', is_correct: false },
          { id: 'opt-uiux-1-1-4', question_id: 'q-uiux-1-1', text: 'User Extension', is_correct: false },
        ],
        explanation: 'UX stands for User Experience, encompassing all aspects of user interaction with a product.',
        points: 10,
        order: 1,
      },
      {
        id: 'q-uiux-1-2',
        quiz_id: 'quiz-uiux-principles',
        question: "Nielsen's 10 Usability Heuristics are guidelines for user interface design.",
        question_type: 'true_false',
        options: [
          { id: 'opt-uiux-1-2-1', question_id: 'q-uiux-1-2', text: 'True', is_correct: true },
          { id: 'opt-uiux-1-2-2', question_id: 'q-uiux-1-2', text: 'False', is_correct: false },
        ],
        explanation: "Jakob Nielsen's 10 heuristics are widely used principles for evaluating UI design.",
        points: 10,
        order: 2,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'quiz-uiux-research',
    lesson_id: 'lesson-uiux-3-5',
    course_id: 'course-5',
    title: 'User Research Quiz',
    description: 'Test your user research methodology knowledge',
    time_limit_minutes: 15,
    passing_score: 70,
    max_attempts: 3,
    shuffle_questions: true,
    show_correct_answers: true,
    questions: [
      {
        id: 'q-uiux-3-1',
        quiz_id: 'quiz-uiux-research',
        question: 'What is a user persona?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-uiux-3-1-1', question_id: 'q-uiux-3-1', text: 'A real user account', is_correct: false },
          { id: 'opt-uiux-3-1-2', question_id: 'q-uiux-3-1', text: 'A fictional representation of target users', is_correct: true },
          { id: 'opt-uiux-3-1-3', question_id: 'q-uiux-3-1', text: 'A design tool', is_correct: false },
          { id: 'opt-uiux-3-1-4', question_id: 'q-uiux-3-1', text: 'A testing environment', is_correct: false },
        ],
        explanation: 'User personas are fictional characters representing different user types based on research.',
        points: 10,
        order: 1,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // ============================================
  // COURSE 6: AWS Solutions Architect Quizzes
  // ============================================
  {
    id: 'quiz-aws-fundamentals',
    lesson_id: 'lesson-aws-1-5',
    course_id: 'course-6',
    title: 'AWS Fundamentals Quiz',
    description: 'Test your AWS core services knowledge',
    time_limit_minutes: 15,
    passing_score: 70,
    max_attempts: 3,
    shuffle_questions: true,
    show_correct_answers: true,
    questions: [
      {
        id: 'q-aws-1-1',
        quiz_id: 'quiz-aws-fundamentals',
        question: 'What is an AWS Region?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-aws-1-1-1', question_id: 'q-aws-1-1', text: 'A single data center', is_correct: false },
          { id: 'opt-aws-1-1-2', question_id: 'q-aws-1-1', text: 'A geographical area with multiple Availability Zones', is_correct: true },
          { id: 'opt-aws-1-1-3', question_id: 'q-aws-1-1', text: 'A virtual network', is_correct: false },
          { id: 'opt-aws-1-1-4', question_id: 'q-aws-1-1', text: 'A storage bucket', is_correct: false },
        ],
        explanation: 'An AWS Region is a geographical location consisting of multiple isolated Availability Zones.',
        points: 10,
        order: 1,
      },
      {
        id: 'q-aws-1-2',
        quiz_id: 'quiz-aws-fundamentals',
        question: 'S3 stands for Simple Storage Service.',
        question_type: 'true_false',
        options: [
          { id: 'opt-aws-1-2-1', question_id: 'q-aws-1-2', text: 'True', is_correct: true },
          { id: 'opt-aws-1-2-2', question_id: 'q-aws-1-2', text: 'False', is_correct: false },
        ],
        explanation: 'Amazon S3 stands for Simple Storage Service, an object storage service.',
        points: 10,
        order: 2,
      },
      {
        id: 'q-aws-1-3',
        quiz_id: 'quiz-aws-fundamentals',
        question: 'Which AWS service is used for virtual servers?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-aws-1-3-1', question_id: 'q-aws-1-3', text: 'Lambda', is_correct: false },
          { id: 'opt-aws-1-3-2', question_id: 'q-aws-1-3', text: 'EC2', is_correct: true },
          { id: 'opt-aws-1-3-3', question_id: 'q-aws-1-3', text: 'S3', is_correct: false },
          { id: 'opt-aws-1-3-4', question_id: 'q-aws-1-3', text: 'RDS', is_correct: false },
        ],
        explanation: 'EC2 (Elastic Compute Cloud) provides virtual servers in the AWS cloud.',
        points: 10,
        order: 3,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'quiz-aws-networking',
    lesson_id: 'lesson-aws-3-5',
    course_id: 'course-6',
    title: 'AWS Networking Quiz',
    description: 'Test your AWS networking knowledge',
    time_limit_minutes: 15,
    passing_score: 70,
    max_attempts: 3,
    shuffle_questions: true,
    show_correct_answers: true,
    questions: [
      {
        id: 'q-aws-3-1',
        quiz_id: 'quiz-aws-networking',
        question: 'What is a VPC?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-aws-3-1-1', question_id: 'q-aws-3-1', text: 'Virtual Private Cloud', is_correct: true },
          { id: 'opt-aws-3-1-2', question_id: 'q-aws-3-1', text: 'Virtual Processing Center', is_correct: false },
          { id: 'opt-aws-3-1-3', question_id: 'q-aws-3-1', text: 'Virtual Public Connection', is_correct: false },
          { id: 'opt-aws-3-1-4', question_id: 'q-aws-3-1', text: 'Variable Performance Computing', is_correct: false },
        ],
        explanation: 'VPC stands for Virtual Private Cloud, an isolated network in AWS.',
        points: 10,
        order: 1,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'quiz-aws-security',
    lesson_id: 'lesson-aws-5-5',
    course_id: 'course-6',
    title: 'AWS Security Quiz',
    description: 'Test your AWS security knowledge',
    time_limit_minutes: 15,
    passing_score: 70,
    max_attempts: 3,
    shuffle_questions: true,
    show_correct_answers: true,
    questions: [
      {
        id: 'q-aws-5-1',
        quiz_id: 'quiz-aws-security',
        question: 'What is IAM in AWS?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-aws-5-1-1', question_id: 'q-aws-5-1', text: 'Internet Access Management', is_correct: false },
          { id: 'opt-aws-5-1-2', question_id: 'q-aws-5-1', text: 'Identity and Access Management', is_correct: true },
          { id: 'opt-aws-5-1-3', question_id: 'q-aws-5-1', text: 'Instance Allocation Module', is_correct: false },
          { id: 'opt-aws-5-1-4', question_id: 'q-aws-5-1', text: 'Internal Audit Manager', is_correct: false },
        ],
        explanation: 'IAM is Identity and Access Management, controlling who can access AWS resources.',
        points: 10,
        order: 1,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // ============================================
  // COURSE 7: Next.js 14 Quizzes
  // ============================================
  {
    id: 'quiz-next-fundamentals',
    lesson_id: 'lesson-next-1-5',
    course_id: 'course-7',
    title: 'Next.js Fundamentals Quiz',
    description: 'Test your Next.js 14 core concepts knowledge',
    time_limit_minutes: 15,
    passing_score: 70,
    max_attempts: 3,
    shuffle_questions: true,
    show_correct_answers: true,
    questions: [
      {
        id: 'q-next-1-1',
        quiz_id: 'quiz-next-fundamentals',
        question: 'What is the App Router in Next.js 14?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-next-1-1-1', question_id: 'q-next-1-1', text: 'A mobile app builder', is_correct: false },
          { id: 'opt-next-1-1-2', question_id: 'q-next-1-1', text: 'A file-system based router using the app directory', is_correct: true },
          { id: 'opt-next-1-1-3', question_id: 'q-next-1-1', text: 'A network routing protocol', is_correct: false },
          { id: 'opt-next-1-1-4', question_id: 'q-next-1-1', text: 'A package manager', is_correct: false },
        ],
        explanation: 'The App Router is Next.js 14s file-system based routing using the app directory with React Server Components.',
        points: 10,
        order: 1,
      },
      {
        id: 'q-next-1-2',
        quiz_id: 'quiz-next-fundamentals',
        question: 'Server Components are rendered on the server by default in Next.js 14.',
        question_type: 'true_false',
        options: [
          { id: 'opt-next-1-2-1', question_id: 'q-next-1-2', text: 'True', is_correct: true },
          { id: 'opt-next-1-2-2', question_id: 'q-next-1-2', text: 'False', is_correct: false },
        ],
        explanation: 'In Next.js 14 App Router, components are Server Components by default.',
        points: 10,
        order: 2,
      },
      {
        id: 'q-next-1-3',
        quiz_id: 'quiz-next-fundamentals',
        question: 'Which directive marks a component as a Client Component?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-next-1-3-1', question_id: 'q-next-1-3', text: '"use server"', is_correct: false },
          { id: 'opt-next-1-3-2', question_id: 'q-next-1-3', text: '"use client"', is_correct: true },
          { id: 'opt-next-1-3-3', question_id: 'q-next-1-3', text: '"use browser"', is_correct: false },
          { id: 'opt-next-1-3-4', question_id: 'q-next-1-3', text: '"client only"', is_correct: false },
        ],
        explanation: 'The "use client" directive at the top of a file marks it as a Client Component.',
        points: 10,
        order: 3,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'quiz-next-data',
    lesson_id: 'lesson-next-3-5',
    course_id: 'course-7',
    title: 'Data Fetching Quiz',
    description: 'Test your Next.js data fetching knowledge',
    time_limit_minutes: 15,
    passing_score: 70,
    max_attempts: 3,
    shuffle_questions: true,
    show_correct_answers: true,
    questions: [
      {
        id: 'q-next-3-1',
        quiz_id: 'quiz-next-data',
        question: 'What are Server Actions in Next.js 14?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-next-3-1-1', question_id: 'q-next-3-1', text: 'Database connections', is_correct: false },
          { id: 'opt-next-3-1-2', question_id: 'q-next-3-1', text: 'Async functions that run on the server for mutations', is_correct: true },
          { id: 'opt-next-3-1-3', question_id: 'q-next-3-1', text: 'API routes', is_correct: false },
          { id: 'opt-next-3-1-4', question_id: 'q-next-3-1', text: 'Middleware functions', is_correct: false },
        ],
        explanation: 'Server Actions are async functions executed on the server for data mutations.',
        points: 10,
        order: 1,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // ============================================
  // COURSE 8: Python for Data Science Quizzes
  // ============================================
  {
    id: 'quiz-pyds-foundations',
    lesson_id: 'lesson-pyds-1-5',
    course_id: 'course-8',
    title: 'Python Data Science Foundations Quiz',
    description: 'Test your Python and data science basics',
    time_limit_minutes: 15,
    passing_score: 70,
    max_attempts: 3,
    shuffle_questions: true,
    show_correct_answers: true,
    questions: [
      {
        id: 'q-pyds-1-1',
        quiz_id: 'quiz-pyds-foundations',
        question: 'Which library is primarily used for numerical computing in Python?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-pyds-1-1-1', question_id: 'q-pyds-1-1', text: 'Pandas', is_correct: false },
          { id: 'opt-pyds-1-1-2', question_id: 'q-pyds-1-1', text: 'NumPy', is_correct: true },
          { id: 'opt-pyds-1-1-3', question_id: 'q-pyds-1-1', text: 'Matplotlib', is_correct: false },
          { id: 'opt-pyds-1-1-4', question_id: 'q-pyds-1-1', text: 'Scikit-learn', is_correct: false },
        ],
        explanation: 'NumPy is the fundamental package for numerical computing in Python.',
        points: 10,
        order: 1,
      },
      {
        id: 'q-pyds-1-2',
        quiz_id: 'quiz-pyds-foundations',
        question: 'Pandas DataFrame is similar to a spreadsheet or SQL table.',
        question_type: 'true_false',
        options: [
          { id: 'opt-pyds-1-2-1', question_id: 'q-pyds-1-2', text: 'True', is_correct: true },
          { id: 'opt-pyds-1-2-2', question_id: 'q-pyds-1-2', text: 'False', is_correct: false },
        ],
        explanation: 'A DataFrame is a 2D labeled data structure, similar to a spreadsheet or SQL table.',
        points: 10,
        order: 2,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'quiz-pyds-visualization',
    lesson_id: 'lesson-pyds-3-5',
    course_id: 'course-8',
    title: 'Data Visualization Quiz',
    description: 'Test your data visualization knowledge',
    time_limit_minutes: 15,
    passing_score: 70,
    max_attempts: 3,
    shuffle_questions: true,
    show_correct_answers: true,
    questions: [
      {
        id: 'q-pyds-3-1',
        quiz_id: 'quiz-pyds-visualization',
        question: 'Which library is built on top of Matplotlib for statistical visualization?',
        question_type: 'multiple_choice',
        options: [
          { id: 'opt-pyds-3-1-1', question_id: 'q-pyds-3-1', text: 'Plotly', is_correct: false },
          { id: 'opt-pyds-3-1-2', question_id: 'q-pyds-3-1', text: 'Seaborn', is_correct: true },
          { id: 'opt-pyds-3-1-3', question_id: 'q-pyds-3-1', text: 'Bokeh', is_correct: false },
          { id: 'opt-pyds-3-1-4', question_id: 'q-pyds-3-1', text: 'Altair', is_correct: false },
        ],
        explanation: 'Seaborn is built on Matplotlib and provides a high-level interface for statistical graphics.',
        points: 10,
        order: 1,
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
  // ============================================
  // COURSE 3: Node.js Backend Development Assignments
  // ============================================
  {
    id: 'assignment-node-cli',
    lesson_id: 'lesson-node-2-5',
    course_id: 'course-3',
    title: 'Build a CLI Task Manager',
    description: 'Create a command-line task management application',
    instructions: `## Objective
Build a command-line task manager using Node.js core modules.

## Requirements

### Core Features
1. **Add Tasks**: Add new tasks with title and optional description
2. **List Tasks**: Display all tasks with status
3. **Complete Tasks**: Mark tasks as complete
4. **Delete Tasks**: Remove tasks from the list
5. **Persistence**: Save tasks to a JSON file

### Commands
\`\`\`bash
node task.js add "Buy groceries" --desc "Milk, eggs, bread"
node task.js list
node task.js complete 1
node task.js delete 1
\`\`\`

### Technical Requirements
- Use only Node.js built-in modules (fs, path, readline)
- Handle errors gracefully
- Pretty-print output with colors (use ANSI codes)

## Submission
Submit a GitHub repository with your implementation.`,
    due_days_after_enrollment: 7,
    max_score: 100,
    submission_types: ['url'],
    rubric: [
      { id: 'rubric-node-cli-1', criteria: 'Core Functionality', description: 'All CRUD operations work correctly', max_points: 40 },
      { id: 'rubric-node-cli-2', criteria: 'Error Handling', description: 'Graceful error handling and user feedback', max_points: 25 },
      { id: 'rubric-node-cli-3', criteria: 'Code Quality', description: 'Clean, modular code structure', max_points: 20 },
      { id: 'rubric-node-cli-4', criteria: 'UX', description: 'Good command-line user experience', max_points: 15 },
    ],
    resources: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'assignment-node-api',
    lesson_id: 'lesson-node-4-4',
    course_id: 'course-3',
    title: 'Build a Task Management API',
    description: 'Create a complete RESTful API for task management',
    instructions: `## Objective
Build a production-ready RESTful API for task management using Express.js.

## Requirements

### Endpoints
- \`GET /api/tasks\` - List all tasks (with pagination)
- \`GET /api/tasks/:id\` - Get single task
- \`POST /api/tasks\` - Create task
- \`PUT /api/tasks/:id\` - Update task
- \`DELETE /api/tasks/:id\` - Delete task

### Features
1. Request validation using Joi or Zod
2. Error handling middleware
3. Input sanitization
4. Rate limiting
5. API documentation (Swagger or README)

### Data Model
\`\`\`typescript
interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
}
\`\`\`

## Submission
Submit a GitHub repository with your API implementation.`,
    due_days_after_enrollment: 14,
    max_score: 100,
    submission_types: ['url'],
    rubric: [
      { id: 'rubric-node-api-1', criteria: 'API Design', description: 'RESTful design principles followed', max_points: 30 },
      { id: 'rubric-node-api-2', criteria: 'Validation', description: 'Proper input validation', max_points: 25 },
      { id: 'rubric-node-api-3', criteria: 'Error Handling', description: 'Comprehensive error handling', max_points: 25 },
      { id: 'rubric-node-api-4', criteria: 'Documentation', description: 'Clear API documentation', max_points: 20 },
    ],
    resources: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // ============================================
  // COURSE 4: AI & ML Bootcamp Assignments
  // ============================================
  {
    id: 'assignment-aiml-eda',
    lesson_id: 'lesson-aiml-2-5',
    course_id: 'course-4',
    title: 'Exploratory Data Analysis Project',
    description: 'Perform comprehensive EDA on a real dataset',
    instructions: `## Objective
Perform exploratory data analysis on the provided housing dataset.

## Requirements

### Analysis Tasks
1. **Data Overview**: Shape, types, missing values
2. **Statistical Summary**: Mean, median, std dev, quartiles
3. **Visualizations**:
   - Distribution plots for numerical features
   - Correlation heatmap
   - Scatter plots for key relationships
4. **Feature Engineering**: Create 2-3 new meaningful features
5. **Insights**: Document 5 key findings

### Deliverables
- Jupyter notebook with analysis
- Executive summary (1 page)
- Cleaned dataset

## Submission
Submit a Jupyter notebook (.ipynb) with your analysis.`,
    due_days_after_enrollment: 7,
    max_score: 100,
    submission_types: ['file', 'url'],
    allowed_file_types: ['.ipynb', '.zip'],
    rubric: [
      { id: 'rubric-aiml-eda-1', criteria: 'Data Understanding', description: 'Thorough data exploration', max_points: 25 },
      { id: 'rubric-aiml-eda-2', criteria: 'Visualizations', description: 'Clear, informative charts', max_points: 30 },
      { id: 'rubric-aiml-eda-3', criteria: 'Feature Engineering', description: 'Meaningful new features', max_points: 25 },
      { id: 'rubric-aiml-eda-4', criteria: 'Insights', description: 'Actionable insights documented', max_points: 20 },
    ],
    resources: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'assignment-aiml-model',
    lesson_id: 'lesson-aiml-4-4',
    course_id: 'course-4',
    title: 'Build a Classification Model',
    description: 'Train and evaluate a machine learning classifier',
    instructions: `## Objective
Build a classification model to predict customer churn.

## Requirements

### Tasks
1. Data preprocessing and cleaning
2. Feature selection and engineering
3. Train multiple models (Logistic Regression, Random Forest, XGBoost)
4. Hyperparameter tuning
5. Model evaluation and comparison
6. Feature importance analysis

### Evaluation Metrics
- Accuracy, Precision, Recall, F1-Score
- ROC-AUC curve
- Confusion matrix

### Deliverables
- Jupyter notebook with full pipeline
- Trained model file (.pkl)
- Performance comparison table

## Submission
Submit your Jupyter notebook and model file.`,
    due_days_after_enrollment: 14,
    max_score: 100,
    submission_types: ['file', 'url'],
    allowed_file_types: ['.ipynb', '.pkl', '.zip'],
    rubric: [
      { id: 'rubric-aiml-model-1', criteria: 'Preprocessing', description: 'Proper data preparation', max_points: 20 },
      { id: 'rubric-aiml-model-2', criteria: 'Model Training', description: 'Multiple models trained correctly', max_points: 30 },
      { id: 'rubric-aiml-model-3', criteria: 'Evaluation', description: 'Comprehensive evaluation metrics', max_points: 30 },
      { id: 'rubric-aiml-model-4', criteria: 'Documentation', description: 'Clear explanations and conclusions', max_points: 20 },
    ],
    resources: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // ============================================
  // COURSE 5: UI/UX Design Assignments
  // ============================================
  {
    id: 'assignment-uiux-wireframe',
    lesson_id: 'lesson-uiux-2-5',
    course_id: 'course-5',
    title: 'Wireframe a Mobile App',
    description: 'Create wireframes for a fitness tracking app',
    instructions: `## Objective
Design wireframes for a fitness tracking mobile application.

## Requirements

### Screens to Design
1. Onboarding flow (3 screens)
2. Home/Dashboard
3. Workout logging
4. Progress/Statistics
5. Settings/Profile

### Deliverables
- Low-fidelity wireframes for all screens
- User flow diagram
- Brief annotation document explaining design decisions

### Tools
Use Figma, Sketch, or Adobe XD

## Submission
Submit a link to your design file and PDF exports.`,
    due_days_after_enrollment: 7,
    max_score: 100,
    submission_types: ['url', 'file'],
    allowed_file_types: ['.pdf', '.fig', '.sketch'],
    rubric: [
      { id: 'rubric-uiux-wire-1', criteria: 'Completeness', description: 'All required screens included', max_points: 25 },
      { id: 'rubric-uiux-wire-2', criteria: 'User Flow', description: 'Logical navigation and flow', max_points: 30 },
      { id: 'rubric-uiux-wire-3', criteria: 'Usability', description: 'Intuitive interface design', max_points: 25 },
      { id: 'rubric-uiux-wire-4', criteria: 'Documentation', description: 'Clear design rationale', max_points: 20 },
    ],
    resources: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'assignment-uiux-prototype',
    lesson_id: 'lesson-uiux-4-4',
    course_id: 'course-5',
    title: 'High-Fidelity Prototype',
    description: 'Create an interactive prototype from wireframes',
    instructions: `## Objective
Transform your wireframes into a high-fidelity interactive prototype.

## Requirements

### Design Elements
1. Apply a consistent design system
2. Include proper typography hierarchy
3. Create a color palette (accessibility-compliant)
4. Design custom icons or use an icon library
5. Add micro-interactions and transitions

### Prototype Features
- Interactive navigation between all screens
- Form interactions
- Loading states
- Empty states
- Error states

## Submission
Submit Figma/Sketch link with interactive prototype.`,
    due_days_after_enrollment: 14,
    max_score: 100,
    submission_types: ['url'],
    rubric: [
      { id: 'rubric-uiux-proto-1', criteria: 'Visual Design', description: 'Polished, professional aesthetics', max_points: 30 },
      { id: 'rubric-uiux-proto-2', criteria: 'Interactivity', description: 'Smooth, complete interactions', max_points: 30 },
      { id: 'rubric-uiux-proto-3', criteria: 'Consistency', description: 'Design system adherence', max_points: 20 },
      { id: 'rubric-uiux-proto-4', criteria: 'Accessibility', description: 'Color contrast, touch targets', max_points: 20 },
    ],
    resources: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // ============================================
  // COURSE 6: AWS Solutions Architect Assignments
  // ============================================
  {
    id: 'assignment-aws-vpc',
    lesson_id: 'lesson-aws-2-5',
    course_id: 'course-6',
    title: 'Design a Multi-Tier VPC',
    description: 'Create a production-ready VPC architecture',
    instructions: `## Objective
Design and document a multi-tier VPC architecture for a web application.

## Requirements

### Architecture Components
1. VPC with public and private subnets across 2 AZs
2. Internet Gateway and NAT Gateway
3. Security Groups and NACLs
4. Route tables configuration

### Documentation
- Architecture diagram (use draw.io or Lucidchart)
- CIDR allocation plan
- Security group rules documentation
- Cost estimation

### Bonus
- CloudFormation or Terraform template

## Submission
Submit your architecture diagram and documentation.`,
    due_days_after_enrollment: 10,
    max_score: 100,
    submission_types: ['file', 'url'],
    allowed_file_types: ['.pdf', '.png', '.yaml', '.tf'],
    rubric: [
      { id: 'rubric-aws-vpc-1', criteria: 'Architecture Design', description: 'Proper multi-tier design', max_points: 35 },
      { id: 'rubric-aws-vpc-2', criteria: 'Security', description: 'Appropriate security controls', max_points: 30 },
      { id: 'rubric-aws-vpc-3', criteria: 'Documentation', description: 'Clear, complete documentation', max_points: 20 },
      { id: 'rubric-aws-vpc-4', criteria: 'Best Practices', description: 'AWS well-architected principles', max_points: 15 },
    ],
    resources: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'assignment-aws-serverless',
    lesson_id: 'lesson-aws-4-4',
    course_id: 'course-6',
    title: 'Build a Serverless API',
    description: 'Create a serverless REST API using AWS services',
    instructions: `## Objective
Build a serverless REST API using API Gateway, Lambda, and DynamoDB.

## Requirements

### API Endpoints
- CRUD operations for a resource (e.g., products, users)
- Proper error handling
- Input validation

### AWS Services
1. API Gateway - REST API
2. Lambda - Business logic
3. DynamoDB - Data storage
4. IAM - Proper permissions

### Deliverables
- Working API endpoint
- CloudFormation/SAM template
- API documentation
- Architecture diagram

## Submission
Submit your CloudFormation template and API documentation.`,
    due_days_after_enrollment: 14,
    max_score: 100,
    submission_types: ['file', 'url'],
    allowed_file_types: ['.yaml', '.json', '.zip'],
    rubric: [
      { id: 'rubric-aws-sls-1', criteria: 'Functionality', description: 'API works correctly', max_points: 35 },
      { id: 'rubric-aws-sls-2', criteria: 'IaC', description: 'Proper infrastructure as code', max_points: 25 },
      { id: 'rubric-aws-sls-3', criteria: 'Security', description: 'Least privilege IAM', max_points: 20 },
      { id: 'rubric-aws-sls-4', criteria: 'Documentation', description: 'Complete API docs', max_points: 20 },
    ],
    resources: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // ============================================
  // COURSE 7: Next.js 14 Assignments
  // ============================================
  {
    id: 'assignment-next-blog',
    lesson_id: 'lesson-next-2-5',
    course_id: 'course-7',
    title: 'Build a Blog with App Router',
    description: 'Create a blog using Next.js 14 App Router',
    instructions: `## Objective
Build a blog application using Next.js 14 App Router features.

## Requirements

### Pages
1. Home page with blog post list
2. Individual blog post pages (dynamic routes)
3. About page
4. Contact page

### Features
- Static generation for blog posts
- MDX support for content
- Metadata API for SEO
- Loading and error states
- Responsive design

### Technical Requirements
- Use Server Components by default
- Client Components only where needed
- Implement generateStaticParams
- Add proper TypeScript types

## Submission
Submit a GitHub repository with your blog implementation.`,
    due_days_after_enrollment: 10,
    max_score: 100,
    submission_types: ['url'],
    rubric: [
      { id: 'rubric-next-blog-1', criteria: 'App Router Usage', description: 'Proper use of App Router features', max_points: 30 },
      { id: 'rubric-next-blog-2', criteria: 'Server/Client Components', description: 'Appropriate component boundaries', max_points: 25 },
      { id: 'rubric-next-blog-3', criteria: 'Performance', description: 'Static generation, optimized images', max_points: 25 },
      { id: 'rubric-next-blog-4', criteria: 'Code Quality', description: 'Clean, typed code', max_points: 20 },
    ],
    resources: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'assignment-next-dashboard',
    lesson_id: 'lesson-next-4-4',
    course_id: 'course-7',
    title: 'Build a Dashboard with Server Actions',
    description: 'Create an interactive dashboard using Server Actions',
    instructions: `## Objective
Build an interactive dashboard using Next.js 14 Server Actions.

## Requirements

### Features
1. Data table with sorting and filtering
2. Form for adding/editing items
3. Delete functionality with confirmation
4. Real-time updates after mutations

### Technical Requirements
- Use Server Actions for all mutations
- Implement optimistic updates
- Add form validation
- Use revalidatePath for cache invalidation
- Proper loading states

### UI Components
- Use a component library (shadcn/ui recommended)
- Responsive layout
- Toast notifications for feedback

## Submission
Submit a GitHub repository with deployment to Vercel.`,
    due_days_after_enrollment: 14,
    max_score: 100,
    submission_types: ['url'],
    rubric: [
      { id: 'rubric-next-dash-1', criteria: 'Server Actions', description: 'Proper Server Actions implementation', max_points: 35 },
      { id: 'rubric-next-dash-2', criteria: 'UX', description: 'Loading states, optimistic updates', max_points: 25 },
      { id: 'rubric-next-dash-3', criteria: 'Validation', description: 'Form and data validation', max_points: 20 },
      { id: 'rubric-next-dash-4', criteria: 'Deployment', description: 'Working production deployment', max_points: 20 },
    ],
    resources: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // ============================================
  // COURSE 8: Python for Data Science Assignments
  // ============================================
  {
    id: 'assignment-pyds-analysis',
    lesson_id: 'lesson-pyds-2-4',
    course_id: 'course-8',
    title: 'Data Analysis with Pandas',
    description: 'Analyze a dataset using Pandas',
    instructions: `## Objective
Perform data analysis on a sales dataset using Pandas.

## Requirements

### Analysis Tasks
1. Load and inspect the data
2. Clean missing values and duplicates
3. Aggregate sales by region, product, time
4. Calculate key metrics (revenue, growth, averages)
5. Export cleaned data to CSV

### Deliverables
- Jupyter notebook with analysis
- Summary of findings (markdown)
- Cleaned dataset

### Dataset Columns
- OrderID, Product, Category, Region, Date, Quantity, Price

## Submission
Submit your Jupyter notebook.`,
    due_days_after_enrollment: 7,
    max_score: 100,
    submission_types: ['file'],
    allowed_file_types: ['.ipynb', '.zip'],
    rubric: [
      { id: 'rubric-pyds-ana-1', criteria: 'Data Cleaning', description: 'Proper handling of missing/duplicate data', max_points: 25 },
      { id: 'rubric-pyds-ana-2', criteria: 'Analysis', description: 'Meaningful aggregations and metrics', max_points: 35 },
      { id: 'rubric-pyds-ana-3', criteria: 'Code Quality', description: 'Clean, efficient Pandas code', max_points: 20 },
      { id: 'rubric-pyds-ana-4', criteria: 'Documentation', description: 'Clear explanations', max_points: 20 },
    ],
    resources: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'assignment-pyds-viz',
    lesson_id: 'lesson-pyds-4-4',
    course_id: 'course-8',
    title: 'Data Visualization Dashboard',
    description: 'Create an interactive visualization dashboard',
    instructions: `## Objective
Build an interactive data visualization dashboard using Plotly/Dash.

## Requirements

### Visualizations
1. Line chart for time series data
2. Bar chart for category comparison
3. Pie chart for distribution
4. Scatter plot with correlation
5. Heatmap for correlation matrix

### Interactive Features
- Dropdowns for filtering
- Date range selector
- Hover tooltips
- Export functionality

### Layout
- Responsive grid layout
- Clear titles and labels
- Consistent color scheme

## Submission
Submit your Dash app code and a video demo.`,
    due_days_after_enrollment: 14,
    max_score: 100,
    submission_types: ['file', 'url'],
    allowed_file_types: ['.py', '.zip', '.mp4'],
    rubric: [
      { id: 'rubric-pyds-viz-1', criteria: 'Visualizations', description: 'All chart types implemented', max_points: 30 },
      { id: 'rubric-pyds-viz-2', criteria: 'Interactivity', description: 'Working filters and interactions', max_points: 30 },
      { id: 'rubric-pyds-viz-3', criteria: 'Design', description: 'Clean, professional layout', max_points: 20 },
      { id: 'rubric-pyds-viz-4', criteria: 'Code Quality', description: 'Well-organized code', max_points: 20 },
    ],
    resources: [],
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
  // Course 3: Node.js Backend Development Videos
  {
    id: 'video-node-1-1',
    lesson_id: 'lesson-node-1-1',
    title: 'Welcome to Node.js Backend Development',
    description: 'Introduction to server-side JavaScript',
    script: `Welcome to Node.js Backend Development!

I'm Marcus, a backend engineer with over 12 years of experience building scalable server applications. I've worked at companies like Netflix and Uber, and I'm excited to share my knowledge with you.

Node.js has revolutionized backend development. It allows us to use JavaScript on the server, creating a unified development experience across your entire stack.

In this course, you'll learn:

First, the fundamentals of Node.js - the event loop, modules, and how Node handles asynchronous operations differently from traditional server languages.

Next, we'll build REST APIs with Express.js, the most popular Node.js framework. You'll learn routing, middleware, and best practices for API design.

Then we'll tackle databases - both SQL with PostgreSQL and NoSQL with MongoDB. You'll understand when to use each and how to implement them effectively.

We'll also cover authentication, security, testing, and deployment. By the end, you'll have built a complete production-ready backend.

Prerequisites: Basic JavaScript knowledge and familiarity with terminal commands.

Let's start building powerful backends together!`,
    avatar_id: 'marcus_professional_front',
    avatar_name: 'Marcus - Tech Expert',
    voice_id: 'en-US-MarcusNeural',
    status: 'ready',
    video_url: 'https://cdn.phazurlabs.com/videos/nodejs/1-1-welcome.mp4',
    thumbnail_url: '/thumbnails/node-1-1.jpg',
    duration_seconds: 190,
    heygen_video_id: 'heygen-node-1-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'video-node-1-2',
    lesson_id: 'lesson-node-1-2',
    title: 'Understanding the Event Loop',
    description: 'Deep dive into how Node.js handles asynchronous operations',
    script: `Let's explore the heart of Node.js: the Event Loop.

Understanding the event loop is crucial for writing efficient Node.js code. It's what makes Node.js incredibly fast despite being single-threaded.

Here's how it works:

When your Node.js application starts, it initializes the event loop, processes your code, and then waits for events to handle.

The event loop has several phases:
- Timers: executes callbacks scheduled by setTimeout and setInterval
- I/O callbacks: handles almost all callbacks except close callbacks and timers
- Poll: retrieves new I/O events
- Check: executes setImmediate callbacks
- Close callbacks: handles socket.on('close') callbacks

When you make an asynchronous call, like reading a file or making an HTTP request, Node.js offloads that work to the system kernel or thread pool. When the operation completes, the callback is queued to be executed.

This non-blocking architecture is why Node.js can handle thousands of concurrent connections with a single thread.

Common pitfalls to avoid:
- Blocking the event loop with synchronous operations
- Not understanding callback execution order
- Memory leaks from unclosed event listeners

Let's see this in action with some code examples.`,
    avatar_id: 'marcus_professional_front',
    avatar_name: 'Marcus - Tech Expert',
    voice_id: 'en-US-MarcusNeural',
    status: 'ready',
    video_url: 'https://cdn.phazurlabs.com/videos/nodejs/1-2-event-loop.mp4',
    thumbnail_url: '/thumbnails/node-1-2.jpg',
    duration_seconds: 280,
    heygen_video_id: 'heygen-node-1-2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Course 4: AI & Machine Learning Videos
  {
    id: 'video-aiml-1-1',
    lesson_id: 'lesson-aiml-1-1',
    title: 'Welcome to AI & Machine Learning',
    description: 'Introduction to the world of artificial intelligence',
    script: `Welcome to the AI and Machine Learning Bootcamp!

I'm Dr. Elena, a machine learning researcher with a PhD from Stanford. I've published over 30 papers and led AI teams at major tech companies.

Artificial intelligence is transforming every industry. From healthcare to finance, from transportation to entertainment, AI is revolutionizing how we solve problems.

In this comprehensive bootcamp, you'll learn:

First, the fundamentals - what is machine learning, types of learning (supervised, unsupervised, reinforcement), and the mathematics behind it all.

Next, we'll implement classic algorithms - linear regression, decision trees, support vector machines, and ensemble methods.

Then comes deep learning - neural networks, CNNs for computer vision, RNNs for sequences, and transformers that power modern AI.

We'll use Python with libraries like NumPy, Pandas, Scikit-learn, TensorFlow, and PyTorch.

The final section covers deployment - taking your models from Jupyter notebooks to production systems.

Prerequisites: Basic Python knowledge and high school mathematics. Don't worry if you're not a math expert - I'll explain everything clearly.

Get ready to join the AI revolution!`,
    avatar_id: 'elena_scientist_front',
    avatar_name: 'Dr. Elena - AI Researcher',
    voice_id: 'en-US-ElenaNeural',
    status: 'ready',
    video_url: 'https://cdn.phazurlabs.com/videos/aiml/1-1-welcome.mp4',
    thumbnail_url: '/thumbnails/aiml-1-1.jpg',
    duration_seconds: 210,
    heygen_video_id: 'heygen-aiml-1-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'video-aiml-1-2',
    lesson_id: 'lesson-aiml-1-2',
    title: 'Types of Machine Learning',
    description: 'Understanding supervised, unsupervised, and reinforcement learning',
    script: `Let's explore the three main types of machine learning.

First: Supervised Learning. This is like learning with a teacher. You have input data and correct output labels. The algorithm learns to map inputs to outputs.

Examples include:
- Classification: Is this email spam or not spam?
- Regression: What will this house sell for?

The algorithm learns from labeled examples to make predictions on new data.

Second: Unsupervised Learning. Here, there's no teacher. You have data without labels, and the algorithm finds patterns on its own.

Examples include:
- Clustering: Group similar customers together
- Dimensionality reduction: Simplify data while preserving important features
- Anomaly detection: Find unusual patterns

Third: Reinforcement Learning. This is like training a pet with rewards and punishments. An agent learns by interacting with an environment and receiving feedback.

Examples include:
- Game playing AI like AlphaGo
- Robot navigation
- Recommendation systems

Each type has its strengths. Choosing the right approach depends on your data and problem. Often, real-world solutions combine multiple types.

In the next lessons, we'll dive deep into each type with hands-on implementations.`,
    avatar_id: 'elena_scientist_front',
    avatar_name: 'Dr. Elena - AI Researcher',
    voice_id: 'en-US-ElenaNeural',
    status: 'ready',
    video_url: 'https://cdn.phazurlabs.com/videos/aiml/1-2-ml-types.mp4',
    thumbnail_url: '/thumbnails/aiml-1-2.jpg',
    duration_seconds: 260,
    heygen_video_id: 'heygen-aiml-1-2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Course 5: UI/UX Design Videos
  {
    id: 'video-uiux-1-1',
    lesson_id: 'lesson-uiux-1-1',
    title: 'Welcome to UI/UX Design',
    description: 'Introduction to user-centered design',
    script: `Welcome to the UI/UX Design Masterclass!

I'm Sofia, a principal product designer who has shaped user experiences at Apple, Google, and Spotify. Design is my passion, and I'm thrilled to share my journey with you.

What's the difference between UI and UX?

UX, User Experience, is about how a product feels. It's the complete experience a user has when interacting with your product. It includes research, strategy, and information architecture.

UI, User Interface, is about how a product looks. It's the visual elements - colors, typography, icons, and layouts that users interact with.

Both are essential. Beautiful UI without good UX is just decoration. Great UX with poor UI lacks polish.

In this course, you'll master:

Design thinking and user research methods
Information architecture and user flows
Wireframing and prototyping in Figma
Visual design principles and design systems
Usability testing and iteration

We'll work on real projects that you can add to your portfolio.

No prerequisites needed - just curiosity and a desire to create amazing user experiences.

Let's design products people love!`,
    avatar_id: 'sofia_creative_front',
    avatar_name: 'Sofia - Design Lead',
    voice_id: 'en-US-SofiaNeural',
    status: 'ready',
    video_url: 'https://cdn.phazurlabs.com/videos/uiux/1-1-welcome.mp4',
    thumbnail_url: '/thumbnails/uiux-1-1.jpg',
    duration_seconds: 175,
    heygen_video_id: 'heygen-uiux-1-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'video-uiux-1-2',
    lesson_id: 'lesson-uiux-1-2',
    title: 'Design Thinking Process',
    description: 'Understanding the five stages of design thinking',
    script: `Let's explore Design Thinking, a human-centered approach to problem solving.

Design Thinking has five stages:

Stage 1: Empathize. Put yourself in the user's shoes. Conduct interviews, observe behavior, and gather insights. The goal is to truly understand your users' needs, desires, and pain points.

Stage 2: Define. Synthesize your research into a clear problem statement. A good problem statement is human-centered, broad enough for creativity, and narrow enough to be actionable.

Stage 3: Ideate. Generate as many ideas as possible. Use techniques like brainstorming, mind mapping, and sketching. Don't judge ideas yet - quantity leads to quality.

Stage 4: Prototype. Build quick, rough representations of your ideas. Prototypes can be paper sketches, clickable wireframes, or functional demos. The goal is to make ideas tangible.

Stage 5: Test. Put your prototype in front of real users. Observe how they interact with it. Gather feedback and identify what works and what doesn't.

Here's the key: Design Thinking is iterative, not linear. You'll move back and forth between stages as you learn.

Let's see how this applies to real design challenges.`,
    avatar_id: 'sofia_creative_front',
    avatar_name: 'Sofia - Design Lead',
    voice_id: 'en-US-SofiaNeural',
    status: 'ready',
    video_url: 'https://cdn.phazurlabs.com/videos/uiux/1-2-design-thinking.mp4',
    thumbnail_url: '/thumbnails/uiux-1-2.jpg',
    duration_seconds: 240,
    heygen_video_id: 'heygen-uiux-1-2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Course 6: AWS Solutions Architect Videos
  {
    id: 'video-aws-1-1',
    lesson_id: 'lesson-aws-1-1',
    title: 'Welcome to AWS Solutions Architect',
    description: 'Introduction to cloud architecture',
    script: `Welcome to AWS Solutions Architect!

I'm David, an AWS Solutions Architect Professional with 15 years of cloud experience. I've designed cloud infrastructure for Fortune 500 companies and startups alike.

Amazon Web Services is the world's leading cloud platform. Understanding AWS is essential for modern technology careers.

In this comprehensive course, you'll learn:

Core services - EC2 for compute, S3 for storage, RDS for databases, and Lambda for serverless. These are the building blocks of AWS.

Networking - VPCs, subnets, security groups, and load balancers. You'll design secure, scalable network architectures.

Security - IAM, encryption, and compliance. Security is job zero at AWS, and it will be in your designs too.

High availability and disaster recovery - Multi-AZ deployments, cross-region replication, and backup strategies.

Cost optimization - Right-sizing, reserved instances, and architectural decisions that save money.

This course prepares you for the AWS Solutions Architect Associate certification. We'll cover all exam objectives with hands-on labs.

Prerequisites: Basic IT knowledge. No prior cloud experience needed.

Let's architect the cloud!`,
    avatar_id: 'david_cloud_front',
    avatar_name: 'David - Cloud Architect',
    voice_id: 'en-US-DavidNeural',
    status: 'ready',
    video_url: 'https://cdn.phazurlabs.com/videos/aws/1-1-welcome.mp4',
    thumbnail_url: '/thumbnails/aws-1-1.jpg',
    duration_seconds: 200,
    heygen_video_id: 'heygen-aws-1-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'video-aws-1-2',
    lesson_id: 'lesson-aws-1-2',
    title: 'AWS Global Infrastructure',
    description: 'Understanding regions, availability zones, and edge locations',
    script: `Let's explore AWS's global infrastructure.

AWS operates in regions around the world. A region is a physical location with multiple data centers. As of today, AWS has over 30 regions globally.

Why does this matter? Regions let you:
- Reduce latency by putting resources near users
- Meet data residency requirements
- Achieve disaster recovery across geographic areas

Within each region are Availability Zones, or AZs. An AZ is one or more data centers with redundant power, networking, and connectivity. AZs are isolated from each other to prevent correlated failures.

Most regions have 3 or more AZs. When you deploy across multiple AZs, your application stays running even if an entire data center fails.

Then there are Edge Locations. These are points of presence for CloudFront, AWS's content delivery network. Edge locations cache content close to users for faster delivery. There are over 400 edge locations worldwide.

Key architectural decisions:
- Choose regions based on latency, cost, and compliance
- Always deploy production workloads across multiple AZs
- Use CloudFront edge locations for static content and APIs

Let's see how to implement this in the AWS console.`,
    avatar_id: 'david_cloud_front',
    avatar_name: 'David - Cloud Architect',
    voice_id: 'en-US-DavidNeural',
    status: 'ready',
    video_url: 'https://cdn.phazurlabs.com/videos/aws/1-2-infrastructure.mp4',
    thumbnail_url: '/thumbnails/aws-1-2.jpg',
    duration_seconds: 270,
    heygen_video_id: 'heygen-aws-1-2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Course 7: Next.js 14 Full Course Videos
  {
    id: 'video-next-1-1',
    lesson_id: 'lesson-next-1-1',
    title: 'Welcome to Next.js 14',
    description: 'Introduction to the React framework for production',
    script: `Welcome to the Next.js 14 Full Course!

I'm Rachel, a full-stack developer who has been using Next.js since version 1. I've built applications serving millions of users and I'm here to share everything I know.

Next.js is the React framework for production. It's used by companies like Netflix, TikTok, and Nike to build fast, scalable web applications.

What makes Next.js 14 special?

The App Router: A new paradigm for building React applications with nested layouts, server components, and streaming.

Server Components: React components that render on the server, reducing JavaScript sent to the client and improving performance.

Server Actions: A simple way to handle form submissions and data mutations without building separate API endpoints.

Partial Prerendering: The best of static and dynamic rendering in a single page.

In this course, you'll learn:
- The App Router and file-based routing
- Server vs. Client Components
- Data fetching strategies
- Authentication and middleware
- Deployment and optimization

Prerequisites: Solid React knowledge, including hooks and functional components.

Let's build the future of web development!`,
    avatar_id: 'rachel_frontend_front',
    avatar_name: 'Rachel - Full-Stack Dev',
    voice_id: 'en-US-RachelNeural',
    status: 'ready',
    video_url: 'https://cdn.phazurlabs.com/videos/nextjs/1-1-welcome.mp4',
    thumbnail_url: '/thumbnails/next-1-1.jpg',
    duration_seconds: 185,
    heygen_video_id: 'heygen-next-1-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'video-next-1-2',
    lesson_id: 'lesson-next-1-2',
    title: 'Understanding the App Router',
    description: 'Deep dive into Next.js 14 routing system',
    script: `Let's explore the App Router, Next.js 14's powerful routing system.

The App Router uses a file-system based approach. Your folder structure becomes your URL structure.

Here's how it works:

Create a folder in your app directory, and it becomes a route segment. Add a page.tsx file, and that route renders content.

For example:
- app/page.tsx renders at the root /
- app/about/page.tsx renders at /about
- app/blog/[slug]/page.tsx creates dynamic routes like /blog/my-post

Special files:
- layout.tsx: Shared UI that wraps child routes
- loading.tsx: Loading states while routes load
- error.tsx: Error boundaries for route segments
- not-found.tsx: Custom 404 pages

Layouts are one of the App Router's superpowers. They persist across navigation, meaning shared UI doesn't re-render. This makes your app feel faster and preserves state.

Route groups with parentheses let you organize routes without affecting URLs. For instance, (marketing) and (shop) can have different layouts but appear at the same URL level.

Parallel routes with @folder let you render multiple pages simultaneously, perfect for dashboards and split views.

Let's build some routes together!`,
    avatar_id: 'rachel_frontend_front',
    avatar_name: 'Rachel - Full-Stack Dev',
    voice_id: 'en-US-RachelNeural',
    status: 'ready',
    video_url: 'https://cdn.phazurlabs.com/videos/nextjs/1-2-app-router.mp4',
    thumbnail_url: '/thumbnails/next-1-2.jpg',
    duration_seconds: 295,
    heygen_video_id: 'heygen-next-1-2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Course 8: Python for Data Science Videos
  {
    id: 'video-pyds-1-1',
    lesson_id: 'lesson-pyds-1-1',
    title: 'Welcome to Python for Data Science',
    description: 'Introduction to data science with Python',
    script: `Welcome to Python for Data Science!

I'm Dr. James, a data scientist with a PhD in Statistics and 20 years of experience turning data into insights. I've worked at NASA, IBM, and several AI startups.

Python has become the language of data science. It's powerful yet readable, with an incredible ecosystem of libraries for data manipulation, visualization, and machine learning.

In this course, you'll master:

Python fundamentals for data work - even if you're new to programming, we'll get you up to speed quickly.

NumPy - the foundation for numerical computing. You'll learn to work with arrays and perform mathematical operations efficiently.

Pandas - the heart of data analysis. You'll master DataFrames for data manipulation, cleaning, and transformation.

Matplotlib and Seaborn - create stunning visualizations that tell stories with data.

Exploratory Data Analysis - the process of investigating datasets to discover patterns and anomalies.

Statistical Analysis - hypothesis testing, correlation, and statistical significance.

We'll work with real datasets throughout - census data, financial data, and scientific data.

Prerequisites: None! This course starts from absolute beginner.

Let's unlock the power of data!`,
    avatar_id: 'james_professor_front',
    avatar_name: 'Dr. James - Data Scientist',
    voice_id: 'en-US-JamesNeural',
    status: 'ready',
    video_url: 'https://cdn.phazurlabs.com/videos/python-ds/1-1-welcome.mp4',
    thumbnail_url: '/thumbnails/pyds-1-1.jpg',
    duration_seconds: 195,
    heygen_video_id: 'heygen-pyds-1-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'video-pyds-1-2',
    lesson_id: 'lesson-pyds-1-2',
    title: 'Setting Up Your Data Science Environment',
    description: 'Installing Python, Jupyter, and essential libraries',
    script: `Let's set up your data science environment.

We'll install everything you need to follow along with this course.

First, Python. I recommend using Anaconda, a Python distribution designed for data science. It includes Python and hundreds of pre-installed packages.

Download Anaconda from anaconda.com. Choose the version for your operating system. The installation is straightforward - just follow the prompts.

Once installed, open Anaconda Navigator. This is your hub for data science tools.

Jupyter Notebook is where you'll spend most of your time. It's an interactive environment that lets you write code, see results, and add notes - all in one document.

Launch Jupyter from Anaconda Navigator. Your browser will open with the Jupyter interface. You can create new notebooks and organize your work.

Key libraries we'll use:
- NumPy: Already installed with Anaconda
- Pandas: Already installed
- Matplotlib: Already installed
- Seaborn: Already installed

If you ever need to install something new, use pip or conda from the terminal.

Let me show you the Jupyter interface and write our first code cell.

Congratulations - you're ready for data science!`,
    avatar_id: 'james_professor_front',
    avatar_name: 'Dr. James - Data Scientist',
    voice_id: 'en-US-JamesNeural',
    status: 'ready',
    video_url: 'https://cdn.phazurlabs.com/videos/python-ds/1-2-setup.mp4',
    thumbnail_url: '/thumbnails/pyds-1-2.jpg',
    duration_seconds: 320,
    heygen_video_id: 'heygen-pyds-1-2',
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
    case 'course-3':
      return nodejsSections
    case 'course-4':
      return aimlSections
    case 'course-5':
      return uiuxSections
    case 'course-6':
      return awsSections
    case 'course-7':
      return nextjsSections
    case 'course-8':
      return pythonDataScienceSections
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
