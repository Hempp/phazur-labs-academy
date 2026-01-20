import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">Phazur Labs Academy</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium hover:text-primary">Sign In</Link>
            <Link href="/auth/register" className="h-10 px-4 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 flex items-center">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 15, 2024</p>

          <div className="prose prose-lg dark:prose-invert">
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, enroll in a course, or contact us for support.</p>
            <ul>
              <li>Account information (name, email, password)</li>
              <li>Payment information (processed securely by Stripe)</li>
              <li>Course progress and completion data</li>
              <li>Communication preferences</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and support messages</li>
              <li>Personalize your learning experience</li>
              <li>Monitor and analyze trends and usage</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
            <ul>
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>With service providers who assist our operations</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information, including encryption, secure servers, and regular security audits.</p>

            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>

            <h2>6. Cookies</h2>
            <p>We use cookies and similar technologies to enhance your experience, analyze usage, and assist in our marketing efforts. You can manage cookie preferences through your browser settings.</p>

            <h2>7. Children&apos;s Privacy</h2>
            <p>Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>

            <h2>8. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

            <h2>9. Contact Us</h2>
            <p>If you have questions about this privacy policy, please contact us at:</p>
            <p>Email: privacy@phazurlabs.com<br />Address: 123 Innovation Drive, San Francisco, CA 94105</p>
          </div>
        </div>
      </div>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Phazur Labs Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
