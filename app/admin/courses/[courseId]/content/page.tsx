'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Video,
  FileText,
  FileQuestion,
  ClipboardList,
  GripVertical,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Upload,
  FolderPlus,
  ChevronDown,
  ChevronRight,
  Clock,
  Lock,
  Unlock,
  Play,
  Copy,
  Settings,
  CheckCircle,
  X,
  Loader2
} from 'lucide-react'

interface Lesson {
  id: string
  title: string
  description: string | null
  content_type: string
  video_url: string | null
  video_duration_seconds: number
  display_order: number
  is_free_preview: boolean
  created_at: string
}

interface Section {
  id: string
  title: string
  description: string | null
  display_order: number
  is_free_preview: boolean
  created_at: string
  updated_at: string
  lessons: Lesson[]
  expanded?: boolean
}

const itemTypeConfig: Record<string, { icon: typeof Video; color: string; bgColor: string }> = {
  video: { icon: Video, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  quiz: { icon: FileQuestion, color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  assignment: { icon: ClipboardList, color: 'text-amber-500', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  text: { icon: FileText, color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  article: { icon: FileText, color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  live: { icon: Video, color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900/30' },
}

function formatDuration(seconds: number): string {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function CourseContentPage() {
  const params = useParams()
  const courseId = params.courseId as string

  // Data state
  const [sections, setSections] = useState<Section[]>([])
  const [courseTitle, setCourseTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showAddSectionModal, setShowAddSectionModal] = useState(false)
  const [showEditSectionModal, setShowEditSectionModal] = useState(false)
  const [showEditLessonModal, setShowEditLessonModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)
  const [uploadProgress] = useState<number | null>(null)

  // Form states
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<{ lesson: Lesson; sectionId: string } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'section' | 'lesson'; id: string; title: string; sectionId?: string } | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  // Add section form
  const [newSectionTitle, setNewSectionTitle] = useState('')
  const [newSectionDescription, setNewSectionDescription] = useState('')

  // Edit section form
  const [editSectionTitle, setEditSectionTitle] = useState('')
  const [editSectionDescription, setEditSectionDescription] = useState('')
  const [editSectionIsFreePreview, setEditSectionIsFreePreview] = useState(false)

  // Edit lesson form
  const [editLessonTitle, setEditLessonTitle] = useState('')
  const [editLessonDescription, setEditLessonDescription] = useState('')
  const [editLessonContentType, setEditLessonContentType] = useState('video')
  const [editLessonVideoUrl, setEditLessonVideoUrl] = useState('')
  const [editLessonDuration, setEditLessonDuration] = useState(0)
  const [editLessonIsFreePreview, setEditLessonIsFreePreview] = useState(false)

  // Drag state
  const [draggedLesson, setDraggedLesson] = useState<{ lesson: Lesson; sectionId: string } | null>(null)
  const [draggedSection, setDraggedSection] = useState<Section | null>(null)

  // Fetch modules and lessons
  const fetchContent = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch course title
      const courseRes = await fetch(`/api/admin/courses/${courseId}`)
      if (courseRes.ok) {
        const courseData = await courseRes.json()
        setCourseTitle(courseData.course?.title || 'Course')
      }

      // Fetch modules with lessons
      const modulesRes = await fetch(`/api/admin/courses/${courseId}/modules`)
      if (!modulesRes.ok) {
        throw new Error('Failed to fetch course content')
      }

      const data = await modulesRes.json()
      const modulesWithExpanded = (data.modules || []).map((m: Section) => ({
        ...m,
        expanded: true,
        lessons: (m.lessons || []).sort((a: Lesson, b: Lesson) => a.display_order - b.display_order)
      }))
      setSections(modulesWithExpanded.sort((a: Section, b: Section) => a.display_order - b.display_order))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content')
    } finally {
      setLoading(false)
    }
  }, [courseId])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const toggleSection = (sectionId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? { ...section, expanded: !section.expanded }
          : section
      )
    )
  }

  // Add Section Handler
  const handleAddSection = async () => {
    if (!newSectionTitle.trim()) return

    try {
      setFormLoading(true)
      const res = await fetch(`/api/admin/courses/${courseId}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newSectionTitle,
          description: newSectionDescription || null
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to add section')
      }

      setShowAddSectionModal(false)
      setNewSectionTitle('')
      setNewSectionDescription('')
      await fetchContent()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add section')
    } finally {
      setFormLoading(false)
    }
  }

  // Edit Section Handler
  const openEditSectionModal = (section: Section) => {
    setSelectedSection(section)
    setEditSectionTitle(section.title)
    setEditSectionDescription(section.description || '')
    setEditSectionIsFreePreview(section.is_free_preview)
    setShowEditSectionModal(true)
  }

  const handleEditSection = async () => {
    if (!selectedSection || !editSectionTitle.trim()) return

    try {
      setFormLoading(true)
      const res = await fetch(`/api/admin/courses/${courseId}/modules/${selectedSection.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editSectionTitle,
          description: editSectionDescription || null,
          is_free_preview: editSectionIsFreePreview
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update section')
      }

      setShowEditSectionModal(false)
      setSelectedSection(null)
      await fetchContent()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update section')
    } finally {
      setFormLoading(false)
    }
  }

  // Edit Lesson Handler
  const openEditLessonModal = (lesson: Lesson, sectionId: string) => {
    setSelectedLesson({ lesson, sectionId })
    setEditLessonTitle(lesson.title)
    setEditLessonDescription(lesson.description || '')
    setEditLessonContentType(lesson.content_type)
    setEditLessonVideoUrl(lesson.video_url || '')
    setEditLessonDuration(lesson.video_duration_seconds)
    setEditLessonIsFreePreview(lesson.is_free_preview)
    setShowEditLessonModal(true)
    setActionMenuOpen(null)
  }

  const handleEditLesson = async () => {
    if (!selectedLesson || !editLessonTitle.trim()) return

    try {
      setFormLoading(true)
      const res = await fetch(
        `/api/admin/courses/${courseId}/modules/${selectedLesson.sectionId}/lessons/${selectedLesson.lesson.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: editLessonTitle,
            description: editLessonDescription || null,
            content_type: editLessonContentType,
            video_url: editLessonVideoUrl || null,
            video_duration_seconds: editLessonDuration,
            is_free_preview: editLessonIsFreePreview
          })
        }
      )

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update lesson')
      }

      setShowEditLessonModal(false)
      setSelectedLesson(null)
      await fetchContent()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update lesson')
    } finally {
      setFormLoading(false)
    }
  }

  // Delete Handlers
  const openDeleteModal = (type: 'section' | 'lesson', id: string, title: string, sectionId?: string) => {
    setDeleteTarget({ type, id, title, sectionId })
    setShowDeleteModal(true)
    setActionMenuOpen(null)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      setFormLoading(true)
      let url: string

      if (deleteTarget.type === 'section') {
        url = `/api/admin/courses/${courseId}/modules/${deleteTarget.id}`
      } else {
        url = `/api/admin/courses/${courseId}/modules/${deleteTarget.sectionId}/lessons/${deleteTarget.id}`
      }

      const res = await fetch(url, { method: 'DELETE' })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || `Failed to delete ${deleteTarget.type}`)
      }

      setShowDeleteModal(false)
      setDeleteTarget(null)
      await fetchContent()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setFormLoading(false)
    }
  }

  // Toggle Preview Status
  const toggleLessonPreview = async (lesson: Lesson, sectionId: string) => {
    try {
      const res = await fetch(
        `/api/admin/courses/${courseId}/modules/${sectionId}/lessons/${lesson.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            is_free_preview: !lesson.is_free_preview
          })
        }
      )

      if (!res.ok) {
        throw new Error('Failed to update preview status')
      }

      await fetchContent()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update')
    }
    setActionMenuOpen(null)
  }

  // Drag and Drop Handlers for Sections
  const handleSectionDragStart = (e: React.DragEvent, section: Section) => {
    setDraggedSection(section)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleSectionDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleSectionDrop = async (e: React.DragEvent, targetSection: Section) => {
    e.preventDefault()
    if (!draggedSection || draggedSection.id === targetSection.id) {
      setDraggedSection(null)
      return
    }

    const newSections = [...sections]
    const draggedIndex = newSections.findIndex(s => s.id === draggedSection.id)
    const targetIndex = newSections.findIndex(s => s.id === targetSection.id)

    newSections.splice(draggedIndex, 1)
    newSections.splice(targetIndex, 0, draggedSection)

    setSections(newSections)
    setDraggedSection(null)

    // Persist to API
    try {
      const moduleIds = newSections.map(s => s.id)
      await fetch(`/api/admin/courses/${courseId}/modules/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleIds })
      })
    } catch {
      await fetchContent() // Revert on error
    }
  }

  // Drag and Drop Handlers for Lessons
  const handleLessonDragStart = (e: React.DragEvent, lesson: Lesson, sectionId: string) => {
    setDraggedLesson({ lesson, sectionId })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleLessonDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleLessonDrop = async (e: React.DragEvent, targetLesson: Lesson, targetSectionId: string) => {
    e.preventDefault()
    if (!draggedLesson) {
      return
    }

    // Only allow reordering within same section for now
    if (draggedLesson.sectionId !== targetSectionId) {
      setDraggedLesson(null)
      return
    }

    if (draggedLesson.lesson.id === targetLesson.id) {
      setDraggedLesson(null)
      return
    }

    const sectionIndex = sections.findIndex(s => s.id === targetSectionId)
    if (sectionIndex === -1) {
      setDraggedLesson(null)
      return
    }

    const newSections = [...sections]
    const lessons = [...newSections[sectionIndex].lessons]
    const draggedIndex = lessons.findIndex(l => l.id === draggedLesson.lesson.id)
    const targetIndex = lessons.findIndex(l => l.id === targetLesson.id)

    lessons.splice(draggedIndex, 1)
    lessons.splice(targetIndex, 0, draggedLesson.lesson)

    newSections[sectionIndex] = { ...newSections[sectionIndex], lessons }
    setSections(newSections)
    setDraggedLesson(null)

    // Persist to API
    try {
      const lessonIds = lessons.map(l => l.id)
      await fetch(`/api/admin/courses/${courseId}/modules/${targetSectionId}/lessons/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonIds })
      })
    } catch {
      await fetchContent() // Revert on error
    }
  }

  const totalItems = sections.reduce((acc, s) => acc + s.lessons.length, 0)
  const publishedItems = sections.reduce((acc, s) => acc + s.lessons.length, 0) // All items count as published in this simple view

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchContent}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/courses"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Course Content</h1>
            <p className="text-muted-foreground truncate max-w-md">{courseTitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddSectionModal(true)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <FolderPlus className="h-4 w-4" />
            Add Section
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Upload Content
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Video className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="font-semibold">{totalItems}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Published</p>
              <p className="font-semibold">{publishedItems}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <FolderPlus className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sections</p>
              <p className="font-semibold">{sections.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground">Content Protection:</span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <Lock className="h-3 w-3" />
              Enabled
            </span>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-4">
        {sections.map((section, sectionIndex) => (
          <div
            key={section.id}
            draggable
            onDragStart={(e) => handleSectionDragStart(e, section)}
            onDragOver={handleSectionDragOver}
            onDrop={(e) => handleSectionDrop(e, section)}
            className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${
              draggedSection?.id === section.id ? 'opacity-50' : ''
            }`}
          >
            {/* Section Header */}
            <div
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center gap-3">
                <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
                <button className="p-1">
                  {section.expanded ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </button>
                <div>
                  <h3 className="font-semibold">Section {sectionIndex + 1}: {section.title}</h3>
                  <p className="text-sm text-muted-foreground">{section.lessons.length} items</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); openEditSectionModal(section); }}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  title="Edit Section"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  title="Add Lesson"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); openDeleteModal('section', section.id, section.title); }}
                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600"
                  title="Delete Section"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Section Items */}
            {section.expanded && (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {section.lessons.map((item, itemIndex) => {
                  const typeKey = item.content_type || 'video'
                  const config = itemTypeConfig[typeKey] || itemTypeConfig.video
                  const ItemIcon = config.icon
                  const iconColor = config.color
                  const iconBg = config.bgColor

                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleLessonDragStart(e, item, section.id)}
                      onDragOver={handleLessonDragOver}
                      onDrop={(e) => handleLessonDrop(e, item, section.id)}
                      className={`flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group ${
                        draggedLesson?.lesson.id === item.id ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <GripVertical className="h-5 w-5 text-gray-400 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
                          <ItemIcon className={`h-5 w-5 ${iconColor}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{sectionIndex + 1}.{itemIndex + 1}</span>
                            <h4 className="font-medium">{item.title}</h4>
                            {item.is_free_preview && (
                              <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                Preview
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            {(item.content_type === 'video' || !item.content_type) && item.video_duration_seconds > 0 && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDuration(item.video_duration_seconds)}
                              </span>
                            )}
                            <span className="capitalize">{item.content_type || 'video'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {(item.content_type === 'video' || !item.content_type) && item.video_url && (
                          <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700" title="Preview">
                            <Play className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => openEditLessonModal(item, section.id)}
                          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setActionMenuOpen(actionMenuOpen === item.id ? null : item.id)}
                            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {actionMenuOpen === item.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                              <button
                                onClick={() => { setActionMenuOpen(null); }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Eye className="h-4 w-4" />
                                Preview
                              </button>
                              <button
                                onClick={() => openEditLessonModal(item, section.id)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => { setActionMenuOpen(null); }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Copy className="h-4 w-4" />
                                Duplicate
                              </button>
                              <button
                                onClick={() => toggleLessonPreview(item, section.id)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                {item.is_free_preview ? (
                                  <>
                                    <Lock className="h-4 w-4" />
                                    Remove from Preview
                                  </>
                                ) : (
                                  <>
                                    <Unlock className="h-4 w-4" />
                                    Set as Preview
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => { setActionMenuOpen(null); }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Settings className="h-4 w-4" />
                                Settings
                              </button>
                              <hr className="my-1 border-gray-200 dark:border-gray-700" />
                              <button
                                onClick={() => openDeleteModal('lesson', item.id, item.title, section.id)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Add Item Button */}
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="w-full flex items-center justify-center gap-2 p-4 text-sm text-muted-foreground hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-foreground transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Item to Section
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Add Section Button */}
        <button
          onClick={() => setShowAddSectionModal(true)}
          className="w-full flex items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          <FolderPlus className="h-5 w-5" />
          Add New Section
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold">Upload Content</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Content Type Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">Content Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button className="flex flex-col items-center gap-2 p-4 border-2 border-primary rounded-xl bg-primary/5">
                    <Video className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">Video</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-4 border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors">
                    <FileQuestion className="h-6 w-6" />
                    <span className="text-sm">Quiz</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-4 border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors">
                    <ClipboardList className="h-6 w-6" />
                    <span className="text-sm">Assignment</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-4 border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors">
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">Document</span>
                  </button>
                </div>
              </div>

              {/* Upload Zone */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Drag & drop video files here</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  MP4, MOV, or WebM. Max 5GB per file.
                </p>
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  Browse Files
                </button>
              </div>

              {/* Upload Progress */}
              {uploadProgress !== null && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">lecture-01-intro.mp4</span>
                    <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Content Protection Notice */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-300">Content Protection Enabled</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    All uploaded content is automatically protected. Downloads are disabled and screen recording is blocked where supported.
                  </p>
                </div>
              </div>

              {/* Title & Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Introduction to Neural Networks"
                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Add to Section</label>
                  <select className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary">
                    {sections.map((section, i) => (
                      <option key={section.id} value={section.id}>
                        Section {i + 1}: {section.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  <span className="text-sm">Set as preview (free)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  <span className="text-sm">Publish immediately</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Section Modal */}
      {showAddSectionModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold">Add New Section</h2>
              <button
                onClick={() => setShowAddSectionModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Section Title</label>
                <input
                  type="text"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="e.g., Advanced Techniques"
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Description (optional)</label>
                <textarea
                  rows={3}
                  value={newSectionDescription}
                  onChange={(e) => setNewSectionDescription(e.target.value)}
                  placeholder="Brief description of this section..."
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAddSectionModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSection}
                disabled={formLoading || !newSectionTitle.trim()}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
              >
                {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Add Section
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Section Modal */}
      {showEditSectionModal && selectedSection && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold">Edit Section</h2>
              <button
                onClick={() => { setShowEditSectionModal(false); setSelectedSection(null); }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Section Title</label>
                <input
                  type="text"
                  value={editSectionTitle}
                  onChange={(e) => setEditSectionTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={editSectionDescription}
                  onChange={(e) => setEditSectionDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editSectionIsFreePreview}
                  onChange={(e) => setEditSectionIsFreePreview(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm">Free preview section</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => { setShowEditSectionModal(false); setSelectedSection(null); }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSection}
                disabled={formLoading || !editSectionTitle.trim()}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
              >
                {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lesson Modal */}
      {showEditLessonModal && selectedLesson && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold">Edit Lesson</h2>
              <button
                onClick={() => { setShowEditLessonModal(false); setSelectedLesson(null); }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-auto">
              <div>
                <label className="block text-sm font-medium mb-1.5">Title</label>
                <input
                  type="text"
                  value={editLessonTitle}
                  onChange={(e) => setEditLessonTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={editLessonDescription}
                  onChange={(e) => setEditLessonDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Content Type</label>
                <select
                  value={editLessonContentType}
                  onChange={(e) => setEditLessonContentType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="video">Video</option>
                  <option value="text">Text/Article</option>
                  <option value="quiz">Quiz</option>
                  <option value="assignment">Assignment</option>
                  <option value="live">Live Session</option>
                </select>
              </div>
              {editLessonContentType === 'video' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Video URL</label>
                    <input
                      type="url"
                      value={editLessonVideoUrl}
                      onChange={(e) => setEditLessonVideoUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Duration (seconds)</label>
                    <input
                      type="number"
                      value={editLessonDuration}
                      onChange={(e) => setEditLessonDuration(parseInt(e.target.value) || 0)}
                      min={0}
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </>
              )}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editLessonIsFreePreview}
                  onChange={(e) => setEditLessonIsFreePreview(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm">Free preview lesson</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => { setShowEditLessonModal(false); setSelectedLesson(null); }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleEditLesson}
                disabled={formLoading || !editLessonTitle.trim()}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
              >
                {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-red-600">Delete {deleteTarget.type === 'section' ? 'Section' : 'Lesson'}</h2>
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-muted-foreground">
                Are you sure you want to delete <strong className="text-foreground">&ldquo;{deleteTarget.title}&rdquo;</strong>?
                {deleteTarget.type === 'section' && (
                  <span className="block mt-2 text-sm text-red-500">
                    This will also delete all lessons in this section. This action cannot be undone.
                  </span>
                )}
                {deleteTarget.type === 'lesson' && (
                  <span className="block mt-2 text-sm">This action cannot be undone.</span>
                )}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={formLoading}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
