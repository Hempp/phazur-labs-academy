import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Clock,
  BookOpen,
  Award,
  Code2,
  Brain,
  Database,
  Cloud,
  Shield,
  Smartphone,
  TrendingUp,
  CheckCircle2
} from 'lucide-react'

const learningPaths = [
  {
    id: 'full-stack',
    title: 'Full-Stack Web Development',
    description: 'Master front-end and back-end technologies to build complete web applications from scratch.',
    icon: Code2,
    color: 'from-blue-500 to-cyan-500',
    duration: '6 months',
    courses: 12,
    skills: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'TypeScript', 'REST APIs'],
    career: 'Full-Stack Developer',
    salary: '$95,000 - $150,000'
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    description: 'Learn to build intelligent systems using machine learning, deep learning, and AI frameworks.',
    icon: Brain,
    color: 'from-violet-500 to-purple-500',
    duration: '8 months',
    courses: 15,
    skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'MLOps'],
    career: 'ML Engineer',
    salary: '$120,000 - $180,000'
  },
  {
    id: 'data-science',
    title: 'Data Science & Analytics',
    description: 'Transform data into insights using statistical analysis, visualization, and predictive modeling.',
    icon: Database,
    color: 'from-emerald-500 to-teal-500',
    duration: '5 months',
    courses: 10,
    skills: ['Python', 'SQL', 'Pandas', 'Tableau', 'Statistics', 'Machine Learning'],
    career: 'Data Scientist',
    salary: '$100,000 - $160,000'
  },
  {
    id: 'cloud',
    title: 'Cloud Architecture & DevOps',
    description: 'Design and deploy scalable cloud infrastructure with modern DevOps practices.',
    icon: Cloud,
    color: 'from-orange-500 to-amber-500',
    duration: '4 months',
    courses: 8,
    skills: ['AWS', 'Azure', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD'],
    career: 'Cloud Architect',
    salary: '$130,000 - $190,000'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Professional',
    description: 'Protect systems and data from cyber threats with comprehensive security knowledge.',
    icon: Shield,
    color: 'from-red-500 to-rose-500',
    duration: '6 months',
    courses: 11,
    skills: ['Network Security', 'Ethical Hacking', 'SIEM', 'Compliance', 'Incident Response'],
    career: 'Security Engineer',
    salary: '$110,000 - $170,000'
  },
  {
    id: 'mobile',
    title: 'Mobile App Development',
    description: 'Build native and cross-platform mobile applications for iOS and Android.',
    icon: Smartphone,
    color: 'from-pink-500 to-fuchsia-500',
    duration: '5 months',
    courses: 9,
    skills: ['React Native', 'Swift', 'Kotlin', 'Flutter', 'Firebase', 'App Store'],
    career: 'Mobile Developer',
    salary: '$90,000 - $145,000'
  }
]

export default function TracksPage() {
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
            <Link href="/tracks" className="text-sm font-medium text-primary">Learning Paths</Link>
            <Link href="/certifications" className="text-sm font-medium hover:text-primary transition-colors">Certifications</Link>
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
            <TrendingUp className="h-4 w-4" />
            Structured Career Paths
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Learning Paths
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Follow our expertly crafted learning paths to go from beginner to job-ready professional in your chosen field.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <span>Structured curriculum</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <span>Industry-aligned skills</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <span>Career certification</span>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {learningPaths.map((path) => (
              <Link
                key={path.id}
                href={`/tracks/${path.id}`}
                className="group bg-card border rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
              >
                {/* Header */}
                <div className={`h-32 bg-gradient-to-br ${path.color} p-6 relative`}>
                  <path.icon className="h-12 w-12 text-white/90" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-white text-xs font-medium">
                    {path.courses} courses
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {path.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {path.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {path.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      Certificate
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {path.skills.slice(0, 4).map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-muted rounded text-xs">
                        {skill}
                      </span>
                    ))}
                    {path.skills.length > 4 && (
                      <span className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
                        +{path.skills.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Career */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground">Career Path</div>
                        <div className="font-medium">{path.career}</div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Not Sure Which Path to Choose?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Take our free skill assessment to get personalized recommendations based on your goals and experience.
          </p>
          <Link
            href="/skills"
            className="inline-flex items-center h-12 px-8 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90"
          >
            Take Skill Assessment
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
