import Link from 'next/link'
import { GraduationCap, Facebook, Twitter, Linkedin, Youtube, Instagram } from 'lucide-react'

const footerLinks = {
  coursera: {
    title: 'Phazur Labs',
    links: [
      { label: 'About', href: '/about' },
      { label: 'What We Offer', href: '/courses' },
      { label: 'Leadership', href: '/about#team' },
      { label: 'Careers', href: '/careers' },
      { label: 'Catalog', href: '/courses' },
      { label: 'Affiliates', href: '/affiliates' },
    ],
  },
  community: {
    title: 'Community',
    links: [
      { label: 'Learners', href: '/community' },
      { label: 'Partners', href: '/partners' },
      { label: 'Developers', href: '/developers' },
      { label: 'Beta Testers', href: '/beta' },
      { label: 'Blog', href: '/blog' },
      { label: 'Tech Blog', href: '/tech-blog' },
    ],
  },
  more: {
    title: 'More',
    links: [
      { label: 'Press', href: '/press' },
      { label: 'Investors', href: '/investors' },
      { label: 'Terms', href: '/terms' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Help', href: '/help' },
      { label: 'Accessibility', href: '/accessibility' },
      { label: 'Contact', href: '/contact' },
    ],
  },
}

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/phazurlabs', label: 'Facebook' },
  { icon: Linkedin, href: 'https://linkedin.com/company/phazurlabs', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://twitter.com/phazurlabs', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com/phazurlabs', label: 'YouTube' },
  { icon: Instagram, href: 'https://instagram.com/phazurlabs', label: 'Instagram' },
]

export function Footer() {
  return (
    <footer className="bg-surface-tertiary border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="font-bold text-lg text-foreground">
                Phazur Labs
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Learn without limits. Build your future with industry-recognized certificates.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((column) => (
            <div key={column.title}>
              <h3 className="font-semibold text-foreground mb-4">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Phazur Labs Academy. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
