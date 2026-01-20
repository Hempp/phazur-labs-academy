import Link from 'next/link'
import {
  GraduationCap,
  Users,
  BarChart3,
  Shield,
  Award,
  ArrowRight,
  CheckCircle2,
  Building2,
  Zap,
  BookOpen,
  Target,
  TrendingUp,
  Clock,
  Headphones
} from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Team Management',
    description: 'Easily add team members, assign courses, and manage learning groups from a central dashboard.'
  },
  {
    icon: BarChart3,
    title: 'Progress Analytics',
    description: 'Track team progress with detailed analytics on completion rates, skill gaps, and learning time.'
  },
  {
    icon: BookOpen,
    title: 'Curated Paths',
    description: 'Choose from pre-built learning paths or create custom curricula for your team.'
  },
  {
    icon: Award,
    title: 'Team Certificates',
    description: 'Track and verify team certifications with a dedicated employer verification portal.'
  },
  {
    icon: Target,
    title: 'Skill Assessments',
    description: 'Benchmark team skills and identify training needs with our assessment tools.'
  },
  {
    icon: Shield,
    title: 'Admin Controls',
    description: 'Role-based access, SSO integration, and content restrictions for enterprise security.'
  }
]

const plans = [
  {
    name: 'Team',
    description: 'For small teams getting started',
    price: 29,
    period: 'per user/month',
    minSeats: 5,
    features: [
      'Access to all courses',
      'Team dashboard',
      'Progress tracking',
      'Email support',
      'Monthly reports'
    ]
  },
  {
    name: 'Business',
    description: 'For growing organizations',
    price: 49,
    period: 'per user/month',
    minSeats: 20,
    popular: true,
    features: [
      'Everything in Team',
      'Custom learning paths',
      'Advanced analytics',
      'Priority support',
      'API access',
      'SSO integration'
    ]
  },
  {
    name: 'Enterprise',
    description: 'For large organizations',
    price: null,
    period: 'Custom pricing',
    minSeats: 100,
    features: [
      'Everything in Business',
      'Dedicated success manager',
      'Custom content development',
      'On-premise deployment',
      'SLA guarantee',
      'Executive reporting'
    ]
  }
]

export default function TeamsPage() {
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
            <Link href="/enterprise" className="text-sm font-medium hover:text-primary transition-colors">Enterprise</Link>
            <Link href="/teams" className="text-sm font-medium text-primary">For Teams</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium hover:text-primary">Sign In</Link>
            <Link href="/auth/register" className="h-10 px-4 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 flex items-center">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Users className="h-4 w-4" />
            Team Learning
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Upskill Your Team
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Give your team access to world-class training with powerful tools to track progress and measure ROI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/auth/register?plan=team"
              className="inline-flex items-center h-12 px-8 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center h-12 px-8 border rounded-full font-medium hover:bg-muted"
            >
              Talk to Sales
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Everything Your Team Needs</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Powerful features to manage team learning at scale.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 border rounded-xl hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Choose the plan that works for your team size and needs.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-card border rounded-2xl p-8 relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>
                <div className="mb-6">
                  {plan.price ? (
                    <>
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground text-sm"> /{plan.period}</span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold">{plan.period}</span>
                  )}
                  <div className="text-sm text-muted-foreground mt-1">
                    Min. {plan.minSeats} seats
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.price ? `/auth/register?plan=${plan.name.toLowerCase()}` : '/contact'}
                  className={`block w-full h-11 rounded-lg font-medium text-center leading-[44px] ${
                    plan.popular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border hover:bg-muted'
                  }`}
                >
                  {plan.price ? 'Start Free Trial' : 'Contact Sales'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Headphones className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Our team is here to help you find the perfect plan for your organization.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center h-12 px-8 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90"
          >
            Schedule a Demo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
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
