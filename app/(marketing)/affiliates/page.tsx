'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  DollarSign,
  BarChart3,
  Users,
  Zap,
  ArrowRight,
  Check,
  TrendingUp,
  Gift,
  Shield,
  Clock
} from 'lucide-react'

const benefits = [
  {
    icon: DollarSign,
    title: '30% Commission',
    description: 'Earn 30% on every course sale you refer. Top affiliates earn $10,000+ monthly.'
  },
  {
    icon: Clock,
    title: '90-Day Cookie',
    description: 'Your referral cookie lasts 90 days, so you get credit even if they purchase later.'
  },
  {
    icon: TrendingUp,
    title: 'Recurring Revenue',
    description: 'Earn commissions on subscription renewals and future purchases from your referrals.'
  },
  {
    icon: Gift,
    title: 'Exclusive Bonuses',
    description: 'Access exclusive promotions, higher commissions, and special offers for your audience.'
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Track clicks, conversions, and earnings in your personalized affiliate dashboard.'
  },
  {
    icon: Shield,
    title: 'Trusted Brand',
    description: 'Promote courses from a platform with 95% satisfaction and industry recognition.'
  }
]

const tiers = [
  {
    name: 'Starter',
    commission: '25%',
    requirements: '0-10 sales/month',
    features: ['Standard commission rate', 'Basic marketing materials', 'Email support', '30-day cookie']
  },
  {
    name: 'Partner',
    commission: '30%',
    requirements: '11-50 sales/month',
    features: ['Higher commission rate', 'Custom landing pages', 'Priority support', '60-day cookie', 'Monthly bonus opportunities'],
    popular: true
  },
  {
    name: 'Elite',
    commission: '40%',
    requirements: '50+ sales/month',
    features: ['Maximum commission', 'Co-branded content', 'Dedicated manager', '90-day cookie', 'Exclusive promotions', 'Early access to courses']
  }
]

const testimonials = [
  {
    name: 'Alex Thompson',
    role: 'Tech Blogger',
    quote: 'Phazur Labs has been my top-performing affiliate program. The high-quality courses practically sell themselves.',
    earnings: '$8,500/month avg'
  },
  {
    name: 'Maria Garcia',
    role: 'YouTube Creator',
    quote: 'The 90-day cookie duration is amazing. I often get sales weeks after someone clicks my link.',
    earnings: '$12,000/month avg'
  },
  {
    name: 'David Kim',
    role: 'LinkedIn Influencer',
    quote: 'My audience trusts Phazur Labs courses. The conversion rate is the best I\'ve seen in edtech.',
    earnings: '$6,200/month avg'
  }
]

const faqs = [
  {
    question: 'How do I get paid?',
    answer: 'We pay via PayPal, bank transfer, or Wise on the 15th of each month for the previous month\'s earnings. Minimum payout is $50.'
  },
  {
    question: 'Can I promote in any country?',
    answer: 'Yes! We accept affiliates and customers worldwide. Our courses are available in 50+ countries.'
  },
  {
    question: 'What marketing materials do you provide?',
    answer: 'We provide banners, email templates, social media graphics, course descriptions, and custom landing page options.'
  },
  {
    question: 'Is there a minimum follower requirement?',
    answer: 'No minimum requirement! We welcome affiliates of all sizes. Quality of audience matters more than size.'
  }
]

export default function AffiliatesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium mb-6">
            <DollarSign className="h-4 w-4" />
            Earn Up to 40% Commission
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Affiliate Program
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join 2,000+ affiliates earning passive income by promoting the best tech courses online. Start earning today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#apply"
              className="inline-flex items-center h-14 px-8 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
            >
              Become an Affiliate
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="#tiers"
              className="inline-flex items-center h-14 px-8 border rounded-md font-medium hover:bg-muted"
            >
              View Commission Tiers
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-1">$2M+</div>
              <div className="text-muted-foreground text-sm">Paid to Affiliates</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">2,000+</div>
              <div className="text-muted-foreground text-sm">Active Affiliates</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">$127</div>
              <div className="text-muted-foreground text-sm">Avg. Order Value</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">8.5%</div>
              <div className="text-muted-foreground text-sm">Conversion Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Why Join Our Program</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            We offer one of the most competitive affiliate programs in the edtech industry.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4 p-6 border rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Tiers */}
      <section id="tiers" className="py-20 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Commission Tiers</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            The more you sell, the more you earn. Level up your commission rate.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className={`bg-background border rounded-2xl p-8 relative ${
                  tier.popular ? 'border-primary ring-2 ring-primary' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="font-semibold text-lg mb-2">{tier.name}</h3>
                  <div className="text-4xl font-bold text-primary mb-1">{tier.commission}</div>
                  <div className="text-sm text-muted-foreground">{tier.requirements}</div>
                </div>
                <ul className="space-y-3">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Affiliate Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-surface-secondary border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center">
                    <span className="font-bold text-primary">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">&quot;{testimonial.quote}&quot;</p>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
                  <TrendingUp className="h-4 w-4" />
                  {testimonial.earnings}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-background border rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ArrowRight
                    className={`h-5 w-5 text-primary transition-transform ${
                      openFaq === index ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply CTA */}
      <section id="apply" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Users className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join our affiliate program today and start earning commissions on every sale you refer.
          </p>
          <Link
            href="/contact?subject=affiliate"
            className="inline-flex items-center h-14 px-8 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
          >
            Apply Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Applications typically approved within 24-48 hours
          </p>
        </div>
      </section>
    </>
  )
}
