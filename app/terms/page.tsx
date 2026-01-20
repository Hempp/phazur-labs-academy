import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 15, 2024</p>

          <div className="prose prose-lg dark:prose-invert">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using Phazur Labs Academy, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

            <h2>2. Description of Service</h2>
            <p>Phazur Labs Academy provides online educational courses, certifications, and related services. We reserve the right to modify, suspend, or discontinue any part of our services at any time.</p>

            <h2>3. User Accounts</h2>
            <p>To access certain features, you must create an account. You are responsible for:</p>
            <ul>
              <li>Maintaining the confidentiality of your account</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information</li>
              <li>Notifying us of any unauthorized use</li>
            </ul>

            <h2>4. Course Access and Completion</h2>
            <p>Upon purchase, you receive access to course content as specified. Course access may be:</p>
            <ul>
              <li>Lifetime access for purchased courses</li>
              <li>Time-limited for subscription plans</li>
              <li>Subject to successful completion requirements for certifications</li>
            </ul>

            <h2>5. Certificates</h2>
            <p>Certificates are awarded upon successful completion of course requirements. Certificates:</p>
            <ul>
              <li>Are non-transferable</li>
              <li>May be verified by employers through our verification system</li>
              <li>May be revoked if obtained through fraudulent means</li>
            </ul>

            <h2>6. Payment Terms</h2>
            <p>All payments are processed securely. Refunds are available within 30 days of purchase if you have completed less than 20% of the course content.</p>

            <h2>7. Intellectual Property</h2>
            <p>All course content, materials, and platform features are owned by Phazur Labs Academy. You may not:</p>
            <ul>
              <li>Copy, distribute, or share course content</li>
              <li>Record or screenshot video lessons</li>
              <li>Use content for commercial purposes</li>
              <li>Reverse engineer our platform</li>
            </ul>

            <h2>8. Code of Conduct</h2>
            <p>Users must:</p>
            <ul>
              <li>Behave respectfully in discussions and forums</li>
              <li>Not share account credentials</li>
              <li>Not engage in cheating or plagiarism</li>
              <li>Not upload malicious content</li>
            </ul>

            <h2>9. Limitation of Liability</h2>
            <p>Phazur Labs Academy is not liable for any indirect, incidental, or consequential damages arising from your use of our services.</p>

            <h2>10. Termination</h2>
            <p>We may terminate or suspend your account for violations of these terms. You may cancel your account at any time through your account settings.</p>

            <h2>11. Governing Law</h2>
            <p>These terms are governed by the laws of the State of California, United States.</p>

            <h2>12. Contact</h2>
            <p>For questions about these terms, contact us at legal@phazurlabs.com</p>
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
