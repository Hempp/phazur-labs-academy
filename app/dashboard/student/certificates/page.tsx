'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Award, Download, Share2, ExternalLink, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Certificate {
  id: string
  courseTitle: string
  courseSlug: string
  studentName: string
  certificateNumber: string
  issueDate: string
  grade: string
  verificationUrl: string
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCertificates() {
      try {
        const response = await fetch('/api/student/certificates')
        if (response.ok) {
          const data = await response.json()
          setCertificates(data.certificates || [])
        }
      } catch (error) {
        console.error('Failed to fetch certificates:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCertificates()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Certificates</h1>
        <p className="text-muted-foreground">Your earned certificates and achievements</p>
      </div>

      {certificates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No certificates yet</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Complete courses to earn certificates. Your achievements will appear here once you finish a course.
            </p>
            <Link
              href="/courses"
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse Courses
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {certificates.map(cert => (
            <Card key={cert.id} className="overflow-hidden">
              {/* Certificate Preview */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 border-b">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <Award className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      Certificate of Completion
                    </p>
                    <h3 className="text-lg font-bold mt-2">{cert.courseTitle}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Awarded to {cert.studentName}
                    </p>
                  </div>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(cert.issueDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <Badge variant="secondary">{cert.grade}</Badge>
                </div>

                <div className="text-xs text-muted-foreground mb-4">
                  Certificate ID: {cert.certificateNumber}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/verify/${cert.certificateNumber}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-lg hover:bg-muted transition-colors text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View
                  </Link>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-lg hover:bg-muted transition-colors text-sm">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                  <button className="flex items-center justify-center gap-2 px-3 py-2 border rounded-lg hover:bg-muted transition-colors text-sm">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
