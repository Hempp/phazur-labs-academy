'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  BookOpen,
  CreditCard,
  Award,
  Settings,
  Users,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Mail,
  Phone,
  HelpCircle,
  Laptop,
  Shield,
  Clock,
  FileText,
  Video,
  ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'

const categories = [
  {
    id: 'getting-started',
    icon: BookOpen,
    title: 'Getting Started',
    description: 'New to Course Training? Start here.',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
    articles: [
      { title: 'How to create an account', views: 12500 },
      { title: 'Navigating the platform', views: 8900 },
      { title: 'Choosing your first course', views: 7200 },
      { title: 'Setting up your profile', views: 5400 },
      { title: 'Mobile app installation', views: 4100 }
    ]
  },
  {
    id: 'courses',
    icon: Video,
    title: 'Courses & Learning',
    description: 'Course access, progress, and completion.',
    color: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600',
    articles: [
      { title: 'How to access course materials', views: 9800 },
      { title: 'Downloading videos for offline', views: 6700 },
      { title: 'Course progress tracking', views: 5500 },
      { title: 'Completing assignments', views: 4800 },
      { title: 'Requesting course extensions', views: 2300 }
    ]
  },
  {
    id: 'billing',
    icon: CreditCard,
    title: 'Billing & Payments',
    description: 'Subscriptions, refunds, and invoices.',
    color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600',
    articles: [
      { title: 'Subscription plans explained', views: 11200 },
      { title: 'How to request a refund', views: 8400 },
      { title: 'Updating payment methods', views: 6100 },
      { title: 'Understanding invoices', views: 3800 },
      { title: 'Team billing management', views: 2900 }
    ]
  },
  {
    id: 'certificates',
    icon: Award,
    title: 'Certificates',
    description: 'Earning and sharing your credentials.',
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600',
    articles: [
      { title: 'How to earn a certificate', views: 15600 },
      { title: 'Downloading your certificate', views: 9200 },
      { title: 'Sharing on LinkedIn', views: 7800 },
      { title: 'Certificate verification', views: 5100 },
      { title: 'Replacing a lost certificate', views: 1800 }
    ]
  },
  {
    id: 'account',
    icon: Settings,
    title: 'Account Settings',
    description: 'Profile, security, and preferences.',
    color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600',
    articles: [
      { title: 'Changing your password', views: 7400 },
      { title: 'Email notification settings', views: 4900 },
      { title: 'Two-factor authentication', views: 3600 },
      { title: 'Deleting your account', views: 2100 },
      { title: 'Data export request', views: 1500 }
    ]
  },
  {
    id: 'enterprise',
    icon: Users,
    title: 'Enterprise & Teams',
    description: 'Team management and admin features.',
    color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600',
    articles: [
      { title: 'Setting up your team', views: 4200 },
      { title: 'Admin dashboard overview', views: 3800 },
      { title: 'Assigning courses to members', views: 3100 },
      { title: 'Progress reporting', views: 2700 },
      { title: 'SSO configuration', views: 1900 }
    ]
  }
]

const popularArticles = [
  { title: 'How to earn a certificate', category: 'Certificates', views: 15600 },
  { title: 'How to create an account', category: 'Getting Started', views: 12500 },
  { title: 'Subscription plans explained', category: 'Billing', views: 11200 },
  { title: 'How to access course materials', category: 'Courses', views: 9800 },
  { title: 'Downloading your certificate', category: 'Certificates', views: 9200 }
]

const faqs = [
  {
    question: 'How do I reset my password?',
    answer: 'Go to the login page and click "Forgot password". Enter your email address, and we\'ll send you a link to reset your password. The link expires after 24 hours.'
  },
  {
    question: 'Can I download courses for offline viewing?',
    answer: 'Yes! Premium subscribers can download course videos for offline viewing in our mobile apps. Go to any lesson, tap the download icon, and the video will be saved to your device.'
  },
  {
    question: 'What is your refund policy?',
    answer: 'We offer a 30-day money-back guarantee on all courses. If you\'ve completed less than 20% of a course and are unsatisfied, contact support for a full refund.'
  },
  {
    question: 'How do certificates work?',
    answer: 'You earn a certificate by completing all course modules and passing the final assessment with a score of 70% or higher. Certificates are verifiable and can be shared on LinkedIn.'
  },
  {
    question: 'Can I switch subscription plans?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time from Account Settings. If you upgrade, you\'ll be charged the prorated difference. If you downgrade, the change takes effect at your next billing cycle.'
  }
]

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const filteredCategories = searchQuery
    ? categories.filter(cat =>
        cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.articles.some(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : categories

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-light mb-6">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Find answers to your questions and learn how to get the most out of Course Training.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-lg"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
          <Link href="#getting-started" className="flex items-center gap-2 p-4 bg-surface-secondary rounded-xl hover:bg-muted transition-colors">
            <Laptop className="h-5 w-5 text-primary" />
            <span className="font-medium text-sm">Quick Start</span>
          </Link>
          <Link href="#billing" className="flex items-center gap-2 p-4 bg-surface-secondary rounded-xl hover:bg-muted transition-colors">
            <CreditCard className="h-5 w-5 text-primary" />
            <span className="font-medium text-sm">Billing Help</span>
          </Link>
          <Link href="/verify" className="flex items-center gap-2 p-4 bg-surface-secondary rounded-xl hover:bg-muted transition-colors">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-medium text-sm">Verify Cert</span>
          </Link>
          <Link href="/contact" className="flex items-center gap-2 p-4 bg-surface-secondary rounded-xl hover:bg-muted transition-colors">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span className="font-medium text-sm">Contact Us</span>
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                id={category.id}
                className="bg-background border rounded-xl p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', category.color)}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {category.articles.slice(0, 4).map((article, index) => (
                    <li key={index}>
                      <Link
                        href="#"
                        className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                      >
                        <span className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4" />
                          {article.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="#"
                  className="inline-flex items-center text-sm text-primary font-medium mt-4 hover:underline"
                >
                  View all {category.articles.length} articles
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Most Popular Articles</h2>
          <div className="max-w-3xl mx-auto bg-background border rounded-xl divide-y">
            {popularArticles.map((article, index) => (
              <Link
                key={index}
                href="#"
                className="flex items-center justify-between p-4 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{article.title}</div>
                    <div className="text-sm text-muted-foreground">{article.category}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {(article.views / 1000).toFixed(1)}k views
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-background border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium pr-4">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 text-muted-foreground transition-transform flex-shrink-0',
                      expandedFaq === index && 'rotate-180'
                    )}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6 text-muted-foreground">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-surface-secondary rounded-xl p-6 text-center">
            <FileText className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Documentation</h3>
            <p className="text-sm text-muted-foreground mb-4">
              In-depth guides and technical documentation for developers.
            </p>
            <Link href="#" className="text-primary text-sm font-medium hover:underline inline-flex items-center">
              View Docs <ExternalLink className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="bg-surface-secondary rounded-xl p-6 text-center">
            <Video className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Video Tutorials</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Watch step-by-step video guides on using the platform.
            </p>
            <Link href="#" className="text-primary text-sm font-medium hover:underline inline-flex items-center">
              Watch Videos <ExternalLink className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="bg-surface-secondary rounded-xl p-6 text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Community</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Join discussions and get help from other learners.
            </p>
            <Link href="#" className="text-primary text-sm font-medium hover:underline inline-flex items-center">
              Join Community <ExternalLink className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-br from-primary/10 to-violet-500/10 rounded-2xl p-8 md:p-12 text-center">
          <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Our support team is available 24/7 to help you with any questions or issues.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center h-12 px-6 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
            >
              <Mail className="h-5 w-5 mr-2" />
              Contact Support
            </Link>
            <a
              href="tel:+1-555-123-4567"
              className="inline-flex items-center h-12 px-6 border rounded-lg font-medium hover:bg-muted"
            >
              <Phone className="h-5 w-5 mr-2" />
              +1 (555) 123-4567
            </a>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            Average response time: <strong>under 2 hours</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
