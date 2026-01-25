'use client'

import { useState, useRef } from 'react'
import {
  UserPlus,
  Mail,
  Upload,
  FileSpreadsheet,
  X,
  Check,
  AlertCircle,
  Send,
  Clock,
  ChevronDown,
  Plus,
  Trash2,
  Copy,
  Link,
  Users,
  BookOpen,
  Download
} from 'lucide-react'
import toast from 'react-hot-toast'

// Mock courses for enrollment
const courses = [
  { id: 1, title: 'Advanced React Patterns', enrolled: 156 },
  { id: 2, title: 'Node.js Masterclass', enrolled: 234 },
  { id: 3, title: 'TypeScript Deep Dive', enrolled: 189 },
  { id: 4, title: 'Next.js Full Stack', enrolled: 312 },
  { id: 5, title: 'GraphQL Essentials', enrolled: 98 }
]

// Mock invitation history
const invitationHistory = [
  { id: 1, email: 'john@company.com', status: 'accepted', course: 'Advanced React Patterns', date: '2024-01-15', acceptedDate: '2024-01-16' },
  { id: 2, email: 'sarah@startup.io', status: 'pending', course: 'TypeScript Deep Dive', date: '2024-01-14', acceptedDate: null },
  { id: 3, email: 'mike@enterprise.com', status: 'expired', course: 'Node.js Masterclass', date: '2024-01-01', acceptedDate: null },
  { id: 4, email: 'emily@tech.co', status: 'accepted', course: 'Next.js Full Stack', date: '2024-01-10', acceptedDate: '2024-01-11' },
  { id: 5, email: 'david@agency.com', status: 'pending', course: 'GraphQL Essentials', date: '2024-01-13', acceptedDate: null }
]

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  accepted: { label: 'Accepted', color: 'text-green-500', bgColor: 'bg-green-500/10' },
  pending: { label: 'Pending', color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  expired: { label: 'Expired', color: 'text-red-500', bgColor: 'bg-red-500/10' }
}

interface EmailEntry {
  email: string
  valid: boolean
  error?: string
}

export default function StudentInvitePage() {
  const [inviteMode, setInviteMode] = useState<'single' | 'bulk' | 'link'>('single')
  const [emails, setEmails] = useState<EmailEntry[]>([])
  const [emailInput, setEmailInput] = useState('')
  const [selectedCourses, setSelectedCourses] = useState<number[]>([])
  const [welcomeMessage, setWelomeMessage] = useState(
    `Welcome to our learning platform! You've been invited to join our courses. Click the link below to get started with your learning journey.`
  )
  const [expirationDays, setExpirationDays] = useState('7')
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvPreview, setCsvPreview] = useState<string[]>([])
  const [inviteLink, setInviteLink] = useState('')
  const [linkCopied, setLinkCopied] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleAddEmail = () => {
    const trimmedEmail = emailInput.trim().toLowerCase()
    if (!trimmedEmail) return

    if (emails.some(e => e.email === trimmedEmail)) {
      toast.error('Email already added')
      return
    }

    const isValid = validateEmail(trimmedEmail)
    setEmails(prev => [...prev, {
      email: trimmedEmail,
      valid: isValid,
      error: isValid ? undefined : 'Invalid email format'
    }])
    setEmailInput('')
  }

  const handleRemoveEmail = (email: string) => {
    setEmails(prev => prev.filter(e => e.email !== email))
  }

  const handlePasteEmails = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text')
    const emailList = pastedText.split(/[,\n\r]+/).map(e => e.trim().toLowerCase()).filter(e => e)

    const newEmails: EmailEntry[] = emailList.map(email => ({
      email,
      valid: validateEmail(email),
      error: validateEmail(email) ? undefined : 'Invalid email format'
    })).filter(entry => !emails.some(e => e.email === entry.email))

    if (newEmails.length > 0) {
      setEmails(prev => [...prev, ...newEmails])
      setEmailInput('')
      toast.success(`Added ${newEmails.length} emails`)
    }
  }

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file')
      return
    }

    setCsvFile(file)

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const lines = text.split('\n').filter(line => line.trim())
      const emailsFromCsv = lines
        .map(line => line.split(',')[0].trim().toLowerCase())
        .filter(email => email && email !== 'email')

      setCsvPreview(emailsFromCsv.slice(0, 5))

      const newEmails: EmailEntry[] = emailsFromCsv.map(email => ({
        email,
        valid: validateEmail(email),
        error: validateEmail(email) ? undefined : 'Invalid email format'
      })).filter(entry => !emails.some(e => e.email === entry.email))

      setEmails(prev => [...prev, ...newEmails])
      toast.success(`Imported ${newEmails.length} emails from CSV`)
    }
    reader.readAsText(file)
  }

  const handleCourseToggle = (courseId: number) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    )
  }

  const generateInviteLink = () => {
    const link = `https://phazur-academy.com/invite/${Math.random().toString(36).substring(7)}`
    setInviteLink(link)
    toast.success('Invite link generated')
  }

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setLinkCopied(true)
    toast.success('Link copied to clipboard')
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const handleSendInvitations = () => {
    const validEmails = emails.filter(e => e.valid)

    if (validEmails.length === 0) {
      toast.error('Please add at least one valid email')
      return
    }

    if (selectedCourses.length === 0) {
      toast.error('Please select at least one course')
      return
    }

    toast.success(`Invitations sent to ${validEmails.length} recipients`)
    setEmails([])
    setSelectedCourses([])
    setCsvFile(null)
    setCsvPreview([])
  }

  const validEmailCount = emails.filter(e => e.valid).length
  const invalidEmailCount = emails.filter(e => !e.valid).length

  const downloadTemplate = () => {
    const csvContent = 'email,name\njohn@example.com,John Doe\njane@example.com,Jane Smith'
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'invite-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Invite Students</h1>
            <p className="text-muted-foreground">
              Send invitations via email, CSV upload, or shareable link
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Send className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {invitationHistory.filter(i => i.status === 'pending').length}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {invitationHistory.filter(i => i.status === 'accepted').length}
              </p>
              <p className="text-sm text-muted-foreground">Accepted</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {invitationHistory.filter(i => i.status === 'expired').length}
              </p>
              <p className="text-sm text-muted-foreground">Expired</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Users className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{invitationHistory.length}</p>
              <p className="text-sm text-muted-foreground">Total Sent</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Invite Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invite Mode Tabs */}
          <div className="bg-card border border-border rounded-xl p-1 inline-flex">
            <button
              onClick={() => setInviteMode('single')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                inviteMode === 'single'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              <Mail className="h-4 w-4" />
              Email
            </button>
            <button
              onClick={() => setInviteMode('bulk')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                inviteMode === 'bulk'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              <FileSpreadsheet className="h-4 w-4" />
              CSV Upload
            </button>
            <button
              onClick={() => setInviteMode('link')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                inviteMode === 'link'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              <Link className="h-4 w-4" />
              Invite Link
            </button>
          </div>

          {/* Email Input */}
          {inviteMode === 'single' && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-4">Add Email Addresses</h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEmail())}
                    onPaste={handlePasteEmails}
                    placeholder="Enter email or paste multiple emails"
                    className="flex-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={handleAddEmail}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Tip: You can paste multiple emails separated by commas or new lines
                </p>

                {emails.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {validEmailCount} valid{invalidEmailCount > 0 && `, ${invalidEmailCount} invalid`}
                      </span>
                      <button
                        onClick={() => setEmails([])}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {emails.map((entry) => (
                        <div
                          key={entry.email}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                            entry.valid ? 'bg-accent/50' : 'bg-red-500/10'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {entry.valid ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className={entry.valid ? 'text-foreground' : 'text-red-500'}>
                              {entry.email}
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemoveEmail(entry.email)}
                            className="p-1 hover:bg-accent rounded"
                          >
                            <X className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CSV Upload */}
          {inviteMode === 'bulk' && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">Upload CSV File</h2>
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Download className="h-4 w-4" />
                  Download template
                </button>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-accent rounded-full">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {csvFile ? csvFile.name : 'Click to upload CSV file'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      CSV should have email in the first column
                    </p>
                  </div>
                </div>
              </div>

              {csvPreview.length > 0 && (
                <div className="mt-4 p-4 bg-accent/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-2">Preview (first 5):</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {csvPreview.map((email, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-500" />
                        {email}
                      </li>
                    ))}
                  </ul>
                  {emails.length > 5 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      and {emails.length - 5} more...
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Invite Link */}
          {inviteMode === 'link' && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-4">Shareable Invite Link</h2>

              {!inviteLink ? (
                <div className="text-center py-8">
                  <div className="p-3 bg-accent rounded-full inline-flex mb-4">
                    <Link className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Generate a link that anyone can use to enroll in selected courses
                  </p>
                  <button
                    onClick={generateInviteLink}
                    disabled={selectedCourses.length === 0}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    Generate Link
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inviteLink}
                      readOnly
                      className="flex-1 px-4 py-2 border border-border rounded-lg bg-accent/50"
                    />
                    <button
                      onClick={copyInviteLink}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        linkCopied
                          ? 'bg-green-500 text-white'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      }`}
                    >
                      {linkCopied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Link expires in {expirationDays} days
                    </span>
                    <button
                      onClick={() => setInviteLink('')}
                      className="text-red-500 hover:text-red-600"
                    >
                      Revoke link
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Welcome Message */}
          {inviteMode !== 'link' && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-4">Welcome Message</h2>
              <textarea
                value={welcomeMessage}
                onChange={(e) => setWelomeMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Customize your welcome message..."
              />
            </div>
          )}

          {/* Send Button */}
          {inviteMode !== 'link' && (
            <button
              onClick={handleSendInvitations}
              disabled={validEmailCount === 0 || selectedCourses.length === 0}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
              Send {validEmailCount > 0 ? `${validEmailCount} Invitation${validEmailCount > 1 ? 's' : ''}` : 'Invitations'}
            </button>
          )}
        </div>

        {/* Right Column - Settings & History */}
        <div className="space-y-6">
          {/* Course Selection */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Enroll in Courses
            </h2>
            <div className="space-y-2">
              {courses.map((course) => (
                <label
                  key={course.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedCourses.includes(course.id)
                      ? 'bg-primary/10 border border-primary'
                      : 'bg-accent/50 border border-transparent hover:bg-accent'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(course.id)}
                    onChange={() => handleCourseToggle(course.id)}
                    className="rounded border-border"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{course.title}</p>
                    <p className="text-xs text-muted-foreground">{course.enrolled} enrolled</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Expiration */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Invitation Expiration
            </h2>
            <div className="relative">
              <select
                value={expirationDays}
                onChange={(e) => setExpirationDays(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background appearance-none cursor-pointer pr-10"
              >
                <option value="1">1 day</option>
                <option value="3">3 days</option>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
                <option value="never">Never</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Recent Invitations */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-4">Recent Invitations</h2>
            <div className="space-y-3">
              {invitationHistory.slice(0, 5).map((invite) => {
                const status = statusConfig[invite.status]
                return (
                  <div key={invite.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {invite.email}
                      </p>
                      <p className="text-xs text-muted-foreground">{invite.course}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${status.bgColor} ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
