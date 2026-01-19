'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { CertificateTemplate } from '@/components/certificate'
import { Card } from '@/components/ui/card'

// Mock data - would come from API
const certificateData = {
  id: 'CERT-2024-ABC123',
  recipientName: 'John Anderson',
  courseName: 'Advanced React & Next.js Masterclass',
  courseSlug: 'advanced-react',
  completionDate: 'January 15, 2024',
  issueDate: '2024-01-15T14:30:00Z',
  instructorName: 'Sarah Chen',
  courseHours: 42,
  grade: 'A',
  score: 94,
  skills: ['React 18', 'Next.js 14', 'TypeScript', 'Server Components', 'App Router', 'Performance Optimization'],
  verificationUrl: 'https://verify.phazurlabs.com/certificate/CERT-2024-ABC123',
  blockchainHash: '0x7f3a8b9c2d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
  linkedInAdded: true,
  downloadCount: 3,
  shareCount: 7,
  verificationCount: 12,
  metadata: {
    lessonsCompleted: 156,
    quizzesPassed: 24,
    projectsSubmitted: 6,
    timeSpent: '47h 23m',
    startDate: 'November 1, 2023',
  },
}

export default function CertificateDetailPage() {
  const params = useParams()
  const certificateRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [shareMenuOpen, setShareMenuOpen] = useState(false)

  const handleDownload = async (format: 'pdf' | 'png') => {
    setIsDownloading(true)
    // In production, this would use html2canvas + jsPDF or server-side rendering
    setTimeout(() => {
      alert(`Certificate will download as ${format.toUpperCase()}`)
      setIsDownloading(false)
    }, 1500)
  }

  const handleShare = (platform: string) => {
    const shareUrl = certificateData.verificationUrl
    const text = `I just earned my ${certificateData.courseName} certificate from Phazur Labs Academy!`

    const urls: Record<string, string> = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      email: `mailto:?subject=${encodeURIComponent(`My ${certificateData.courseName} Certificate`)}&body=${encodeURIComponent(`${text}\n\nVerify here: ${shareUrl}`)}`,
    }

    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl)
      alert('Verification link copied to clipboard!')
    } else {
      window.open(urls[platform], '_blank')
    }
    setShareMenuOpen(false)
  }

  const handleAddToLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(certificateData.courseName)}&organizationName=Phazur%20Labs%20Academy&issueYear=2024&issueMonth=1&certUrl=${encodeURIComponent(certificateData.verificationUrl)}&certId=${certificateData.id}`
    window.open(linkedInUrl, '_blank')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/dashboard" className="hover:text-primary-600">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/certificates" className="hover:text-primary-600">Certificates</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{certificateData.id}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{certificateData.courseName}</h1>
          <p className="text-gray-600 mt-1">Certificate ID: {certificateData.id}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Share Button */}
          <div className="relative">
            <button
              onClick={() => setShareMenuOpen(!shareMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
            {shareMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-10">
                <div className="p-2">
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 rounded-lg"
                  >
                    <svg className="w-5 h-5 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    Share on LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Share on X
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 rounded-lg"
                  >
                    <svg className="w-5 h-5 text-[#1877f2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Share on Facebook
                  </button>
                  <button
                    onClick={() => handleShare('email')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 rounded-lg"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={() => handleShare('copy')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 rounded-lg"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy Link
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Download Button */}
          <div className="flex items-center">
            <button
              onClick={() => handleDownload('pdf')}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-l-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {isDownloading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
              Download PDF
            </button>
            <button
              onClick={() => handleDownload('png')}
              disabled={isDownloading}
              className="px-3 py-2 bg-primary-700 text-white rounded-r-lg hover:bg-primary-800 transition-colors border-l border-primary-500 disabled:opacity-50"
            >
              PNG
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Certificate Preview */}
        <div className="xl:col-span-2">
          <Card className="p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Certificate Preview</h2>
              <span className="flex items-center gap-1 text-sm text-green-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Verified Certificate
              </span>
            </div>

            {/* Certificate Scaled Preview */}
            <div className="bg-gray-100 rounded-lg p-4 overflow-auto">
              <div className="transform scale-[0.6] origin-top-left" style={{ width: '1056px', height: '490px' }}>
                <CertificateTemplate
                  ref={certificateRef}
                  recipientName={certificateData.recipientName}
                  courseName={certificateData.courseName}
                  completionDate={certificateData.completionDate}
                  certificateId={certificateData.id}
                  instructorName={certificateData.instructorName}
                  courseHours={certificateData.courseHours}
                  skills={certificateData.skills}
                  grade={certificateData.grade}
                />
              </div>
            </div>
          </Card>

          {/* Verification Section */}
          <Card className="p-6 mt-6">
            <h2 className="font-semibold text-gray-900 mb-4">Verification Details</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-green-900">Certificate Verified</p>
                    <p className="text-sm text-green-700">This certificate is authentic and verifiable</p>
                  </div>
                </div>
                <span className="text-sm text-green-600">{certificateData.verificationCount} verifications</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Verification URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={certificateData.verificationUrl}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm font-mono"
                    />
                    <button
                      onClick={() => handleShare('copy')}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500 block mb-1">Blockchain Hash</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={certificateData.blockchainHash}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm font-mono truncate"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(certificateData.blockchainHash)
                        alert('Hash copied!')
                      }}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* LinkedIn Integration */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Add to LinkedIn</h3>
            <p className="text-sm text-gray-600 mb-4">
              Showcase your achievement on your LinkedIn profile to boost your professional credibility.
            </p>
            <button
              onClick={handleAddToLinkedIn}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0077b5] text-white rounded-lg hover:bg-[#006399] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              Add to Profile
            </button>
            {certificateData.linkedInAdded && (
              <p className="text-xs text-green-600 mt-2 text-center">Added to LinkedIn</p>
            )}
          </Card>

          {/* Certificate Stats */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Certificate Statistics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Downloads</span>
                <span className="font-medium">{certificateData.downloadCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Shares</span>
                <span className="font-medium">{certificateData.shareCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Verifications</span>
                <span className="font-medium">{certificateData.verificationCount}</span>
              </div>
            </div>
          </Card>

          {/* Course Completion Details */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Completion Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Start Date</span>
                <span className="text-sm font-medium">{certificateData.metadata.startDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completion Date</span>
                <span className="text-sm font-medium">{certificateData.completionDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Lessons Completed</span>
                <span className="text-sm font-medium">{certificateData.metadata.lessonsCompleted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Quizzes Passed</span>
                <span className="text-sm font-medium">{certificateData.metadata.quizzesPassed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Projects Submitted</span>
                <span className="text-sm font-medium">{certificateData.metadata.projectsSubmitted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Time Spent</span>
                <span className="text-sm font-medium">{certificateData.metadata.timeSpent}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Final Score</span>
                <span className="text-sm font-medium text-primary-600">{certificateData.score}%</span>
              </div>
            </div>
          </Card>

          {/* Skills Earned */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Skills Earned</h3>
            <div className="flex flex-wrap gap-2">
              {certificateData.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>

          {/* Related Actions */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Related Actions</h3>
            <div className="space-y-2">
              <Link
                href={`/courses/${certificateData.courseSlug}`}
                className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-sm">View Course</span>
              </Link>
              <Link
                href={`/courses/${certificateData.courseSlug}/review`}
                className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span className="text-sm">Leave a Review</span>
              </Link>
              <Link
                href="/dashboard/certificates"
                className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm">All Certificates</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
