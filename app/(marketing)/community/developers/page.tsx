import Link from 'next/link'
import {
  Code,
  Terminal,
  Puzzle,
  Book,
  MessageSquare,
  Zap,
  ArrowRight,
  Github,
  Box,
  Webhook,
  Key,
  Layers
} from 'lucide-react'

const features = [
  {
    icon: Key,
    title: 'Public APIs',
    description: 'Access our RESTful and GraphQL APIs to integrate course data, progress tracking, and certifications into your apps.'
  },
  {
    icon: Box,
    title: 'SDKs & Libraries',
    description: 'Official SDKs for JavaScript, Python, and Go. Build integrations faster with type-safe code.'
  },
  {
    icon: Webhook,
    title: 'Webhooks',
    description: 'Real-time event notifications for enrollments, completions, and certificate issuance.'
  },
  {
    icon: Puzzle,
    title: 'Embed Components',
    description: 'Drop-in React components to embed course listings, player, and progress widgets in your site.'
  },
  {
    icon: Layers,
    title: 'LTI Integration',
    description: 'LTI 1.3 compliant for seamless integration with LMS platforms like Canvas, Moodle, and Blackboard.'
  },
  {
    icon: Book,
    title: 'Documentation',
    description: 'Comprehensive docs with tutorials, code examples, and API references to get you started quickly.'
  }
]

const useCases = [
  {
    title: 'Corporate LMS Integration',
    description: 'Integrate our courses directly into your company learning management system.',
    icon: '🏢'
  },
  {
    title: 'Custom Learning Portals',
    description: 'Build white-labeled learning experiences for your organization or clients.',
    icon: '🎓'
  },
  {
    title: 'Progress Analytics',
    description: 'Pull learning data into your analytics platform for custom reporting.',
    icon: '📊'
  },
  {
    title: 'Certification Verification',
    description: 'Verify credentials programmatically for hiring or credential checks.',
    icon: '✅'
  }
]

const stats = [
  { value: '1,000+', label: 'Developers' },
  { value: '100+', label: 'Integrations Built' },
  { value: '99.9%', label: 'API Uptime' },
  { value: '<100ms', label: 'Avg Response Time' }
]

export default function DevelopersPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-background dark:from-green-950/20">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6">
            <Code className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Developer Program
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Build powerful integrations with our APIs, SDKs, and developer tools. Create custom learning experiences.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#get-started"
              className="inline-flex items-center h-14 px-8 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
            >
              Get API Access
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="https://docs.phazurlabs.com"
              className="inline-flex items-center h-14 px-8 border rounded-md font-medium hover:bg-muted"
            >
              <Book className="mr-2 h-5 w-5" />
              View Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Developer Tools</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Everything you need to build integrations and custom learning experiences.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-4 p-6 border rounded-xl bg-background">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-20 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Quick Start</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Get up and running in minutes with our simple API.
          </p>
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-900 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-800">
                <Terminal className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">JavaScript</span>
              </div>
              <pre className="p-6 overflow-x-auto">
                <code className="text-sm text-gray-300">{`import { PhazurLabs } from '@phazurlabs/sdk';

const client = new PhazurLabs({
  apiKey: process.env.PHAZUR_API_KEY
});

// Get all courses
const courses = await client.courses.list();

// Get user progress
const progress = await client.progress.get({
  userId: 'user_123',
  courseId: 'course_456'
});

// Verify a certificate
const cert = await client.certificates.verify({
  certificateNumber: 'CERT-2024-XXXXX'
});`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Use Cases</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            See what developers are building with our platform.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {useCases.map((useCase, index) => (
              <div key={index} className="text-center p-6 border rounded-xl bg-background">
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="font-semibold mb-2">{useCase.title}</h3>
                <p className="text-muted-foreground text-sm">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-20 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Developer Resources</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Link
              href="https://docs.phazurlabs.com"
              className="flex items-center gap-4 p-6 bg-background border rounded-xl hover:shadow-lg transition-all"
            >
              <Book className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-semibold">Documentation</h3>
                <p className="text-sm text-muted-foreground">API reference & guides</p>
              </div>
            </Link>
            <Link
              href="https://github.com/phazurlabs"
              className="flex items-center gap-4 p-6 bg-background border rounded-xl hover:shadow-lg transition-all"
            >
              <Github className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-semibold">GitHub</h3>
                <p className="text-sm text-muted-foreground">SDKs & examples</p>
              </div>
            </Link>
            <Link
              href="https://discord.gg/phazurlabs"
              className="flex items-center gap-4 p-6 bg-background border rounded-xl hover:shadow-lg transition-all"
            >
              <MessageSquare className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-semibold">Discord</h3>
                <p className="text-sm text-muted-foreground">Developer community</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="get-started" className="py-20 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <Zap className="h-12 w-12 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Start Building Today</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Get free API access and start integrating in minutes.
          </p>
          <Link
            href="/contact?subject=developer"
            className="inline-flex items-center h-14 px-8 bg-white text-green-600 rounded-md font-medium hover:bg-gray-100"
          >
            Request API Key
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  )
}
