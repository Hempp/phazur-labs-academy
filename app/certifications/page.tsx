import Link from 'next/link'
import {
  GraduationCap,
  Award,
  Shield,
  CheckCircle2,
  Globe,
  Building2,
  ArrowRight,
  BadgeCheck,
  Lock,
  FileCheck,
  Star
} from 'lucide-react'

const certifications = [
  {
    id: 'full-stack-developer',
    title: 'Certified Full-Stack Developer',
    level: 'Professional',
    description: 'Validates expertise in building complete web applications using modern technologies.',
    requirements: ['Complete Full-Stack Learning Path', 'Pass certification exam (80%+)', 'Complete capstone project'],
    skills: ['React', 'Next.js', 'Node.js', 'Databases', 'APIs', 'Deployment'],
    examDuration: '3 hours',
    questions: 80,
    validity: '2 years',
    price: 199,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'ai-ml-engineer',
    title: 'Certified AI/ML Engineer',
    level: 'Expert',
    description: 'Demonstrates advanced skills in machine learning, deep learning, and AI systems.',
    requirements: ['Complete AI/ML Learning Path', 'Pass certification exam (75%+)', 'Submit ML project portfolio'],
    skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'MLOps'],
    examDuration: '4 hours',
    questions: 100,
    validity: '2 years',
    price: 299,
    color: 'from-violet-500 to-purple-500'
  },
  {
    id: 'data-scientist',
    title: 'Certified Data Scientist',
    level: 'Professional',
    description: 'Proves proficiency in data analysis, visualization, and predictive modeling.',
    requirements: ['Complete Data Science Path', 'Pass certification exam (80%+)', 'Complete data analysis project'],
    skills: ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Visualization', 'Big Data'],
    examDuration: '3 hours',
    questions: 75,
    validity: '2 years',
    price: 249,
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'cloud-architect',
    title: 'Certified Cloud Architect',
    level: 'Expert',
    description: 'Validates expertise in designing and deploying cloud infrastructure.',
    requirements: ['Complete Cloud Learning Path', 'Pass certification exam (80%+)', 'Architecture case study'],
    skills: ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Terraform', 'Security'],
    examDuration: '3.5 hours',
    questions: 85,
    validity: '2 years',
    price: 279,
    color: 'from-orange-500 to-amber-500'
  },
  {
    id: 'cybersecurity-professional',
    title: 'Certified Cybersecurity Professional',
    level: 'Professional',
    description: 'Demonstrates comprehensive knowledge of security principles and practices.',
    requirements: ['Complete Security Learning Path', 'Pass certification exam (85%+)', 'Security audit project'],
    skills: ['Network Security', 'Penetration Testing', 'SIEM', 'Compliance', 'Incident Response'],
    examDuration: '3 hours',
    questions: 90,
    validity: '2 years',
    price: 259,
    color: 'from-red-500 to-rose-500'
  },
  {
    id: 'frontend-developer',
    title: 'Certified Frontend Developer',
    level: 'Associate',
    description: 'Validates skills in modern frontend development and UI/UX implementation.',
    requirements: ['Complete Frontend courses', 'Pass certification exam (75%+)', 'Portfolio review'],
    skills: ['HTML/CSS', 'JavaScript', 'React', 'TypeScript', 'Responsive Design', 'Accessibility'],
    examDuration: '2 hours',
    questions: 60,
    validity: '2 years',
    price: 149,
    color: 'from-pink-500 to-fuchsia-500'
  }
]

const features = [
  {
    icon: Shield,
    title: 'Blockchain Verified',
    description: 'Every certificate is secured on the blockchain for tamper-proof verification.'
  },
  {
    icon: Globe,
    title: 'Globally Recognized',
    description: 'Our certifications are recognized by leading tech companies worldwide.'
  },
  {
    icon: Building2,
    title: 'Industry Aligned',
    description: 'Exam content is developed with input from industry experts and employers.'
  },
  {
    icon: FileCheck,
    title: 'Instant Verification',
    description: 'Employers can verify your credentials instantly with a unique certificate ID.'
  }
]

export default function CertificationsPage() {
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
            <Link href="/tracks" className="text-sm font-medium hover:text-primary transition-colors">Learning Paths</Link>
            <Link href="/certifications" className="text-sm font-medium text-primary">Certifications</Link>
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
            <Award className="h-4 w-4" />
            Industry-Recognized Credentials
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Professional Certifications
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Earn credentials that demonstrate your expertise and help you stand out to employers.
          </p>
          <Link
            href="/verify"
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
          >
            <BadgeCheck className="mr-2 h-5 w-5" />
            Verify a Certificate
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications List */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Available Certifications</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="bg-card border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${cert.color} p-6 text-white`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-3">
                        {cert.level}
                      </span>
                      <h3 className="text-xl font-bold">{cert.title}</h3>
                    </div>
                    <Award className="h-10 w-10 text-white/80" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-muted-foreground mb-6">{cert.description}</p>

                  {/* Requirements */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Requirements</h4>
                    <ul className="space-y-2">
                      {cert.requirements.map((req, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Skills */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Skills Validated</h4>
                    <div className="flex flex-wrap gap-2">
                      {cert.skills.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-muted rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Exam Details */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg mb-6">
                    <div className="text-center">
                      <div className="text-lg font-bold">{cert.examDuration}</div>
                      <div className="text-xs text-muted-foreground">Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{cert.questions}</div>
                      <div className="text-xs text-muted-foreground">Questions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{cert.validity}</div>
                      <div className="text-xs text-muted-foreground">Validity</div>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold">${cert.price}</span>
                      <span className="text-muted-foreground text-sm"> / exam</span>
                    </div>
                    <Link
                      href={`/certifications/${cert.id}`}
                      className="inline-flex items-center h-10 px-6 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <Building2 className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Enterprise Certification Programs</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Get volume discounts and custom certification programs for your organization.
          </p>
          <Link
            href="/enterprise"
            className="inline-flex items-center h-12 px-8 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90"
          >
            Contact Sales
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
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
