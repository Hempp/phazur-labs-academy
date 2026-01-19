'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'

interface VerificationResult {
  valid: boolean
  certificate?: {
    id: string
    recipientName: string
    courseName: string
    completionDate: string
    instructorName: string
    courseHours: number
    grade: string
    skills: string[]
    issueDate: string
    organizationVerified: boolean
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

    // Simulate API call - in production, this would verify against the database
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock verification result
    if (certificateId.toUpperCase().startsWith('CERT-')) {
      setResult({
        valid: true,
        certificate: {
          id: certificateId.toUpperCase(),
          recipientName: 'John Anderson',
          courseName: 'Advanced React & Next.js Masterclass',
          completionDate: 'January 15, 2024',
          instructorName: 'Sarah Chen',
          courseHours: 42,
          grade: 'A',
          skills: ['React 18', 'Next.js 14', 'TypeScript', 'Server Components', 'App Router'],
          issueDate: '2024-01-15',
          organizationVerified: true,
        },
      })
    } else {
      setResult({
        valid: false,
        error: 'Certificate not found. Please check the ID and try again.',
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Phazur Labs</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/courses" className="text-gray-600 hover:text-gray-900 text-sm">
              Browse Courses
            </Link>
            <Link
              href="/enterprise"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
            >
              For Employers
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Certificate Verification</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Verify the authenticity of Phazur Labs Academy certificates. Enter a certificate ID below to confirm credentials.
          </p>
        </div>

        {/* Verification Form */}
        <Card className="p-8 mb-8">
          <form onSubmit={handleVerify} className="max-w-xl mx-auto">
            <label htmlFor="certificateId" className="block text-sm font-medium text-gray-700 mb-2">
              Certificate ID
            </label>
            <div className="flex gap-3">
              <input
                id="certificateId"
                type="text"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                placeholder="e.g., CERT-2024-ABC123"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg font-mono"
              />
              <button
                type="submit"
                disabled={isLoading || !certificateId.trim()}
                className="px-8 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Verifying...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Verify
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              The certificate ID can be found at the bottom of any Phazur Labs Academy certificate.
            </p>
          </form>
        </Card>

        {/* Verification Result */}
        {result && (
          <Card className={`p-8 ${result.valid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            {result.valid && result.certificate ? (
              <div>
                {/* Success Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-green-800">Certificate Verified</h2>
                    <p className="text-green-600">This is an authentic Phazur Labs Academy certificate</p>
                  </div>
                </div>

                {/* Certificate Details */}
                <div className="bg-white rounded-lg p-6 border border-green-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Certificate Holder</label>
                      <p className="text-lg font-semibold text-gray-900">{result.certificate.recipientName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Certificate ID</label>
                      <p className="text-lg font-mono text-gray-900">{result.certificate.id}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-500 block mb-1">Course Completed</label>
                      <p className="text-lg font-semibold text-gray-900">{result.certificate.courseName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Completion Date</label>
                      <p className="text-gray-900">{result.certificate.completionDate}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Course Duration</label>
                      <p className="text-gray-900">{result.certificate.courseHours} hours</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Final Grade</label>
                      <p className="text-gray-900">{result.certificate.grade}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Instructor</label>
                      <p className="text-gray-900">{result.certificate.instructorName}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-500 block mb-2">Skills Verified</label>
                      <div className="flex flex-wrap gap-2">
                        {result.certificate.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Verification Badge */}
                  <div className="mt-6 pt-6 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {result.certificate.organizationVerified && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Accredited Organization
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Verified on {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-red-800">Verification Failed</h2>
                  <p className="text-red-600">{result.error}</p>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Trust Indicators */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Blockchain Secured</h3>
            <p className="text-sm text-gray-600">
              Every certificate is recorded on blockchain for tamper-proof verification
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Industry Recognized</h3>
            <p className="text-sm text-gray-600">
              Our certifications are recognized by 500+ leading tech companies worldwide
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">50,000+ Certified</h3>
            <p className="text-sm text-gray-600">
              Join a community of professionals who have earned Phazur Labs certifications
            </p>
          </Card>
        </div>

        {/* Enterprise CTA */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">For Employers & HR Teams</h2>
              <p className="text-primary-100 max-w-xl">
                Streamline your hiring process with bulk verification, API access, and custom training programs for your team.
              </p>
            </div>
            <Link
              href="/enterprise"
              className="px-6 py-3 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-colors flex-shrink-0"
            >
              Enterprise Solutions
            </Link>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              2024 Phazur Labs Academy. All certificates are issued and verified in accordance with our accreditation standards.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700">Terms</Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">Privacy</Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-700">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
