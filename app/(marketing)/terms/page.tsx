import {
  FileText,
  CheckCircle,
  User,
  BookOpen,
  Award,
  CreditCard,
  Copyright,
  Shield,
  AlertTriangle,
  XCircle,
  Scale,
  Mail
} from 'lucide-react'

const sections = [
  {
    icon: CheckCircle,
    title: '1. Acceptance of Terms',
    content: 'By accessing or using Phazur Labs Academy, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.',
    items: []
  },
  {
    icon: FileText,
    title: '2. Description of Service',
    content: 'Phazur Labs Academy provides online educational courses, certifications, and related services. We reserve the right to modify, suspend, or discontinue any part of our services at any time.',
    items: []
  },
  {
    icon: User,
    title: '3. User Accounts',
    content: 'To access certain features, you must create an account. You are responsible for:',
    items: [
      'Maintaining the confidentiality of your account',
      'All activities that occur under your account',
      'Providing accurate and complete information',
      'Notifying us of any unauthorized use'
    ]
  },
  {
    icon: BookOpen,
    title: '4. Course Access and Completion',
    content: 'Upon purchase, you receive access to course content as specified. Course access may be:',
    items: [
      'Lifetime access for purchased courses',
      'Time-limited for subscription plans',
      'Subject to successful completion requirements for certifications'
    ]
  },
  {
    icon: Award,
    title: '5. Certificates',
    content: 'Certificates are awarded upon successful completion of course requirements. Certificates:',
    items: [
      'Are non-transferable',
      'May be verified by employers through our verification system',
      'May be revoked if obtained through fraudulent means'
    ]
  },
  {
    icon: CreditCard,
    title: '6. Payment Terms',
    content: 'All payments are processed securely. Refunds are available within 30 days of purchase if you have completed less than 20% of the course content.',
    items: []
  },
  {
    icon: Copyright,
    title: '7. Intellectual Property',
    content: 'All course content, materials, and platform features are owned by Phazur Labs Academy. You may not:',
    items: [
      'Copy, distribute, or share course content',
      'Record or screenshot video lessons',
      'Use content for commercial purposes',
      'Reverse engineer our platform'
    ]
  },
  {
    icon: Shield,
    title: '8. Code of Conduct',
    content: 'Users must:',
    items: [
      'Behave respectfully in discussions and forums',
      'Not share account credentials',
      'Not engage in cheating or plagiarism',
      'Not upload malicious content'
    ]
  },
  {
    icon: AlertTriangle,
    title: '9. Limitation of Liability',
    content: 'Phazur Labs Academy is not liable for any indirect, incidental, or consequential damages arising from your use of our services.',
    items: []
  },
  {
    icon: XCircle,
    title: '10. Termination',
    content: 'We may terminate or suspend your account for violations of these terms. You may cancel your account at any time through your account settings.',
    items: []
  },
  {
    icon: Scale,
    title: '11. Governing Law',
    content: 'These terms are governed by the laws of the State of California, United States.',
    items: []
  },
  {
    icon: Mail,
    title: '12. Contact',
    content: 'For questions about these terms, contact us at:',
    contact: {
      email: 'legal@phazurlabs.com'
    }
  }
]

export default function TermsPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-light mb-6">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: January 15, 2024</p>
          </div>

          {/* Introduction */}
          <div className="bg-surface-secondary rounded-2xl p-8 mb-12">
            <p className="text-lg text-muted-foreground">
              Welcome to Phazur Labs Academy. These Terms of Service govern your use of our platform,
              courses, and services. Please read them carefully before using our services.
            </p>
          </div>

          {/* Quick Summary */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600 mb-1">30 Days</div>
              <div className="text-sm text-muted-foreground">Refund Period</div>
            </div>
            <div className="bg-primary-light border border-primary/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">Lifetime</div>
              <div className="text-sm text-muted-foreground">Course Access</div>
            </div>
            <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-violet-600 mb-1">Verifiable</div>
              <div className="text-sm text-muted-foreground">Certificates</div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index} className="bg-background border rounded-xl p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                    <section.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
                    <p className="text-muted-foreground mb-4">{section.content}</p>

                    {section.items && section.items.length > 0 && (
                      <ul className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2 text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.contact && (
                      <div className="mt-4">
                        <a
                          href={`mailto:${section.contact.email}`}
                          className="inline-flex items-center gap-2 text-primary hover:underline"
                        >
                          <Mail className="h-4 w-4" />
                          {section.contact.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>
              By using Phazur Labs Academy, you acknowledge that you have read, understood, and agree to these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
