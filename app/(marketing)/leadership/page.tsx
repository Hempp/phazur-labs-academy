import Link from 'next/link'
import {
  Linkedin,
  Twitter,
  Mail,
  ArrowRight,
  Award,
  Users,
  TrendingUp,
  Globe
} from 'lucide-react'

const executives = [
  {
    name: 'Sarah Chen',
    role: 'Chief Executive Officer',
    bio: 'Former engineering lead at Google with 15+ years in tech education. Sarah has led teams of 200+ engineers and is passionate about making technology accessible to everyone.',
    background: ['Google - Engineering Lead', 'Stanford University - MS Computer Science', 'MIT - BS Computer Science'],
    image: '/team/sarah.jpg'
  },
  {
    name: 'Marcus Rivera',
    role: 'Chief Technology Officer',
    bio: 'PhD in Computer Science from Stanford. Built ML systems at OpenAI and DeepMind. Marcus leads our technical vision and drives innovation in AI-powered learning.',
    background: ['OpenAI - ML Research Lead', 'DeepMind - Senior Research Scientist', 'Stanford University - PhD Computer Science'],
    image: '/team/marcus.jpg'
  },
  {
    name: 'Emily Wong',
    role: 'Chief Learning Officer',
    bio: 'EdTech pioneer with 20+ years building curricula for Fortune 500 companies. Emily ensures our courses meet the highest standards of educational excellence.',
    background: ['Coursera - VP Curriculum', 'McKinsey - Learning Director', 'Harvard - EdD Education'],
    image: '/team/emily.jpg'
  },
  {
    name: 'James Mitchell',
    role: 'VP of Engineering',
    bio: 'Previously led platform engineering at Coursera and Udacity. James builds the infrastructure that powers learning for thousands of students daily.',
    background: ['Coursera - Director of Engineering', 'Udacity - Senior Engineer', 'Carnegie Mellon - MS Software Engineering'],
    image: '/team/james.jpg'
  }
]

const advisors = [
  {
    name: 'Dr. Andrew Ng',
    role: 'AI Advisor',
    affiliation: 'Founder of DeepLearning.AI, Coursera Co-founder'
  },
  {
    name: 'Reshma Saujani',
    role: 'Education Advisor',
    affiliation: 'Founder of Girls Who Code'
  },
  {
    name: 'Werner Vogels',
    role: 'Cloud Advisor',
    affiliation: 'CTO, Amazon Web Services'
  },
  {
    name: 'Ginni Rometty',
    role: 'Business Advisor',
    affiliation: 'Former CEO, IBM'
  }
]

const stats = [
  { icon: Users, value: '50K+', label: 'Students Taught' },
  { icon: Award, value: '15K+', label: 'Certifications Issued' },
  { icon: TrendingUp, value: '87%', label: 'Career Advancement' },
  { icon: Globe, value: '50+', label: 'Countries Reached' }
]

export default function LeadershipPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Leadership Team
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meet the visionaries driving our mission to transform technology education worldwide.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Executive Team</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Our leadership brings decades of experience from the world&apos;s top technology companies.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {executives.map((exec, index) => (
              <div key={index} className="bg-surface-secondary border rounded-2xl p-8">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl font-bold text-primary">
                      {exec.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{exec.name}</h3>
                    <div className="text-primary font-medium mb-2">{exec.role}</div>
                    <div className="flex items-center gap-3">
                      <Link href="#" className="text-muted-foreground hover:text-primary">
                        <Linkedin className="h-5 w-5" />
                      </Link>
                      <Link href="#" className="text-muted-foreground hover:text-primary">
                        <Twitter className="h-5 w-5" />
                      </Link>
                      <Link href="#" className="text-muted-foreground hover:text-primary">
                        <Mail className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">{exec.bio}</p>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Background</h4>
                  <ul className="space-y-2">
                    {exec.background.map((item, i) => (
                      <li key={i} className="text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Board */}
      <section className="py-20 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Advisory Board</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Industry leaders guiding our strategic direction.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {advisors.map((advisor, index) => (
              <div key={index} className="bg-background border rounded-xl p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {advisor.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-semibold">{advisor.name}</h3>
                <div className="text-primary text-sm mb-2">{advisor.role}</div>
                <p className="text-muted-foreground text-xs">{advisor.affiliation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Leadership Journey</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Interested in partnering with us or exploring investment opportunities?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center h-12 px-8 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
            >
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/investors"
              className="inline-flex items-center h-12 px-8 border rounded-md font-medium hover:bg-muted"
            >
              Investor Relations
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
