import Link from 'next/link'
import {
  FlaskConical,
  Star,
  Gift,
  MessageCircle,
  Eye,
  Zap,
  ArrowRight,
  CheckCircle,
  Clock,
  Shield,
  Sparkles
} from 'lucide-react'

const benefits = [
  {
    icon: Eye,
    title: 'Early Access',
    description: 'Be the first to try new courses, features, and platform updates before anyone else.'
  },
  {
    icon: MessageCircle,
    title: 'Direct Impact',
    description: 'Your feedback directly influences product decisions. We listen and iterate based on your input.'
  },
  {
    icon: Gift,
    title: 'Exclusive Perks',
    description: 'Free courses, extended trials, and special discounts as thanks for your contributions.'
  },
  {
    icon: Star,
    title: 'Beta Badge',
    description: 'Earn a special beta tester badge on your profile recognizing your contributions.'
  },
  {
    icon: Zap,
    title: 'Priority Support',
    description: 'Skip the queue with priority access to our support team for any issues.'
  },
  {
    icon: Shield,
    title: 'Insider Community',
    description: 'Join our private Slack channel with product team access and fellow testers.'
  }
]

const currentBetas = [
  {
    title: 'AI Learning Assistant',
    description: 'An AI-powered tutor that answers questions, explains concepts, and provides personalized guidance.',
    status: 'Open',
    spots: '50 spots left'
  },
  {
    title: 'Collaborative Projects',
    description: 'Team-based project features for group learning and portfolio building.',
    status: 'Open',
    spots: '30 spots left'
  },
  {
    title: 'Mobile App 2.0',
    description: 'Completely redesigned mobile experience with offline learning and progress sync.',
    status: 'Waitlist',
    spots: 'Joining waitlist'
  },
  {
    title: 'Live Code Reviews',
    description: 'Real-time code review sessions with industry experts for premium courses.',
    status: 'Coming Soon',
    spots: 'Sign up for alerts'
  }
]

const requirements = [
  'Active Phazur Labs account (free or paid)',
  'Commitment to provide regular feedback',
  'Willingness to try new features',
  'Basic technical proficiency',
  'Constructive and detailed communication'
]

const stats = [
  { value: '500+', label: 'Beta Testers' },
  { value: '200+', label: 'Features Tested' },
  { value: '95%', label: 'Feedback Implemented' },
  { value: '4.9', label: 'Avg Satisfaction' }
]

export default function BetaTestersPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-background dark:from-orange-950/20">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-6">
            <FlaskConical className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Beta Testers Program
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Get early access to new features and help shape the future of learning at Phazur Labs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#apply"
              className="inline-flex items-center h-14 px-8 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
            >
              Apply to Join
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="#current-betas"
              className="inline-flex items-center h-14 px-8 border rounded-md font-medium hover:bg-muted"
            >
              View Current Betas
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

      {/* Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Beta Tester Benefits</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Being a beta tester comes with exclusive perks and the satisfaction of shaping the product.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4 p-6 border rounded-xl bg-background">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
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

      {/* Current Betas */}
      <section id="current-betas" className="py-20 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Current Beta Programs</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Here&apos;s what we&apos;re currently testing. Apply to join any open beta.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {currentBetas.map((beta, index) => (
              <div key={index} className="bg-background border rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-orange-500" />
                    <h3 className="font-semibold text-lg">{beta.title}</h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      beta.status === 'Open'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : beta.status === 'Waitlist'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {beta.status}
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">{beta.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {beta.spots}
                  </span>
                  <Link
                    href="#apply"
                    className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    Apply
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Requirements</h2>
            <p className="text-muted-foreground mb-8">
              To be a great beta tester, here&apos;s what we&apos;re looking for:
            </p>
            <ul className="space-y-3 text-left max-w-md mx-auto">
              {requirements.map((req, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="max-w-3xl mx-auto grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Apply', description: 'Submit your application with your experience and interests.' },
              { step: 2, title: 'Get Accepted', description: 'We review applications and select testers for each beta.' },
              { step: 3, title: 'Test Features', description: 'Access beta features and provide feedback through our platform.' },
              { step: 4, title: 'Earn Rewards', description: 'Get perks, badges, and recognition for your contributions.' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="apply" className="py-20 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <FlaskConical className="h-12 w-12 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Become a Beta Tester</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Help us build the future of tech education. Apply now to join our exclusive beta program.
          </p>
          <Link
            href="/contact?subject=beta"
            className="inline-flex items-center h-14 px-8 bg-white text-orange-600 rounded-md font-medium hover:bg-gray-100"
          >
            Apply Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <p className="mt-4 text-white/60 text-sm">
            Applications typically reviewed within 48 hours
          </p>
        </div>
      </section>
    </>
  )
}
