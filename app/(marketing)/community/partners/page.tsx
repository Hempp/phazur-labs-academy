import Link from 'next/link'
import {
  Building2,
  Users,
  Briefcase,
  BarChart3,
  Shield,
  Headphones,
  ArrowRight,
  Check,
  Globe,
  Award,
  Zap
} from 'lucide-react'

const benefits = [
  {
    icon: Users,
    title: 'Volume Licensing',
    description: 'Flexible licensing options for teams of any size with significant volume discounts.'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track employee progress, completion rates, and skill development in real-time.'
  },
  {
    icon: Briefcase,
    title: 'Custom Learning Paths',
    description: 'Create tailored curriculum aligned with your organization\'s specific needs.'
  },
  {
    icon: Shield,
    title: 'SSO Integration',
    description: 'Seamless single sign-on with your existing identity provider (Okta, Azure AD, etc.).'
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: 'Priority support with a dedicated customer success manager for your account.'
  },
  {
    icon: Globe,
    title: 'Global Deployment',
    description: 'Multi-language support and localized content for global teams.'
  }
]

const partnerTypes = [
  {
    title: 'Enterprise Partners',
    description: 'Large organizations training 500+ employees',
    features: [
      'Custom content development',
      'Dedicated success manager',
      'API access for LMS integration',
      'Co-branded certificates',
      'Quarterly business reviews'
    ],
    icon: Building2
  },
  {
    title: 'SMB Partners',
    description: 'Growing companies training 50-500 employees',
    features: [
      'Team management dashboard',
      'Volume pricing discounts',
      'Priority email support',
      'Custom learning paths',
      'Progress reporting'
    ],
    icon: Briefcase
  },
  {
    title: 'Reseller Partners',
    description: 'Training providers and consultancies',
    features: [
      'White-label options',
      'Revenue sharing model',
      'Sales enablement resources',
      'Partner portal access',
      'Co-marketing opportunities'
    ],
    icon: Award
  }
]

const logos = [
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix',
  'Salesforce', 'Adobe', 'Spotify', 'Airbnb', 'Uber', 'Stripe'
]

const stats = [
  { value: '200+', label: 'Enterprise Partners' },
  { value: '500K+', label: 'Employees Trained' },
  { value: '95%', label: 'Satisfaction Rate' },
  { value: '40%', label: 'Avg. Skill Improvement' }
]

const testimonials = [
  {
    quote: 'Phazur Labs transformed how we onboard engineers. New hires are productive 50% faster.',
    name: 'Jennifer Walsh',
    role: 'VP of Engineering',
    company: 'TechCorp Inc.'
  },
  {
    quote: 'The custom learning paths aligned perfectly with our tech stack. Outstanding ROI.',
    name: 'Marcus Johnson',
    role: 'L&D Director',
    company: 'GlobalFinance'
  },
  {
    quote: 'Their analytics dashboard gives us unprecedented visibility into skill development.',
    name: 'Priya Sharma',
    role: 'CTO',
    company: 'StartupXYZ'
  }
]

export default function PartnersPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-violet-50 to-background dark:from-violet-950/20">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mx-auto mb-6">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Enterprise Partners
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Train your workforce with industry-leading tech courses. Custom solutions for organizations of all sizes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact?subject=enterprise"
              className="inline-flex items-center h-14 px-8 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
            >
              Contact Sales
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="#partner-types"
              className="inline-flex items-center h-14 px-8 border rounded-md font-medium hover:bg-muted"
            >
              View Partner Programs
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

      {/* Trusted By */}
      <section className="py-16 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground mb-8">Trusted by leading companies worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {logos.map((logo, index) => (
              <div key={index} className="text-xl font-bold text-muted-foreground/50">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Enterprise Benefits</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Everything you need to upskill your entire organization efficiently.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4 p-6 border rounded-xl bg-background">
                <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
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

      {/* Partner Types */}
      <section id="partner-types" className="py-20 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Partner Programs</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Choose the partnership level that fits your organization&apos;s needs.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {partnerTypes.map((type, index) => (
              <div key={index} className="bg-background border rounded-2xl p-8">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-6">
                  <type.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                <p className="text-muted-foreground mb-6">{type.description}</p>
                <ul className="space-y-3">
                  {type.features.map((feature, i) => (
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
          <h2 className="text-3xl font-bold mb-12 text-center">What Partners Say</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-surface-secondary border rounded-xl p-6">
                <p className="text-muted-foreground mb-6">&quot;{testimonial.quote}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                    <span className="font-bold text-violet-600">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-violet-500 to-purple-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <Zap className="h-12 w-12 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Team?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Let&apos;s discuss how Phazur Labs can help upskill your workforce.
          </p>
          <Link
            href="/contact?subject=enterprise"
            className="inline-flex items-center h-14 px-8 bg-white text-violet-600 rounded-md font-medium hover:bg-gray-100"
          >
            Schedule a Demo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  )
}
