'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Team Management',
    description: 'Manage all your employees from a single dashboard. Assign courses, track progress, and monitor skill development across your organization.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Advanced Analytics',
    description: 'Get deep insights into your team\'s learning progress with detailed reports, skill gap analysis, and ROI measurements.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    title: 'Custom Learning Paths',
    description: 'Create customized training programs tailored to your company\'s tech stack, roles, and career progression frameworks.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Verified Certifications',
    description: 'Industry-recognized certificates with instant employer verification. Build a credentialed workforce that stands out.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'API Integration',
    description: 'Seamlessly integrate with your HRIS, LMS, or internal tools via our REST API. SSO support with SAML and OAuth.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: 'Dedicated Support',
    description: 'Get priority support with dedicated customer success managers, onboarding assistance, and 24/7 technical support.',
  },
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
      'Email support',
    ],
    cta: 'Start Free Trial',
    popular: false,
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
      'Priority support',
    ],
    cta: 'Contact Sales',
    popular: true,
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
      'SLA guarantees',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

const testimonials = [
  {
    quote: "Phazur Labs has transformed how we upskill our engineering team. The certification program gave our developers credible credentials that they're proud to showcase.",
    author: 'Sarah Chen',
    role: 'VP of Engineering',
    company: 'TechCorp Inc.',
    logo: '/logos/techcorp.svg',
  },
  {
    quote: "We've seen a 40% reduction in onboarding time for new hires since implementing Phazur Labs training. The custom learning paths are a game-changer.",
    author: 'Michael Roberts',
    role: 'Head of L&D',
    company: 'ScaleUp Solutions',
    logo: '/logos/scaleup.svg',
  },
  {
    quote: "The ROI on our training investment has been incredible. Our certified developers are 2x more productive and our retention rate improved by 35%.",
    author: 'Emily Watson',
    role: 'CTO',
    company: 'Innovation Labs',
    logo: '/logos/innovation.svg',
  },
]

const stats = [
  { value: '500+', label: 'Enterprise Clients' },
  { value: '250K+', label: 'Certified Professionals' },
  { value: '98%', label: 'Customer Satisfaction' },
  { value: '35%', label: 'Avg. Productivity Increase' },
]

export default function EnterprisePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    teamSize: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Thank you! Our team will contact you within 24 hours.')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">Phazur Labs</span>
              <span className="text-xs text-primary-600 block -mt-1">for Enterprise</span>
            </div>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 text-sm">Features</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm">Pricing</Link>
            <Link href="/verify" className="text-gray-600 hover:text-gray-900 text-sm">Verify Certificates</Link>
            <Link
              href="#contact"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
            >
              Contact Sales
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-primary-600/20 text-primary-400 rounded-full text-sm font-medium mb-6">
              Enterprise Training Solutions
            </span>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Build a World-Class
              <span className="text-primary-400"> Tech Team</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Upskill your workforce with industry-recognized certifications. Custom training programs,
              team analytics, and verified credentials that employers trust.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="#contact"
                className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                Request Demo
              </Link>
              <Link
                href="#pricing"
                className="px-8 py-4 border border-gray-600 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-bold text-primary-600 mb-1">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything Your Team Needs to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools to manage, track, and certify your workforce's skills at scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <Card key={i} className="p-6">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Plans That Scale With You
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From small teams to enterprise organizations, we have a plan that fits your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <Card
                key={i}
                className={`p-8 relative ${plan.popular ? 'border-2 border-primary-600 shadow-xl' : ''}`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="mb-6">
                  {plan.price ? (
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-500 ml-1">{plan.period}</span>
                    </div>
                  ) : (
                    <div className="text-4xl font-bold text-gray-900">{plan.period}</div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">Minimum {plan.minSeats} seats</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 font-semibold rounded-lg transition-colors ${
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {plan.cta}
                </button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Leading Companies
            </h2>
            <p className="text-xl text-gray-600">
              See how organizations are transforming their teams with Phazur Labs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                  <p className="text-sm text-primary-600">{testimonial.company}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Solutions for Every Team
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Engineering Teams',
                description: 'Upskill developers with modern frameworks, cloud technologies, and best practices.',
                icon: '💻',
              },
              {
                title: 'New Hire Onboarding',
                description: 'Accelerate time-to-productivity with structured onboarding programs.',
                icon: '🚀',
              },
              {
                title: 'Career Development',
                description: 'Support employee growth with clear learning paths and certifications.',
                icon: '📈',
              },
              {
                title: 'Compliance Training',
                description: 'Ensure team compliance with security and regulatory requirements.',
                icon: '✅',
              },
            ].map((useCase, i) => (
              <Card key={i} className="p-6 text-center">
                <span className="text-4xl mb-4 block">{useCase.icon}</span>
                <h3 className="font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                <p className="text-sm text-gray-600">{useCase.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get Started Today</h2>
            <p className="text-xl text-gray-300">
              Talk to our team about how Phazur Labs can help transform your workforce.
            </p>
          </div>

          <Card className="p-8 bg-white text-gray-900">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Work Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    id="company"
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-1">
                    Team Size *
                  </label>
                  <select
                    id="teamSize"
                    required
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  How can we help?
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Tell us about your training needs..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                Request Demo
              </button>

              <p className="text-sm text-gray-500 text-center">
                By submitting this form, you agree to our{' '}
                <Link href="/terms" className="text-primary-600 hover:underline">Terms</Link> and{' '}
                <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>.
              </p>
            </form>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="text-white font-semibold">Phazur Labs Academy</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/terms" className="hover:text-white">Terms</Link>
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/security" className="hover:text-white">Security</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
            </div>
          </div>
          <p className="text-sm mt-8 text-center">
            2024 Phazur Labs Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
