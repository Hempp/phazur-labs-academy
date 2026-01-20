import Link from 'next/link'
import {
  GraduationCap,
  Target,
  Heart,
  Globe,
  Users,
  Award,
  ArrowRight,
  Linkedin,
  Twitter,
  Rocket,
  Lightbulb,
  Shield
} from 'lucide-react'

const values = [
  {
    icon: Target,
    title: 'Excellence',
    description: 'We strive for excellence in everything we do, from course content to student support.'
  },
  {
    icon: Heart,
    title: 'Accessibility',
    description: 'Quality education should be accessible to everyone, regardless of background.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We continuously innovate our platform and curriculum to stay ahead of industry trends.'
  },
  {
    icon: Shield,
    title: 'Integrity',
    description: 'We maintain the highest standards of integrity in our certifications and assessments.'
  }
]

const team = [
  {
    name: 'Sarah Chen',
    role: 'CEO & Co-Founder',
    bio: 'Former engineering lead at Google with 15+ years in tech education.',
    image: '/team/sarah.jpg'
  },
  {
    name: 'Marcus Rivera',
    role: 'CTO & Co-Founder',
    bio: 'PhD in Computer Science, built ML systems at OpenAI and DeepMind.',
    image: '/team/marcus.jpg'
  },
  {
    name: 'Emily Wong',
    role: 'Chief Learning Officer',
    bio: 'EdTech pioneer with experience building curricula for Fortune 500 companies.',
    image: '/team/emily.jpg'
  },
  {
    name: 'James Mitchell',
    role: 'VP of Engineering',
    bio: 'Previously led platform engineering at Coursera and Udacity.',
    image: '/team/james.jpg'
  }
]

const stats = [
  { value: '50,000+', label: 'Active Learners' },
  { value: '200+', label: 'Expert Courses' },
  { value: '95%', label: 'Completion Rate' },
  { value: '87%', label: 'Career Advancement' }
]

const milestones = [
  { year: '2020', title: 'Founded', description: 'Phazur Labs Academy launched with 10 courses.' },
  { year: '2021', title: 'Series A', description: 'Raised $15M to expand course library and team.' },
  { year: '2022', title: '10K Students', description: 'Reached 10,000 active learners milestone.' },
  { year: '2023', title: 'Enterprise Launch', description: 'Launched enterprise solutions for teams.' },
  { year: '2024', title: 'Global Expansion', description: 'Expanded to 50+ countries with localized content.' }
]

export default function AboutPage() {
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
            <Link href="/about" className="text-sm font-medium text-primary">About</Link>
            <Link href="/careers" className="text-sm font-medium hover:text-primary transition-colors">Careers</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium hover:text-primary">Sign In</Link>
            <Link href="/auth/register" className="h-10 px-4 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 flex items-center">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Our Mission
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We believe everyone deserves access to world-class technology education. Our mission is to empower professionals worldwide with the skills they need to thrive in the digital economy.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
            <div className="prose prose-lg dark:prose-invert mx-auto">
              <p>
                Phazur Labs Academy was founded in 2020 by a team of educators and technologists who saw a gap in the market for high-quality, practical tech education that actually leads to career outcomes.
              </p>
              <p>
                Having worked at leading tech companies and universities, our founders experienced firsthand how traditional education often fails to prepare students for real-world challenges. They set out to build something different—a platform that combines rigorous curriculum with hands-on projects and industry-recognized certifications.
              </p>
              <p>
                Today, we&apos;re proud to have helped thousands of professionals advance their careers, with graduates working at companies like Google, Microsoft, Amazon, and countless innovative startups around the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Journey</h2>
          <div className="max-w-2xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {milestone.year}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="font-semibold text-lg">{milestone.title}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Leadership Team</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Meet the people leading our mission to democratize tech education.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-card border rounded-xl p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-primary">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <div className="text-primary text-sm mb-3">{member.role}</div>
                <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
                <div className="flex items-center justify-center gap-3">
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    <Twitter className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Rocket className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            We&apos;re always looking for talented people to help us transform tech education.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/careers"
              className="inline-flex items-center h-12 px-8 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90"
            >
              View Open Positions
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center h-12 px-8 border rounded-full font-medium hover:bg-muted"
            >
              Contact Us
            </Link>
          </div>
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
