import Link from 'next/link'
import {
  GraduationCap,
  Users,
  MessageCircle,
  BookOpen,
  Trophy,
  Calendar,
  ArrowRight,
  Star,
  Zap,
  Target
} from 'lucide-react'

const benefits = [
  {
    icon: Users,
    title: 'Study Groups',
    description: 'Join virtual study groups for your courses and learn together with peers from around the world.'
  },
  {
    icon: MessageCircle,
    title: 'Discussion Forums',
    description: 'Ask questions, share insights, and engage in meaningful conversations with fellow learners.'
  },
  {
    icon: Trophy,
    title: 'Leaderboards',
    description: 'Track your progress and compete with others on course leaderboards and challenges.'
  },
  {
    icon: Calendar,
    title: 'Live Events',
    description: 'Attend weekly webinars, Q&A sessions, and networking events exclusively for learners.'
  },
  {
    icon: BookOpen,
    title: 'Resource Library',
    description: 'Access community-contributed resources, notes, and project examples.'
  },
  {
    icon: Target,
    title: 'Career Support',
    description: 'Get resume reviews, interview prep, and job referrals from our community network.'
  }
]

const testimonials = [
  {
    name: 'Michael Chen',
    role: 'Software Developer',
    company: 'Google',
    quote: 'The learner community was instrumental in my career transition. The support and networking opportunities were invaluable.',
    image: '/testimonials/michael.jpg'
  },
  {
    name: 'Sarah Johnson',
    role: 'Data Scientist',
    company: 'Meta',
    quote: 'Study groups helped me stay motivated and accountable. I made friends who are now colleagues!',
    image: '/testimonials/sarah.jpg'
  },
  {
    name: 'Carlos Rodriguez',
    role: 'Cloud Architect',
    company: 'AWS',
    quote: 'The discussion forums are amazing. Every question I had was answered within hours by helpful community members.',
    image: '/testimonials/carlos.jpg'
  }
]

const stats = [
  { value: '50,000+', label: 'Active Learners' },
  { value: '120', label: 'Countries' },
  { value: '500+', label: 'Study Groups' },
  { value: '10K+', label: 'Success Stories' }
]

export default function LearnersPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-background dark:from-blue-950/20">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Learner Community
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join 50,000+ students mastering technology skills together. Get support, make connections, and accelerate your learning.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="inline-flex items-center h-14 px-8 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
            >
              Join the Community
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center h-14 px-8 border rounded-md font-medium hover:bg-muted"
            >
              Explore Courses
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
          <h2 className="text-3xl font-bold mb-4 text-center">Community Benefits</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Everything you need to succeed in your learning journey, powered by community.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4 p-6 border rounded-xl bg-background">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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

      {/* Testimonials */}
      <section className="py-20 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-background border rounded-xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">&quot;{testimonial.quote}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                    <span className="font-bold text-blue-600">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {[
                { step: 1, title: 'Create Your Account', description: 'Sign up for free and complete your learner profile.' },
                { step: 2, title: 'Join Study Groups', description: 'Find groups based on your courses, interests, or timezone.' },
                { step: 3, title: 'Engage & Learn', description: 'Participate in discussions, attend events, and collaborate with peers.' },
                { step: 4, title: 'Achieve Your Goals', description: 'Complete courses, earn certificates, and advance your career.' }
              ].map((item, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                    {index < 3 && <div className="w-0.5 h-full bg-border mt-2" />}
                  </div>
                  <div className="pb-8">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <Zap className="h-12 w-12 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Start Learning Today</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Join thousands of learners who are transforming their careers through our community.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center h-14 px-8 bg-white text-blue-600 rounded-md font-medium hover:bg-gray-100"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  )
}
