import Link from 'next/link'
import { GraduationCap, CheckCircle2 } from 'lucide-react'

export default function AccessibilityPage() {
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
          <h1 className="text-4xl font-bold mb-4">Accessibility Statement</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 15, 2024</p>

          <div className="prose prose-lg dark:prose-invert">
            <h2>Our Commitment</h2>
            <p>Phazur Labs Academy is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards.</p>

            <h2>Conformance Status</h2>
            <p>We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible to people with disabilities.</p>

            <h2>Accessibility Features</h2>
            <p>Our platform includes the following accessibility features:</p>

            <div className="not-prose my-6 space-y-3">
              {[
                'Keyboard navigation support throughout the platform',
                'Screen reader compatible content and navigation',
                'Captions and transcripts for all video content',
                'Adjustable text size and high contrast mode',
                'Alternative text for images and graphics',
                'Clear and consistent navigation structure',
                'Focus indicators for interactive elements',
                'Descriptive link text',
                'Form labels and error messages',
                'Sufficient color contrast ratios'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <h2>Video Accessibility</h2>
            <p>All our video courses include:</p>
            <ul>
              <li>Closed captions in English</li>
              <li>Transcripts available for download</li>
              <li>Playback speed controls</li>
              <li>Keyboard-accessible video player</li>
            </ul>

            <h2>Assistive Technologies</h2>
            <p>Our platform is designed to be compatible with:</p>
            <ul>
              <li>Screen readers (JAWS, NVDA, VoiceOver)</li>
              <li>Screen magnification software</li>
              <li>Speech recognition software</li>
              <li>Keyboard-only navigation</li>
            </ul>

            <h2>Known Limitations</h2>
            <p>While we strive for full accessibility, some third-party content or legacy materials may have limitations. We are actively working to address these issues.</p>

            <h2>Feedback</h2>
            <p>We welcome your feedback on the accessibility of Phazur Labs Academy. Please let us know if you encounter accessibility barriers:</p>
            <ul>
              <li>Email: accessibility@phazurlabs.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Contact form: <Link href="/contact" className="text-primary">Contact Us</Link></li>
            </ul>

            <h2>Response Time</h2>
            <p>We aim to respond to accessibility feedback within 2 business days and resolve issues within 10 business days when possible.</p>

            <h2>Continuous Improvement</h2>
            <p>We regularly review our platform for accessibility and conduct audits with both automated tools and manual testing by users with disabilities.</p>
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
