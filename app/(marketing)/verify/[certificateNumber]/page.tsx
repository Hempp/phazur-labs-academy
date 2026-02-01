'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ShieldCheck,
  Loader2,
  CheckCircle2,
  XCircle,
  Award,
  BadgeCheck,
  Calendar,
  GraduationCap,
  User,
  ArrowLeft,
  Share2,
  Copy,
  Check
} from 'lucide-react'

interface CertificateData {
  certificateNumber: string
  courseTitle: string
  studentName: string
  issueDate: string
  verificationUrl: string
  grade: string
}

interface VerificationResult {
  valid: boolean
  certificate?: CertificateData
  error?: string
}

export default function CertificateVerifyPage() {
  const params = useParams()
  const certificateNumber = params.certificateNumber as string

  const [isLoading, setIsLoading] = useState(true)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function verifyCertificate() {
      try {
        const response = await fetch(`/api/certificates?verify=${encodeURIComponent(certificateNumber)}`)
        const data = await response.json()

        if (data.valid && data.certificate) {
          setResult({
            valid: true,
            certificate: data.certificate,
          })
        } else {
          setResult({
            valid: false,
            error: data.error || 'Certificate not found.',
          })
        }
      } catch (error) {
        console.error('Verification error:', error)
        setResult({
          valid: false,
          error: 'An error occurred while verifying the certificate.',
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (certificateNumber) {
      verifyCertificate()
    }
  }, [certificateNumber])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleShare = async () => {
    if (navigator.share && result?.certificate) {
      try {
        await navigator.share({
          title: `Certificate - ${result.certificate.courseTitle}`,
          text: `${result.certificate.studentName} completed ${result.certificate.courseTitle} at Course Training`,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled or share failed, fall back to copy
        handleCopyLink()
      }
    } else {
      handleCopyLink()
    }
  }

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-light mb-6">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Verifying Certificate</h1>
            <p className="text-muted-foreground">
              Please wait while we verify certificate <span className="font-mono">{certificateNumber}</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Back Link */}
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Verification
          </Link>

          {result?.valid && result.certificate ? (
            <>
              {/* Success Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-6">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                </div>
                <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">
                  Certificate Verified
                </h1>
                <p className="text-emerald-600 dark:text-emerald-400">
                  This is an authentic Course Training certificate
                </p>
              </div>

              {/* Certificate Card */}
              <div className="bg-background border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-violet-600 px-6 py-4 text-white">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6" />
                    <span className="font-semibold">Course Training Certificate</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <User className="h-4 w-4" />
                        Certificate Holder
                      </div>
                      <p className="text-xl font-semibold">{result.certificate.studentName}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Award className="h-4 w-4" />
                        Certificate ID
                      </div>
                      <p className="text-lg font-mono text-primary">{result.certificate.certificateNumber}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <GraduationCap className="h-4 w-4" />
                      Course Completed
                    </div>
                    <p className="text-xl font-semibold">{result.certificate.courseTitle}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Calendar className="h-4 w-4" />
                        Issue Date
                      </div>
                      <p className="font-medium">
                        {new Date(result.certificate.issueDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Grade</div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-semibold">
                        {result.certificate.grade || 'Pass'}
                      </span>
                    </div>
                  </div>

                  {/* Verification Badge */}
                  <div className="pt-6 border-t flex items-center justify-between flex-wrap gap-4">
                    <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
                      <BadgeCheck className="h-4 w-4" />
                      Verified Credential
                    </span>
                    <p className="text-sm text-muted-foreground">
                      Verified on {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Share Actions */}
              <div className="mt-6 flex gap-3 justify-center">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Error State */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
                  <XCircle className="h-10 w-10 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold text-red-800 dark:text-red-200 mb-2">
                  Verification Failed
                </h1>
                <p className="text-red-600 dark:text-red-400 mb-2">
                  {result?.error || 'Certificate not found.'}
                </p>
                <p className="text-sm text-muted-foreground font-mono">
                  Certificate ID: {certificateNumber}
                </p>
              </div>

              <div className="bg-background border rounded-2xl p-8 text-center">
                <h2 className="font-semibold mb-4">What you can do:</h2>
                <ul className="text-left text-muted-foreground space-y-2 max-w-md mx-auto mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">1.</span>
                    Double-check the certificate ID for typos
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">2.</span>
                    Make sure the certificate was issued by Course Training
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">3.</span>
                    Contact support if you believe this is an error
                  </li>
                </ul>
                <Link
                  href="/verify"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Try Another Certificate
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
