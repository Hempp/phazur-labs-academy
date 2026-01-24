'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  BarChart3,
  Settings,
  Shield,
  Terminal,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Building2,
  Loader2,
  Code2,
  Rocket,
  TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: Users,
    title: 'Team Management',
    description: 'Manage all your employees from a single dashboard. Assign courses, track progress, and monitor skill development across your organization.'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: "Get deep insights into your team's learning progress with detailed reports, skill gap analysis, and ROI measurements."
  },
  {
    icon: Settings,
    title: 'Custom Learning Paths',
    description: "Create customized training programs tailored to your company's tech stack, roles, and career progression frameworks."
  },
  {
    icon: Shield,
    title: 'Verified Certifications',
    description: 'Industry-recognized certificates with instant employer verification. Build a credentialed workforce that stands out.'
  },
  {
    icon: Terminal,
    title: 'API Integration',
    description: 'Seamlessly integrate with your HRIS, LMS, or internal tools via our REST API. SSO support with SAML and OAuth.'
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: 'Get priority support with dedicated customer success managers, onboarding assistance, and 24/7 technical support.'
  }
]

const plans = [
  {
    name: 'Team',
    description: 'For small teams getting started',
    price: 79,
    period: '/seat/month',
    minSeats: 5,
    features: [
      'Up to 25 team members',
      'All course catalog access',
      'Team progress dashboard',
      'Certificate verification',
      'Basic analytics',
      'Email support'
    ],
    cta: 'Start Free Trial',
    popular: false
  },
  {
    name: 'Business',
    description: 'For growing organizations',
    price: 149,
    period: '/seat/month',
    minSeats: 10,
    features: [
      'Up to 250 team members',
      'Everything in Team',
      'Custom learning paths',
      'Advanced analytics & reporting',
      'API access',
      'SSO (SAML/OAuth)',
      'Dedicated success manager',
      'Priority support'
    ],
    cta: 'Contact Sales',
    popular: true
  },
  {
    name: 'Enterprise',
    description: 'For large organizations',
    price: null,
    period: 'Custom pricing',
    minSeats: 100,
    features: [
      'Unlimited team members',
      'Everything in Business',
      'Custom course development',
      'White-label options',
      'On-premise deployment',
      'Custom integrations',
      'Executive reporting',
      '24/7 premium support',
      'SLA guarantees'
    ],
    cta: 'Contact Sales',
    popular: false
  }
]

const testimonials = [
  {
    quote: "Phazur Labs has transformed how we upskill our engineering team. The certification program gave our developers credible credentials that they're proud to showcase.",
    author: 'Sarah Chen',
    role: 'VP of Engineering',
    company: 'TechCorp Inc.'
  },
  {
    quote: "We've seen a 40% reduction in onboarding time for new hires since implementing Phazur Labs training. The custom learning paths are a game-changer.",
    author: 'Michael Roberts',
    role: 'Head of L&D',
    company: 'ScaleUp Solutions'
  },
  {
    quote: "The ROI on our training investment has been incredible. Our certified developers are 2x more productive and our retention rate improved by 35%.",
    author: 'Emily Watson',
    role: 'CTO',
    company: 'Innovation Labs'
  }
]

const stats = [
  { value: '500+', label: 'Enterprise Clients' },
  { value: '250K+', label: 'Certified Professionals' },
  { value: '98%', label: 'Customer Satisfaction' },
  { value: '35%', label: 'Avg. Productivity Increase' }
]

const useCases = [
  {
    title: 'Engineering Teams',
    description: 'Upskill developers with modern frameworks, cloud technologies, and best practices.',
    Icon: Code2
  },
  {
    title: 'New Hire Onboarding',
    description: 'Accelerate time-to-productivity with structured onboarding programs.',
    Icon: Rocket
  },
  {
    title: 'Career Development',
    description: 'Support employee growth with clear learning paths and certifications.',
    Icon: TrendingUp
  },
  {
    title: 'Compliance Training',
    description: 'Ensure team compliance with security and regulatory requirements.',
    Icon: CheckCircle2
  }
]

export default function EnterprisePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    teamSize: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
              <Building2 className="h-4 w-4" />
              Enterprise Training Solutions
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Build a World-Class
              <span className="text-primary"> Tech Team</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Upskill your workforce with industry-recognized certifications. Custom training programs,
              team analytics, and verified credentials that employers trust.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="#contact"
                className="inline-flex items-center h-12 px-8 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
              >
                Request Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="#pricing"
                className="inline-flex items-center h-12 px-8 border border-slate-600 text-white rounded-md font-medium hover:bg-white/10"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Everything Your Team Needs to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools to manage, track, and certify your workforce&apos;s skills at scale.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-background border rounded-xl p-6">
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center text-primary mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Plans That Scale With You
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From small teams to enterprise organizations, we have a plan that fits your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={cn(
                  'bg-background border rounded-2xl p-8 relative',
                  plan.popular && 'border-2 border-primary shadow-xl'
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                <p className="text-muted-foreground mb-6">{plan.description}</p>

                <div className="mb-6">
                  {plan.price ? (
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground ml-1">{plan.period}</span>
                    </div>
                  ) : (
                    <div className="text-4xl font-bold">{plan.period}</div>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">Minimum {plan.minSeats} seats</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={cn(
                    'w-full h-12 rounded-lg font-medium transition-colors',
                    plan.popular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border hover:bg-muted'
                  )}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Trusted by Leading Companies
            </h2>
            <p className="text-xl text-muted-foreground">
              See how organizations are transforming their teams with Phazur Labs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-background border rounded-xl p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">&quot;{testimonial.quote}&quot;</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-sm text-primary">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Solutions for Every Team
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, i) => (
              <div key={i} className="bg-background border rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <useCase.Icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{useCase.title}</h3>
                <p className="text-sm text-muted-foreground">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Get Started Today</h2>
              <p className="text-xl text-slate-300">
                Talk to our team about how Phazur Labs can help transform your workforce.
              </p>
            </div>

            <div className="bg-background text-foreground rounded-2xl p-8">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                  <p className="text-muted-foreground mb-6">
                    Our team will contact you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false)
                      setFormData({ name: '', email: '', company: '', teamSize: '', message: '' })
                    }}
                    className="text-primary font-medium hover:underline"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Work Email *
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium mb-2">
                        Company Name *
                      </label>
                      <input
                        id="company"
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="teamSize" className="block text-sm font-medium mb-2">
                        Team Size *
                      </label>
                      <select
                        id="teamSize"
                        required
                        value={formData.teamSize}
                        onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select team size</option>
                        <option value="5-25">5-25 employees</option>
                        <option value="26-100">26-100 employees</option>
                        <option value="101-500">101-500 employees</option>
                        <option value="500+">500+ employees</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      How can we help?
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Tell us about your training needs..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      'Request Demo'
                    )}
                  </button>

                  <p className="text-sm text-muted-foreground text-center">
                    By submitting this form, you agree to our{' '}
                    <Link href="/terms" className="text-primary hover:underline">Terms</Link> and{' '}
                    <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
