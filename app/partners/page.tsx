'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Partner Logo Component with fallback
function PartnerLogo({ partner }: { partner: { name: string; logo: string } }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex items-center justify-center h-24 bg-white/95 border border-gray-200 rounded-xl hover:shadow-lg hover:scale-105 transition-all p-4">
      {!imageError && partner.logo ? (
        <img
          src={partner.logo}
          alt={partner.name}
          className="object-contain max-h-14 max-w-full"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="text-sm font-semibold text-gray-600 text-center leading-tight">
          {partner.name}
        </span>
      )}
    </div>
  );
}
import {
  Building2,
  Users,
  GraduationCap,
  TrendingUp,
  Globe,
  Award,
  Briefcase,
  Handshake,
  CheckCircle2,
  ArrowRight,
  Star,
  Zap,
  Shield,
  BarChart3,
  BookOpen,
  DollarSign,
  Headphones,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Send,
} from 'lucide-react';

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
      'Priority support',
    ],
    cta: 'Contact Sales',
    color: 'indigo',
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
      'Dedicated affiliate support',
    ],
    cta: 'Join Affiliate Program',
    color: 'purple',
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
      'Instructor community',
    ],
    cta: 'Become an Instructor',
    color: 'emerald',
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
      'Revenue sharing model',
    ],
    cta: 'Become a Reseller',
    color: 'amber',
  },
];

const stats = [
  { value: '500+', label: 'Partner Companies' },
  { value: '10M+', label: 'Learners Worldwide' },
  { value: '5,000+', label: 'Courses Available' },
  { value: '98%', label: 'Partner Satisfaction' },
];

const featuredPartners = [
  { name: 'Eromo Ventures', logo: '/images/partners/eromo-ventures.svg' },
  { name: 'Bridgemore', logo: '/images/partners/bridgemore.svg' },
  { name: 'Concierge Healthcare Partners', logo: '/images/partners/concierge-healthcare.svg' },
  { name: 'The Orthopedic & Spine Institute', logo: '/images/partners/orthopedic-spine.svg' },
  { name: 'Geekdom', logo: '/images/partners/geekdom.svg' },
  { name: 'ASEN', logo: '/images/partners/asen.svg' },
  { name: 'Music Maven', logo: '/images/partners/music-maven.svg' },
  { name: 'SBDC', logo: '/images/partners/sbdc.svg' },
  { name: 'UCLA Bruins', logo: '/images/partners/ucla-bruins.svg' },
  { name: 'LULAC', logo: '/images/partners/lulac.svg' },
  { name: 'Prince Hall', logo: '/images/partners/prince-hall.svg' },
  { name: '3E', logo: '/images/partners/3e.svg' },
];

const testimonials = [
  {
    quote: "Partnering with Phazur Labs Academy transformed our L&D program. Our employees now have access to cutting-edge tech courses that directly impact our bottom line.",
    author: 'Sarah Chen',
    role: 'VP of Learning & Development',
    company: 'TechCorp Global',
    avatar: null,
  },
  {
    quote: "As an affiliate, I've earned over $50,000 in commissions. The tracking is transparent, payouts are reliable, and the courses practically sell themselves.",
    author: 'Marcus Johnson',
    role: 'Tech Blogger & Affiliate',
    company: 'CodeMasters Blog',
    avatar: null,
  },
  {
    quote: "The instructor program gave me a platform to share my 20 years of experience. I've now taught over 100,000 students and built a thriving community.",
    author: 'Dr. Emily Rodriguez',
    role: 'Senior Instructor',
    company: 'Data Science Expert',
    avatar: null,
  },
];

const faqs = [
  {
    question: 'How long does the partnership application process take?',
    answer: 'Most applications are reviewed within 3-5 business days. Enterprise partnerships may require additional discovery calls and can take 2-3 weeks to finalize.',
  },
  {
    question: 'What are the requirements to become an instructor?',
    answer: 'We look for industry expertise, teaching experience, and a commitment to quality. You\'ll need to submit a course outline and sample video for review.',
  },
  {
    question: 'How does the affiliate commission structure work?',
    answer: 'Affiliates earn 20-30% commission on referred sales. Commission rates increase based on performance tiers. Payouts are processed monthly via PayPal or bank transfer.',
  },
  {
    question: 'Can we white-label the platform for our organization?',
    answer: 'Yes! Enterprise partners can access our white-label solution with custom branding, domain, and tailored content libraries.',
  },
  {
    question: 'Is there a minimum commitment for enterprise partnerships?',
    answer: 'Enterprise plans start at 50 seats with annual commitments. We offer flexible pricing based on your organization\'s size and needs.',
  },
];

export default function PartnersPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    partnerType: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Phazur Labs</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/courses" className="text-gray-300 hover:text-white transition-colors">
                Courses
              </Link>
              <Link href="/enterprise" className="text-gray-300 hover:text-white transition-colors">
                Enterprise
              </Link>
              <Link href="/partners" className="text-indigo-400 font-medium">
                Partners
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                About
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8">
            <Handshake className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-indigo-400">Partnership Program</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Grow Together with{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Phazur Labs
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
            Join our global network of partners and unlock new opportunities. Whether you're an
            enterprise, affiliate, instructor, or reseller, we have a program designed for your success.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#partner-types"
              className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              Explore Partnerships
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#contact"
              className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-400 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section id="partner-types" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Partnership Programs
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose the partnership model that fits your goals and start growing with us
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {partnerTypes.map((type) => {
              const colorClasses = {
                indigo: 'from-indigo-500 to-indigo-600 hover:shadow-indigo-500/25',
                purple: 'from-purple-500 to-purple-600 hover:shadow-purple-500/25',
                emerald: 'from-emerald-500 to-emerald-600 hover:shadow-emerald-500/25',
                amber: 'from-amber-500 to-amber-600 hover:shadow-amber-500/25',
              };

              return (
                <div
                  key={type.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-gray-600 transition-all group"
                >
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${colorClasses[type.color as keyof typeof colorClasses]} mb-6`}>
                    <type.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3">{type.title}</h3>
                  <p className="text-gray-400 mb-6">{type.description}</p>

                  <ul className="space-y-3 mb-8">
                    {type.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${colorClasses[type.color as keyof typeof colorClasses]} hover:shadow-lg transition-all`}>
                    {type.cta}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Partners */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Partners</h2>
            <p className="text-gray-400">Trusted by leading organizations across industries</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {featuredPartners.map((partner, index) => (
              <PartnerLogo key={index} partner={partner} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Partner with Phazur Labs?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We provide the tools, support, and platform you need to succeed
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: 'Revenue Growth',
                description: 'Access new markets and revenue streams with our proven business model and global reach.',
              },
              {
                icon: Shield,
                title: 'Trusted Platform',
                description: 'Build on a secure, scalable platform trusted by millions of learners worldwide.',
              },
              {
                icon: Headphones,
                title: 'Dedicated Support',
                description: 'Get personalized assistance from our partner success team at every step.',
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                description: 'Track performance with real-time dashboards and detailed reporting.',
              },
              {
                icon: Zap,
                title: 'Fast Integration',
                description: 'Easy API integration and white-label solutions to get you started quickly.',
              },
              {
                icon: Award,
                title: 'Premium Content',
                description: 'Access to 5,000+ courses from industry experts and thought leaders.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all"
              >
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Partner Success Stories
            </h2>
            <p className="text-xl text-gray-400">Hear from our partners around the world</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.author}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                    <p className="text-sm text-indigo-400">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-400">Everything you need to know about partnering with us</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-semibold text-white pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Partner?
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Fill out the form and our partnership team will get back to you within 24 hours.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Email Us</h4>
                    <p className="text-gray-400">partners@phazurlabs.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Call Us</h4>
                    <p className="text-gray-400">+1 (888) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Visit Us</h4>
                    <p className="text-gray-400">100 Innovation Drive, San Francisco, CA 94105</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Company Inc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Partnership Type *
                  </label>
                  <select
                    required
                    value={formData.partnerType}
                    onChange={(e) => setFormData({ ...formData, partnerType: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select partnership type</option>
                    <option value="enterprise">Enterprise Partner</option>
                    <option value="affiliate">Affiliate Partner</option>
                    <option value="instructor">Instructor Partner</option>
                    <option value="reseller">Reseller Partner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    placeholder="Tell us about your partnership goals..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Submit Application
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By submitting, you agree to our{' '}
                  <Link href="/terms" className="text-indigo-400 hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-indigo-400 hover:underline">Privacy Policy</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Start Your Partnership Journey Today
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join 500+ partners already growing with Phazur Labs Academy
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#partner-types"
                className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Get Started
              </a>
              <Link
                href="/enterprise"
                className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
              >
                Learn About Enterprise
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Phazur Labs Academy</span>
            </div>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Phazur Labs. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
