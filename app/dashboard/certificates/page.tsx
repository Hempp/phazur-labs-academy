'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Mock data - would come from API
const certificates = [
  {
    id: 'CERT-2024-ABC123',
    courseName: 'Advanced React & Next.js Masterclass',
    courseId: 'advanced-react',
    completionDate: 'January 15, 2024',
    instructorName: 'Sarah Chen',
    courseHours: 42,
    grade: 'A',
    skills: ['React 18', 'Next.js 14', 'TypeScript', 'Server Components', 'App Router'],
    status: 'issued',
    linkedInAdded: true,
    downloadCount: 3,
  },
  {
    id: 'CERT-2024-DEF456',
    courseName: 'Node.js Backend Development',
    courseId: 'nodejs-backend',
    completionDate: 'December 28, 2023',
    instructorName: 'Michael Torres',
    courseHours: 36,
    grade: 'A-',
    skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'Authentication'],
    status: 'issued',
    linkedInAdded: false,
    downloadCount: 1,
  },
  {
    id: 'CERT-2024-GHI789',
    courseName: 'Python for Data Science',
    courseId: 'python-data-science',
    completionDate: 'November 10, 2023',
    instructorName: 'Dr. Emily Watson',
    courseHours: 48,
    grade: 'B+',
    skills: ['Python', 'Pandas', 'NumPy', 'Machine Learning', 'Data Visualization'],
    status: 'issued',
    linkedInAdded: true,
    downloadCount: 5,
  },
]

const pendingCertifications = [
  {
    courseId: 'aws-solutions-architect',
    courseName: 'AWS Solutions Architect Certification Prep',
    progress: 78,
    lessonsRemaining: 12,
    quizzesPending: 2,
    estimatedCompletion: '2 weeks',
  },
  {
    courseId: 'docker-kubernetes',
    courseName: 'Docker & Kubernetes Fundamentals',
    progress: 45,
    lessonsRemaining: 28,
    quizzesPending: 4,
    estimatedCompletion: '4 weeks',
  },
]

export default function CertificatesPage() {
  const [selectedCert, setSelectedCert] = useState<string | null>(null)

  const handleDownload = (certId: string, format: 'pdf' | 'png') => {
    // In production, this would trigger actual download
    console.log(`Downloading ${certId} as ${format}`)
    alert(`Certificate ${certId} will download as ${format.toUpperCase()}`)
  }

  const handleAddToLinkedIn = (certId: string) => {
    // Would integrate with LinkedIn API
    const cert = certificates.find(c => c.id === certId)
    if (cert) {
      const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.courseName)}&organizationName=Phazur%20Labs%20Academy&issueYear=2024&issueMonth=1&certUrl=${encodeURIComponent(`https://verify.phazurlabs.com/certificate/${certId}`)}&certId=${certId}`
      window.open(linkedInUrl, '_blank')
    }
  }

  const handleShare = (certId: string) => {
    const shareUrl = `https://verify.phazurlabs.com/certificate/${certId}`
    navigator.clipboard.writeText(shareUrl)
    alert('Certificate verification link copied to clipboard!')
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
          <p className="text-gray-600 mt-1">View, download, and share your earned certificates</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Certificates</p>
            <p className="text-2xl font-bold text-primary-600">{certificates.length}</p>
          </div>
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-green-700">Issued</p>
              <p className="text-xl font-bold text-green-900">{certificates.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-blue-700">In Progress</p>
              <p className="text-xl font-bold text-blue-900">{pendingCertifications.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-purple-700">On LinkedIn</p>
              <p className="text-xl font-bold text-purple-900">{certificates.filter(c => c.linkedInAdded).length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-amber-700">Total Hours</p>
              <p className="text-xl font-bold text-amber-900">{certificates.reduce((acc, c) => acc + c.courseHours, 0)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Issued Certificates */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Issued Certificates</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <Card key={cert.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Certificate Preview Header */}
              <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white/70 text-sm mb-1">Certificate of Completion</p>
                      <h3 className="text-xl font-bold leading-tight">{cert.courseName}</h3>
                    </div>
                    <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                      <svg className="w-4 h-4 text-[#c9a227]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm mt-2">Issued on {cert.completionDate}</p>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">ID:</span>
                    <code className="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded">{cert.id}</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                      Grade: {cert.grade}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                      {cert.courseHours} hrs
                    </span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Skills Verified:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cert.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs font-medium rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Instructor: <strong>{cert.instructorName}</strong></span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t">
                  <Link
                    href={`/dashboard/certificates/${cert.id}`}
                    className="flex-1 py-2 px-3 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors text-center"
                  >
                    View Certificate
                  </Link>
                  <button
                    onClick={() => handleDownload(cert.id, 'pdf')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Download PDF"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleAddToLinkedIn(cert.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      cert.linkedInAdded
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    title={cert.linkedInAdded ? 'Added to LinkedIn' : 'Add to LinkedIn'}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleShare(cert.id)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Share Certificate"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Certifications in Progress */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Certifications in Progress</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {pendingCertifications.map((cert) => (
            <Card key={cert.courseId} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{cert.courseName}</h3>
                  <p className="text-sm text-gray-500 mt-1">Est. completion: {cert.estimatedCompletion}</p>
                </div>
                <Badge variant="warning">{cert.progress}%</Badge>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all"
                    style={{ width: `${cert.progress}%` }}
                  />
                </div>
              </div>

              {/* Remaining Items */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {cert.lessonsRemaining} lessons left
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {cert.quizzesPending} quizzes pending
                </span>
              </div>

              <Link
                href={`/courses/${cert.courseId}/learn`}
                className="mt-4 inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                Continue Learning
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Employer Verification Info */}
      <Card className="p-6 bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Employer Verification</h3>
            <p className="text-sm text-gray-600 mb-3">
              All Phazur Labs Academy certificates are verifiable by employers. Share your certificate ID or
              verification link with potential employers so they can confirm your skills and achievements.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/verify"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                View Verification Portal
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
              <span className="text-sm text-gray-400">|</span>
              <Link
                href="/enterprise"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                Enterprise Solutions
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
