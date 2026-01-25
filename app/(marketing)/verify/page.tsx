'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  Lock,
  Award,
  Users,
  ArrowRight,
  BadgeCheck,
  Calendar,
  GraduationCap,
  User
} from 'lucide-react'

interface VerificationResult {
  valid: boolean
  certificate?: {
    certificateNumber: string
    courseTitle: string
    studentName: string
    issueDate: string
    verificationUrl: string
    grade: string
  }
  error?: string
}

export default function VerifyPage() {
  const [certificateId, setCertificateId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!certificateId.trim()) return

    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch(`/api/certificates?verify=${encodeURIComponent(certificateId.trim())}`)
      const data = await response.json()

      if (data.valid && data.certificate) {
        setResult({
          valid: true,
          certificate: data.certificate,
        })
      } else {
        setResult({
          valid: false,
          error: data.error || 'Certificate not found. Please check the ID and try again.',
        })
      }
    } catch (error) {
      console.error('Verification error:', error)
      setResult({
        valid: false,
        error: 'An error occurred while verifying. Please try again.',
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-light mb-6">
              <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Certificate Verification</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Verify the authenticity of Phazur Labs Academy certificates. Enter a certificate ID below to confirm credentials.
            </p>
          </div>

          {/* Verification Form */}
          <div className="bg-background border rounded-2xl p-8 mb-8">
            <form onSubmit={handleVerify} className="max-w-xl mx-auto">
              <label htmlFor="certificateId" className="block text-sm font-medium mb-2">
                Certificate ID
              </label>
              <div className="flex gap-3">
                <input
                  id="certificateId"
                  type="text"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  placeholder="e.g., PHZR-1234567890-ABC123"
                  className="flex-1 h-12 px-4 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-lg font-mono"
                />
                <button
                  type="submit"
                  disabled={isLoading || !certificateId.trim()}
                  className="h-12 px-8 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5" />
                      Verify
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                The certificate ID can be found at the bottom of any Phazur Labs Academy certificate.
              </p>
            </form>
          </div>

          {/* Verification Result */}
          {result && (
            <div className={`rounded-2xl p-8 mb-8 border ${
              result.valid
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}>
              {result.valid && result.certificate ? (
                <div>
                  {/* Success Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">Certificate Verified</h2>
                      <p className="text-emerald-600 dark:text-emerald-400">This is an authentic Phazur Labs Academy certificate</p>
                    </div>
                  </div>

                  {/* Certificate Details */}
                  <div className="bg-background rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <User className="h-4 w-4" />
                          Certificate Holder
                        </div>
                        <p className="text-lg font-semibold">{result.certificate.studentName}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Award className="h-4 w-4" />
                          Certificate ID
                        </div>
                        <p className="text-lg font-mono">{result.certificate.certificateNumber}</p>
                      </div>
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <GraduationCap className="h-4 w-4" />
                          Course Completed
                        </div>
                        <p className="text-lg font-semibold">{result.certificate.courseTitle}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Calendar className="h-4 w-4" />
                          Issue Date
                        </div>
                        <p>{new Date(result.certificate.issueDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground block mb-1">Final Grade</label>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-semibold">
                          {result.certificate.grade || 'Pass'}
                        </span>
                      </div>
                    </div>

                    {/* Verification Badge */}
                    <div className="mt-6 pt-6 border-t flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
                          <BadgeCheck className="h-4 w-4" />
                          Phazur Labs Academy
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Verified on {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-red-800 dark:text-red-200">Verification Failed</h2>
                    <p className="text-red-600 dark:text-red-400">{result.error}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-background border rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mx-auto mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Blockchain Secured</h3>
              <p className="text-sm text-muted-foreground">
                Every certificate is recorded on blockchain for tamper-proof verification
              </p>
            </div>

            <div className="bg-background border rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Industry Recognized</h3>
              <p className="text-sm text-muted-foreground">
                Our certifications are recognized by 500+ leading tech companies worldwide
              </p>
            </div>

            <div className="bg-background border rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">50,000+ Certified</h3>
              <p className="text-sm text-muted-foreground">
                Join a community of professionals who have earned Phazur Labs certifications
              </p>
            </div>
          </div>

          {/* Enterprise CTA */}
          <div className="bg-gradient-to-r from-primary to-violet-600 rounded-2xl p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">For Employers & HR Teams</h2>
                <p className="text-white/80 max-w-xl">
                  Streamline your hiring process with bulk verification, API access, and custom training programs for your team.
                </p>
              </div>
              <Link
                href="/enterprise"
                className="inline-flex items-center h-12 px-6 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors flex-shrink-0"
              >
                Enterprise Solutions
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
