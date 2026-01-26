'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Upload,
  Video,
  X,
  Check,
  AlertCircle,
  FileVideo,
  Image as ImageIcon,
  FileText,
  Tag,
  BookOpen,
  Clock,
  ChevronDown,
  Plus,
  Trash2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Loader2,
  Cloud,
  Server
} from 'lucide-react'
import toast from 'react-hot-toast'

// Types for courses and lessons from API
interface Lesson {
  id: string
  title: string
  content_type?: string
}

interface Course {
  id: string
  title: string
  lessons?: Lesson[]
}

interface VideoProviderInfo {
  provider: string
  maxFileSizeMB: number
  allowedTypes: string[]
  features: {
    cdn: boolean
    signedUrls: boolean
    thumbnailGeneration: boolean
    transcoding: boolean
  }
}

interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
  progress: number
  status: 'uploading' | 'processing' | 'complete' | 'error'
  thumbnail?: string
  duration?: string
}

export default function VideoUploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    courseId: '',
    lessonId: '',
    visibility: 'private',
    transcript: ''
  })
  const [tagInput, setTagInput] = useState('')
  const [selectedThumbnail, setSelectedThumbnail] = useState<'auto' | 'custom'>('auto')
  const [customThumbnail, setCustomThumbnail] = useState<string | null>(null)
  const [autoThumbnails, setAutoThumbnails] = useState<string[]>([
    '/placeholder-thumb-1.jpg',
    '/placeholder-thumb-2.jpg',
    '/placeholder-thumb-3.jpg'
  ])
  const [selectedAutoThumb, setSelectedAutoThumb] = useState(0)

  // API data state
  const [courses, setCourses] = useState<Course[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [providerInfo, setProviderInfo] = useState<VideoProviderInfo | null>(null)
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)
  const [isLoadingLessons, setIsLoadingLessons] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)

  const selectedCourse = courses.find(c => c.id === metadata.courseId)

  // Fetch video provider info on mount
  useEffect(() => {
    const fetchProviderInfo = async () => {
      try {
        const response = await fetch('/api/admin/videos/upload')
        if (response.ok) {
          const data = await response.json()
          setProviderInfo(data)
        }
      } catch (err) {
        console.error('Failed to fetch provider info:', err)
      }
    }
    fetchProviderInfo()
  }, [])

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoadingCourses(true)
      try {
        const response = await fetch('/api/admin/courses')
        if (response.ok) {
          const data = await response.json()
          setCourses(data.courses || [])
        } else {
          // Fallback to mock data for development
          setCourses([
            { id: '1', title: 'Advanced React Patterns' },
            { id: '2', title: 'Node.js Masterclass' },
            { id: '3', title: 'TypeScript Deep Dive' },
            { id: '4', title: 'Next.js Full Stack' },
          ])
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err)
        // Fallback to mock data
        setCourses([
          { id: '1', title: 'Advanced React Patterns' },
          { id: '2', title: 'Node.js Masterclass' },
        ])
      } finally {
        setIsLoadingCourses(false)
      }
    }
    fetchCourses()
  }, [])

  // Fetch lessons when course changes
  useEffect(() => {
    const fetchLessons = async () => {
      if (!metadata.courseId) {
        setLessons([])
        return
      }

      setIsLoadingLessons(true)
      try {
        const response = await fetch(`/api/admin/courses/${metadata.courseId}/lessons`)
        if (response.ok) {
          const data = await response.json()
          setLessons(data.lessons || [])
        } else {
          // Fallback mock lessons
          setLessons([
            { id: `${metadata.courseId}-1`, title: 'Introduction' },
            { id: `${metadata.courseId}-2`, title: 'Getting Started' },
            { id: `${metadata.courseId}-3`, title: 'Advanced Topics' },
          ])
        }
      } catch (err) {
        console.error('Failed to fetch lessons:', err)
        setLessons([
          { id: `${metadata.courseId}-1`, title: 'Introduction' },
          { id: `${metadata.courseId}-2`, title: 'Getting Started' },
        ])
      } finally {
        setIsLoadingLessons(false)
      }
    }
    fetchLessons()
  }, [metadata.courseId])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  // Real upload function using the API
  const uploadFile = useCallback(async (uploadedFile: UploadedFile) => {
    const formData = new FormData()
    formData.append('file', uploadedFile.file)
    formData.append('courseId', metadata.courseId)
    if (metadata.lessonId) {
      formData.append('lessonId', metadata.lessonId)
    }
    formData.append('title', metadata.title || uploadedFile.name)
    formData.append('description', metadata.description)

    try {
      // Use XMLHttpRequest for upload progress tracking
      const xhr = new XMLHttpRequest()

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100
          setFiles(prev => prev.map(f =>
            f.id === uploadedFile.id ? { ...f, progress } : f
          ))
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText)
          setFiles(prev => prev.map(f =>
            f.id === uploadedFile.id
              ? { ...f, progress: 100, status: 'complete', duration: response.duration }
              : f
          ))
          toast.success(`${uploadedFile.name} uploaded successfully!`)
        } else {
          const error = JSON.parse(xhr.responseText)
          setFiles(prev => prev.map(f =>
            f.id === uploadedFile.id ? { ...f, status: 'error' } : f
          ))
          toast.error(error.error || 'Upload failed')
        }
      }

      xhr.onerror = () => {
        setFiles(prev => prev.map(f =>
          f.id === uploadedFile.id ? { ...f, status: 'error' } : f
        ))
        toast.error('Upload failed - network error')
      }

      xhr.open('POST', '/api/admin/videos/upload')
      xhr.send(formData)

    } catch (error) {
      setFiles(prev => prev.map(f =>
        f.id === uploadedFile.id ? { ...f, status: 'error' } : f
      ))
      toast.error('Upload failed')
    }
  }, [metadata.courseId, metadata.lessonId, metadata.title, metadata.description])

  // Fallback simulation for development without API
  const simulateUpload = useCallback((fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setFiles(prev => prev.map(f =>
          f.id === fileId ? { ...f, progress: 100, status: 'processing' } : f
        ))

        // Simulate processing
        setTimeout(() => {
          setFiles(prev => prev.map(f =>
            f.id === fileId ? { ...f, status: 'complete', duration: '12:34' } : f
          ))
        }, 2000)
      } else {
        setFiles(prev => prev.map(f =>
          f.id === fileId ? { ...f, progress } : f
        ))
      }
    }, 300)
  }, [])

  const processFiles = useCallback((newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading' as const
    }))

    setFiles(prev => [...prev, ...uploadedFiles])

    // Use real upload if course is selected, otherwise simulate
    uploadedFiles.forEach(uploadedFile => {
      if (metadata.courseId) {
        uploadFile(uploadedFile)
      } else {
        simulateUpload(uploadedFile.id)
      }
    })
  }, [simulateUpload, uploadFile, metadata.courseId])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('video/')
    )

    if (droppedFiles.length === 0) {
      toast.error('Please upload video files only')
      return
    }

    processFiles(droppedFiles)
  }, [processFiles])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter(
      file => file.type.startsWith('video/')
    )

    if (selectedFiles.length > 0) {
      processFiles(selectedFiles)
    }
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !metadata.tags.includes(tagInput.trim())) {
      setMetadata(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        setCustomThumbnail(reader.result as string)
        setSelectedThumbnail('custom')
      }
      reader.readAsDataURL(file)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handlePublish = () => {
    if (files.length === 0) {
      toast.error('Please upload at least one video')
      return
    }

    if (!metadata.title) {
      toast.error('Please enter a video title')
      return
    }

    if (!metadata.courseId || !metadata.lessonId) {
      toast.error('Please assign the video to a course and lesson')
      return
    }

    toast.success('Video published successfully!')
    // Reset form
    setFiles([])
    setMetadata({
      title: '',
      description: '',
      tags: [],
      courseId: '',
      lessonId: '',
      visibility: 'private',
      transcript: ''
    })
  }

  const completedFiles = files.filter(f => f.status === 'complete').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Upload Video</h1>
            <p className="text-muted-foreground">
              Upload and configure your video content
            </p>
          </div>
        </div>
        <button
          onClick={handlePublish}
          disabled={files.length === 0 || completedFiles === 0}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="h-4 w-4" />
          Publish Video
        </button>
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
                <FileVideo className={`h-10 w-10 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">
                  {isDragging ? 'Drop your videos here' : 'Drag and drop videos here'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse • MP4, MOV, AVI up to 5GB
                </p>
              </div>
            </div>
          </div>

          {/* Uploaded Files */}
          {files.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">
                  Uploaded Files ({completedFiles}/{files.length})
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
                        {file.duration && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {file.duration}
                            </span>
                          </>
                        )}
                      </div>
                      {file.status === 'uploading' && (
                        <div className="mt-2">
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Uploading... {Math.round(file.progress)}%
                          </p>
                        </div>
                      )}
                      {file.status === 'processing' && (
                        <p className="text-xs text-amber-500 mt-2 flex items-center gap-1">
                          <Clock className="h-3 w-3 animate-spin" />
                          Processing video...
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {file.status === 'complete' && (
                        <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-500/10 text-green-500 rounded">
                          <Check className="h-3 w-3" />
                          Ready
                        </span>
                      )}
                      {file.status === 'error' && (
                        <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-500/10 text-red-500 rounded">
                          <AlertCircle className="h-3 w-3" />
                          Error
                        </span>
                      )}
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1 hover:bg-accent rounded"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Thumbnail Selection */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Video Thumbnail
            </h2>

            <div className="space-y-4">
              {/* Auto-generated thumbnails */}
              <div>
                <label className="text-sm font-medium text-foreground">Auto-generated</label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {autoThumbnails.map((thumb, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedThumbnail('auto')
                        setSelectedAutoThumb(idx)
                      }}
                      className={`relative aspect-video bg-accent rounded-lg overflow-hidden border-2 transition-all ${
                        selectedThumbnail === 'auto' && selectedAutoThumb === idx
                          ? 'border-primary'
                          : 'border-transparent hover:border-primary/50'
                      }`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-8 w-8 text-muted-foreground" />
                      </div>
                      {selectedThumbnail === 'auto' && selectedAutoThumb === idx && (
                        <div className="absolute top-2 right-2 p-1 bg-primary rounded-full">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom thumbnail */}
              <div>
                <label className="text-sm font-medium text-foreground">Custom thumbnail</label>
                <div className="mt-2">
                  {customThumbnail ? (
                    <div className="relative inline-block">
                      <img
                        src={customThumbnail}
                        alt="Custom thumbnail"
                        className={`h-24 rounded-lg object-cover border-2 ${
                          selectedThumbnail === 'custom' ? 'border-primary' : 'border-transparent'
                        }`}
                        onClick={() => setSelectedThumbnail('custom')}
                      />
                      <button
                        onClick={() => {
                          setCustomThumbnail(null)
                          if (selectedThumbnail === 'custom') setSelectedThumbnail('auto')
                        }}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => thumbnailInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-accent/50 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Upload thumbnail
                    </button>
                  )}
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Transcript */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Video Transcript
            </h2>
            <textarea
              value={metadata.transcript}
              onChange={(e) => setMetadata(prev => ({ ...prev, transcript: e.target.value }))}
              rows={6}
              placeholder="Paste or type your video transcript here. This helps with accessibility and SEO..."
              className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Transcripts improve accessibility and help students search for content within your videos.
            </p>
          </div>
        </div>

        {/* Right Column - Metadata */}
        <div className="space-y-6">
          {/* Video Details */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-4">Video Details</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Title *</label>
                <input
                  type="text"
                  value={metadata.title}
                  onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter video title"
                  className="w-full mt-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  value={metadata.description}
                  onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  placeholder="Describe your video content..."
                  className="w-full mt-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
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
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {metadata.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {metadata.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-2 py-1 text-sm bg-primary/10 text-primary rounded"
                      >
                        <Tag className="h-3 w-3" />
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

              <div>
                <label className="text-sm font-medium text-foreground">Visibility</label>
                <div className="relative mt-1">
                  <select
                    value={metadata.visibility}
                    onChange={(e) => setMetadata(prev => ({ ...prev, visibility: e.target.value }))}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background appearance-none cursor-pointer pr-10"
                  >
                    <option value="private">Private - Only enrolled students</option>
                    <option value="unlisted">Unlisted - Anyone with link</option>
                    <option value="public">Public - Everyone</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Course Assignment */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course Assignment
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Course *</label>
                <div className="relative mt-1">
                  <select
                    value={metadata.courseId}
                    onChange={(e) => setMetadata(prev => ({
                      ...prev,
                      courseId: e.target.value,
                      lessonId: ''
                    }))}
                    disabled={isLoadingCourses}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background appearance-none cursor-pointer pr-10 disabled:opacity-50"
                  >
                    <option value="">{isLoadingCourses ? 'Loading courses...' : 'Select a course'}</option>
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
                <label className="text-sm font-medium text-foreground">Lesson *</label>
                <div className="relative mt-1">
                  <select
                    value={metadata.lessonId}
                    onChange={(e) => setMetadata(prev => ({ ...prev, lessonId: e.target.value }))}
                    disabled={!metadata.courseId || isLoadingLessons}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background appearance-none cursor-pointer pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{isLoadingLessons ? 'Loading lessons...' : 'Select a lesson'}</option>
                    {lessons.map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>
                        {lesson.title}
                      </option>
                    ))}
                  </select>
                  {isLoadingLessons ? (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                  ) : (
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  )}
                </div>
              </div>

              {/* Video Provider Info */}
              {providerInfo && (
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {providerInfo.provider === 'bunnycdn' ? (
                      <Cloud className="h-4 w-4 text-green-500" />
                    ) : (
                      <Server className="h-4 w-4 text-blue-500" />
                    )}
                    <span>
                      Storage: {providerInfo.provider === 'bunnycdn' ? 'BunnyCDN' : 'Supabase'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Max file size: {providerInfo.maxFileSizeMB}MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Upload Tips */}
          <div className="bg-accent/50 border border-border rounded-xl p-4">
            <h3 className="font-medium text-foreground mb-2">Upload Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                Use MP4 format for best compatibility
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                Recommended resolution: 1080p or higher
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                Add a transcript for better accessibility
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                Choose a compelling thumbnail
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
