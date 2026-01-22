import Link from 'next/link'
import {
  Users,
  GraduationCap,
  Building2,
  Code,
  FlaskConical,
  ArrowRight,
  MessageCircle,
  Calendar,
  Trophy,
  Lightbulb,
  Heart
} from 'lucide-react'

const communities = [
  {
    id: 'learners',
    icon: GraduationCap,
    title: 'Learners',
    description: 'Join 50,000+ students mastering technology skills together.',
    members: '50,000+',
    features: [
      'Connect with fellow students',
      'Study groups and peer learning',
      'Share projects and get feedback',
      'Career networking opportunities'
    ],
    cta: 'Join Learner Community',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'partners',
    icon: Building2,
    title: 'Partners',
    description: 'Collaborate with enterprises transforming their workforce.',
    members: '200+',
    features: [
      'Enterprise training solutions',
      'Custom curriculum development',
      'Bulk licensing discounts',
      'Dedicated success managers'
    ],
    cta: 'Become a Partner',
    color: 'from-violet-500 to-purple-500'
  },
  {
    id: 'developers',
    icon: Code,
    title: 'Developers',
    description: 'Build integrations and extend our platform capabilities.',
    members: '1,000+',
    features: [
      'Access to public APIs',
      'SDK and documentation',
      'Developer Discord server',
      'Integration marketplace'
    ],
    cta: 'Join Developer Program',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'beta-testers',
    icon: FlaskConical,
    title: 'Beta Testers',
    description: 'Get early access and help shape the future of learning.',
    members: '500+',
    features: [
      'Preview new features first',
      'Influence product direction',
      'Exclusive beta tester perks',
      'Direct feedback to product team'
    ],
    cta: 'Apply for Beta Program',
    color: 'from-orange-500 to-red-500'
  }
]

const events = [
  {
    title: 'Monthly Tech Talks',
    description: 'Live sessions with industry experts sharing insights and best practices.',
    icon: MessageCircle
  },
  {
    title: 'Hackathons',
    description: 'Quarterly coding competitions with prizes and job opportunities.',
    icon: Trophy
  },
  {
    title: 'Study Groups',
    description: 'Weekly virtual study sessions for each course track.',
    icon: Calendar
  },
  {
    title: 'Mentorship Matching',
    description: 'Connect with experienced professionals for career guidance.',
    icon: Lightbulb
  }
]

const stats = [
  { value: '50K+', label: 'Community Members' },
  { value: '120', label: 'Countries Represented' },
  { value: '500+', label: 'Events Hosted' },
  { value: '95%', label: 'Member Satisfaction' }
]

export default function CommunityPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light text-primary text-sm font-medium mb-6">
            <Users className="h-4 w-4" />
            Join Our Community
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Learn Together,<br />Grow Together
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Connect with learners, partners, developers, and innovators who share your passion for technology.
          </p>
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

      {/* Community Types */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Find Your Community</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Whether you&apos;re a student, enterprise partner, developer, or early adopter, there&apos;s a place for you.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {communities.map((community) => (
              <div key={community.id} className="bg-background border rounded-2xl overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${community.color}`} />
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${community.color} flex items-center justify-center`}>
                        <community.icon className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{community.title}</h3>
                        <div className="text-sm text-muted-foreground">{community.members} members</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6">{community.description}</p>
                  <ul className="space-y-3 mb-8">
                    {community.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm">
                        <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${community.color}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/community/${community.id}`}
                    className="inline-flex items-center h-11 px-6 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 text-sm"
                  >
                    {community.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-20 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Community Events</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Connect and learn through our regular community events and programs.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {events.map((event, index) => (
              <div key={index} className="bg-background border rounded-xl p-6 text-center">
                <div className="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center mx-auto mb-4">
                  <event.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{event.title}</h3>
                <p className="text-muted-foreground text-sm">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Our Community Values</h2>
            <p className="text-muted-foreground mb-8">
              We&apos;re committed to creating a welcoming, inclusive environment where everyone can learn and grow.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="p-6 bg-surface-secondary rounded-xl">
                <h3 className="font-semibold mb-2">Be Respectful</h3>
                <p className="text-sm text-muted-foreground">
                  Treat everyone with respect. No harassment, discrimination, or bullying.
                </p>
              </div>
              <div className="p-6 bg-surface-secondary rounded-xl">
                <h3 className="font-semibold mb-2">Share Knowledge</h3>
                <p className="text-sm text-muted-foreground">
                  Help others learn. Share your experiences and insights generously.
                </p>
              </div>
              <div className="p-6 bg-surface-secondary rounded-xl">
                <h3 className="font-semibold mb-2">Stay Curious</h3>
                <p className="text-sm text-muted-foreground">
                  Ask questions, explore new ideas, and embrace continuous learning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Start connecting with thousands of learners and professionals today.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center h-12 px-8 bg-white text-primary rounded-md font-medium hover:bg-gray-100"
          >
            Create Free Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  )
}
