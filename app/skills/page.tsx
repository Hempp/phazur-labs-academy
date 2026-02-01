import Link from 'next/link'
import Image from 'next/image'
import {
  Target,
  BarChart3,
  Clock,
  Award,
  ArrowRight,
  CheckCircle2,
  Code2,
  Brain,
  Database,
  Cloud,
  Shield,
  Smartphone,
  Zap,
  TrendingUp
} from 'lucide-react'

const assessments = [
  {
    id: 'javascript',
    title: 'JavaScript',
    category: 'Programming',
    icon: Code2,
    questions: 40,
    duration: '45 min',
    difficulty: 'Beginner to Expert',
    color: 'bg-yellow-500'
  },
  {
    id: 'python',
    title: 'Python',
    category: 'Programming',
    icon: Code2,
    questions: 40,
    duration: '45 min',
    difficulty: 'Beginner to Expert',
    color: 'bg-blue-500'
  },
  {
    id: 'react',
    title: 'React',
    category: 'Frontend',
    icon: Code2,
    questions: 35,
    duration: '40 min',
    difficulty: 'Intermediate to Expert',
    color: 'bg-cyan-500'
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning',
    category: 'AI/ML',
    icon: Brain,
    questions: 50,
    duration: '60 min',
    difficulty: 'Intermediate to Expert',
    color: 'bg-violet-500'
  },
  {
    id: 'sql',
    title: 'SQL & Databases',
    category: 'Data',
    icon: Database,
    questions: 35,
    duration: '40 min',
    difficulty: 'Beginner to Expert',
    color: 'bg-emerald-500'
  },
  {
    id: 'aws',
    title: 'AWS Cloud',
    category: 'Cloud',
    icon: Cloud,
    questions: 45,
    duration: '50 min',
    difficulty: 'Intermediate to Expert',
    color: 'bg-orange-500'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    category: 'Security',
    icon: Shield,
    questions: 40,
    duration: '45 min',
    difficulty: 'Intermediate to Expert',
    color: 'bg-red-500'
  },
  {
    id: 'mobile-dev',
    title: 'Mobile Development',
    category: 'Mobile',
    icon: Smartphone,
    questions: 35,
    duration: '40 min',
    difficulty: 'Beginner to Expert',
    color: 'bg-pink-500'
  }
]

const benefits = [
  {
    icon: Target,
    title: 'Identify Skill Gaps',
    description: 'Understand exactly where you need to improve with detailed results.'
  },
  {
    icon: TrendingUp,
    title: 'Personalized Learning',
    description: 'Get course recommendations tailored to your assessment results.'
  },
  {
    icon: Award,
    title: 'Showcase Skills',
    description: 'Add verified skill badges to your profile and LinkedIn.'
  },
  {
    icon: BarChart3,
    title: 'Track Progress',
    description: 'Retake assessments to measure your improvement over time.'
  }
]

export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo/phazur-logo-dark.png"
              alt="Course Training"
              width={32}
              height={32}
              className="dark:invert"
            />
            <span className="font-bold text-xl">Course Training</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/courses" className="text-sm font-medium hover:text-primary transition-colors">Courses</Link>
            <Link href="/tracks" className="text-sm font-medium hover:text-primary transition-colors">Learning Paths</Link>
            <Link href="/skills" className="text-sm font-medium text-primary">Skill Assessments</Link>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Free Skill Assessments
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Measure Your Skills
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Take our free assessments to benchmark your skills, identify gaps, and get personalized learning recommendations.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <span>Verified Badges</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessments Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Available Assessments</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Choose from our library of skill assessments covering programming, cloud, data, and more.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {assessments.map((assessment) => (
              <Link
                key={assessment.id}
                href={`/skills/${assessment.id}`}
                className="group bg-card border rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className={`w-12 h-12 ${assessment.color} rounded-xl flex items-center justify-center mb-4`}>
                  <assessment.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-xs text-muted-foreground mb-1">{assessment.category}</div>
                <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                  {assessment.title}
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Questions</span>
                    <span className="font-medium text-foreground">{assessment.questions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Duration</span>
                    <span className="font-medium text-foreground">{assessment.duration}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <span className="text-xs text-muted-foreground">{assessment.difficulty}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid gap-8">
              {[
                { step: 1, title: 'Choose an Assessment', description: 'Select the skill you want to evaluate from our library.' },
                { step: 2, title: 'Answer Questions', description: 'Complete adaptive questions that adjust to your skill level.' },
                { step: 3, title: 'Get Your Results', description: 'Receive detailed feedback and a skill level rating instantly.' },
                { step: 4, title: 'Start Learning', description: 'Get personalized course recommendations to improve.' }
              ].map((item) => (
                <div key={item.step} className="flex gap-6 items-start">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Test Your Skills?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Create a free account to take assessments, track your progress, and earn skill badges.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center h-12 px-8 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Course Training. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
