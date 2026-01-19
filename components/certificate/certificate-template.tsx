'use client'

import { forwardRef } from 'react'

interface CertificateTemplateProps {
  recipientName: string
  courseName: string
  completionDate: string
  certificateId: string
  instructorName: string
  courseHours: number
  skills?: string[]
  grade?: string
}

export const CertificateTemplate = forwardRef<HTMLDivElement, CertificateTemplateProps>(
  ({ recipientName, courseName, completionDate, certificateId, instructorName, courseHours, skills = [], grade }, ref) => {
    return (
      <div
        ref={ref}
        className="w-[1056px] h-[816px] bg-white relative overflow-hidden"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 35px,
              #1e3a5f 35px,
              #1e3a5f 70px
            )`
          }} />
        </div>

        {/* Border Frame */}
        <div className="absolute inset-4 border-4 border-[#1e3a5f]" />
        <div className="absolute inset-6 border border-[#c9a227]" />
        <div className="absolute inset-8 border border-[#1e3a5f]/30" />

        {/* Corner Decorations */}
        {[
          'top-12 left-12',
          'top-12 right-12 rotate-90',
          'bottom-12 right-12 rotate-180',
          'bottom-12 left-12 -rotate-90'
        ].map((position, i) => (
          <div key={i} className={`absolute ${position} w-16 h-16`}>
            <svg viewBox="0 0 64 64" className="w-full h-full text-[#c9a227]">
              <path
                d="M0 0 L64 0 L64 8 L8 8 L8 64 L0 64 Z"
                fill="currentColor"
              />
              <circle cx="24" cy="24" r="4" fill="currentColor" />
            </svg>
          </div>
        ))}

        {/* Content */}
        <div className="absolute inset-16 flex flex-col items-center justify-between py-8">
          {/* Header */}
          <div className="text-center">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-2xl font-bold text-[#1e3a5f] tracking-wide">PHAZUR LABS</span>
            </div>

            <h1 className="text-5xl font-bold text-[#1e3a5f] tracking-widest mb-2">
              CERTIFICATE
            </h1>
            <p className="text-xl text-[#c9a227] tracking-[0.3em] uppercase">
              of Completion
            </p>
          </div>

          {/* Recipient */}
          <div className="text-center flex-1 flex flex-col justify-center">
            <p className="text-gray-600 text-lg mb-2">This is to certify that</p>
            <h2 className="text-4xl font-bold text-[#1e3a5f] mb-4 py-2 border-b-2 border-[#c9a227] inline-block px-8">
              {recipientName}
            </h2>
            <p className="text-gray-600 text-lg mb-2">has successfully completed the course</p>
            <h3 className="text-2xl font-semibold text-[#2d5a8f] mb-4 max-w-xl">
              {courseName}
            </h3>

            {/* Course Details */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {courseHours} Hours
              </span>
              {grade && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Grade: {grade}
                </span>
              )}
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {completionDate}
              </span>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Skills Acquired:</p>
                <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                  {skills.slice(0, 6).map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#1e3a5f]/10 text-[#1e3a5f] rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="w-full">
            <div className="flex justify-between items-end px-8">
              {/* Instructor Signature */}
              <div className="text-center">
                <div className="w-48 border-b border-gray-400 mb-2 pb-4">
                  <span className="font-script text-2xl text-gray-700 italic">{instructorName}</span>
                </div>
                <p className="text-sm text-gray-600">Course Instructor</p>
              </div>

              {/* Seal */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border-4 border-[#c9a227] flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f]">
                  <div className="text-center text-white">
                    <svg className="w-8 h-8 mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-[10px] font-bold tracking-wider">VERIFIED</span>
                  </div>
                </div>
              </div>

              {/* Academy Director */}
              <div className="text-center">
                <div className="w-48 border-b border-gray-400 mb-2 pb-4">
                  <span className="font-script text-2xl text-gray-700 italic">Academy Director</span>
                </div>
                <p className="text-sm text-gray-600">Phazur Labs Academy</p>
              </div>
            </div>

            {/* Certificate ID */}
            <div className="text-center mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Certificate ID: <span className="font-mono font-semibold text-[#1e3a5f]">{certificateId}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Verify at: verify.phazurlabs.com/certificate/{certificateId}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

CertificateTemplate.displayName = 'CertificateTemplate'
