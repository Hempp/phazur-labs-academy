import Link from 'next/link'
import Image from 'next/image'
import {
  GraduationCap,
  PlayCircle,
  Users,
  Award,
  ChevronRight,
  Star,
  BookOpen,
  Clock,
  BarChart3,
  Zap,
  Shield,
  Globe,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  TrendingUp,
  Building2,
  Code2,
  Brain,
  Database,
  Sparkles,
  Target,
  BadgeCheck,
  Rocket
} from 'lucide-react'

const featuredCourses = [
  {
    id: 1,
    title: 'Full-Stack Web Development Mastery',
    instructor: 'Sarah Chen',
    rating: 4.9,
    students: 12500,
    hours: 85,
    price: 199,
    originalPrice: 399,
    image: '/courses/fullstack.jpg',
    category: 'Development',
    badge: 'Bestseller'
  },
  {
    id: 2,
    title: 'AI & Machine Learning Engineering',
    instructor: 'Dr. Marcus Rivera',
    rating: 4.8,
    students: 8900,
    hours: 120,
    price: 249,
    originalPrice: 499,
    image: '/courses/ai-ml.jpg',
    category: 'AI/ML',
    badge: 'Hot'
  },
  {
    id: 3,
    title: 'Cloud Architecture & DevOps',
    instructor: 'James Mitchell',
    rating: 4.9,
    students: 6700,
    hours: 65,
    price: 179,
    originalPrice: 349,
    image: '/courses/cloud.jpg',
    category: 'Cloud',
    badge: 'New'
  },
  {
    id: 4,
    title: 'Data Science & Analytics Pro',
    instructor: 'Dr. Emily Wong',
    rating: 4.8,
    students: 9200,
    hours: 95,
    price: 189,
    originalPrice: 379,
    image: '/courses/data-science.jpg',
    category: 'Data Science',
    badge: 'Top Rated'
  }
]

const testimonials = [
  {
    name: 'Alex Thompson',
    role: 'Senior Software Engineer',
    company: 'Google',
    image: '/testimonials/alex.jpg',
    quote: 'Phazur Labs Academy completely transformed my career. Within 6 months of completing the Full-Stack track, I landed my dream job at Google.',
    rating: 5
  },
  {
    name: 'Priya Sharma',
    role: 'ML Engineer',
    company: 'OpenAI',
    image: '/testimonials/priya.jpg',
    quote: 'The AI/ML certification gave me the competitive edge I needed. The hands-on projects were invaluable for building my portfolio.',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Cloud Architect',
    company: 'Amazon',
    image: '/testimonials/michael.jpg',
    quote: 'Best investment in my career. The instructors are industry experts and the certificate is recognized by top tech companies.',
    rating: 5
  }
]

const companyLogos = [
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Spotify', 'Stripe'
]

const careerOutcomes = [
  { metric: '87%', label: 'Got promoted or new job within 6 months' },
  { metric: '$32K', label: 'Average salary increase' },
  { metric: '94%', label: 'Would recommend to colleagues' },
  { metric: '2.3M', label: 'Skills assessments completed' }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-colors" />
              <GraduationCap className="h-8 w-8 text-primary relative" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">Phazur Labs Academy</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/courses" className="text-sm font-medium hover:text-primary transition-colors">
              Courses
            </Link>
            <Link href="/enterprise" className="text-sm font-medium hover:text-primary transition-colors">
              Enterprise
            </Link>
            <Link href="/verify" className="text-sm font-medium hover:text-primary transition-colors">
              Verify Certificate
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium hover:text-primary transition-colors hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center h-10 px-6 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105"
            >
              Start Free
              <Sparkles className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Premium 10x Design */}
      <section className="relative py-24 lg:py-36 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-violet-500/5" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-32 left-[15%] p-3 bg-card/80 backdrop-blur-sm border rounded-xl shadow-xl animate-float">
            <Code2 className="h-6 w-6 text-blue-500" />
          </div>
          <div className="absolute top-48 right-[20%] p-3 bg-card/80 backdrop-blur-sm border rounded-xl shadow-xl animate-float-delayed">
            <Brain className="h-6 w-6 text-violet-500" />
          </div>
          <div className="absolute bottom-32 left-[25%] p-3 bg-card/80 backdrop-blur-sm border rounded-xl shadow-xl animate-float">
            <Database className="h-6 w-6 text-emerald-500" />
          </div>
          <div className="absolute bottom-48 right-[15%] p-3 bg-card/80 backdrop-blur-sm border rounded-xl shadow-xl animate-float-delayed">
            <Rocket className="h-6 w-6 text-orange-500" />
          </div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-violet-500/20 border border-primary/20 text-sm font-medium mb-8 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent font-semibold">
                Industry-Recognized Certifications
              </span>
              <BadgeCheck className="h-4 w-4 text-primary" />
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                Launch Your Tech Career
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent">
                With Confidence
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Master in-demand skills with expert-led courses. Earn certificates that top employers trust and recognize.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/courses"
                className="group inline-flex items-center justify-center h-14 px-8 bg-gradient-to-r from-primary to-violet-600 text-primary-foreground rounded-full text-lg font-semibold hover:opacity-90 transition-all shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 w-full sm:w-auto"
              >
                Explore Courses
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/enterprise"
                className="group inline-flex items-center justify-center h-14 px-8 border-2 border-primary/30 bg-background/50 backdrop-blur-sm rounded-full text-lg font-semibold hover:bg-primary/10 hover:border-primary/50 transition-all w-full sm:w-auto"
              >
                <Building2 className="mr-2 h-5 w-5" />
                For Enterprise
              </Link>
            </div>

            {/* Trust Indicators - Enhanced */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full border">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-semibold">50,000+</span>
                <span className="text-muted-foreground text-sm">Students</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full border">
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <span className="font-semibold">4.9</span>
                <span className="text-muted-foreground text-sm">Rating</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full border">
                <Award className="h-5 w-5 text-primary" />
                <span className="font-semibold">Verified</span>
                <span className="text-muted-foreground text-sm">Certificates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Logos - Social Proof */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider font-medium">
            Our alumni work at leading companies worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60">
            {companyLogos.map((company) => (
              <div key={company} className="text-2xl font-bold text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-2">
                <Sparkles className="h-4 w-4" />
                FEATURED COURSES
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Master In-Demand Skills</h2>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium group"
            >
              Browse all courses
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group bg-card border rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all hover:-translate-y-1"
              >
                {/* Course Image */}
                <div className="relative h-44 bg-gradient-to-br from-primary/20 to-violet-500/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-primary/30" />
                  </div>
                  {/* Badge */}
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
                    course.badge === 'Bestseller' ? 'bg-amber-500 text-white' :
                    course.badge === 'Hot' ? 'bg-red-500 text-white' :
                    course.badge === 'New' ? 'bg-emerald-500 text-white' :
                    'bg-violet-500 text-white'
                  }`}>
                    {course.badge}
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-5">
                  <div className="text-xs text-primary font-medium mb-2">{course.category}</div>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{course.instructor}</p>

                  {/* Rating & Students */}
                  <div className="flex items-center gap-4 text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span className="font-semibold">{course.rating}</span>
                    </div>
                    <span className="text-muted-foreground">{course.students.toLocaleString()} students</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">${course.price}</span>
                    <span className="text-sm text-muted-foreground line-through">${course.originalPrice}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Career Outcomes - Stats */}
      <section className="py-24 bg-gradient-to-br from-primary via-violet-600 to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-300/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-white/80 text-sm font-semibold mb-4">
              <TrendingUp className="h-4 w-4" />
              CAREER OUTCOMES
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Real Results. Real Careers.
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Our graduates don't just learn—they transform their careers and earn industry-recognized credentials.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {careerOutcomes.map((outcome, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                  {outcome.metric}
                </div>
                <div className="text-white/80 text-sm md:text-base">
                  {outcome.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-2">
              <Target className="h-4 w-4" />
              WHY PHAZUR LABS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Career Advancement</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to go from beginner to job-ready professional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: PlayCircle,
                title: 'HD Video Lessons',
                description: 'Crystal-clear video with adaptive streaming. Captions in 10+ languages.',
                color: 'text-blue-500'
              },
              {
                icon: Code2,
                title: 'Hands-On Projects',
                description: 'Build real-world portfolio projects that showcase your skills to employers.',
                color: 'text-emerald-500'
              },
              {
                icon: Award,
                title: 'Verified Certificates',
                description: 'Blockchain-secured credentials that employers can verify instantly.',
                color: 'text-amber-500'
              },
              {
                icon: Brain,
                title: 'AI-Powered Learning',
                description: 'Personalized learning paths that adapt to your skill level and goals.',
                color: 'text-violet-500'
              },
              {
                icon: Users,
                title: 'Expert Instructors',
                description: 'Learn from industry veterans at Google, Meta, Amazon, and more.',
                color: 'text-rose-500'
              },
              {
                icon: Briefcase,
                title: 'Career Services',
                description: 'Resume reviews, interview prep, and job placement assistance.',
                color: 'text-cyan-500'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl border bg-card hover:shadow-xl hover:shadow-primary/5 transition-all hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-7 w-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-2">
              <Star className="h-4 w-4" />
              TESTIMONIALS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Graduates Say</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands of professionals who've accelerated their careers with Phazur Labs Academy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-2xl border relative"
              >
                {/* Quote Icon */}
                <div className="absolute -top-4 left-8 text-6xl text-primary/20 font-serif">"</div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-500 fill-amber-500" />
                  ))}
                </div>

                <p className="text-lg mb-6 relative z-10">{testimonial.quote}</p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-12 md:p-16">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl" />

            <div className="relative grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-4">
                  <Building2 className="h-4 w-4" />
                  ENTERPRISE SOLUTIONS
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Upskill Your Entire Team
                </h2>
                <p className="text-gray-300 text-lg mb-8">
                  Custom training programs, dedicated success managers, and detailed analytics to track team progress and ROI.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/enterprise"
                    className="inline-flex items-center justify-center h-12 px-6 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="/enterprise#contact"
                    className="inline-flex items-center justify-center h-12 px-6 border border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-colors"
                  >
                    Contact Sales
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Users, label: 'Team Management', value: 'Unlimited seats' },
                  { icon: BarChart3, label: 'Analytics', value: 'Real-time insights' },
                  { icon: Shield, label: 'Security', value: 'SSO & compliance' },
                  { icon: Award, label: 'Certificates', value: 'Verified credentials' }
                ].map((item, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                    <item.icon className="h-6 w-6 text-primary mb-2" />
                    <div className="text-white font-semibold">{item.label}</div>
                    <div className="text-gray-400 text-sm">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <Rocket className="h-4 w-4" />
              <span>Start learning today</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-muted-foreground text-xl mb-10">
              Join 50,000+ learners who are building the skills employers want most. Start free today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="group inline-flex items-center justify-center h-14 px-8 bg-gradient-to-r from-primary to-violet-600 text-primary-foreground rounded-full text-lg font-semibold hover:opacity-90 transition-all shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105"
              >
                Create Free Account
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Free courses available</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Enhanced */}
      <footer className="border-t bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-8 w-8 text-primary" />
                <span className="font-bold text-xl">Phazur Labs Academy</span>
              </Link>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Empowering professionals worldwide with industry-recognized technology certifications and hands-on training.
              </p>
              <div className="flex items-center gap-4">
                <Link href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Globe className="h-5 w-5" />
                </Link>
                <Link href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <span className="text-sm font-bold">in</span>
                </Link>
                <Link href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <span className="text-sm font-bold">X</span>
                </Link>
              </div>
            </div>

            {/* Learn */}
            <div>
              <h4 className="font-semibold mb-4">Learn</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/courses" className="hover:text-foreground transition-colors">All Courses</Link></li>
                <li><Link href="/tracks" className="hover:text-foreground transition-colors">Learning Paths</Link></li>
                <li><Link href="/certifications" className="hover:text-foreground transition-colors">Certifications</Link></li>
                <li><Link href="/skills" className="hover:text-foreground transition-colors">Skill Assessments</Link></li>
              </ul>
            </div>

            {/* Business */}
            <div>
              <h4 className="font-semibold mb-4">Business</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/enterprise" className="hover:text-foreground transition-colors">Enterprise</Link></li>
                <li><Link href="/teams" className="hover:text-foreground transition-colors">For Teams</Link></li>
                <li><Link href="/verify" className="hover:text-foreground transition-colors">Verify Certificates</Link></li>
                <li><Link href="/partners" className="hover:text-foreground transition-colors">Partners</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Phazur Labs Academy. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="/accessibility" className="hover:text-foreground transition-colors">Accessibility</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
