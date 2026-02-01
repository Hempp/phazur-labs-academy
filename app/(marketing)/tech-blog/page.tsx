import Link from 'next/link'
import {
  Code,
  Cpu,
  Database,
  Cloud,
  Lock,
  Gauge,
  ArrowRight,
  Clock,
  User,
  Tag,
  Star
} from 'lucide-react'

const categories = [
  { name: 'All', slug: 'all', count: 48 },
  { name: 'Engineering', slug: 'engineering', count: 15 },
  { name: 'Infrastructure', slug: 'infrastructure', count: 12 },
  { name: 'AI/ML', slug: 'ai-ml', count: 10 },
  { name: 'Security', slug: 'security', count: 6 },
  { name: 'Performance', slug: 'performance', count: 5 }
]

const featuredPost = {
  title: 'How We Scaled Our Video Streaming Infrastructure to 1 Million Concurrent Users',
  excerpt: 'A deep dive into our journey from a monolithic architecture to a distributed, event-driven system that handles millions of video streams daily.',
  author: 'Alex Chen',
  role: 'Principal Engineer',
  date: 'Jan 15, 2025',
  readTime: '15 min read',
  category: 'Infrastructure',
  tags: ['Kubernetes', 'Video Streaming', 'Scalability'],
  slug: 'scaling-video-infrastructure'
}

const posts = [
  {
    title: 'Building a Real-Time Code Execution Engine with WebAssembly',
    excerpt: 'How we built a secure, sandboxed environment for executing student code in the browser.',
    author: 'Sarah Kim',
    date: 'Jan 12, 2025',
    readTime: '12 min read',
    category: 'Engineering',
    icon: Code,
    slug: 'wasm-code-execution'
  },
  {
    title: 'Our Journey to Zero-Downtime Deployments',
    excerpt: 'Implementing blue-green deployments and feature flags for seamless releases.',
    author: 'Marcus Johnson',
    date: 'Jan 10, 2025',
    readTime: '10 min read',
    category: 'Infrastructure',
    icon: Cloud,
    slug: 'zero-downtime-deployments'
  },
  {
    title: 'Fine-Tuning LLMs for Personalized Learning Recommendations',
    excerpt: 'How we trained custom models to understand learner behavior and suggest optimal content.',
    author: 'Dr. Emily Zhang',
    date: 'Jan 8, 2025',
    readTime: '18 min read',
    category: 'AI/ML',
    icon: Cpu,
    slug: 'llm-learning-recommendations'
  },
  {
    title: 'Implementing End-to-End Encryption for Student Data',
    excerpt: 'A technical overview of our encryption strategy protecting millions of learner records.',
    author: 'James Wilson',
    date: 'Jan 5, 2025',
    readTime: '14 min read',
    category: 'Security',
    icon: Lock,
    slug: 'e2e-encryption-student-data'
  },
  {
    title: 'Optimizing PostgreSQL for 10 Billion Learning Events',
    excerpt: 'Database tuning strategies that reduced query times by 90% at scale.',
    author: 'Priya Patel',
    date: 'Jan 3, 2025',
    readTime: '16 min read',
    category: 'Performance',
    icon: Database,
    slug: 'postgresql-optimization'
  },
  {
    title: 'From REST to GraphQL: Our API Evolution',
    excerpt: 'Lessons learned migrating our public API while maintaining backwards compatibility.',
    author: 'Tom Anderson',
    date: 'Dec 28, 2024',
    readTime: '11 min read',
    category: 'Engineering',
    icon: Code,
    slug: 'rest-to-graphql-migration'
  },
  {
    title: 'Building an AI-Powered Code Review System',
    excerpt: 'How we use machine learning to provide instant feedback on student code submissions.',
    author: 'Lisa Chen',
    date: 'Dec 22, 2024',
    readTime: '13 min read',
    category: 'AI/ML',
    icon: Cpu,
    slug: 'ai-code-review'
  },
  {
    title: 'Achieving 99.99% Uptime: Our SRE Practices',
    excerpt: 'The monitoring, alerting, and incident response systems that keep us running.',
    author: 'David Park',
    date: 'Dec 18, 2024',
    readTime: '15 min read',
    category: 'Infrastructure',
    icon: Gauge,
    slug: 'sre-practices-uptime'
  }
]

const openSourceProjects = [
  {
    name: 'course-player-sdk',
    description: 'Open-source SDK for embedding interactive course content',
    stars: '2.4k',
    language: 'TypeScript'
  },
  {
    name: 'code-sandbox',
    description: 'Secure, sandboxed code execution environment',
    stars: '1.8k',
    language: 'Rust'
  },
  {
    name: 'learning-analytics',
    description: 'Real-time learning analytics pipeline',
    stars: '1.2k',
    language: 'Python'
  }
]

export default function TechBlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm font-medium mb-6">
              <Code className="h-4 w-4" />
              Engineering Blog
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Tech Blog
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Deep dives into how we build and scale the Course Training platform. Engineering insights, architecture decisions, and lessons learned.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="#posts"
                className="inline-flex items-center h-12 px-6 bg-white text-gray-900 rounded-md font-medium hover:bg-gray-100"
              >
                Read Articles
              </Link>
              <Link
                href="https://github.com/coursetraining"
                className="inline-flex items-center h-12 px-6 border border-white/30 text-white rounded-md font-medium hover:bg-white/10"
              >
                View GitHub
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.slug}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  category.slug === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {category.name}
                <span className="text-xs opacity-60">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Link href={`/tech-blog/${featuredPost.slug}`} className="block group">
            <div className="bg-gradient-to-br from-primary/5 to-violet-500/5 border rounded-2xl p-8 md:p-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Featured
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 group-hover:text-primary transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
                {featuredPost.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {featuredPost.author}, {featuredPost.role}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {featuredPost.readTime}
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  {featuredPost.category}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {featuredPost.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-muted rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Posts Grid */}
      <section id="posts" className="py-16 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <Link
                key={index}
                href={`/tech-blog/${post.slug}`}
                className="bg-background border rounded-xl p-6 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <post.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{post.category}</span>
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{post.author}</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <button className="inline-flex items-center h-12 px-6 border rounded-md font-medium hover:bg-muted">
              Load More Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Open Source */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Open Source</h2>
            <p className="text-muted-foreground">
              We believe in giving back to the community. Check out our open source projects.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {openSourceProjects.map((project, index) => (
              <Link
                key={index}
                href={`https://github.com/coursetraining/${project.name}`}
                className="p-6 border rounded-xl hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Code className="h-5 w-5 text-primary" />
                  <span className="font-mono font-semibold">{project.name}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {project.stars}
                  </span>
                  <span className="text-muted-foreground">{project.language}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Subscribe to our engineering newsletter for the latest technical insights and updates.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full h-12 px-4 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:border-white/40"
            />
            <button className="w-full sm:w-auto h-12 px-6 bg-white text-gray-900 rounded-md font-medium hover:bg-gray-100 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
