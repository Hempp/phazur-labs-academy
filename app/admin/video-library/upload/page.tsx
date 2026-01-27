'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Upload,
  Video,
  X,
  Check,
  AlertCircle,
  FileVideo,
  ArrowLeft,
  Clock,
  ChevronDown,
  Loader2,
  Cloud,
  HardDrive,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface UploadSession {
  id: string
  uploadId: string
  filename: string
  fileSizeBytes: number
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed' | 'cancelled'
  partsCompleted: number
  totalParts: number
  bytesUploaded: number
  presignedUrls: { partNumber: number; url: string; expiresAt: string }[]
}

interface Course {
  id: string
  title: string
}

interface UploadingFile {
  id: string
  file: File
  name: string
  size: number
  progress: number
  status: 'initiating' | 'uploading' | 'completing' | 'complete' | 'error' | 'paused'
  session?: UploadSession
  uploadedParts: { PartNumber: number; ETag: string }[]
  errorMessage?: string
}

const CHUNK_SIZE = 100 * 1024 * 1024 // 100MB per part

export default function VideoLibraryUploadPage() {
  const router = useRouter()
  const [files, setFiles] = useState<UploadingFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    courseId: '',
  })
  const [tagInput, setTagInput] = useState('')
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)
  const [s3Available, setS3Available] = useState<boolean | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const abortControllers = useRef<Map<string, AbortController[]>>(new Map())

  // Check if S3 is configured
  useEffect(() => {
    const checkS3 = async () => {
      try {
        const response = await fetch('/api/admin/video-upload/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: 'test.mp4', fileSizeBytes: 1000, mimeType: 'video/mp4' }),
        })
        // If we get 503, S3 is not configured
        if (response.status === 503) {
          setS3Available(false)
        } else {
          setS3Available(true)
          // Abort the test session if it was created
          const data = await response.json()
          if (data.session?.id) {
            fetch(`/api/admin/video-upload/${data.session.id}/abort`, { method: 'POST' }).catch(() => {})
          }
        }
      } catch {
        setS3Available(false)
      }
    }
    checkS3()
  }, [])

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoadingCourses(true)
      try {
        const response = await fetch('/api/admin/courses')
        if (response.ok) {
          const data = await response.json()
          setCourses(data.courses || [])
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err)
      } finally {
        setIsLoadingCourses(false)
      }
    }
    fetchCourses()
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  // Initiate upload session
  const initiateUpload = async (file: File): Promise<UploadSession | null> => {
    try {
      const response = await fetch('/api/admin/video-upload/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          fileSizeBytes: file.size,
          mimeType: file.type,
          title: metadata.title || file.name.replace(/\.[^/.]+$/, ''),
          courseId: metadata.courseId || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to initiate upload')
      }

      const data = await response.json()
      return data.session
    } catch (error) {
      throw error
    }
  }

  // Upload a single part
  const uploadPart = async (
    fileId: string,
    file: File,
    partNumber: number,
    presignedUrl: string
  ): Promise<{ PartNumber: number; ETag: string }> => {
    const start = (partNumber - 1) * CHUNK_SIZE
    const end = Math.min(start + CHUNK_SIZE, file.size)
    const chunk = file.slice(start, end)

    // Get or create abort controller for this file
    if (!abortControllers.current.has(fileId)) {
      abortControllers.current.set(fileId, [])
    }
    const controller = new AbortController()
    abortControllers.current.get(fileId)!.push(controller)

    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: chunk,
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`Failed to upload part ${partNumber}`)
    }

    const etag = response.headers.get('ETag')
    if (!etag) {
      throw new Error(`No ETag returned for part ${partNumber}`)
    }

    return { PartNumber: partNumber, ETag: etag.replace(/"/g, '') }
  }

  // Upload all parts
  const uploadAllParts = async (uploadingFile: UploadingFile) => {
    const { file, session } = uploadingFile
    if (!session) return

    const completedParts: { PartNumber: number; ETag: string }[] = [...uploadingFile.uploadedParts]
    let bytesUploaded = completedParts.length * CHUNK_SIZE

    // Upload parts in parallel (up to 3 at a time)
    const concurrency = 3
    const pendingParts = session.presignedUrls.filter(
      (p) => !completedParts.some((cp) => cp.PartNumber === p.partNumber)
    )

    for (let i = 0; i < pendingParts.length; i += concurrency) {
      const batch = pendingParts.slice(i, i + concurrency)

      const results = await Promise.allSettled(
        batch.map((part) => uploadPart(uploadingFile.id, file, part.partNumber, part.url))
      )

      for (const result of results) {
        if (result.status === 'fulfilled') {
          completedParts.push(result.value)
          bytesUploaded = Math.min(bytesUploaded + CHUNK_SIZE, file.size)

          // Update progress
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadingFile.id
                ? {
                    ...f,
                    uploadedParts: completedParts,
                    progress: (bytesUploaded / file.size) * 100,
                  }
                : f
            )
          )
        } else {
          // Check if it was cancelled
          if (result.reason?.name === 'AbortError') {
            return null
          }
          throw result.reason
        }
      }
    }

    return completedParts
  }

  // Complete the upload
  const completeUpload = async (
    sessionId: string,
    parts: { PartNumber: number; ETag: string }[]
  ) => {
    const response = await fetch(`/api/admin/video-upload/${sessionId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        parts: parts.sort((a, b) => a.PartNumber - b.PartNumber),
        title: metadata.title || undefined,
        description: metadata.description || undefined,
        tags: metadata.tags.length > 0 ? metadata.tags : undefined,
      }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to complete upload')
    }

    return await response.json()
  }

  // Main upload function
  const startUpload = async (uploadingFile: UploadingFile) => {
    try {
      // Update status to initiating
      setFiles((prev) =>
        prev.map((f) => (f.id === uploadingFile.id ? { ...f, status: 'initiating' } : f))
      )

      // Initiate upload session
      const session = await initiateUpload(uploadingFile.file)
      if (!session) throw new Error('Failed to create upload session')

      // Update with session info
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadingFile.id ? { ...f, session, status: 'uploading' } : f
        )
      )

      // Upload all parts
      const completedParts = await uploadAllParts({ ...uploadingFile, session })
      if (!completedParts) {
        // Upload was cancelled
        return
      }

      // Update status to completing
      setFiles((prev) =>
        prev.map((f) => (f.id === uploadingFile.id ? { ...f, status: 'completing' } : f))
      )

      // Complete the upload
      await completeUpload(session.id, completedParts)

      // Success!
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadingFile.id ? { ...f, status: 'complete', progress: 100 } : f
        )
      )
      toast.success(`${uploadingFile.name} uploaded successfully!`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadingFile.id ? { ...f, status: 'error', errorMessage } : f
        )
      )
      toast.error(errorMessage)
    }
  }

  // Process dropped/selected files
  const processFiles = useCallback(
    (newFiles: File[]) => {
      const uploadingFiles: UploadingFile[] = newFiles.map((file) => ({
        id: Math.random().toString(36).substring(7),
        file,
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'initiating' as const,
        uploadedParts: [],
      }))

      setFiles((prev) => [...prev, ...uploadingFiles])

      // Start uploads
      uploadingFiles.forEach((uf) => startUpload(uf))
    },
    [metadata]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith('video/')
      )

      if (droppedFiles.length === 0) {
        toast.error('Please upload video files only')
        return
      }

      processFiles(droppedFiles)
    },
    [processFiles]
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter((file) =>
      file.type.startsWith('video/')
    )

    if (selectedFiles.length > 0) {
      processFiles(selectedFiles)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const cancelUpload = async (fileId: string) => {
    // Abort all fetch requests for this file
    const controllers = abortControllers.current.get(fileId)
    if (controllers) {
      controllers.forEach((c) => c.abort())
      abortControllers.current.delete(fileId)
    }

    // Get session and abort on server
    const file = files.find((f) => f.id === fileId)
    if (file?.session) {
      fetch(`/api/admin/video-upload/${file.session.id}/abort`, { method: 'POST' }).catch(() => {})
    }

    // Remove from list
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const retryUpload = (fileId: string) => {
    const file = files.find((f) => f.id === fileId)
    if (file) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, status: 'initiating', progress: 0, uploadedParts: [], session: undefined }
            : f
        )
      )
      startUpload({ ...file, status: 'initiating', progress: 0, uploadedParts: [], session: undefined })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !metadata.tags.includes(tagInput.trim())) {
      setMetadata((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setMetadata((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const completedCount = files.filter((f) => f.status === 'complete').length

  // Show loading while checking S3
  if (s3Available === null) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Show warning if S3 not configured
  if (s3Available === false) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/video-library"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Upload Video</h1>
            <p className="text-muted-foreground">Upload videos to the library</p>
          </div>
        </div>

        <div className="text-center py-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
          <AlertCircle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">S3 Storage Not Configured</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-4">
            AWS S3 storage is required for video uploads. Please configure the following environment
            variables:
          </p>
          <div className="text-left max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-lg p-4 font-mono text-sm">
            <p>AWS_ACCESS_KEY_ID</p>
            <p>AWS_SECRET_ACCESS_KEY</p>
            <p>AWS_REGION</p>
            <p>AWS_S3_BUCKET</p>
          </div>
          <Link
            href="/admin/video-library"
            className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Video Library
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/video-library"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Upload Video</h1>
          <p className="text-muted-foreground">Upload videos to the library via AWS S3</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Cloud className="h-4 w-4 text-green-500" />
          <span>AWS S3 Connected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Upload & Files */}
        <div className="lg:col-span-2 space-y-6">
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-accent/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-4">
              <div className={`p-4 rounded-full ${isDragging ? 'bg-primary/20' : 'bg-accent'}`}>
                <FileVideo
                  className={`h-10 w-10 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`}
                />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">
                  {isDragging ? 'Drop your videos here' : 'Drag and drop videos here'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse • MP4, MOV, AVI, WebM up to 5GB
                </p>
              </div>
            </div>
          </div>

          {/* Uploading Files */}
          {files.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">
                  Uploads ({completedCount}/{files.length})
                </h2>
              </div>
              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-4 p-3 bg-accent/50 rounded-lg"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{file.name}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        {file.session && (
                          <>
                            <span>•</span>
                            <span>
                              {file.uploadedParts.length}/{file.session.totalParts} parts
                            </span>
                          </>
                        )}
                      </div>
                      {(file.status === 'initiating' ||
                        file.status === 'uploading' ||
                        file.status === 'completing') && (
                        <div className="mt-2">
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {file.status === 'initiating' && 'Initializing...'}
                            {file.status === 'uploading' && `Uploading... ${Math.round(file.progress)}%`}
                            {file.status === 'completing' && 'Finalizing...'}
                          </p>
                        </div>
                      )}
                      {file.status === 'error' && (
                        <p className="text-xs text-red-500 mt-2">
                          {file.errorMessage || 'Upload failed'}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {file.status === 'complete' && (
                        <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-500/10 text-green-500 rounded">
                          <Check className="h-3 w-3" />
                          Complete
                        </span>
                      )}
                      {file.status === 'error' && (
                        <>
                          <button
                            onClick={() => retryUpload(file.id)}
                            className="p-1 hover:bg-accent rounded"
                            title="Retry"
                          >
                            <RotateCcw className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-500/10 text-red-500 rounded">
                            <AlertCircle className="h-3 w-3" />
                            Error
                          </span>
                        </>
                      )}
                      {(file.status === 'initiating' || file.status === 'uploading') && (
                        <button
                          onClick={() => cancelUpload(file.id)}
                          className="p-1 hover:bg-accent rounded"
                          title="Cancel"
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                      )}
                      {(file.status === 'complete' || file.status === 'error') && (
                        <button
                          onClick={() => setFiles((prev) => prev.filter((f) => f.id !== file.id))}
                          className="p-1 hover:bg-accent rounded"
                          title="Remove"
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Metadata */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-4">Video Details</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Optional - can be set after upload
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Title</label>
                <input
                  type="text"
                  value={metadata.title}
                  onChange={(e) => setMetadata((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Video title (optional)"
                  className="w-full mt-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  value={metadata.description}
                  onChange={(e) =>
                    setMetadata((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={3}
                  placeholder="Describe your video..."
                  className="w-full mt-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Course (optional)</label>
                <div className="relative mt-1">
                  <select
                    value={metadata.courseId}
                    onChange={(e) =>
                      setMetadata((prev) => ({ ...prev, courseId: e.target.value }))
                    }
                    disabled={isLoadingCourses}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background appearance-none cursor-pointer pr-10 disabled:opacity-50"
                  >
                    <option value="">
                      {isLoadingCourses ? 'Loading courses...' : 'No course assignment'}
                    </option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                  {isLoadingCourses ? (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                  ) : (
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Tags</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add a tag"
                    className="flex-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-3 py-2 bg-accent rounded-lg hover:bg-accent/80"
                  >
                    +
                  </button>
                </div>
                {metadata.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {metadata.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-2 py-1 text-sm bg-primary/10 text-primary rounded"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-primary/80"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upload Info */}
          <div className="bg-accent/50 border border-border rounded-xl p-4">
            <h3 className="font-medium text-foreground mb-2">Upload Info</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                Multipart upload for large files
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                100MB chunks for reliability
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                Parallel uploads (3 concurrent)
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                Files go to video library
              </li>
            </ul>
          </div>

          {/* Finish Button */}
          {completedCount > 0 && (
            <button
              onClick={() => router.push('/admin/video-library')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Check className="h-4 w-4" />
              Done - Go to Library
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
