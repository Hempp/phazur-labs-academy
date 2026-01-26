#!/usr/bin/env npx tsx

/**
 * Comprehensive Course Content Seeder
 *
 * Populates all 8 courses with topic-specific:
 * - Video scripts (500 words: HOOK, CONTENT x3, RECAP, NEXT)
 * - Quizzes (5 questions: multiple_choice + true_false)
 * - Assignments (100 points with rubric)
 *
 * Usage: npx tsx scripts/seed-course-content.ts
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load .env.local
config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cpwowfcqkltnjcixmaaf.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY')
  console.log('Set it: export SUPABASE_SERVICE_ROLE_KEY="your-key"')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ============================================================================
// TOPIC-SPECIFIC COURSE TEMPLATES
// ============================================================================

interface LessonTemplate {
  title: string
  focus: string
  concepts: string[]
  practicalSkill: string
}

interface CourseTemplate {
  slug: string
  matchPatterns: string[]
  modules: {
    name: string
    lessons: LessonTemplate[]
  }[]
  quizBank: {
    concept: string
    questions: {
      text: string
      type: 'multiple_choice' | 'true_false'
      options?: string[]
      answer: string | boolean
      explanation: string
    }[]
  }[]
  assignmentTemplates: {
    type: string
    objective: string
    steps: string[]
    deliverables: string[]
    rubric: Record<string, number>
  }[]
}

// AI & Machine Learning Course Template
const AI_ML_TEMPLATE: CourseTemplate = {
  slug: 'ai-ml',
  matchPatterns: ['ai', 'machine learning', 'artificial intelligence', 'ml', 'deep learning'],
  modules: [
    {
      name: 'Foundations of AI',
      lessons: [
        { title: 'Introduction to Artificial Intelligence', focus: 'history and core concepts of AI', concepts: ['Turing test', 'narrow vs general AI', 'AI applications'], practicalSkill: 'identify AI use cases' },
        { title: 'Mathematics for Machine Learning', focus: 'essential math foundations', concepts: ['linear algebra', 'calculus', 'probability'], practicalSkill: 'solve matrix operations' },
        { title: 'Python for AI Development', focus: 'Python tools for AI', concepts: ['NumPy', 'Pandas', 'Matplotlib'], practicalSkill: 'data manipulation with Python' },
        { title: 'Data Preprocessing Fundamentals', focus: 'cleaning and preparing data', concepts: ['normalization', 'encoding', 'handling missing values'], practicalSkill: 'preprocess a dataset' },
        { title: 'Exploratory Data Analysis', focus: 'understanding data patterns', concepts: ['distributions', 'correlations', 'outliers'], practicalSkill: 'generate EDA report' },
      ]
    },
    {
      name: 'Supervised Learning',
      lessons: [
        { title: 'Linear Regression Deep Dive', focus: 'predicting continuous values', concepts: ['gradient descent', 'cost function', 'R-squared'], practicalSkill: 'build regression model' },
        { title: 'Logistic Regression for Classification', focus: 'binary classification', concepts: ['sigmoid function', 'decision boundary', 'confusion matrix'], practicalSkill: 'classify data points' },
        { title: 'Decision Trees and Random Forests', focus: 'tree-based algorithms', concepts: ['entropy', 'information gain', 'ensemble methods'], practicalSkill: 'train random forest' },
        { title: 'Support Vector Machines', focus: 'margin-based classification', concepts: ['hyperplane', 'kernel trick', 'soft margin'], practicalSkill: 'implement SVM classifier' },
        { title: 'Model Evaluation and Validation', focus: 'measuring model performance', concepts: ['cross-validation', 'precision/recall', 'ROC curves'], practicalSkill: 'evaluate model metrics' },
      ]
    },
    {
      name: 'Neural Networks',
      lessons: [
        { title: 'Neural Network Architecture', focus: 'building blocks of neural nets', concepts: ['neurons', 'activation functions', 'layers'], practicalSkill: 'design network architecture' },
        { title: 'Backpropagation Algorithm', focus: 'training neural networks', concepts: ['chain rule', 'weight updates', 'loss functions'], practicalSkill: 'implement backprop' },
        { title: 'Convolutional Neural Networks', focus: 'image recognition', concepts: ['convolution', 'pooling', 'feature maps'], practicalSkill: 'build CNN for images' },
        { title: 'Recurrent Neural Networks', focus: 'sequence modeling', concepts: ['LSTM', 'GRU', 'vanishing gradients'], practicalSkill: 'process text sequences' },
        { title: 'Transfer Learning Techniques', focus: 'leveraging pretrained models', concepts: ['fine-tuning', 'feature extraction', 'domain adaptation'], practicalSkill: 'apply transfer learning' },
      ]
    },
    {
      name: 'Advanced Topics',
      lessons: [
        { title: 'Natural Language Processing', focus: 'text understanding', concepts: ['tokenization', 'embeddings', 'transformers'], practicalSkill: 'build NLP pipeline' },
        { title: 'Generative AI and LLMs', focus: 'content generation', concepts: ['GPT architecture', 'prompt engineering', 'fine-tuning LLMs'], practicalSkill: 'create AI application' },
        { title: 'Reinforcement Learning Basics', focus: 'learning from rewards', concepts: ['Q-learning', 'policy gradients', 'exploration vs exploitation'], practicalSkill: 'train RL agent' },
        { title: 'MLOps and Model Deployment', focus: 'production ML systems', concepts: ['model serving', 'monitoring', 'CI/CD for ML'], practicalSkill: 'deploy ML model' },
        { title: 'AI Ethics and Responsible AI', focus: 'ethical considerations', concepts: ['bias', 'fairness', 'explainability'], practicalSkill: 'audit model for bias' },
      ]
    },
  ],
  quizBank: [
    {
      concept: 'supervised learning',
      questions: [
        { text: 'What distinguishes supervised learning from unsupervised learning?', type: 'multiple_choice', options: ['A. Supervised learning uses labeled data', 'B. Supervised learning is faster', 'C. Supervised learning requires more memory', 'D. Supervised learning only works with images'], answer: 'A', explanation: 'Supervised learning uses labeled training data where each example has an input and expected output.' },
        { text: 'True or False: Linear regression can only be used for classification problems.', type: 'true_false', answer: false, explanation: 'Linear regression is used for predicting continuous values, not classification. Logistic regression is used for classification.' },
      ]
    },
    {
      concept: 'neural networks',
      questions: [
        { text: 'What is the purpose of an activation function in a neural network?', type: 'multiple_choice', options: ['A. To introduce non-linearity', 'B. To reduce training time', 'C. To prevent overfitting', 'D. To normalize inputs'], answer: 'A', explanation: 'Activation functions introduce non-linearity, allowing neural networks to learn complex patterns beyond linear relationships.' },
        { text: 'True or False: Backpropagation calculates gradients by moving forward through the network.', type: 'true_false', answer: false, explanation: 'Backpropagation calculates gradients by propagating errors backward from the output layer to earlier layers.' },
      ]
    },
    {
      concept: 'model evaluation',
      questions: [
        { text: 'Which metric is most appropriate when dealing with imbalanced datasets?', type: 'multiple_choice', options: ['A. Accuracy', 'B. F1-Score', 'C. Mean Squared Error', 'D. R-Squared'], answer: 'B', explanation: 'F1-Score balances precision and recall, making it suitable for imbalanced datasets where accuracy can be misleading.' },
      ]
    }
  ],
  assignmentTemplates: [
    { type: 'implementation', objective: 'Build a complete machine learning pipeline', steps: ['Load and explore the dataset', 'Preprocess and clean the data', 'Split into training and test sets', 'Train multiple models', 'Evaluate and compare results'], deliverables: ['Jupyter notebook with code', 'Model performance report', 'Visualizations of results'], rubric: { 'Data Preprocessing': 20, 'Model Implementation': 30, 'Evaluation Metrics': 25, 'Code Quality': 15, 'Documentation': 10 } },
    { type: 'analysis', objective: 'Perform comprehensive exploratory data analysis', steps: ['Generate descriptive statistics', 'Create visualizations', 'Identify patterns and correlations', 'Document insights', 'Recommend next steps'], deliverables: ['EDA report (PDF)', 'Visualization gallery', 'Key findings summary'], rubric: { 'Statistical Analysis': 25, 'Visualizations': 25, 'Insights Quality': 25, 'Presentation': 15, 'Recommendations': 10 } },
  ]
}

// React & Next.js Course Template
const REACT_NEXTJS_TEMPLATE: CourseTemplate = {
  slug: 'react-nextjs',
  matchPatterns: ['react', 'next.js', 'nextjs', 'frontend', 'javascript framework', 'full-stack', 'web development', 'fullstack'],
  modules: [
    {
      name: 'React Fundamentals',
      lessons: [
        { title: 'React Component Architecture', focus: 'building with components', concepts: ['JSX', 'props', 'component composition'], practicalSkill: 'create reusable components' },
        { title: 'State Management with Hooks', focus: 'managing component state', concepts: ['useState', 'useEffect', 'useRef'], practicalSkill: 'implement stateful logic' },
        { title: 'Event Handling and Forms', focus: 'user interactions', concepts: ['synthetic events', 'controlled inputs', 'form validation'], practicalSkill: 'build interactive forms' },
        { title: 'Conditional Rendering Patterns', focus: 'dynamic UI', concepts: ['ternary operators', 'logical AND', 'switch patterns'], practicalSkill: 'render conditional content' },
        { title: 'Lists and Keys in React', focus: 'rendering collections', concepts: ['map function', 'key prop', 'virtual DOM reconciliation'], practicalSkill: 'render dynamic lists' },
      ]
    },
    {
      name: 'Advanced React Patterns',
      lessons: [
        { title: 'Context API for Global State', focus: 'sharing state across components', concepts: ['createContext', 'useContext', 'provider pattern'], practicalSkill: 'implement theme switching' },
        { title: 'Custom Hooks Development', focus: 'extracting reusable logic', concepts: ['hook rules', 'composition', 'abstracting side effects'], practicalSkill: 'create custom hooks' },
        { title: 'Performance Optimization', focus: 'fast React applications', concepts: ['useMemo', 'useCallback', 'React.memo'], practicalSkill: 'optimize re-renders' },
        { title: 'Error Boundaries and Suspense', focus: 'handling errors gracefully', concepts: ['error boundaries', 'fallback UI', 'lazy loading'], practicalSkill: 'implement error handling' },
        { title: 'Testing React Components', focus: 'ensuring code quality', concepts: ['React Testing Library', 'Jest', 'test patterns'], practicalSkill: 'write component tests' },
      ]
    },
    {
      name: 'Next.js Framework',
      lessons: [
        { title: 'Next.js App Router Architecture', focus: 'file-based routing', concepts: ['app directory', 'layouts', 'page components'], practicalSkill: 'structure Next.js app' },
        { title: 'Server and Client Components', focus: 'hybrid rendering', concepts: ['use client', 'server components', 'streaming'], practicalSkill: 'choose component types' },
        { title: 'Data Fetching Strategies', focus: 'loading data efficiently', concepts: ['fetch', 'caching', 'revalidation'], practicalSkill: 'implement data fetching' },
        { title: 'API Routes and Server Actions', focus: 'backend in Next.js', concepts: ['route handlers', 'server actions', 'form handling'], practicalSkill: 'build API endpoints' },
        { title: 'Authentication with NextAuth', focus: 'user authentication', concepts: ['providers', 'sessions', 'protected routes'], practicalSkill: 'implement auth flow' },
      ]
    },
    {
      name: 'Production Ready',
      lessons: [
        { title: 'Styling with Tailwind CSS', focus: 'utility-first styling', concepts: ['utility classes', 'responsive design', 'dark mode'], practicalSkill: 'style with Tailwind' },
        { title: 'State Management at Scale', focus: 'complex state', concepts: ['Zustand', 'Redux Toolkit', 'state machines'], practicalSkill: 'manage global state' },
        { title: 'SEO and Metadata Optimization', focus: 'search engine visibility', concepts: ['metadata API', 'Open Graph', 'structured data'], practicalSkill: 'optimize for SEO' },
        { title: 'Deployment and CI/CD', focus: 'shipping to production', concepts: ['Vercel', 'environment variables', 'preview deployments'], practicalSkill: 'deploy Next.js app' },
        { title: 'Performance Monitoring', focus: 'production observability', concepts: ['Core Web Vitals', 'analytics', 'error tracking'], practicalSkill: 'monitor application' },
      ]
    },
  ],
  quizBank: [
    {
      concept: 'react hooks',
      questions: [
        { text: 'When should you use useEffect with an empty dependency array?', type: 'multiple_choice', options: ['A. When you want the effect to run on every render', 'B. When you want the effect to run only once on mount', 'C. When you want to watch specific values', 'D. Never, it causes bugs'], answer: 'B', explanation: 'An empty dependency array [] causes useEffect to run only once when the component mounts, similar to componentDidMount.' },
        { text: 'True or False: useState can only store primitive values like strings and numbers.', type: 'true_false', answer: false, explanation: 'useState can store any JavaScript value including objects, arrays, and functions.' },
      ]
    },
    {
      concept: 'nextjs routing',
      questions: [
        { text: 'In Next.js App Router, where do you define a layout that applies to multiple pages?', type: 'multiple_choice', options: ['A. In a layout.tsx file in the route directory', 'B. In next.config.js', 'C. In _app.tsx', 'D. In each page file'], answer: 'A', explanation: 'The App Router uses layout.tsx files for shared layouts. They wrap child routes and persist across navigation.' },
        { text: 'True or False: Server Components in Next.js can use useState and other React hooks.', type: 'true_false', answer: false, explanation: 'Server Components cannot use hooks like useState or useEffect. You need Client Components (with "use client") for interactive features.' },
      ]
    },
  ],
  assignmentTemplates: [
    { type: 'project', objective: 'Build a full-stack Next.js application', steps: ['Set up Next.js project with TypeScript', 'Create page layouts and navigation', 'Implement data fetching and API routes', 'Add authentication and protected routes', 'Deploy to Vercel'], deliverables: ['GitHub repository', 'Live deployed URL', 'README with setup instructions'], rubric: { 'Functionality': 30, 'Code Quality': 25, 'UI/UX Design': 20, 'Performance': 15, 'Documentation': 10 } },
  ]
}

// AWS Solutions Architect Template
const AWS_TEMPLATE: CourseTemplate = {
  slug: 'aws',
  matchPatterns: ['aws', 'amazon web services', 'cloud', 'solutions architect'],
  modules: [
    {
      name: 'AWS Fundamentals',
      lessons: [
        { title: 'AWS Global Infrastructure', focus: 'regions and availability zones', concepts: ['regions', 'AZs', 'edge locations'], practicalSkill: 'select appropriate region' },
        { title: 'Identity and Access Management', focus: 'security and permissions', concepts: ['users', 'roles', 'policies'], practicalSkill: 'configure IAM policies' },
        { title: 'EC2 Compute Fundamentals', focus: 'virtual servers', concepts: ['instance types', 'AMIs', 'security groups'], practicalSkill: 'launch EC2 instance' },
        { title: 'S3 Storage Deep Dive', focus: 'object storage', concepts: ['buckets', 'storage classes', 'lifecycle policies'], practicalSkill: 'configure S3 bucket' },
        { title: 'VPC Networking Essentials', focus: 'network architecture', concepts: ['subnets', 'route tables', 'NAT gateways'], practicalSkill: 'design VPC' },
      ]
    },
    {
      name: 'High Availability',
      lessons: [
        { title: 'Elastic Load Balancing', focus: 'traffic distribution', concepts: ['ALB', 'NLB', 'target groups'], practicalSkill: 'configure load balancer' },
        { title: 'Auto Scaling Groups', focus: 'dynamic scaling', concepts: ['launch templates', 'scaling policies', 'health checks'], practicalSkill: 'implement auto scaling' },
        { title: 'RDS Database Services', focus: 'managed databases', concepts: ['Multi-AZ', 'read replicas', 'backups'], practicalSkill: 'deploy RDS instance' },
        { title: 'Route 53 DNS Services', focus: 'DNS management', concepts: ['hosted zones', 'routing policies', 'health checks'], practicalSkill: 'configure DNS routing' },
        { title: 'CloudFront CDN', focus: 'content delivery', concepts: ['distributions', 'origins', 'caching'], practicalSkill: 'set up CloudFront' },
      ]
    },
    {
      name: 'Serverless Architecture',
      lessons: [
        { title: 'AWS Lambda Functions', focus: 'serverless compute', concepts: ['handlers', 'triggers', 'cold starts'], practicalSkill: 'deploy Lambda function' },
        { title: 'API Gateway Integration', focus: 'API management', concepts: ['REST APIs', 'stages', 'authorizers'], practicalSkill: 'create REST API' },
        { title: 'DynamoDB NoSQL Database', focus: 'serverless database', concepts: ['tables', 'indexes', 'capacity modes'], practicalSkill: 'design DynamoDB table' },
        { title: 'Step Functions Workflows', focus: 'orchestration', concepts: ['state machines', 'tasks', 'error handling'], practicalSkill: 'build workflow' },
        { title: 'EventBridge Event-Driven', focus: 'event routing', concepts: ['event buses', 'rules', 'targets'], practicalSkill: 'create event rules' },
      ]
    },
    {
      name: 'Security & Cost',
      lessons: [
        { title: 'AWS Security Best Practices', focus: 'securing workloads', concepts: ['encryption', 'KMS', 'Security Hub'], practicalSkill: 'implement security controls' },
        { title: 'CloudWatch Monitoring', focus: 'observability', concepts: ['metrics', 'alarms', 'logs'], practicalSkill: 'set up monitoring' },
        { title: 'Cost Optimization Strategies', focus: 'reducing spend', concepts: ['Reserved Instances', 'Spot', 'Cost Explorer'], practicalSkill: 'analyze and optimize costs' },
        { title: 'Well-Architected Framework', focus: 'best practices', concepts: ['pillars', 'trade-offs', 'reviews'], practicalSkill: 'conduct architecture review' },
        { title: 'Disaster Recovery Planning', focus: 'business continuity', concepts: ['RTO/RPO', 'backup strategies', 'multi-region'], practicalSkill: 'design DR strategy' },
      ]
    },
  ],
  quizBank: [
    {
      concept: 'aws compute',
      questions: [
        { text: 'Which EC2 pricing model offers the deepest discounts for flexible workloads?', type: 'multiple_choice', options: ['A. On-Demand', 'B. Reserved Instances', 'C. Spot Instances', 'D. Dedicated Hosts'], answer: 'C', explanation: 'Spot Instances offer up to 90% discount compared to On-Demand pricing for interruptible workloads.' },
        { text: 'True or False: Lambda functions can run for unlimited duration.', type: 'true_false', answer: false, explanation: 'Lambda functions have a maximum timeout of 15 minutes. For longer-running tasks, consider Step Functions or ECS.' },
      ]
    },
    {
      concept: 'aws storage',
      questions: [
        { text: 'Which S3 storage class is most cost-effective for infrequently accessed data that needs millisecond retrieval?', type: 'multiple_choice', options: ['A. S3 Standard', 'B. S3 Standard-IA', 'C. S3 Glacier', 'D. S3 One Zone-IA'], answer: 'B', explanation: 'S3 Standard-IA (Infrequent Access) offers lower storage costs while maintaining millisecond retrieval times.' },
      ]
    },
  ],
  assignmentTemplates: [
    { type: 'architecture', objective: 'Design a highly available web application architecture', steps: ['Define requirements and constraints', 'Design VPC and network architecture', 'Select appropriate compute and storage services', 'Plan for high availability and disaster recovery', 'Estimate monthly costs'], deliverables: ['Architecture diagram', 'Written justification for each service', 'Cost estimate spreadsheet'], rubric: { 'Architecture Design': 30, 'Service Selection': 25, 'High Availability': 20, 'Cost Optimization': 15, 'Documentation': 10 } },
  ]
}

// UI/UX Design Template
const UIUX_TEMPLATE: CourseTemplate = {
  slug: 'uiux',
  matchPatterns: ['ui', 'ux', 'design', 'user interface', 'user experience', 'product design'],
  modules: [
    {
      name: 'UX Fundamentals',
      lessons: [
        { title: 'Introduction to User Experience', focus: 'UX principles and process', concepts: ['user-centered design', 'design thinking', 'UX vs UI'], practicalSkill: 'define UX strategy' },
        { title: 'User Research Methods', focus: 'understanding users', concepts: ['interviews', 'surveys', 'contextual inquiry'], practicalSkill: 'conduct user research' },
        { title: 'Creating User Personas', focus: 'representing users', concepts: ['demographics', 'goals', 'pain points'], practicalSkill: 'build personas' },
        { title: 'User Journey Mapping', focus: 'visualizing experiences', concepts: ['touchpoints', 'emotions', 'opportunities'], practicalSkill: 'create journey map' },
        { title: 'Information Architecture', focus: 'organizing content', concepts: ['card sorting', 'sitemaps', 'navigation'], practicalSkill: 'structure information' },
      ]
    },
    {
      name: 'UI Design Principles',
      lessons: [
        { title: 'Visual Hierarchy and Layout', focus: 'guiding attention', concepts: ['grid systems', 'spacing', 'alignment'], practicalSkill: 'design layouts' },
        { title: 'Color Theory for Digital', focus: 'effective color use', concepts: ['color psychology', 'accessibility', 'palettes'], practicalSkill: 'create color system' },
        { title: 'Typography Fundamentals', focus: 'text design', concepts: ['font pairing', 'hierarchy', 'readability'], practicalSkill: 'set up type scale' },
        { title: 'Iconography and Imagery', focus: 'visual elements', concepts: ['icon styles', 'image selection', 'consistency'], practicalSkill: 'create icon set' },
        { title: 'Design Systems Basics', focus: 'scalable design', concepts: ['components', 'tokens', 'documentation'], practicalSkill: 'build component library' },
      ]
    },
    {
      name: 'Prototyping',
      lessons: [
        { title: 'Wireframing Techniques', focus: 'low-fidelity design', concepts: ['sketching', 'digital wireframes', 'iteration'], practicalSkill: 'create wireframes' },
        { title: 'High-Fidelity Mockups', focus: 'detailed design', concepts: ['visual design', 'specifications', 'handoff'], practicalSkill: 'design mockups' },
        { title: 'Interactive Prototyping', focus: 'simulating interactions', concepts: ['hotspots', 'transitions', 'micro-interactions'], practicalSkill: 'build prototype' },
        { title: 'Figma Advanced Features', focus: 'tool mastery', concepts: ['auto layout', 'variants', 'plugins'], practicalSkill: 'master Figma' },
        { title: 'Usability Testing', focus: 'validating designs', concepts: ['test planning', 'moderation', 'analysis'], practicalSkill: 'run usability tests' },
      ]
    },
    {
      name: 'Professional Practice',
      lessons: [
        { title: 'Accessibility in Design', focus: 'inclusive design', concepts: ['WCAG', 'screen readers', 'contrast'], practicalSkill: 'audit for accessibility' },
        { title: 'Mobile-First Design', focus: 'responsive approach', concepts: ['breakpoints', 'touch targets', 'gestures'], practicalSkill: 'design for mobile' },
        { title: 'Design Handoff Process', focus: 'developer collaboration', concepts: ['specifications', 'assets', 'communication'], practicalSkill: 'prepare handoff' },
        { title: 'Portfolio Development', focus: 'showcasing work', concepts: ['case studies', 'presentation', 'storytelling'], practicalSkill: 'create case study' },
        { title: 'Design Career Growth', focus: 'professional development', concepts: ['specializations', 'leadership', 'trends'], practicalSkill: 'plan career path' },
      ]
    },
  ],
  quizBank: [
    {
      concept: 'ux research',
      questions: [
        { text: 'What is the primary goal of creating user personas?', type: 'multiple_choice', options: ['A. To impress stakeholders with user data', 'B. To create a shared understanding of target users', 'C. To replace actual user research', 'D. To justify design decisions already made'], answer: 'B', explanation: 'Personas help teams develop empathy and maintain focus on real user needs throughout the design process.' },
        { text: 'True or False: Quantitative research tells you "why" users behave a certain way.', type: 'true_false', answer: false, explanation: 'Quantitative research tells you "what" is happening (numbers, metrics). Qualitative research helps understand "why".' },
      ]
    },
    {
      concept: 'visual design',
      questions: [
        { text: 'What is the recommended minimum contrast ratio for normal text according to WCAG AA?', type: 'multiple_choice', options: ['A. 2.5:1', 'B. 3:1', 'C. 4.5:1', 'D. 7:1'], answer: 'C', explanation: 'WCAG AA requires a contrast ratio of at least 4.5:1 for normal text to ensure readability for users with visual impairments.' },
      ]
    },
  ],
  assignmentTemplates: [
    { type: 'design', objective: 'Design a mobile app feature from research to prototype', steps: ['Conduct user research (at least 3 interviews)', 'Create user persona and journey map', 'Sketch wireframes for key screens', 'Design high-fidelity mockups', 'Build interactive prototype'], deliverables: ['Research findings document', 'Figma file with all designs', 'Clickable prototype link', 'Presentation deck'], rubric: { 'Research Quality': 20, 'User-Centered Approach': 25, 'Visual Design': 25, 'Prototype Fidelity': 20, 'Presentation': 10 } },
  ]
}

// Python Data Science Template
const PYTHON_DS_TEMPLATE: CourseTemplate = {
  slug: 'python-ds',
  matchPatterns: ['python', 'data science', 'data analysis', 'pandas', 'analytics'],
  modules: [
    {
      name: 'Python Essentials',
      lessons: [
        { title: 'Python for Data Science Setup', focus: 'environment configuration', concepts: ['Anaconda', 'Jupyter', 'virtual environments'], practicalSkill: 'set up Python environment' },
        { title: 'Python Data Structures', focus: 'core data types', concepts: ['lists', 'dictionaries', 'tuples'], practicalSkill: 'manipulate data structures' },
        { title: 'NumPy Array Operations', focus: 'numerical computing', concepts: ['arrays', 'broadcasting', 'vectorization'], practicalSkill: 'perform array operations' },
        { title: 'Pandas DataFrames Mastery', focus: 'data manipulation', concepts: ['Series', 'DataFrames', 'indexing'], practicalSkill: 'transform dataframes' },
        { title: 'Data Cleaning with Python', focus: 'preparing data', concepts: ['missing values', 'duplicates', 'type conversion'], practicalSkill: 'clean real dataset' },
      ]
    },
    {
      name: 'Data Visualization',
      lessons: [
        { title: 'Matplotlib Fundamentals', focus: 'basic plotting', concepts: ['figures', 'axes', 'plot types'], practicalSkill: 'create standard plots' },
        { title: 'Seaborn Statistical Plots', focus: 'statistical visualization', concepts: ['distributions', 'relationships', 'categorical'], practicalSkill: 'build statistical charts' },
        { title: 'Interactive Visualizations', focus: 'dynamic charts', concepts: ['Plotly', 'widgets', 'dashboards'], practicalSkill: 'create interactive viz' },
        { title: 'Data Storytelling', focus: 'communicating insights', concepts: ['narrative', 'annotation', 'design principles'], practicalSkill: 'tell data stories' },
        { title: 'Dashboard Development', focus: 'building dashboards', concepts: ['Streamlit', 'layout', 'deployment'], practicalSkill: 'deploy dashboard' },
      ]
    },
    {
      name: 'Statistical Analysis',
      lessons: [
        { title: 'Descriptive Statistics', focus: 'summarizing data', concepts: ['central tendency', 'dispersion', 'distributions'], practicalSkill: 'compute statistics' },
        { title: 'Probability Distributions', focus: 'statistical foundations', concepts: ['normal', 'binomial', 'Poisson'], practicalSkill: 'work with distributions' },
        { title: 'Hypothesis Testing', focus: 'statistical inference', concepts: ['t-tests', 'chi-square', 'p-values'], practicalSkill: 'conduct hypothesis tests' },
        { title: 'Correlation and Regression', focus: 'relationships', concepts: ['Pearson', 'linear regression', 'interpretation'], practicalSkill: 'analyze correlations' },
        { title: 'A/B Testing in Practice', focus: 'experimentation', concepts: ['experiment design', 'sample size', 'significance'], practicalSkill: 'design A/B test' },
      ]
    },
    {
      name: 'Advanced Analytics',
      lessons: [
        { title: 'Time Series Analysis', focus: 'temporal data', concepts: ['trends', 'seasonality', 'forecasting'], practicalSkill: 'analyze time series' },
        { title: 'SQL for Data Scientists', focus: 'database queries', concepts: ['joins', 'aggregations', 'subqueries'], practicalSkill: 'write SQL queries' },
        { title: 'Web Scraping with Python', focus: 'data collection', concepts: ['BeautifulSoup', 'requests', 'APIs'], practicalSkill: 'scrape web data' },
        { title: 'Big Data with PySpark', focus: 'scalable processing', concepts: ['RDDs', 'DataFrames', 'transformations'], practicalSkill: 'process large datasets' },
        { title: 'Data Science Project Lifecycle', focus: 'end-to-end workflow', concepts: ['CRISP-DM', 'documentation', 'presentation'], practicalSkill: 'manage DS project' },
      ]
    },
  ],
  quizBank: [
    {
      concept: 'pandas',
      questions: [
        { text: 'Which Pandas method combines two DataFrames based on a common column?', type: 'multiple_choice', options: ['A. concat()', 'B. append()', 'C. merge()', 'D. join()'], answer: 'C', explanation: 'merge() performs SQL-style joins between DataFrames based on common columns, similar to SQL JOIN operations.' },
        { text: 'True or False: A Pandas Series can contain different data types.', type: 'true_false', answer: true, explanation: 'While not recommended, a Series can contain mixed types using the object dtype.' },
      ]
    },
  ],
  assignmentTemplates: [
    { type: 'analysis', objective: 'Complete an end-to-end data analysis project', steps: ['Find and load a real-world dataset', 'Clean and preprocess the data', 'Perform exploratory data analysis', 'Apply statistical analysis techniques', 'Create visualizations and present findings'], deliverables: ['Jupyter notebook', 'Executive summary (1 page)', 'Presentation slides'], rubric: { 'Data Cleaning': 20, 'Analysis Depth': 30, 'Visualizations': 20, 'Insights Quality': 20, 'Presentation': 10 } },
  ]
}

// Ethical Hacking Template
const ETHICAL_HACKING_TEMPLATE: CourseTemplate = {
  slug: 'ethical-hacking',
  matchPatterns: ['ethical hacking', 'cybersecurity', 'penetration testing', 'security', 'hacking'],
  modules: [
    {
      name: 'Security Fundamentals',
      lessons: [
        { title: 'Introduction to Ethical Hacking', focus: 'foundations and methodology', concepts: ['white hat vs black hat', 'legal considerations', 'hacking methodology'], practicalSkill: 'understand hacker mindset' },
        { title: 'Networking for Security', focus: 'network foundations', concepts: ['TCP/IP', 'ports', 'protocols'], practicalSkill: 'analyze network traffic' },
        { title: 'Linux Command Line Mastery', focus: 'essential commands', concepts: ['bash', 'permissions', 'system administration'], practicalSkill: 'navigate Linux CLI' },
        { title: 'Setting Up Hacking Lab', focus: 'practice environment', concepts: ['Kali Linux', 'virtual machines', 'vulnerable targets'], practicalSkill: 'configure lab environment' },
        { title: 'Information Gathering', focus: 'reconnaissance', concepts: ['OSINT', 'footprinting', 'social engineering'], practicalSkill: 'gather target information' },
      ]
    },
    {
      name: 'Scanning & Enumeration',
      lessons: [
        { title: 'Network Scanning with Nmap', focus: 'port scanning', concepts: ['scan types', 'service detection', 'scripts'], practicalSkill: 'perform network scans' },
        { title: 'Vulnerability Assessment', focus: 'finding weaknesses', concepts: ['vulnerability scanners', 'CVEs', 'risk assessment'], practicalSkill: 'run vulnerability scans' },
        { title: 'Web Application Reconnaissance', focus: 'web enumeration', concepts: ['directory busting', 'subdomain enumeration', 'technology fingerprinting'], practicalSkill: 'enumerate web targets' },
        { title: 'SMB and Network Services', focus: 'service enumeration', concepts: ['SMB', 'FTP', 'SSH enumeration'], practicalSkill: 'enumerate network services' },
        { title: 'Active Directory Enumeration', focus: 'Windows networks', concepts: ['domain controllers', 'users', 'groups'], practicalSkill: 'enumerate AD environment' },
      ]
    },
    {
      name: 'Exploitation',
      lessons: [
        { title: 'Metasploit Framework', focus: 'exploitation toolkit', concepts: ['modules', 'payloads', 'meterpreter'], practicalSkill: 'use Metasploit' },
        { title: 'Web Application Attacks', focus: 'web vulnerabilities', concepts: ['SQL injection', 'XSS', 'CSRF'], practicalSkill: 'exploit web vulnerabilities' },
        { title: 'Password Attacks', focus: 'credential attacks', concepts: ['brute force', 'dictionary attacks', 'hash cracking'], practicalSkill: 'crack passwords' },
        { title: 'Privilege Escalation', focus: 'gaining higher access', concepts: ['Linux privesc', 'Windows privesc', 'misconfigurations'], practicalSkill: 'escalate privileges' },
        { title: 'Post-Exploitation', focus: 'maintaining access', concepts: ['persistence', 'lateral movement', 'data exfiltration'], practicalSkill: 'perform post-exploitation' },
      ]
    },
    {
      name: 'Professional Practice',
      lessons: [
        { title: 'Wireless Network Attacks', focus: 'WiFi security', concepts: ['WPA2', 'handshake capture', 'deauthentication'], practicalSkill: 'test wireless security' },
        { title: 'Social Engineering Attacks', focus: 'human vulnerabilities', concepts: ['phishing', 'pretexting', 'physical security'], practicalSkill: 'conduct SE assessment' },
        { title: 'Report Writing', focus: 'documenting findings', concepts: ['executive summary', 'technical details', 'remediation'], practicalSkill: 'write pentest report' },
        { title: 'Bug Bounty Hunting', focus: 'responsible disclosure', concepts: ['platforms', 'scope', 'reporting'], practicalSkill: 'participate in bug bounty' },
        { title: 'Certification Preparation', focus: 'career advancement', concepts: ['CEH', 'OSCP', 'CompTIA Security+'], practicalSkill: 'prepare for certification' },
      ]
    },
  ],
  quizBank: [
    {
      concept: 'reconnaissance',
      questions: [
        { text: 'Which type of reconnaissance involves directly interacting with the target system?', type: 'multiple_choice', options: ['A. Passive reconnaissance', 'B. Active reconnaissance', 'C. Social engineering', 'D. OSINT'], answer: 'B', explanation: 'Active reconnaissance involves directly interacting with target systems (like port scanning), while passive reconnaissance gathers information without direct contact.' },
        { text: 'True or False: Ethical hackers should always get written authorization before testing.', type: 'true_false', answer: true, explanation: 'Written authorization (scope document or contract) is essential for legal protection and clearly defines what testing is permitted.' },
      ]
    },
  ],
  assignmentTemplates: [
    { type: 'lab', objective: 'Perform a complete penetration test on a practice target', steps: ['Conduct reconnaissance and enumeration', 'Identify vulnerabilities', 'Exploit at least one vulnerability', 'Attempt privilege escalation', 'Document all findings professionally'], deliverables: ['Penetration test report', 'Evidence screenshots', 'Remediation recommendations'], rubric: { 'Methodology': 25, 'Technical Execution': 30, 'Documentation': 25, 'Recommendations': 20 } },
  ]
}

// iOS SwiftUI Template
const IOS_SWIFTUI_TEMPLATE: CourseTemplate = {
  slug: 'ios-swiftui',
  matchPatterns: ['ios', 'swiftui', 'swift', 'apple', 'iphone', 'mobile app'],
  modules: [
    {
      name: 'Swift Fundamentals',
      lessons: [
        { title: 'Swift Language Basics', focus: 'core syntax', concepts: ['variables', 'types', 'optionals'], practicalSkill: 'write Swift code' },
        { title: 'Collections and Control Flow', focus: 'data and logic', concepts: ['arrays', 'dictionaries', 'loops'], practicalSkill: 'manage collections' },
        { title: 'Functions and Closures', focus: 'code organization', concepts: ['parameters', 'return types', 'closures'], practicalSkill: 'create functions' },
        { title: 'Object-Oriented Swift', focus: 'OOP concepts', concepts: ['classes', 'structs', 'inheritance'], practicalSkill: 'design with OOP' },
        { title: 'Protocols and Extensions', focus: 'Swift patterns', concepts: ['protocols', 'extensions', 'generics'], practicalSkill: 'use protocol-oriented design' },
      ]
    },
    {
      name: 'SwiftUI Basics',
      lessons: [
        { title: 'SwiftUI View Fundamentals', focus: 'building views', concepts: ['View protocol', 'modifiers', 'previews'], practicalSkill: 'create SwiftUI views' },
        { title: 'Layout and Stacks', focus: 'arranging views', concepts: ['HStack', 'VStack', 'ZStack'], practicalSkill: 'design layouts' },
        { title: 'State and Data Flow', focus: 'managing state', concepts: ['@State', '@Binding', 'ObservableObject'], practicalSkill: 'handle app state' },
        { title: 'Lists and Navigation', focus: 'content organization', concepts: ['List', 'NavigationStack', 'NavigationLink'], practicalSkill: 'build navigation' },
        { title: 'Forms and User Input', focus: 'data entry', concepts: ['Form', 'TextField', 'Picker'], practicalSkill: 'create forms' },
      ]
    },
    {
      name: 'Advanced SwiftUI',
      lessons: [
        { title: 'Custom Views and Shapes', focus: 'custom UI', concepts: ['Shape', 'Path', 'custom modifiers'], practicalSkill: 'build custom components' },
        { title: 'Animations and Transitions', focus: 'motion design', concepts: ['withAnimation', 'transitions', 'matched geometry'], practicalSkill: 'animate interfaces' },
        { title: 'Gestures and Interactions', focus: 'touch handling', concepts: ['tap', 'drag', 'gesture composition'], practicalSkill: 'implement gestures' },
        { title: 'Data Persistence', focus: 'storing data', concepts: ['UserDefaults', 'Core Data', 'SwiftData'], practicalSkill: 'persist app data' },
        { title: 'Networking and APIs', focus: 'remote data', concepts: ['URLSession', 'async/await', 'JSON decoding'], practicalSkill: 'fetch API data' },
      ]
    },
    {
      name: 'App Development',
      lessons: [
        { title: 'App Architecture Patterns', focus: 'code organization', concepts: ['MVVM', 'dependency injection', 'modularity'], practicalSkill: 'structure app code' },
        { title: 'Testing SwiftUI Apps', focus: 'quality assurance', concepts: ['unit tests', 'UI tests', 'snapshot testing'], practicalSkill: 'test iOS apps' },
        { title: 'App Store Preparation', focus: 'launch readiness', concepts: ['app icons', 'screenshots', 'metadata'], practicalSkill: 'prepare for submission' },
        { title: 'In-App Purchases', focus: 'monetization', concepts: ['StoreKit', 'subscriptions', 'receipt validation'], practicalSkill: 'implement purchases' },
        { title: 'iOS Features Integration', focus: 'platform APIs', concepts: ['notifications', 'widgets', 'app intents'], practicalSkill: 'integrate iOS features' },
      ]
    },
  ],
  quizBank: [
    {
      concept: 'swiftui views',
      questions: [
        { text: 'Which property wrapper should you use for simple view-local state?', type: 'multiple_choice', options: ['A. @Binding', 'B. @State', 'C. @ObservedObject', 'D. @EnvironmentObject'], answer: 'B', explanation: '@State is used for simple value types that are owned and managed by a single view.' },
        { text: 'True or False: SwiftUI views are classes that inherit from UIView.', type: 'true_false', answer: false, explanation: 'SwiftUI views are structs that conform to the View protocol, not classes inheriting from UIView.' },
      ]
    },
  ],
  assignmentTemplates: [
    { type: 'app', objective: 'Build a complete iOS app with SwiftUI', steps: ['Design app architecture and data model', 'Implement main views and navigation', 'Add state management and data flow', 'Implement networking or data persistence', 'Polish UI with animations'], deliverables: ['Xcode project', 'App demo video', 'Technical documentation'], rubric: { 'Functionality': 30, 'Code Quality': 25, 'UI/UX Design': 20, 'SwiftUI Best Practices': 15, 'Documentation': 10 } },
  ]
}

// Blockchain Web3 Template
const BLOCKCHAIN_TEMPLATE: CourseTemplate = {
  slug: 'blockchain-web3',
  matchPatterns: ['blockchain', 'web3', 'crypto', 'ethereum', 'solidity', 'smart contract'],
  modules: [
    {
      name: 'Blockchain Fundamentals',
      lessons: [
        { title: 'Introduction to Blockchain', focus: 'core concepts', concepts: ['decentralization', 'consensus', 'immutability'], practicalSkill: 'understand blockchain architecture' },
        { title: 'Cryptography Essentials', focus: 'security foundations', concepts: ['hashing', 'public key cryptography', 'digital signatures'], practicalSkill: 'apply cryptographic concepts' },
        { title: 'Bitcoin and Proof of Work', focus: 'first blockchain', concepts: ['mining', 'UTXO', 'halving'], practicalSkill: 'analyze Bitcoin transactions' },
        { title: 'Ethereum Platform', focus: 'smart contract platform', concepts: ['EVM', 'gas', 'accounts'], practicalSkill: 'interact with Ethereum' },
        { title: 'Web3 Wallets and Identity', focus: 'user onboarding', concepts: ['MetaMask', 'private keys', 'ENS'], practicalSkill: 'set up Web3 wallet' },
      ]
    },
    {
      name: 'Solidity Development',
      lessons: [
        { title: 'Solidity Language Basics', focus: 'smart contract syntax', concepts: ['data types', 'functions', 'visibility'], practicalSkill: 'write Solidity code' },
        { title: 'Smart Contract Structure', focus: 'contract design', concepts: ['state variables', 'modifiers', 'events'], practicalSkill: 'structure smart contracts' },
        { title: 'ERC Token Standards', focus: 'token creation', concepts: ['ERC-20', 'ERC-721', 'ERC-1155'], practicalSkill: 'create tokens and NFTs' },
        { title: 'Security Best Practices', focus: 'secure development', concepts: ['reentrancy', 'overflow', 'access control'], practicalSkill: 'write secure contracts' },
        { title: 'Testing Smart Contracts', focus: 'quality assurance', concepts: ['Hardhat', 'unit tests', 'coverage'], practicalSkill: 'test smart contracts' },
      ]
    },
    {
      name: 'DApp Development',
      lessons: [
        { title: 'Connecting Frontend to Web3', focus: 'Web3 integration', concepts: ['ethers.js', 'wagmi', 'wallet connection'], practicalSkill: 'build Web3 frontend' },
        { title: 'Reading and Writing to Chain', focus: 'blockchain interactions', concepts: ['read calls', 'transactions', 'events'], practicalSkill: 'interact with contracts' },
        { title: 'IPFS and Decentralized Storage', focus: 'off-chain data', concepts: ['IPFS', 'Arweave', 'metadata'], practicalSkill: 'store data on IPFS' },
        { title: 'The Graph Protocol', focus: 'indexing blockchain', concepts: ['subgraphs', 'GraphQL', 'queries'], practicalSkill: 'query blockchain data' },
        { title: 'DApp UX Best Practices', focus: 'user experience', concepts: ['transaction states', 'error handling', 'gas estimation'], practicalSkill: 'improve DApp UX' },
      ]
    },
    {
      name: 'Advanced Topics',
      lessons: [
        { title: 'DeFi Protocols', focus: 'decentralized finance', concepts: ['AMMs', 'lending', 'yield farming'], practicalSkill: 'integrate DeFi protocols' },
        { title: 'Layer 2 Solutions', focus: 'scaling', concepts: ['rollups', 'sidechains', 'bridges'], practicalSkill: 'deploy on Layer 2' },
        { title: 'DAO Development', focus: 'governance', concepts: ['voting', 'proposals', 'treasury'], practicalSkill: 'create DAO contracts' },
        { title: 'Smart Contract Auditing', focus: 'security review', concepts: ['audit process', 'tools', 'reporting'], practicalSkill: 'perform security audit' },
        { title: 'Mainnet Deployment', focus: 'production launch', concepts: ['verification', 'upgrades', 'monitoring'], practicalSkill: 'deploy to mainnet' },
      ]
    },
  ],
  quizBank: [
    {
      concept: 'smart contracts',
      questions: [
        { text: 'What is the purpose of the "payable" keyword in Solidity?', type: 'multiple_choice', options: ['A. To make a function free to call', 'B. To allow a function to receive Ether', 'C. To pay gas fees automatically', 'D. To enable token transfers'], answer: 'B', explanation: 'The payable modifier allows a function to receive Ether as part of a transaction.' },
        { text: 'True or False: Once deployed, smart contract code can be modified directly on the blockchain.', type: 'true_false', answer: false, explanation: 'Smart contracts are immutable once deployed. Changes require deploying a new contract or using upgradeable patterns.' },
      ]
    },
  ],
  assignmentTemplates: [
    { type: 'dapp', objective: 'Build a complete decentralized application', steps: ['Design and implement smart contracts', 'Write comprehensive tests', 'Build frontend with wallet connection', 'Deploy to testnet', 'Create documentation'], deliverables: ['Smart contract code (GitHub)', 'Deployed testnet address', 'Frontend demo', 'Technical documentation'], rubric: { 'Smart Contract Quality': 30, 'Security': 25, 'Frontend Integration': 20, 'Testing': 15, 'Documentation': 10 } },
  ]
}

// All course templates - ORDER MATTERS! More specific patterns first
const COURSE_TEMPLATES: CourseTemplate[] = [
  // Specific patterns first (to avoid 'ai' in 'blockchain' or 'ui' in 'swiftui')
  BLOCKCHAIN_TEMPLATE,      // Must come before AI_ML (blockchain contains 'ai')
  IOS_SWIFTUI_TEMPLATE,     // Must come before UIUX (swiftui contains 'ui')
  // Then general patterns
  AI_ML_TEMPLATE,
  REACT_NEXTJS_TEMPLATE,
  AWS_TEMPLATE,
  UIUX_TEMPLATE,
  PYTHON_DS_TEMPLATE,
  ETHICAL_HACKING_TEMPLATE,
]

// ============================================================================
// CONTENT GENERATION FUNCTIONS
// ============================================================================

function findMatchingTemplate(courseTitle: string): CourseTemplate | null {
  const titleLower = courseTitle.toLowerCase()
  for (const template of COURSE_TEMPLATES) {
    for (const pattern of template.matchPatterns) {
      if (titleLower.includes(pattern)) {
        return template
      }
    }
  }
  return null
}

function generateVideoScript(lesson: LessonTemplate, lessonNum: number, totalLessons: number, courseTitle: string): string {
  const { title, focus, concepts, practicalSkill } = lesson

  // Generate ~500 word script with proper structure
  const script = `[HOOK - 30 seconds]
Welcome to Lesson ${lessonNum}! Today we're diving into ${title.toLowerCase()}, and I'm genuinely excited to share this with you because ${focus} is one of those topics that will fundamentally change how you approach ${courseTitle.split(':')[0] || courseTitle}. By the end of this lesson, you'll not only understand ${concepts[0]} but you'll be able to ${practicalSkill} with confidence.

[CONTENT SECTION 1 - 2 minutes]
Understanding ${concepts[0]}

Let's start with the foundation. ${concepts[0]} is at the heart of ${focus}. Think of it as the building block that everything else depends on. When I first learned this, what really clicked for me was understanding that ${concepts[0]} isn't just a theoretical concept—it's something you'll use every single day in real projects.

Here's how it works: ${concepts[0]} allows you to ${practicalSkill.split(' ').slice(0, 3).join(' ')} in a structured way. The key insight is that once you master this fundamental, more advanced topics become much easier to grasp. I've seen countless students struggle because they rushed past these basics, so let's make sure you have a solid understanding.

[CONTENT SECTION 2 - 2 minutes]
Applying ${concepts[1] || 'Core Concepts'}

Now that we have the foundation, let's explore ${concepts[1] || 'how these concepts apply in practice'}. This is where things get interesting because you start to see how the pieces fit together.

In real-world scenarios, you'll encounter situations where you need to ${practicalSkill}. The approach I recommend is to first identify what you're trying to achieve, then systematically apply what you've learned about ${concepts[0]}. Don't try to do everything at once—break it down into manageable steps.

I want you to pause here and really internalize this: the difference between beginners and experts isn't that experts know more shortcuts—it's that they deeply understand these fundamentals and apply them consistently.

[CONTENT SECTION 3 - 2 minutes]
Mastering ${concepts[2] || 'Practical Implementation'}

Here's where we put everything together. ${concepts[2] || 'The practical implementation'} is your opportunity to take what you've learned and make it your own. Let me walk you through a real example.

First, you'll want to set up your environment correctly—this prevents most common errors. Then, apply the ${concepts[0]} principles we discussed. Finally, verify your work by checking that you can successfully ${practicalSkill}.

The most common mistake I see is rushing through this step. Take your time. It's better to do one thing correctly than to rush through five things poorly.

[RECAP - 30 seconds]
Key Takeaways

Let's summarize what we've covered today:
• You now understand ${concepts[0]} and why it matters for ${focus}
• You've learned how to apply ${concepts[1] || 'these concepts'} in real scenarios
• You have the foundation to ${practicalSkill} confidently

These skills will serve you well as we progress through the course.

[NEXT LESSON PREVIEW - 15 seconds]
${lessonNum < totalLessons
  ? `Coming up next, we'll build on everything you've learned today and explore even more powerful techniques. The next lesson takes these fundamentals to the next level, so make sure to complete the practice exercises before moving on!`
  : `Congratulations! You've completed this course section. Take a moment to celebrate your progress—you've built real skills in ${courseTitle}. Now it's time to put everything together in your capstone project!`
}

Thanks for learning with me today. See you in the next lesson!`

  return script
}

interface QuizQuestion {
  text: string
  type: 'multiple_choice' | 'true_false'
  options?: string[]
  answer: string | boolean
  explanation: string
}

function generateQuizQuestions(lesson: LessonTemplate, template: CourseTemplate): QuizQuestion[] {
  const { title, focus, concepts, practicalSkill } = lesson

  // Mix of template questions and lesson-specific questions
  const questions: QuizQuestion[] = []

  // Question 1: Concept understanding (multiple choice)
  questions.push({
    text: `What is the primary purpose of ${concepts[0]} in the context of ${focus}?`,
    type: 'multiple_choice',
    options: [
      'A. To add unnecessary complexity to the process',
      `B. To provide a foundation for ${practicalSkill}`,
      'C. To replace all other approaches entirely',
      'D. To satisfy outdated requirements'
    ],
    answer: 'B',
    explanation: `${concepts[0]} is fundamental to ${focus} because it enables you to ${practicalSkill} effectively.`
  })

  // Question 2: True/False about core concept
  questions.push({
    text: `True or False: Understanding ${concepts[0]} is essential before attempting to ${practicalSkill}.`,
    type: 'true_false',
    answer: true,
    explanation: `${concepts[0]} forms the foundation for ${practicalSkill}. Skipping this step leads to gaps in understanding.`
  })

  // Question 3: Application (multiple choice)
  questions.push({
    text: `Which approach is most effective when learning to ${practicalSkill}?`,
    type: 'multiple_choice',
    options: [
      'A. Memorize solutions without understanding concepts',
      'B. Skip fundamentals and jump to advanced topics',
      'C. Practice with real examples while understanding underlying concepts',
      'D. Wait until you have mastered everything before practicing'
    ],
    answer: 'C',
    explanation: 'Combining conceptual understanding with hands-on practice leads to the best learning outcomes.'
  })

  // Question 4: True/False about practical application
  questions.push({
    text: `True or False: The skills covered in "${title}" can only be applied in theoretical scenarios.`,
    type: 'true_false',
    answer: false,
    explanation: `The skills in this lesson are designed for real-world application. You can immediately start to ${practicalSkill}.`
  })

  // Question 5: Best practice (multiple choice)
  questions.push({
    text: `What is the recommended first step when applying ${concepts[1] || 'these concepts'} in a new project?`,
    type: 'multiple_choice',
    options: [
      'A. Start coding immediately without planning',
      'B. Understand the requirements and plan your approach',
      'C. Copy code from the internet without modification',
      'D. Skip testing until everything is complete'
    ],
    answer: 'B',
    explanation: 'Planning and understanding requirements before implementation leads to better outcomes and fewer errors.'
  })

  return questions
}

interface Assignment {
  title: string
  description: string
  instructions: string
  rubric: Record<string, number>
  totalPoints: number
}

function generateAssignment(lesson: LessonTemplate, moduleNum: number, template: CourseTemplate): Assignment {
  const { title, focus, practicalSkill } = lesson
  const assignmentTemplate = template.assignmentTemplates[moduleNum % template.assignmentTemplates.length]

  const steps = [
    `Review the concepts covered in "${title}"`,
    `Set up your practice environment`,
    `Apply ${focus} concepts in a practical exercise`,
    `${practicalSkill.charAt(0).toUpperCase() + practicalSkill.slice(1)} using the techniques learned`,
    `Document your process, challenges, and solutions`,
    `Review your work against the rubric criteria`
  ]

  return {
    title: `${title} - Practical Assignment`,
    description: `In this assignment, you will demonstrate your understanding of ${focus} by completing a hands-on exercise. Your goal is to ${practicalSkill} while applying best practices covered in the lesson.`,
    instructions: steps.join('\n'),
    rubric: assignmentTemplate.rubric,
    totalPoints: 100
  }
}

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

async function seedCourseContent(courseId: string, courseTitle: string, template: CourseTemplate) {
  console.log(`\n📚 Seeding content for: ${courseTitle}`)

  let totalLessonsCreated = 0
  let totalQuizzesCreated = 0
  let totalAssignmentsCreated = 0

  // Calculate total lessons
  const allLessons = template.modules.flatMap(m => m.lessons)
  const totalLessons = allLessons.length

  // Process each module
  for (let moduleIndex = 0; moduleIndex < template.modules.length; moduleIndex++) {
    const moduleData = template.modules[moduleIndex]

    // Create or get existing module
    let courseModule: { id: string } | null = null

    const { data: existingModule } = await supabase
      .from('modules')
      .select('id')
      .eq('course_id', courseId)
      .eq('title', moduleData.name)
      .single()

    if (existingModule) {
      courseModule = existingModule
    } else {
      const { data: newModule, error: moduleError } = await supabase
        .from('modules')
        .insert({
          course_id: courseId,
          title: moduleData.name,
          description: `Module ${moduleIndex + 1}: ${moduleData.name}`,
          display_order: moduleIndex + 1,
        })
        .select()
        .single()

      if (moduleError) {
        console.error(`  ❌ Failed to create module: ${moduleError.message}`)
        continue
      }
      courseModule = newModule
    }

    console.log(`  📦 Module ${moduleIndex + 1}: ${moduleData.name}`)

    // Create lessons for this module
    for (let lessonIndex = 0; lessonIndex < moduleData.lessons.length; lessonIndex++) {
      const lessonTemplate = moduleData.lessons[lessonIndex]
      const globalLessonNum = moduleIndex * moduleData.lessons.length + lessonIndex + 1

      // Check if lesson already exists
      const { data: existingLesson } = await supabase
        .from('lessons')
        .select('id')
        .eq('course_id', courseId)
        .eq('title', lessonTemplate.title)
        .single()

      if (existingLesson) {
        // Check if assignment exists for this lesson
        const { data: existingAssignment } = await supabase
          .from('assignments')
          .select('id')
          .eq('lesson_id', existingLesson.id)
          .single()

        if (!existingAssignment) {
          // Create missing assignment
          const assignment = generateAssignment(lessonTemplate, moduleIndex, template)
          const { error: assignmentError } = await supabase
            .from('assignments')
            .insert({
              lesson_id: existingLesson.id,
              course_id: courseId,
              title: assignment.title,
              description: assignment.description,
              instructions: assignment.instructions,
              due_days_after_enrollment: 7,
              max_score: assignment.totalPoints,
              rubric: assignment.rubric,
            })

          if (!assignmentError) {
            totalAssignmentsCreated++
            console.log(`    📝 Added assignment: ${lessonTemplate.title}`)
          }
        }

        console.log(`    ⏭️  Lesson exists: ${lessonTemplate.title}`)
        continue
      }

      // Generate video script
      const videoScript = generateVideoScript(lessonTemplate, globalLessonNum, totalLessons, courseTitle)

      // Ensure we have a valid module
      if (!courseModule) {
        console.error(`    ❌ No module available for lesson: ${lessonTemplate.title}`)
        continue
      }

      // Create lesson
      const { data: newLesson, error: lessonError } = await supabase
        .from('lessons')
        .insert({
          module_id: courseModule.id,
          course_id: courseId,
          title: lessonTemplate.title,
          description: `Master ${lessonTemplate.focus} through this comprehensive lesson covering ${lessonTemplate.concepts.join(', ')}.`,
          content_type: 'video',
          article_content: videoScript,
          display_order: lessonIndex + 1,
          video_duration_seconds: 7 * 60, // 7 minutes
        })
        .select()
        .single()

      if (lessonError) {
        console.error(`    ❌ Failed to create lesson: ${lessonError.message}`)
        continue
      }

      totalLessonsCreated++

      // Create quiz
      const { data: newQuiz } = await supabase
        .from('quizzes')
        .insert({
          module_id: courseModule.id,
          course_id: courseId,
          title: `${lessonTemplate.title} Quiz`,
          passing_score: 70,
          time_limit_minutes: 15,
        })
        .select()
        .single()

      if (newQuiz) {
        totalQuizzesCreated++

        // Generate and insert quiz questions
        const questions = generateQuizQuestions(lessonTemplate, template)

        for (const question of questions) {
          const { data: newQuestion } = await supabase
            .from('questions')
            .insert({
              quiz_id: newQuiz.id,
              question_text: question.text,
              type: question.type === 'true_false' ? 'true_false' : 'single_choice',
              points: 20,
            })
            .select()
            .single()

          if (newQuestion) {
            const answers = question.type === 'true_false'
              ? [
                  { question_id: newQuestion.id, answer_text: 'True', is_correct: question.answer === true },
                  { question_id: newQuestion.id, answer_text: 'False', is_correct: question.answer === false },
                ]
              : (question.options || []).map((opt, i) => ({
                  question_id: newQuestion.id,
                  answer_text: opt,
                  is_correct: question.answer === ['A', 'B', 'C', 'D'][i],
                }))

            await supabase.from('answers').insert(answers)
          }
        }
      }

      // Create assignment
      const assignment = generateAssignment(lessonTemplate, moduleIndex, template)

      const { error: assignmentError } = await supabase
        .from('assignments')
        .insert({
          lesson_id: newLesson.id,
          course_id: courseId,
          title: assignment.title,
          description: assignment.description,
          instructions: assignment.instructions,
          due_days_after_enrollment: 7,
          max_score: assignment.totalPoints,
          rubric: assignment.rubric,
        })

      if (assignmentError) {
        console.log(`      ⚠️  Assignment error: ${assignmentError.message}`)
      }

      if (!assignmentError) {
        totalAssignmentsCreated++
      }

      console.log(`    ✅ Lesson ${globalLessonNum}: ${lessonTemplate.title}`)
    }
  }

  // Update course statistics
  await supabase
    .from('courses')
    .update({
      total_lessons: totalLessonsCreated,
      total_duration_minutes: totalLessonsCreated * 7,
    })
    .eq('id', courseId)

  return {
    lessonsCreated: totalLessonsCreated,
    quizzesCreated: totalQuizzesCreated,
    assignmentsCreated: totalAssignmentsCreated,
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('\n' + '═'.repeat(60))
  console.log('🎓 PHAZUR LABS ACADEMY - Comprehensive Course Content Seeder')
  console.log('═'.repeat(60))

  // Fetch all courses
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('id, title, level')
    .order('created_at', { ascending: true })

  if (coursesError) {
    console.error('❌ Failed to fetch courses:', coursesError.message)
    process.exit(1)
  }

  if (!courses || courses.length === 0) {
    console.log('⚠️  No courses found in database')
    process.exit(0)
  }

  console.log(`\n📋 Found ${courses.length} courses:`)
  courses.forEach((c, i) => console.log(`   ${i + 1}. ${c.title}`))

  const results: { course: string; template: string; lessons: number; quizzes: number; assignments: number }[] = []

  for (const course of courses) {
    // Find matching template
    const template = findMatchingTemplate(course.title)

    if (!template) {
      console.log(`\n⚠️  No template found for: ${course.title}`)
      console.log('   Using generic template...')
      // Could use a generic template here, skipping for now
      continue
    }

    console.log(`\n✅ Matched template "${template.slug}" for: ${course.title}`)

    try {
      const result = await seedCourseContent(course.id, course.title, template)

      results.push({
        course: course.title,
        template: template.slug,
        lessons: result.lessonsCreated,
        quizzes: result.quizzesCreated,
        assignments: result.assignmentsCreated,
      })
    } catch (error) {
      console.error(`❌ Error seeding ${course.title}:`, error)
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(60))
  console.log('📊 SEEDING COMPLETE - Summary')
  console.log('═'.repeat(60))

  let totalLessons = 0
  let totalQuizzes = 0
  let totalAssignments = 0

  for (const result of results) {
    console.log(`\n${result.course}:`)
    console.log(`   Template: ${result.template}`)
    console.log(`   Lessons: ${result.lessons}, Quizzes: ${result.quizzes}, Assignments: ${result.assignments}`)
    totalLessons += result.lessons
    totalQuizzes += result.quizzes
    totalAssignments += result.assignments
  }

  console.log('\n' + '─'.repeat(60))
  console.log(`TOTALS: ${totalLessons} lessons, ${totalQuizzes} quizzes, ${totalAssignments} assignments`)
  console.log('═'.repeat(60) + '\n')
}

main().catch(console.error)
