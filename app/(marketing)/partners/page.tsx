'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Building2,
  Users,
  GraduationCap,
  Globe,
  CheckCircle2,
  ArrowRight,
  Star,
  Zap,
  Shield,
  BarChart3,
  Award,
  Headphones,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Send,
  Handshake,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

const partnerTypes = [
  {
    id: 'enterprise',
    icon: Building2,
    title: 'Enterprise Partners',
    description: 'Upskill your workforce with customized learning solutions',
    benefits: [
      'Custom learning paths tailored to your industry',
      'Dedicated account manager',
      'Advanced analytics & reporting',
      'SSO & LMS integration',
      'Volume licensing discounts',
      'Priority support'
    ],
    cta: 'Contact Sales',
    color: 'primary'
  },
  {
    id: 'affiliate',
    icon: Users,
    title: 'Affiliate Partners',
    description: 'Earn commissions by promoting our courses',
    benefits: [
      'Up to 30% commission on referrals',
      'Real-time tracking dashboard',
      'Marketing materials provided',
      '30-day cookie duration',
      'Monthly payouts',
      'Dedicated affiliate support'
    ],
    cta: 'Join Affiliate Program',
    color: 'violet'
  },
  {
    id: 'instructor',
    icon: GraduationCap,
    title: 'Instructor Partners',
    description: 'Share your expertise and build your brand',
    benefits: [
      'Keep 70% of course revenue',
      'Access to 10M+ learners',
      'Course creation support',
      'Marketing & promotion',
      'Analytics & insights',
      'Instructor community'
    ],
    cta: 'Become an Instructor',
    color: 'emerald'
  },
  {
    id: 'reseller',
    icon: Globe,
    title: 'Reseller Partners',
    description: 'Distribute our content in your region',
    benefits: [
      'Exclusive regional rights',
      'Wholesale pricing',
      'Localization support',
      'Co-branding options',
      'Technical integration help',
      'Revenue sharing model'
    ],
    cta: 'Become a Reseller',
    color: 'amber'
  }
]

const stats = [
  { value: '500+', label: 'Partner Companies' },
  { value: '10M+', label: 'Learners Worldwide' },
  { value: '5,000+', label: 'Courses Available' },
  { value: '98%', label: 'Partner Satisfaction' }
]

const featuredPartners = [
  'Eromo Ventures',
  'Bridgemore',
  'Concierge Healthcare Partners',
  'The Orthopedic & Spine Institute',
  'Geekdom',
  'ASEN',
  'Music Maven',
  'SBDC',
  'UCLA Bruins',
  'LULAC',
  'Prince Hall',
  '3E'
]

const testimonials = [
  {
    quote: "Partnering with Phazur Labs Academy transformed our L&D program. Our employees now have access to cutting-edge tech courses that directly impact our bottom line.",
    author: 'Sarah Chen',
    role: 'VP of Learning & Development',
    company: 'TechCorp Global'
  },
  {
    quote: "As an affiliate, I've earned over $50,000 in commissions. The tracking is transparent, payouts are reliable, and the courses practically sell themselves.",
    author: 'Marcus Johnson',
    role: 'Tech Blogger & Affiliate',
    company: 'CodeMasters Blog'
  },
  {
    quote: "The instructor program gave me a platform to share my 20 years of experience. I've now taught over 100,000 students and built a thriving community.",
    author: 'Dr. Emily Rodriguez',
    role: 'Senior Instructor',
    company: 'Data Science Expert'
  }
]

const faqs = [
  {
    question: 'How long does the partnership application process take?',
    answer: 'Most applications are reviewed within 3-5 business days. Enterprise partnerships may require additional discovery calls and can take 2-3 weeks to finalize.'
  },
  {
    question: 'What are the requirements to become an instructor?',
    answer: "We look for industry expertise, teaching experience, and a commitment to quality. You'll need to submit a course outline and sample video for review."
  },
  {
    question: 'How does the affiliate commission structure work?',
    answer: 'Affiliates earn 20-30% commission on referred sales. Commission rates increase based on performance tiers. Payouts are processed monthly via PayPal or bank transfer.'
  },
  {
    question: 'Can we white-label the platform for our organization?',
    answer: 'Yes! Enterprise partners can access our white-label solution with custom branding, domain, and tailored content libraries.'
  },
  {
    question: 'Is there a minimum commitment for enterprise partnerships?',
    answer: "Enterprise plans start at 50 seats with annual commitments. We offer flexible pricing based on your organization's size and needs."
  }
]

const whyPartner = [
  {
    icon: BarChart3,
    title: 'Revenue Growth',
    description: 'Access new markets and revenue streams with our proven business model and global reach.'
  },
  {
    icon: Shield,
    title: 'Trusted Platform',
    description: 'Build on a secure, scalable platform trusted by millions of learners worldwide.'
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: 'Get personalized assistance from our partner success team at every step.'
  },
  {
    icon: Zap,
    title: 'Fast Integration',
    description: 'Easy API integration and white-label solutions to get you started quickly.'
  },
  {
    icon: Award,
    title: 'Premium Content',
    description: 'Access to 5,000+ courses from industry experts and thought leaders.'
  }
]

export default function PartnersPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    partnerType: '',
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
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light text-primary text-sm font-medium mb-8">
            <Handshake className="h-4 w-4" />
            Partnership Program
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Grow Together with{' '}
            <span className="text-primary">Phazur Labs</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Join our global network of partners and unlock new opportunities. Whether you&apos;re an
            enterprise, affiliate, instructor, or reseller, we have a program designed for your success.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#partner-types"
              className="inline-flex items-center h-12 px-8 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
            >
              Explore Partnerships
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center h-12 px-8 border rounded-md font-medium hover:bg-muted"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-surface-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section id="partner-types" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Partnership Programs
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the partnership model that fits your goals and start growing with us
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {partnerTypes.map((type) => (
              <div
                key={type.id}
                className="bg-background border rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className={cn(
                  'inline-flex p-4 rounded-xl mb-6',
                  type.color === 'primary' && 'bg-primary-light text-primary',
                  type.color === 'violet' && 'bg-violet-100 dark:bg-violet-900/30 text-violet-600',
                  type.color === 'emerald' && 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600',
                  type.color === 'amber' && 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                )}>
                  <type.icon className="h-8 w-8" />
                </div>

                <h3 className="text-2xl font-bold mb-3">{type.title}</h3>
                <p className="text-muted-foreground mb-6">{type.description}</p>

                <ul className="space-y-3 mb-8">
                  {type.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <button className={cn(
                  'w-full h-12 rounded-xl font-medium',
                  type.color === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90',
                  type.color === 'violet' && 'bg-violet-600 text-white hover:bg-violet-700',
                  type.color === 'emerald' && 'bg-emerald-600 text-white hover:bg-emerald-700',
                  type.color === 'amber' && 'bg-amber-600 text-white hover:bg-amber-700'
                )}>
                  {type.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Partners */}
      <section className="py-20 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Partners</h2>
            <p className="text-muted-foreground">Trusted by leading organizations across industries</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featuredPartners.map((partner, index) => (
              <div
                key={index}
                className="flex items-center justify-center h-20 bg-background border rounded-xl px-4"
              >
                <span className="text-sm font-medium text-center">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Why Partner with Phazur Labs?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide the tools, support, and platform you need to succeed
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {whyPartner.map((item, index) => (
              <div
                key={index}
                className="bg-background border rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
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
              Partner Success Stories
            </h2>
            <p className="text-xl text-muted-foreground">Hear from our partners around the world</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-background border rounded-2xl p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">&quot;{testimonial.quote}&quot;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                    <span className="font-bold text-primary">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-sm text-primary">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground">Everything you need to know about partnering with us</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-background border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="font-semibold pr-4">{faq.question}</span>
                    <ChevronDown
                      className={cn(
                        'h-5 w-5 text-muted-foreground transition-transform flex-shrink-0',
                        openFaq === index && 'rotate-180'
                      )}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Ready to Partner?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Fill out the form and our partnership team will get back to you within 24 hours.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Email Us</h4>
                    <p className="text-muted-foreground">partners@phazurlabs.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Call Us</h4>
                    <p className="text-muted-foreground">+1 (888) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Visit Us</h4>
                    <p className="text-muted-foreground">100 Innovation Drive, San Francisco, CA 94105</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background border rounded-2xl p-8">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Application Submitted!</h3>
                  <p className="text-muted-foreground mb-6">
                    Our partnership team will reach out within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false)
                      setFormData({ name: '', email: '', company: '', partnerType: '', message: '' })
                    }}
                    className="text-primary font-medium hover:underline"
                  >
                    Submit another application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full h-11 px-4 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Company Inc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Partnership Type *
                    </label>
                    <select
                      required
                      value={formData.partnerType}
                      onChange={(e) => setFormData({ ...formData, partnerType: e.target.value })}
                      className="w-full h-11 px-4 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select partnership type</option>
                      <option value="enterprise">Enterprise Partner</option>
                      <option value="affiliate">Affiliate Partner</option>
                      <option value="instructor">Instructor Partner</option>
                      <option value="reseller">Reseller Partner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Tell us about your partnership goals..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Submit Application
                      </>
                    )}
                  </button>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting, you agree to our{' '}
                    <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary to-violet-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Start Your Partnership Journey Today
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join 500+ partners already growing with Phazur Labs Academy
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="#partner-types"
                className="h-12 px-8 bg-white text-primary font-medium rounded-xl hover:bg-white/90 flex items-center"
              >
                Get Started
              </Link>
              <Link
                href="/enterprise"
                className="h-12 px-8 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 flex items-center"
              >
                Learn About Enterprise
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
