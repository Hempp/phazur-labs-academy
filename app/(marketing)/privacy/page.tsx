import { Shield, Lock, Eye, UserCheck, Cookie, Bell, Baby, FileText, Mail } from 'lucide-react'

const sections = [
  {
    icon: Eye,
    title: '1. Information We Collect',
    content: 'We collect information you provide directly to us, such as when you create an account, enroll in a course, or contact us for support.',
    items: [
      'Account information (name, email, password)',
      'Payment information (processed securely by Stripe)',
      'Course progress and completion data',
      'Communication preferences'
    ]
  },
  {
    icon: FileText,
    title: '2. How We Use Your Information',
    content: 'We use the information we collect to:',
    items: [
      'Provide, maintain, and improve our services',
      'Process transactions and send related information',
      'Send technical notices, updates, and support messages',
      'Personalize your learning experience',
      'Monitor and analyze trends and usage'
    ]
  },
  {
    icon: UserCheck,
    title: '3. Information Sharing',
    content: 'We do not sell, trade, or otherwise transfer your personal information to third parties except:',
    items: [
      'With your consent',
      'To comply with legal obligations',
      'To protect our rights and safety',
      'With service providers who assist our operations'
    ]
  },
  {
    icon: Lock,
    title: '4. Data Security',
    content: 'We implement appropriate security measures to protect your personal information, including encryption, secure servers, and regular security audits.',
    items: []
  },
  {
    icon: Shield,
    title: '5. Your Rights',
    content: 'You have the right to:',
    items: [
      'Access your personal data',
      'Correct inaccurate data',
      'Request deletion of your data',
      'Export your data',
      'Opt-out of marketing communications'
    ]
  },
  {
    icon: Cookie,
    title: '6. Cookies',
    content: 'We use cookies and similar technologies to enhance your experience, analyze usage, and assist in our marketing efforts. You can manage cookie preferences through your browser settings.',
    items: []
  },
  {
    icon: Baby,
    title: "7. Children's Privacy",
    content: 'Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.',
    items: []
  },
  {
    icon: Bell,
    title: '8. Changes to This Policy',
    content: 'We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.',
    items: []
  },
  {
    icon: Mail,
    title: '9. Contact Us',
    content: 'If you have questions about this privacy policy, please contact us at:',
    contact: {
      email: 'privacy@phazurlabs.com',
      address: '123 Innovation Drive, San Francisco, CA 94105'
    }
  }
]

export default function PrivacyPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-light mb-6">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: January 15, 2024</p>
          </div>

          {/* Introduction */}
          <div className="bg-surface-secondary rounded-2xl p-8 mb-12">
            <p className="text-lg text-muted-foreground">
              At Phazur Labs Academy, we take your privacy seriously. This policy describes how we collect,
              use, and protect your personal information when you use our platform and services.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
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
                      <div className="mt-4 p-4 bg-surface-secondary rounded-lg">
                        <p className="text-sm">
                          <strong>Email:</strong>{' '}
                          <a href={`mailto:${section.contact.email}`} className="text-primary hover:underline">
                            {section.contact.email}
                          </a>
                        </p>
                        <p className="text-sm mt-1">
                          <strong>Address:</strong> {section.contact.address}
                        </p>
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
              By using Phazur Labs Academy, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
