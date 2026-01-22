import Link from 'next/link'
import Image from 'next/image'
import { Header, Footer } from '@/components/layout'
import {
  GraduationCap,
  ChevronRight,
  Star,
  Clock,
  Users,
  Award,
  Building2,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Code2,
  Brain,
  Database,
  Cloud,
  Smartphone,
  Shield,
  BarChart3,
  Palette,
  Play,
} from 'lucide-react'

// Course categories for quick browse
const categories = [
  { name: 'Development', icon: Code2, href: '/courses?category=development' },
  { name: 'Data Science', icon: BarChart3, href: '/courses?category=data-science' },
  { name: 'AI & ML', icon: Brain, href: '/courses?category=ai-ml' },
  { name: 'Cloud', icon: Cloud, href: '/courses?category=cloud' },
  { name: 'Mobile', icon: Smartphone, href: '/courses?category=mobile' },
  { name: 'Security', icon: Shield, href: '/courses?category=security' },
  { name: 'Database', icon: Database, href: '/courses?category=database' },
  { name: 'Design', icon: Palette, href: '/courses?category=design' },
]

// Featured courses data (Coursera-style card)
const featuredCourses = [
  {
    id: 1,
    title: 'Full-Stack Web Development Mastery',
    partner: 'Phazur Labs',
    partnerLogo: '/partners/phazur.svg',
    rating: 4.9,
    reviewCount: 12500,
    level: 'Beginner',
    duration: '3-6 Months',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    image: '/courses/fullstack.jpg',
    badge: 'Professional Certificate',
    hasTrial: true,
  },
  {
    id: 2,
    title: 'AI & Machine Learning Engineering',
    partner: 'Phazur Labs',
    partnerLogo: '/partners/phazur.svg',
    rating: 4.8,
    reviewCount: 8900,
    level: 'Intermediate',
    duration: '4-6 Months',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning'],
    image: '/courses/ai-ml.jpg',
    badge: 'Specialization',
    hasTrial: true,
  },
  {
    id: 3,
    title: 'Cloud Architecture & DevOps',
    partner: 'Phazur Labs',
    partnerLogo: '/partners/phazur.svg',
    rating: 4.9,
    reviewCount: 6700,
    level: 'Intermediate',
    duration: '3-4 Months',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    image: '/courses/cloud.jpg',
    badge: 'Professional Certificate',
    hasTrial: false,
  },
  {
    id: 4,
    title: 'Data Science & Analytics Pro',
    partner: 'Phazur Labs',
    partnerLogo: '/partners/phazur.svg',
    rating: 4.8,
    reviewCount: 9200,
    level: 'Beginner',
    duration: '4-5 Months',
    skills: ['Python', 'SQL', 'Pandas', 'Machine Learning'],
    image: '/courses/data-science.jpg',
    badge: 'Professional Certificate',
    hasTrial: true,
  },
]

// Career outcomes data
const careerOutcomes = [
  { metric: '87%', label: 'of learners report career benefits' },
  { metric: '$32K', label: 'average salary increase' },
  { metric: '2.3M+', label: 'skills assessments completed' },
  { metric: '94%', label: 'would recommend to others' },
]

// Partner/company logos
const partnerLogos = [
  'Google', 'Microsoft', 'Amazon', 'Meta', 'IBM', 'Netflix', 'Spotify', 'Stripe'
]

// Testimonials
const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Senior Software Engineer',
    company: 'Google',
    image: '/testimonials/sarah.jpg',
    quote: 'The Full-Stack certification helped me transition from backend to full-stack. Within 3 months, I landed my dream role.',
    course: 'Full-Stack Web Development',
  },
  {
    name: 'Marcus Rivera',
    role: 'ML Engineer',
    company: 'OpenAI',
    image: '/testimonials/marcus.jpg',
    quote: 'The hands-on projects in the AI/ML track were exactly what I needed to build a strong portfolio.',
    course: 'AI & Machine Learning',
  },
  {
    name: 'Emily Wong',
    role: 'Cloud Architect',
    company: 'Amazon',
    image: '/testimonials/emily.jpg',
    quote: 'Best investment in my career. The certificate is recognized by top tech companies worldwide.',
    course: 'Cloud Architecture',
  },
]

// Goal-based paths (Coursera personalization)
const learningGoals = [
  {
    title: 'Start a new career',
    description: 'Get job-ready with professional certificates',
    icon: Briefcase,
    href: '/courses?goal=career',
    color: 'bg-blue-500',
  },
  {
    title: 'Advance my career',
    description: 'Earn a degree or specialization',
    icon: TrendingUp,
    href: '/courses?goal=advance',
    color: 'bg-green-500',
  },
  {
    title: 'Learn a new skill',
    description: 'Explore new topics and interests',
    icon: GraduationCap,
    href: '/courses?goal=learn',
    color: 'bg-purple-500',
  },
]

// Course Card Component (Coursera-style)
function CourseCard({ course }: { course: typeof featuredCourses[0] }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex flex-col bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
        {/* Partner Logo Overlay */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded">
          <div className="w-5 h-5 bg-primary rounded flex items-center justify-center">
            <GraduationCap className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-medium text-foreground">{course.partner}</span>
        </div>
        {/* Placeholder for course image */}
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 group-hover:scale-105 transition-transform duration-300" />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-3">
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {course.hasTrial && (
            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-success/10 text-success rounded">
              Free Trial
            </span>
          )}
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded">
            {course.badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        {/* Skills */}
        <p className="text-sm text-muted-foreground line-clamp-1">
          Skills: {course.skills.slice(0, 3).join(', ')}
          {course.skills.length > 3 && `, +${course.skills.length - 3} more`}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 fill-warning text-warning" />
          <span className="text-sm font-medium">{course.rating}</span>
          <span className="text-sm text-muted-foreground">
            ({course.reviewCount.toLocaleString()} reviews)
          </span>
        </div>

        {/* Meta */}
        <p className="text-xs text-muted-foreground">
          {course.level} · Course · {course.duration}
        </p>
      </div>
    </Link>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section - Coursera Style */}
      <section className="bg-surface-secondary py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Learn without limits
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start, switch, or advance your career with courses and certificates from world-class educators.
            </p>

            {/* Goal Cards - Personalization */}
            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {learningGoals.map((goal) => (
                <Link
                  key={goal.title}
                  href={goal.href}
                  className="group p-5 bg-card border rounded-xl hover:border-primary hover:shadow-md transition-all text-left"
                >
                  <div className={`w-10 h-10 ${goal.color} rounded-lg flex items-center justify-center mb-3`}>
                    <goal.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {goal.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {goal.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="flex items-center gap-2 px-4 py-2 bg-surface-secondary border rounded-full hover:border-primary hover:bg-primary/5 transition-colors whitespace-nowrap"
              >
                <category.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Carousel */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Most Popular Certificates</h2>
              <p className="text-muted-foreground mt-1">Start your career journey today</p>
            </div>
            <Link
              href="/courses"
              className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              See all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div className="mt-6 text-center md:hidden">
            <Link
              href="/courses"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              See all courses
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {careerOutcomes.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold mb-2">{stat.metric}</p>
                <p className="text-sm text-primary-foreground/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Our learners work at leading companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {partnerLogos.map((logo) => (
              <div
                key={logo}
                className="text-xl font-semibold text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Join learners worldwide
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how others have transformed their careers with Phazur Labs Academy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-card border rounded-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                <p className="text-sm text-primary font-medium">{testimonial.course}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-16 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
                <Building2 className="w-4 h-4" />
                For Enterprise
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Upskill your team
              </h2>
              <p className="text-muted-foreground mb-6">
                Get unlimited access to courses and learning paths for your entire organization.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link
                  href="/enterprise"
                  className="inline-flex items-center justify-center h-11 px-6 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  href="/enterprise/demo"
                  className="inline-flex items-center justify-center h-11 px-6 border border-border rounded-md font-medium hover:bg-muted transition-colors"
                >
                  Request a demo
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-64 h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center">
                <Building2 className="w-20 h-20 text-primary/40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Start learning today
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join millions of learners building in-demand skills and earning recognized credentials.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center h-12 px-8 bg-primary text-primary-foreground rounded-md text-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Join for Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
