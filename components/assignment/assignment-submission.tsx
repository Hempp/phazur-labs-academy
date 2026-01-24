'use client'

import { useState, useCallback } from 'react'
import {
  Upload,
  Link2,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  Send,
  Paperclip,
  ExternalLink,
  Download,
  Star,
  MessageSquare,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

// Types - exported for use in other components
export type SubmissionType = 'file' | 'url' | 'text'
export type SubmissionStatus = 'not_started' | 'pending' | 'submitted' | 'graded' | 'resubmit'

export interface RubricItem {
  id: string
  criteria: string
  description: string
  max_points: number
}

export interface RubricScore {
  rubric_id: string
  points: number
  feedback?: string
}

export interface Assignment {
  id: string
  title: string
  description?: string
  instructions: string
  max_score: number
  submission_types: SubmissionType[]
  allowed_file_types?: string[]
  max_file_size_mb?: number
  rubric?: RubricItem[]
  resources?: { id: string; title: string; type: string; url: string }[]
  due_days_after_enrollment?: number
}

export interface Submission {
  id: string
  status: SubmissionStatus
  submission_type: SubmissionType
  file_url?: string
  file_name?: string
  url_link?: string
  text_content?: string
  score?: number
  feedback?: string
  rubric_scores?: RubricScore[]
  submitted_at?: string
  graded_at?: string
  attempt_number: number
}

interface AssignmentSubmissionProps {
  assignment: Assignment
  submission?: Submission | null
  enrollmentId: string
  onSubmitSuccess?: (submission: Submission) => void
}

// Status Badge Component
function StatusBadge({ status, score, maxScore }: {
  status: SubmissionStatus
  score?: number
  maxScore: number
}) {
  const statusConfig = {
    not_started: { label: 'Not Started', variant: 'outline' as const, icon: Clock },
    pending: { label: 'Draft', variant: 'outline' as const, icon: Clock },
    submitted: { label: 'Submitted', variant: 'default' as const, icon: CheckCircle2 },
    graded: { label: score !== undefined ? `${score}/${maxScore}` : 'Graded', variant: 'default' as const, icon: Star },
    resubmit: { label: 'Needs Revision', variant: 'destructive' as const, icon: AlertCircle },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  )
}

// Submission Type Selector
function SubmissionTypeSelector({
  types,
  selected,
  onChange,
  disabled,
}: {
  types: SubmissionType[]
  selected: SubmissionType
  onChange: (type: SubmissionType) => void
  disabled: boolean
}) {
  const typeConfig = {
    file: { label: 'Upload File', icon: Upload },
    url: { label: 'Submit URL', icon: Link2 },
    text: { label: 'Text Entry', icon: FileText },
  }

  if (types.length === 1) return null

  return (
    <div className="flex gap-2 mb-4">
      {types.map(type => {
        const config = typeConfig[type]
        const Icon = config.icon
        return (
          <button
            key={type}
            onClick={() => onChange(type)}
            disabled={disabled}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
              selected === type
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-muted hover:border-muted-foreground/30',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Icon className="w-4 h-4" />
            {config.label}
          </button>
        )
      })}
    </div>
  )
}

// File Upload Component
function FileUpload({
  allowedTypes,
  maxSizeMb,
  onFileSelect,
  selectedFile,
  disabled,
}: {
  allowedTypes?: string[]
  maxSizeMb?: number
  onFileSelect: (file: File | null) => void
  selectedFile: File | null
  disabled: boolean
}) {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateFile = (file: File): boolean => {
    setError(null)

    // Check file type
    if (allowedTypes && allowedTypes.length > 0) {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase()
      if (!allowedTypes.includes(ext)) {
        setError(`File type not allowed. Accepted: ${allowedTypes.join(', ')}`)
        return false
      }
    }

    // Check file size
    if (maxSizeMb && file.size > maxSizeMb * 1024 * 1024) {
      setError(`File too large. Maximum size: ${maxSizeMb}MB`)
      return false
    }

    return true
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const file = e.dataTransfer.files[0]
    if (file && validateFile(file)) {
      onFileSelect(file)
    }
  }, [allowedTypes, maxSizeMb, onFileSelect])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && validateFile(file)) {
      onFileSelect(file)
    }
  }

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          dragOver ? 'border-primary bg-primary/5' : 'border-muted',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {selectedFile ? (
          <div className="flex items-center justify-center gap-3">
            <Paperclip className="w-5 h-5 text-primary" />
            <span className="font-medium">{selectedFile.name}</span>
            <button
              onClick={() => onFileSelect(null)}
              disabled={disabled}
              className="text-muted-foreground hover:text-foreground"
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop your file here, or
            </p>
            <label className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors',
              'bg-primary text-primary-foreground hover:bg-primary/90',
              disabled && 'opacity-50 cursor-not-allowed'
            )}>
              <input
                type="file"
                className="hidden"
                onChange={handleFileInput}
                disabled={disabled}
                accept={allowedTypes?.join(',')}
              />
              Browse Files
            </label>
          </>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      {allowedTypes && (
        <p className="text-xs text-muted-foreground">
          Accepted files: {allowedTypes.join(', ')}
          {maxSizeMb && ` (max ${maxSizeMb}MB)`}
        </p>
      )}
    </div>
  )
}

// Main Component
export function AssignmentSubmission({
  assignment,
  submission,
  enrollmentId,
  onSubmitSuccess,
}: AssignmentSubmissionProps) {
  const [submissionType, setSubmissionType] = useState<SubmissionType>(
    assignment.submission_types[0]
  )
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [urlInput, setUrlInput] = useState(submission?.url_link || '')
  const [textInput, setTextInput] = useState(submission?.text_content || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const status: SubmissionStatus = submission?.status || 'not_started'
  const canSubmit = status === 'not_started' || status === 'pending' || status === 'resubmit'
  const isGraded = status === 'graded'

  const handleSubmit = async () => {
    setError(null)
    setIsSubmitting(true)

    try {
      const body: Record<string, unknown> = {
        submissionType,
      }

      if (submissionType === 'file') {
        if (!selectedFile) {
          throw new Error('Please select a file to upload')
        }
        // In a real app, you'd upload the file to storage first
        // For now, we'll simulate with a placeholder URL
        body.fileUrl = `/uploads/${selectedFile.name}`
        body.fileName = selectedFile.name
        body.fileSize = selectedFile.size
      } else if (submissionType === 'url') {
        if (!urlInput.trim()) {
          throw new Error('Please enter a URL')
        }
        body.urlLink = urlInput.trim()
      } else if (submissionType === 'text') {
        if (!textInput.trim()) {
          throw new Error('Please enter your submission text')
        }
        body.textContent = textInput.trim()
      }

      const response = await fetch(`/api/assignments/${assignment.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit assignment')
      }

      onSubmitSuccess?.(data.submission)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{assignment.title}</CardTitle>
              {assignment.description && (
                <CardDescription className="mt-1">{assignment.description}</CardDescription>
              )}
            </div>
            <StatusBadge status={status} score={submission?.score} maxScore={assignment.max_score} />
          </div>
        </CardHeader>
        <CardContent>
          {/* Instructions */}
          <div className="prose prose-sm max-w-none mb-6">
            <h4 className="font-semibold mb-2">Instructions</h4>
            <div className="whitespace-pre-wrap text-muted-foreground">
              {assignment.instructions}
            </div>
          </div>

          {/* Resources */}
          {assignment.resources && assignment.resources.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Resources</h4>
              <div className="space-y-2">
                {assignment.resources.map(resource => (
                  <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    {resource.type === 'link' ? (
                      <ExternalLink className="w-4 h-4" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    {resource.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Rubric */}
          {assignment.rubric && assignment.rubric.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Grading Rubric</h4>
              <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
                {assignment.rubric.map(item => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{item.criteria}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <Badge variant="outline">{item.max_points} pts</Badge>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between font-medium">
                  <span>Total Points</span>
                  <span>{assignment.max_score}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grading Feedback (if graded) */}
      {isGraded && submission && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="w-5 h-5 text-amber-500" />
              Grade: {submission.score}/{assignment.max_score}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress
              value={(submission.score! / assignment.max_score) * 100}
              className="h-2"
            />

            {submission.feedback && (
              <div className="bg-background rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                  <MessageSquare className="w-4 h-4" />
                  Instructor Feedback
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {submission.feedback}
                </p>
              </div>
            )}

            {/* Rubric Scores */}
            {submission.rubric_scores && submission.rubric_scores.length > 0 && (
              <div className="space-y-2">
                {submission.rubric_scores.map((score, idx) => {
                  const rubricItem = assignment.rubric?.find(r => r.id === score.rubric_id)
                  return rubricItem ? (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{rubricItem.criteria}</span>
                      <span className="font-medium">{score.points}/{rubricItem.max_points}</span>
                    </div>
                  ) : null
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Resubmit Notice */}
      {status === 'resubmit' && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-amber-500" />
              <div>
                <p className="font-medium text-amber-700">Revision Requested</p>
                <p className="text-sm text-muted-foreground">
                  Your instructor has requested a revision. Please review the feedback and resubmit.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submission Form */}
      {canSubmit && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {status === 'resubmit' ? 'Resubmit Assignment' : 'Submit Your Work'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SubmissionTypeSelector
              types={assignment.submission_types}
              selected={submissionType}
              onChange={setSubmissionType}
              disabled={isSubmitting}
            />

            {submissionType === 'file' && (
              <FileUpload
                allowedTypes={assignment.allowed_file_types}
                maxSizeMb={assignment.max_file_size_mb}
                onFileSelect={setSelectedFile}
                selectedFile={selectedFile}
                disabled={isSubmitting}
              />
            )}

            {submissionType === 'url' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Project URL</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://github.com/username/project"
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Submit a link to your project (GitHub, CodePen, deployed site, etc.)
                </p>
              </div>
            )}

            {submissionType === 'text' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Submission</label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter your submission here..."
                  rows={8}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:outline-none resize-y disabled:opacity-50"
                />
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={cn(
                'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors',
                'bg-primary text-primary-foreground hover:bg-primary/90',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {status === 'resubmit' ? 'Resubmit Assignment' : 'Submit Assignment'}
                </>
              )}
            </button>
          </CardContent>
        </Card>
      )}

      {/* Already Submitted Notice */}
      {status === 'submitted' && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Assignment Submitted</p>
                <p className="text-sm text-muted-foreground">
                  Submitted {submission?.submitted_at && new Date(submission.submitted_at).toLocaleDateString()} •
                  Attempt #{submission?.attempt_number}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AssignmentSubmission
