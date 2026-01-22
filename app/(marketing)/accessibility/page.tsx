import Link from 'next/link'
import {
  Accessibility,
  Eye,
  Keyboard,
  Monitor,
  Volume2,
  MousePointer2,
  Smartphone,
  CheckCircle2,
  Mail,
  MessageSquare,
  ArrowRight
} from 'lucide-react'

const commitments = [
  {
    icon: Eye,
    title: 'Visual Accessibility',
    description: 'High contrast modes, resizable text, and screen reader compatibility for visually impaired users.',
    features: [
      'WCAG 2.1 AA compliant color contrast',
      'Scalable text up to 200%',
      'Alt text for all images',
      'Clear visual hierarchy'
    ]
  },
  {
    icon: Keyboard,
    title: 'Keyboard Navigation',
    description: 'Full keyboard accessibility for users who cannot use a mouse or prefer keyboard navigation.',
    features: [
      'Tab navigation through all interactive elements',
      'Skip-to-content links',
      'Focus indicators on all elements',
      'Keyboard shortcuts for common actions'
    ]
  },
  {
    icon: Volume2,
    title: 'Audio & Video',
    description: 'Comprehensive support for users who are deaf or hard of hearing.',
    features: [
      'Closed captions on all videos',
      'Transcripts available for audio content',
      'Visual alternatives to audio cues',
      'Adjustable playback speeds'
    ]
  },
  {
    icon: Monitor,
    title: 'Screen Readers',
    description: 'Optimized experience for assistive technologies and screen readers.',
    features: [
      'Semantic HTML structure',
      'ARIA labels and landmarks',
      'Descriptive link text',
      'Form field labels and instructions'
    ]
  },
  {
    icon: MousePointer2,
    title: 'Motor Accessibility',
    description: 'Accommodations for users with motor impairments or limited dexterity.',
    features: [
      'Large click targets (44x44 minimum)',
      'No time-limited interactions',
      'Drag-and-drop alternatives',
      'Single-click actions'
    ]
  },
  {
    icon: Smartphone,
    title: 'Mobile Accessibility',
    description: 'Fully accessible experience across all devices and screen sizes.',
    features: [
      'Touch-friendly interface',
      'Responsive design',
      'Mobile screen reader support',
      'Orientation flexibility'
    ]
  }
]

const standards = [
  { name: 'WCAG 2.1 Level AA', status: 'Compliant' },
  { name: 'Section 508', status: 'Compliant' },
  { name: 'ADA', status: 'Compliant' },
  { name: 'EN 301 549', status: 'Compliant' }
]

export default function AccessibilityPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-light mb-6">
              <Accessibility className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Accessibility Statement</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Phazur Labs Academy is committed to ensuring digital accessibility for all users,
              including people with disabilities.
            </p>
          </div>

          {/* Our Commitment */}
          <div className="bg-gradient-to-br from-primary/10 to-violet-500/10 rounded-2xl p-8 md:p-12 mb-12">
            <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Education should be accessible to everyone. We continuously work to improve the accessibility
              of our platform and ensure that all learners can access our courses, regardless of ability.
              Our goal is to provide an inclusive learning experience that meets or exceeds accessibility standards.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {standards.map((standard, index) => (
                <div key={index} className="bg-background/80 rounded-xl p-4 text-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                  <div className="font-medium text-sm">{standard.name}</div>
                  <div className="text-xs text-emerald-600">{standard.status}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Accessibility Features */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-8 text-center">Accessibility Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {commitments.map((commitment, index) => (
                <div key={index} className="bg-background border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                      <commitment.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{commitment.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{commitment.description}</p>
                      <ul className="space-y-1">
                        {commitment.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Browser & Assistive Technology */}
          <div className="bg-surface-secondary rounded-2xl p-8 mb-12">
            <h2 className="text-xl font-bold mb-4">Compatible Technologies</h2>
            <p className="text-muted-foreground mb-6">
              Our platform has been tested with the following browsers and assistive technologies:
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-3">Browsers</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Chrome (latest version)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Firefox (latest version)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Safari (latest version)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Edge (latest version)
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Screen Readers</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    NVDA (Windows)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    JAWS (Windows)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    VoiceOver (macOS/iOS)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    TalkBack (Android)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="bg-background border rounded-2xl p-8 text-center">
            <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">We Want Your Feedback</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              We are continually improving our accessibility. If you encounter any barriers or have
              suggestions for improvement, please let us know.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:accessibility@phazurlabs.com"
                className="inline-flex items-center h-12 px-6 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
              >
                <Mail className="h-5 w-5 mr-2" />
                Email Accessibility Team
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center h-12 px-6 border rounded-md font-medium hover:bg-muted"
              >
                Contact Form
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>Last reviewed: January 15, 2024</p>
            <p className="mt-2">
              This statement was created with guidance from the{' '}
              <a
                href="https://www.w3.org/WAI/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                W3C Web Accessibility Initiative
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
