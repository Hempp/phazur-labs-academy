import Link from 'next/link'
import {
  GraduationCap,
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Tag
} from 'lucide-react'

const featuredPost = {
  id: 'future-of-tech-education-2024',
  title: 'The Future of Tech Education: Trends to Watch in 2024',
  excerpt: 'From AI-powered personalized learning to micro-credentials, discover the trends shaping how we learn technology skills.',
  author: 'Sarah Chen',
  authorRole: 'CEO',
  date: 'January 15, 2024',
  readTime: '8 min read',
  category: 'Industry Insights',
  image: '/blog/future-education.jpg'
}

const posts = [
  {
    id: 'getting-started-with-nextjs-14',
    title: 'Getting Started with Next.js 14: A Complete Guide',
    excerpt: 'Learn how to build modern web applications with Next.js 14, including the new App Router and Server Components.',
    author: 'James Mitchell',
    date: 'January 12, 2024',
    readTime: '12 min read',
    category: 'Tutorials'
  },
  {
    id: 'machine-learning-career-guide',
    title: 'Breaking Into Machine Learning: A Career Guide',
    excerpt: 'Everything you need to know about starting a career in machine learning, from skills to job search strategies.',
    author: 'Dr. Marcus Rivera',
    date: 'January 10, 2024',
    readTime: '10 min read',
    category: 'Career Advice'
  },
  {
    id: 'cloud-certifications-worth-it',
    title: 'Are Cloud Certifications Worth It in 2024?',
    excerpt: 'We analyze the ROI of popular cloud certifications and help you decide which ones to pursue.',
    author: 'Emily Wong',
    date: 'January 8, 2024',
    readTime: '7 min read',
    category: 'Certifications'
  },
  {
    id: 'react-vs-vue-2024',
    title: 'React vs Vue in 2024: Which Should You Learn?',
    excerpt: 'An in-depth comparison of React and Vue.js to help you choose the right framework for your career.',
    author: 'James Mitchell',
    date: 'January 5, 2024',
    readTime: '9 min read',
    category: 'Tutorials'
  },
  {
    id: 'remote-work-productivity',
    title: '10 Tips for Staying Productive While Learning Remotely',
    excerpt: 'Practical strategies to maintain focus and motivation when learning new skills from home.',
    author: 'Sarah Chen',
    date: 'January 3, 2024',
    readTime: '6 min read',
    category: 'Learning Tips'
  },
  {
    id: 'ai-tools-developers',
    title: 'AI Tools Every Developer Should Know in 2024',
    excerpt: 'From GitHub Copilot to ChatGPT, explore the AI tools that are transforming software development.',
    author: 'Dr. Marcus Rivera',
    date: 'January 1, 2024',
    readTime: '8 min read',
    category: 'Industry Insights'
  }
]

const categories = [
  'All',
  'Tutorials',
  'Career Advice',
  'Industry Insights',
  'Certifications',
  'Learning Tips',
  'Student Stories'
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">Phazur Labs Academy</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/courses" className="text-sm font-medium hover:text-primary transition-colors">Courses</Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
            <Link href="/blog" className="text-sm font-medium text-primary">Blog</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium hover:text-primary">Sign In</Link>
            <Link href="/auth/register" className="h-10 px-4 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 flex items-center">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Blog</h1>
          <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-8">
            Insights, tutorials, and career advice from our team of experts.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full h-12 pl-12 pr-4 rounded-full border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === 'All'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Link
            href={`/blog/${featuredPost.id}`}
            className="block bg-card border rounded-2xl overflow-hidden hover:shadow-xl transition-all group"
          >
            <div className="grid md:grid-cols-2 gap-0">
              <div className="h-64 md:h-auto bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center">
                <GraduationCap className="h-24 w-24 text-primary/30" />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <span className="inline-flex items-center gap-1 text-primary text-sm font-medium mb-4">
                  <Tag className="h-4 w-4" />
                  {featuredPost.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {featuredPost.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{featuredPost.author}</div>
                      <div className="text-xs text-muted-foreground">{featuredPost.authorRole}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="h-48 bg-gradient-to-br from-primary/10 to-violet-500/10 flex items-center justify-center">
                  <GraduationCap className="h-16 w-16 text-primary/20" />
                </div>
                <div className="p-6">
                  <span className="inline-flex items-center gap-1 text-primary text-xs font-medium mb-3">
                    <Tag className="h-3 w-3" />
                    {post.category}
                  </span>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{post.author}</span>
                    <div className="flex items-center gap-3">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="inline-flex items-center h-12 px-8 border rounded-full font-medium hover:bg-muted">
              Load More Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Get the latest articles, tutorials, and industry insights delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 px-4 rounded-full border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="h-12 px-6 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Phazur Labs Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
