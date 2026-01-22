'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Building2,
  HelpCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'

const contactReasons = [
  { id: 'general', label: 'General Inquiry', icon: MessageSquare },
  { id: 'support', label: 'Technical Support', icon: HelpCircle },
  { id: 'enterprise', label: 'Enterprise Sales', icon: Building2 },
  { id: 'partnership', label: 'Partnership', icon: Mail }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    reason: 'general',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have a question or want to learn more? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Email</div>
                      <a href="mailto:hello@phazurlabs.com" className="text-muted-foreground hover:text-primary">
                        hello@phazurlabs.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Phone</div>
                      <a href="tel:+1-555-123-4567" className="text-muted-foreground hover:text-primary">
                        +1 (555) 123-4567
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Address</div>
                      <div className="text-muted-foreground">
                        123 Innovation Drive<br />
                        San Francisco, CA 94105
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-surface-secondary rounded-xl">
                <h3 className="font-semibold mb-2">Enterprise Inquiries</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Looking for team or enterprise solutions? Our sales team is ready to help.
                </p>
                <Link
                  href="/enterprise"
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Learn about Enterprise &rarr;
                </Link>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              {isSubmitted ? (
                <div className="bg-background border rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                  <p className="text-muted-foreground mb-6">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false)
                      setFormData({ name: '', email: '', company: '', reason: 'general', message: '' })
                    }}
                    className="text-primary font-medium hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-background border rounded-2xl p-8">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Company (Optional)</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full h-11 px-4 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your company"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Reason for Contact *</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {contactReasons.map((reason) => (
                        <button
                          key={reason.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, reason: reason.id })}
                          className={cn(
                            'p-3 rounded-lg border text-center transition-colors',
                            formData.reason === reason.id
                              ? 'border-primary bg-primary-light text-primary'
                              : 'hover:bg-muted'
                          )}
                        >
                          <reason.icon className="h-5 w-5 mx-auto mb-1" />
                          <span className="text-xs font-medium">{reason.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
