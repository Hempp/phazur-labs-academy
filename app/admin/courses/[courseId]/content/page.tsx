'use client'

import { useState } from 'react'
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
  Download,
  Copy,
  Settings,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react'

// Mock course data
const courseData = {
  id: '1',
  title: 'Complete AI & Machine Learning Bootcamp 2024',
  sections: [
    {
      id: 's1',
      title: 'Introduction to AI & Machine Learning',
      expanded: true,
      items: [
        { id: 'v1', type: 'video', title: 'Welcome to the Course', duration: '5:30', status: 'published', isPreview: true },
        { id: 'v2', type: 'video', title: 'What is AI?', duration: '12:45', status: 'published', isPreview: false },
        { id: 'v3', type: 'video', title: 'Machine Learning Overview', duration: '18:20', status: 'published', isPreview: false },
        { id: 'q1', type: 'quiz', title: 'Introduction Quiz', questions: 10, status: 'published', isPreview: false },
      ]
    },
    {
      id: 's2',
      title: 'Python Fundamentals for ML',
      expanded: true,
      items: [
        { id: 'v4', type: 'video', title: 'Python Setup & Environment', duration: '15:00', status: 'published', isPreview: false },
        { id: 'v5', type: 'video', title: 'NumPy Basics', duration: '22:30', status: 'published', isPreview: false },
        { id: 'v6', type: 'video', title: 'Pandas for Data Analysis', duration: '28:15', status: 'processing', isPreview: false },
        { id: 'a1', type: 'assignment', title: 'Data Analysis Project', status: 'published', isPreview: false },
      ]
    },
    {
      id: 's3',
      title: 'Supervised Learning',
      expanded: false,
      items: [
        { id: 'v7', type: 'video', title: 'Linear Regression', duration: '25:00', status: 'published', isPreview: false },
        { id: 'v8', type: 'video', title: 'Logistic Regression', duration: '20:45', status: 'draft', isPreview: false },
        { id: 'v9', type: 'video', title: 'Decision Trees', duration: '18:30', status: 'draft', isPreview: false },
        { id: 'q2', type: 'quiz', title: 'Supervised Learning Quiz', questions: 15, status: 'draft', isPreview: false },
      ]
    },
  ]
}

const itemTypeConfig = {
  video: { icon: Video, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  quiz: { icon: FileQuestion, color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  assignment: { icon: ClipboardList, color: 'text-amber-500', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  document: { icon: FileText, color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/30' },
}

const statusConfig = {
  published: { label: 'Published', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
  processing: { label: 'Processing', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
}

export default function CourseContentPage() {
  const params = useParams()
  const [sections, setSections] = useState(courseData.sections)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showAddSectionModal, setShowAddSectionModal] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)

  const toggleSection = (sectionId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? { ...section, expanded: !section.expanded }
          : section
      )
    )
  }

  const totalItems = sections.reduce((acc, s) => acc + s.items.length, 0)
  const publishedItems = sections.reduce((acc, s) => acc + s.items.filter(i => i.status === 'published').length, 0)

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
            <p className="text-muted-foreground truncate max-w-md">{courseData.title}</p>
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
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
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
                  <p className="text-sm text-muted-foreground">{section.items.length} items</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Section Items */}
            {section.expanded && (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {section.items.map((item, itemIndex) => {
                  const ItemIcon = itemTypeConfig[item.type as keyof typeof itemTypeConfig].icon
                  const iconColor = itemTypeConfig[item.type as keyof typeof itemTypeConfig].color
                  const iconBg = itemTypeConfig[item.type as keyof typeof itemTypeConfig].bgColor

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
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
                            {item.isPreview && (
                              <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                Preview
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            {item.type === 'video' && (
                              <>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {item.duration}
                                </span>
                              </>
                            )}
                            {item.type === 'quiz' && (
                              <span>{item.questions} questions</span>
                            )}
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[item.status as keyof typeof statusConfig].color}`}>
                              {statusConfig[item.status as keyof typeof statusConfig].label}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.type === 'video' && (
                          <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700" title="Preview">
                            <Play className="h-4 w-4" />
                          </button>
                        )}
                        <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700" title="Edit">
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
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Eye className="h-4 w-4" />
                                Preview
                              </button>
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Edit className="h-4 w-4" />
                                Edit
                              </button>
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Copy className="h-4 w-4" />
                                Duplicate
                              </button>
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                                {item.isPreview ? (
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
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Settings className="h-4 w-4" />
                                Settings
                              </button>
                              <hr className="my-1 border-gray-200 dark:border-gray-700" />
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
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
                <button className="w-full flex items-center justify-center gap-2 p-4 text-sm text-muted-foreground hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-foreground transition-colors">
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
                  placeholder="e.g., Advanced Techniques"
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Description (optional)</label>
                <textarea
                  rows={3}
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
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                Add Section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
