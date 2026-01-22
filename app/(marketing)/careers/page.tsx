import Link from 'next/link'
import {
  MapPin,
  Clock,
  DollarSign,
  ArrowRight,
  Heart,
  Zap,
  Globe,
  Laptop,
  Plane,
  GraduationCap as Education,
  Coffee
} from 'lucide-react'

const benefits = [
  { icon: Heart, title: 'Health & Wellness', description: 'Comprehensive health, dental, and vision insurance for you and your family.' },
  { icon: Laptop, title: 'Remote-First', description: 'Work from anywhere in the world with flexible hours.' },
  { icon: DollarSign, title: 'Competitive Pay', description: 'Top-of-market compensation with equity packages.' },
  { icon: Plane, title: 'Unlimited PTO', description: 'Take the time you need to recharge and explore.' },
  { icon: Education, title: 'Learning Budget', description: '$3,000 annual budget for courses, conferences, and books.' },
  { icon: Coffee, title: 'Home Office', description: '$1,000 stipend to set up your perfect workspace.' }
]

const openings = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote (US)',
    type: 'Full-time',
    salary: '$150K - $200K',
    description: 'Build beautiful, accessible learning experiences using React, Next.js, and TypeScript.'
  },
  {
    id: 2,
    title: 'Backend Engineer',
    department: 'Engineering',
    location: 'Remote (Global)',
    type: 'Full-time',
    salary: '$130K - $180K',
    description: 'Design and build scalable APIs and services using Node.js and PostgreSQL.'
  },
  {
    id: 3,
    title: 'Machine Learning Engineer',
    department: 'AI/ML',
    location: 'Remote (US/EU)',
    type: 'Full-time',
    salary: '$160K - $220K',
    description: 'Build AI-powered features like personalized learning paths and skill assessments.'
  },
  {
    id: 4,
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote (Global)',
    type: 'Full-time',
    salary: '$120K - $160K',
    description: 'Create intuitive, delightful experiences for millions of learners worldwide.'
  },
  {
    id: 5,
    title: 'Curriculum Developer - Cloud',
    department: 'Content',
    location: 'Remote (Global)',
    type: 'Full-time',
    salary: '$100K - $140K',
    description: 'Create comprehensive cloud computing curriculum covering AWS, Azure, and GCP.'
  },
  {
    id: 6,
    title: 'Customer Success Manager',
    department: 'Success',
    location: 'Remote (US)',
    type: 'Full-time',
    salary: '$80K - $110K',
    description: 'Help enterprise customers achieve their learning and development goals.'
  }
]

const departments = ['All', 'Engineering', 'AI/ML', 'Design', 'Content', 'Success', 'Marketing']

export default function CareersPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light text-primary text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            We&apos;re Hiring
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Join Our Team
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Help us transform how the world learns technology. We&apos;re building something special and we want you to be part of it.
          </p>
          <Link
            href="#openings"
            className="inline-flex items-center h-12 px-8 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
          >
            View Open Positions
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-1">50+</div>
              <div className="text-muted-foreground">Team Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">12</div>
              <div className="text-muted-foreground">Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">100%</div>
              <div className="text-muted-foreground">Remote</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">4.8</div>
              <div className="text-muted-foreground">Glassdoor Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Why Work With Us</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            We believe in taking care of our team so they can do their best work.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4 p-6 border rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="py-20 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Open Positions</h2>
          <p className="text-muted-foreground text-center mb-8 max-w-xl mx-auto">
            Find your next opportunity. All positions are remote-friendly.
          </p>

          {/* Department Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {departments.map((dept) => (
              <button
                key={dept}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  dept === 'All'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border hover:bg-muted'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Job List */}
          <div className="max-w-3xl mx-auto space-y-4">
            {openings.map((job) => (
              <Link
                key={job.id}
                href={`/careers/${job.id}`}
                className="block bg-background border rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-primary font-medium mb-1">{job.department}</div>
                    <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{job.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-primary flex-shrink-0 hidden md:block" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Globe className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Don&apos;t See a Fit?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            We&apos;re always looking for talented people. Send us your resume and we&apos;ll keep you in mind for future opportunities.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center h-12 px-8 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
          >
            Get in Touch
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  )
}
