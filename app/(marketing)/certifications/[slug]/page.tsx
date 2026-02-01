import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Award,
  Clock,
  FileQuestion,
  Calendar,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Target,
  Shield,
  BadgeCheck,
  ChevronRight,
  Users,
  Building2,
} from 'lucide-react'

// Certification data (would come from database in production)
const certifications: Record<string, {
  id: string
  title: string
  level: 'Associate' | 'Professional' | 'Expert'
  description: string
  longDescription: string
  requirements: string[]
  skills: string[]
  examDuration: string
  questions: number
  validity: string
  price: number
  color: string
  passingScore: string
  prerequisites: string[]
  benefits: string[]
  examFormat: string[]
  relatedCourses: { title: string; slug: string }[]
}> = {
  'full-stack-developer': {
    id: 'full-stack-developer',
    title: 'Certified Full-Stack Developer',
    level: 'Professional',
    description: 'Validates expertise in building complete web applications using modern technologies.',
    longDescription: `The Certified Full-Stack Developer credential demonstrates your comprehensive knowledge of
    modern web development practices. This certification validates your ability to design, develop, and deploy
    complete web applications using industry-standard technologies and best practices.

    Employers worldwide recognize this certification as proof of your technical competence and dedication to
    professional development. Holders of this certification have demonstrated proficiency in both frontend
    and backend development, database design, and deployment strategies.`,
    requirements: ['Complete Full-Stack Learning Path', 'Pass certification exam (80%+)', 'Complete capstone project'],
    skills: ['React', 'Next.js', 'Node.js', 'Databases', 'APIs', 'Deployment'],
    examDuration: '3 hours',
    questions: 80,
    validity: '2 years',
    price: 199,
    color: 'from-blue-500 to-cyan-500',
    passingScore: '80%',
    prerequisites: ['Basic programming knowledge', 'Understanding of web fundamentals', 'Experience with at least one programming language'],
    benefits: [
      'Industry-recognized credential on your resume',
      'Access to exclusive job board for certified developers',
      'Digital badge for LinkedIn and portfolio',
      'Priority access to advanced courses',
      'Join the certified developers community',
    ],
    examFormat: [
      'Multiple choice questions (60%)',
      'Code analysis and debugging (20%)',
      'Practical coding challenges (20%)',
    ],
    relatedCourses: [
      { title: 'Full-Stack Web Development Mastery', slug: 'full-stack-web-development' },
      { title: 'React Advanced Patterns', slug: 'react-advanced-patterns' },
      { title: 'Node.js Backend Development', slug: 'nodejs-backend' },
    ],
  },
  'ai-ml-engineer': {
    id: 'ai-ml-engineer',
    title: 'Certified AI/ML Engineer',
    level: 'Expert',
    description: 'Demonstrates advanced skills in machine learning, deep learning, and AI systems.',
    longDescription: `The Certified AI/ML Engineer credential represents the highest level of achievement in
    artificial intelligence and machine learning. This certification validates your expertise in designing,
    implementing, and deploying production-grade machine learning systems.

    Holders of this certification have demonstrated mastery in neural networks, deep learning architectures,
    natural language processing, computer vision, and MLOps practices. This credential is recognized by
    leading AI companies worldwide.`,
    requirements: ['Complete AI/ML Learning Path', 'Pass certification exam (75%+)', 'Submit ML project portfolio'],
    skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'MLOps'],
    examDuration: '4 hours',
    questions: 100,
    validity: '2 years',
    price: 299,
    color: 'from-violet-500 to-purple-500',
    passingScore: '75%',
    prerequisites: ['Strong Python programming skills', 'Linear algebra and calculus fundamentals', 'Statistics and probability knowledge'],
    benefits: [
      'Expert-level credential recognized globally',
      'Access to AI/ML job opportunities',
      'Invitation to AI research community',
      'Speaking opportunities at conferences',
      'Mentorship program access',
    ],
    examFormat: [
      'Theory and concepts (40%)',
      'Algorithm implementation (30%)',
      'Model optimization and deployment (30%)',
    ],
    relatedCourses: [
      { title: 'AI & Machine Learning Engineering', slug: 'ai-machine-learning-engineering' },
      { title: 'Deep Learning Specialization', slug: 'deep-learning' },
      { title: 'MLOps in Production', slug: 'mlops-production' },
    ],
  },
  'data-scientist': {
    id: 'data-scientist',
    title: 'Certified Data Scientist',
    level: 'Professional',
    description: 'Proves proficiency in data analysis, visualization, and predictive modeling.',
    longDescription: `The Certified Data Scientist credential validates your expertise in extracting insights
    from complex datasets and building predictive models. This certification demonstrates your ability to
    work with large-scale data, perform statistical analysis, and communicate findings effectively.

    Data scientists with this certification are equipped to tackle real-world business problems using
    data-driven approaches. The credential covers the full data science lifecycle from data collection
    to model deployment.`,
    requirements: ['Complete Data Science Path', 'Pass certification exam (80%+)', 'Complete data analysis project'],
    skills: ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Visualization', 'Big Data'],
    examDuration: '3 hours',
    questions: 75,
    validity: '2 years',
    price: 249,
    color: 'from-emerald-500 to-teal-500',
    passingScore: '80%',
    prerequisites: ['Basic programming knowledge', 'Understanding of statistics', 'Familiarity with databases'],
    benefits: [
      'Professional credential for data roles',
      'Access to data science job network',
      'Kaggle competition advantages',
      'Industry recognition',
      'Continuous learning resources',
    ],
    examFormat: [
      'Statistical analysis and interpretation (35%)',
      'Data manipulation and SQL (30%)',
      'Machine learning application (35%)',
    ],
    relatedCourses: [
      { title: 'Data Science & Analytics Pro', slug: 'data-science-analytics' },
      { title: 'Python for Data Science', slug: 'python-data-science' },
      { title: 'SQL Mastery', slug: 'sql-mastery' },
    ],
  },
  'cloud-architect': {
    id: 'cloud-architect',
    title: 'Certified Cloud Architect',
    level: 'Expert',
    description: 'Validates expertise in designing and deploying cloud infrastructure.',
    longDescription: `The Certified Cloud Architect credential demonstrates your mastery in designing,
    implementing, and managing cloud-native architectures. This certification validates your expertise
    across major cloud platforms and infrastructure-as-code practices.

    Cloud architects with this certification can design highly available, scalable, and cost-effective
    solutions. The credential covers multi-cloud strategies, security best practices, and DevOps integration.`,
    requirements: ['Complete Cloud Learning Path', 'Pass certification exam (80%+)', 'Architecture case study'],
    skills: ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Terraform', 'Security'],
    examDuration: '3.5 hours',
    questions: 85,
    validity: '2 years',
    price: 279,
    color: 'from-orange-500 to-amber-500',
    passingScore: '80%',
    prerequisites: ['Experience with at least one cloud platform', 'Networking fundamentals', 'Linux administration basics'],
    benefits: [
      'Expert cloud credential',
      'Access to cloud architect positions',
      'Multi-cloud expertise validation',
      'Conference speaking opportunities',
      'Cloud community leadership',
    ],
    examFormat: [
      'Architecture design scenarios (40%)',
      'Security and compliance (25%)',
      'Cost optimization and performance (35%)',
    ],
    relatedCourses: [
      { title: 'Cloud Architecture & DevOps', slug: 'cloud-architecture-devops' },
      { title: 'Kubernetes Mastery', slug: 'kubernetes-mastery' },
      { title: 'AWS Solutions Architect', slug: 'aws-solutions-architect' },
    ],
  },
  'cybersecurity-professional': {
    id: 'cybersecurity-professional',
    title: 'Certified Cybersecurity Professional',
    level: 'Professional',
    description: 'Demonstrates comprehensive knowledge of security principles and practices.',
    longDescription: `The Certified Cybersecurity Professional credential validates your expertise in
    protecting organizations from cyber threats. This certification demonstrates your knowledge of
    security frameworks, threat detection, incident response, and compliance requirements.

    Security professionals with this certification are equipped to assess vulnerabilities, implement
    security controls, and respond to security incidents. The credential is recognized by enterprises
    and government organizations.`,
    requirements: ['Complete Security Learning Path', 'Pass certification exam (85%+)', 'Security audit project'],
    skills: ['Network Security', 'Penetration Testing', 'SIEM', 'Compliance', 'Incident Response'],
    examDuration: '3 hours',
    questions: 90,
    validity: '2 years',
    price: 259,
    color: 'from-red-500 to-rose-500',
    passingScore: '85%',
    prerequisites: ['Networking knowledge', 'Operating system fundamentals', 'Basic scripting skills'],
    benefits: [
      'Security clearance-friendly credential',
      'Access to security job network',
      'Bug bounty program priority',
      'Security research community',
      'Threat intelligence updates',
    ],
    examFormat: [
      'Security concepts and frameworks (30%)',
      'Threat analysis and response (35%)',
      'Practical security scenarios (35%)',
    ],
    relatedCourses: [
      { title: 'Cybersecurity Fundamentals', slug: 'cybersecurity-fundamentals' },
      { title: 'Ethical Hacking', slug: 'ethical-hacking' },
      { title: 'Security Operations Center', slug: 'soc-operations' },
    ],
  },
  'frontend-developer': {
    id: 'frontend-developer',
    title: 'Certified Frontend Developer',
    level: 'Associate',
    description: 'Validates skills in modern frontend development and UI/UX implementation.',
    longDescription: `The Certified Frontend Developer credential validates your proficiency in building
    modern, responsive, and accessible user interfaces. This certification demonstrates your mastery of
    core web technologies and popular frontend frameworks.

    Frontend developers with this certification can create exceptional user experiences across devices
    and platforms. The credential covers modern JavaScript, CSS frameworks, and accessibility standards.`,
    requirements: ['Complete Frontend courses', 'Pass certification exam (75%+)', 'Portfolio review'],
    skills: ['HTML/CSS', 'JavaScript', 'React', 'TypeScript', 'Responsive Design', 'Accessibility'],
    examDuration: '2 hours',
    questions: 60,
    validity: '2 years',
    price: 149,
    color: 'from-pink-500 to-fuchsia-500',
    passingScore: '75%',
    prerequisites: ['Basic HTML and CSS knowledge', 'JavaScript fundamentals', 'Understanding of web browsers'],
    benefits: [
      'Entry-level credential for frontend roles',
      'Portfolio validation',
      'Access to junior developer positions',
      'Frontend community membership',
      'Project collaboration opportunities',
    ],
    examFormat: [
      'HTML, CSS, and JavaScript (40%)',
      'React and modern frameworks (35%)',
      'Accessibility and performance (25%)',
    ],
    relatedCourses: [
      { title: 'Frontend Development Mastery', slug: 'frontend-development' },
      { title: 'React Complete Guide', slug: 'react-complete-guide' },
      { title: 'CSS Advanced Techniques', slug: 'css-advanced' },
    ],
  },
}

export async function generateStaticParams() {
  return Object.keys(certifications).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cert = certifications[slug]

  if (!cert) {
    return { title: 'Certification Not Found' }
  }

  return {
    title: cert.title,
    description: cert.description,
  }
}

export default async function CertificationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const cert = certifications[slug]

  if (!cert) {
    notFound()
  }

  return (
    <>
      {/* Hero */}
      <section className={`py-16 bg-gradient-to-r ${cert.color}`}>
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/80 mb-8">
            <Link href="/certifications" className="hover:text-white">
              Certifications
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{cert.title}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-4">
                {cert.level} Level
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{cert.title}</h1>
              <p className="text-lg text-white/90 mb-8">{cert.description}</p>

              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{cert.examDuration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileQuestion className="h-5 w-5" />
                  <span>{cert.questions} Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>Valid {cert.validity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  <span>{cert.passingScore} to Pass</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/certifications/${cert.id}/register`}
                  className="inline-flex items-center h-12 px-8 bg-white text-gray-900 rounded-lg font-medium hover:bg-white/90"
                >
                  Register for Exam - ${cert.price}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href={`/courses?certification=${cert.id}`}
                  className="inline-flex items-center h-12 px-8 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Preparation Courses
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Award className="h-32 w-32 text-white/80" />
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <BadgeCheck className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* About */}
              <div>
                <h2 className="text-2xl font-bold mb-4">About This Certification</h2>
                <div className="prose prose-gray max-w-none">
                  {cert.longDescription.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
              </div>

              {/* Skills Validated */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Skills Validated</h2>
                <div className="flex flex-wrap gap-3">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Exam Format */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Exam Format</h2>
                <div className="bg-surface-secondary rounded-xl p-6">
                  <ul className="space-y-4">
                    {cert.examFormat.map((format, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-primary">{index + 1}</span>
                        </div>
                        <span className="text-foreground pt-1">{format}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {cert.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prerequisites */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
                <ul className="space-y-3">
                  {cert.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{prereq}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Related Courses */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Preparation Courses</h2>
                <div className="grid gap-4">
                  {cert.relatedCourses.map((course) => (
                    <Link
                      key={course.slug}
                      href={`/courses/${course.slug}`}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <span className="font-medium">{course.title}</span>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* CTA Card */}
                <div className="border rounded-xl p-6 bg-background shadow-sm">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold">${cert.price}</div>
                    <div className="text-muted-foreground">per exam attempt</div>
                  </div>

                  <Link
                    href={`/certifications/${cert.id}/register`}
                    className="w-full inline-flex items-center justify-center h-12 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 mb-4"
                  >
                    Register for Exam
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>

                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{cert.examDuration} exam duration</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <FileQuestion className="h-4 w-4 text-muted-foreground" />
                      <span>{cert.questions} questions</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span>{cert.passingScore} passing score</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Valid for {cert.validity}</span>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="border rounded-xl p-6 bg-background">
                  <h3 className="font-bold mb-4">Benefits</h3>
                  <ul className="space-y-3">
                    {cert.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Enterprise */}
                <div className="border rounded-xl p-6 bg-primary/5">
                  <div className="flex items-center gap-3 mb-3">
                    <Building2 className="h-6 w-6 text-primary" />
                    <h3 className="font-bold">For Teams</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get volume discounts for your organization.
                  </p>
                  <Link
                    href="/enterprise"
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    Contact Sales
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-surface-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Certified?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of professionals who have advanced their careers with our certifications.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/certifications/${cert.id}/register`}
              className="inline-flex items-center h-12 px-8 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
            >
              Register Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href={`/courses?certification=${cert.id}`}
              className="inline-flex items-center h-12 px-8 border rounded-lg font-medium hover:bg-muted"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              View Prep Courses
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
