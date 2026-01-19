'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeft,
  Save,
  Eye,
  Upload,
  Plus,
  Trash2,
  GripVertical,
  Play,
  FileText,
  Clock,
  Image as ImageIcon,
  Video,
  X,
  ChevronDown,
  ChevronUp,
  Settings,
  DollarSign,
  BarChart3,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type CourseLevel = 'beginner' | 'intermediate' | 'advanced'
type CourseStatus = 'published' | 'draft' | 'archived'
type LessonType = 'video' | 'text' | 'quiz'

interface Lesson {
  id: string
  title: string
  type: LessonType
  duration: string
  isPreview: boolean
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
  isExpanded: boolean
}

// Mock course data - in real app, fetch from API
const mockCourseData = {
  id: '1',
  title: 'Advanced React Patterns',
  subtitle: 'Master modern React development patterns',
  description: 'Learn compound components, render props, custom hooks, and more advanced React patterns used in production applications. This course will take you from intermediate to advanced React developer.',
  category: 'Web Development',
  level: 'advanced' as CourseLevel,
  language: 'English',
  status: 'published' as CourseStatus,
  price: '49.99',
  discountPrice: '29.99',
  isFree: false,
  learningObjectives: [
    'Build reusable compound components',
    'Create powerful custom hooks',
    'Implement render props pattern',
    'Master React context for state management',
  ],
  requirements: [
    'Basic React knowledge',
    'Understanding of JavaScript ES6+',
    'Familiarity with functional components',
  ],
  targetAudience: 'This course is for intermediate React developers who want to level up their skills and learn advanced patterns used in real-world applications.',
  certificateEnabled: true,
  discussionEnabled: true,
  dripContent: false,
  modules: [
    {
      id: '1',
      title: 'Getting Started',
      isExpanded: true,
      lessons: [
        { id: 'l1', title: 'Welcome & Course Overview', type: 'video' as LessonType, duration: '5:30', isPreview: true },
        { id: 'l2', title: 'Setting Up Development Environment', type: 'video' as LessonType, duration: '12:00', isPreview: false },
      ],
    },
    {
      id: '2',
      title: 'Compound Components',
      isExpanded: false,
      lessons: [
        { id: 'l3', title: 'Introduction to Compound Components', type: 'video' as LessonType, duration: '15:00', isPreview: true },
        { id: 'l4', title: 'Building a Tabs Component', type: 'video' as LessonType, duration: '25:00', isPreview: false },
        { id: 'l5', title: 'Accordion Pattern', type: 'video' as LessonType, duration: '20:00', isPreview: false },
        { id: 'l6', title: 'Module Quiz', type: 'quiz' as LessonType, duration: '10:00', isPreview: false },
      ],
    },
    {
      id: '3',
      title: 'Custom Hooks',
      isExpanded: false,
      lessons: [
        { id: 'l7', title: 'Why Custom Hooks?', type: 'video' as LessonType, duration: '10:00', isPreview: false },
        { id: 'l8', title: 'useLocalStorage Hook', type: 'video' as LessonType, duration: '18:00', isPreview: false },
        { id: 'l9', title: 'useFetch Hook', type: 'video' as LessonType, duration: '22:00', isPreview: false },
        { id: 'l10', title: 'Testing Custom Hooks', type: 'text' as LessonType, duration: '15:00', isPreview: false },
      ],
    },
  ],
  stats: {
    students: 3420,
    rating: 4.9,
    reviews: 892,
    revenue: 12500,
  },
}

const categories = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'DevOps',
  'Design',
  'Business',
  'Marketing',
]

const levels: { value: CourseLevel; label: string; description: string }[] = [
  { value: 'beginner', label: 'Beginner', description: 'No prior knowledge required' },
  { value: 'intermediate', label: 'Intermediate', description: 'Some experience recommended' },
  { value: 'advanced', label: 'Advanced', description: 'Expert-level content' },
]

export default function EditCoursePage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'basic' | 'curriculum' | 'pricing' | 'settings'>('basic')
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Load course data
  const [title, setTitle] = useState(mockCourseData.title)
  const [subtitle, setSubtitle] = useState(mockCourseData.subtitle)
  const [description, setDescription] = useState(mockCourseData.description)
  const [category, setCategory] = useState(mockCourseData.category)
  const [level, setLevel] = useState<CourseLevel>(mockCourseData.level)
  const [language, setLanguage] = useState(mockCourseData.language)
  const [status, setStatus] = useState<CourseStatus>(mockCourseData.status)
  const [learningObjectives, setLearningObjectives] = useState<string[]>(mockCourseData.learningObjectives)
  const [requirements, setRequirements] = useState<string[]>(mockCourseData.requirements)
  const [targetAudience, setTargetAudience] = useState(mockCourseData.targetAudience)
  const [modules, setModules] = useState<Module[]>(mockCourseData.modules)
  const [price, setPrice] = useState(mockCourseData.price)
  const [discountPrice, setDiscountPrice] = useState(mockCourseData.discountPrice)
  const [isFree, setIsFree] = useState(mockCourseData.isFree)
  const [certificateEnabled, setCertificateEnabled] = useState(mockCourseData.certificateEnabled)
  const [discussionEnabled, setDiscussionEnabled] = useState(mockCourseData.discussionEnabled)
  const [dripContent, setDripContent] = useState(mockCourseData.dripContent)

  // Track changes
  useEffect(() => {
    setHasUnsavedChanges(true)
  }, [title, subtitle, description, category, level, language, learningObjectives, requirements, targetAudience, modules, price, discountPrice, isFree, certificateEnabled, discussionEnabled, dripContent])

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
    setHasUnsavedChanges(false)
  }

  const handlePublish = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setStatus('published')
    setIsSaving(false)
    setHasUnsavedChanges(false)
  }

  const handleUnpublish = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setStatus('draft')
    setIsSaving(false)
    setHasUnsavedChanges(false)
  }

  // Learning objectives handlers
  const addLearningObjective = () => setLearningObjectives([...learningObjectives, ''])
  const updateLearningObjective = (index: number, value: string) => {
    const updated = [...learningObjectives]
    updated[index] = value
    setLearningObjectives(updated)
  }
  const removeLearningObjective = (index: number) => {
    setLearningObjectives(learningObjectives.filter((_, i) => i !== index))
  }

  // Requirements handlers
  const addRequirement = () => setRequirements([...requirements, ''])
  const updateRequirement = (index: number, value: string) => {
    const updated = [...requirements]
    updated[index] = value
    setRequirements(updated)
  }
  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index))
  }

  // Module handlers
  const addModule = () => {
    setModules([
      ...modules,
      {
        id: Date.now().toString(),
        title: `Module ${modules.length + 1}`,
        isExpanded: true,
        lessons: [],
      },
    ])
  }

  const updateModuleTitle = (moduleId: string, title: string) => {
    setModules(modules.map((m) => (m.id === moduleId ? { ...m, title } : m)))
  }

  const toggleModule = (moduleId: string) => {
    setModules(modules.map((m) => (m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m)))
  }

  const deleteModule = (moduleId: string) => {
    setModules(modules.filter((m) => m.id !== moduleId))
  }

  const addLesson = (moduleId: string, type: LessonType) => {
    setModules(
      modules.map((m) => {
        if (m.id === moduleId) {
          return {
            ...m,
            lessons: [
              ...m.lessons,
              {
                id: Date.now().toString(),
                title: type === 'video' ? 'New Video Lesson' : type === 'text' ? 'New Article' : 'New Quiz',
                type,
                duration: '0:00',
                isPreview: false,
              },
            ],
          }
        }
        return m
      })
    )
  }

  const updateLesson = (moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
    setModules(
      modules.map((m) => {
        if (m.id === moduleId) {
          return {
            ...m,
            lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, ...updates } : l)),
          }
        }
        return m
      })
    )
  }

  const deleteLesson = (moduleId: string, lessonId: string) => {
    setModules(
      modules.map((m) => {
        if (m.id === moduleId) {
          return { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
        }
        return m
      })
    )
  }

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0)

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FileText },
    { id: 'curriculum', label: 'Curriculum', icon: Play },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/instructor/courses"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Link>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <h1 className="font-semibold">{title}</h1>
                  <StatusBadge status={status} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {mockCourseData.stats.students.toLocaleString()} students • ${mockCourseData.stats.revenue.toLocaleString()} revenue
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasUnsavedChanges && (
                <span className="text-xs text-amber-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Unsaved changes
                </span>
              )}
              <Link
                href={`/dashboard/instructor/courses/${params.id}/analytics`}
                className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-muted transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </Link>
              <Link
                href={`/courses/${params.id}`}
                className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-muted transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Preview</span>
              </Link>
              <button
                onClick={handleSave}
                disabled={isSaving || !hasUnsavedChanges}
                className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-muted transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
              </button>
              {status === 'draft' ? (
                <button
                  onClick={handlePublish}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  Publish
                </button>
              ) : (
                <button
                  onClick={handleUnpublish}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
                >
                  Unpublish
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{mockCourseData.stats.students.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Students</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{mockCourseData.stats.rating}</p>
              <p className="text-sm text-muted-foreground">Rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{mockCourseData.stats.reviews}</p>
              <p className="text-sm text-muted-foreground">Reviews</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">${mockCourseData.stats.revenue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors',
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Course Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-muted/50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subtitle</label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-muted/50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-2.5 bg-muted/50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-muted/50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Language</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-4 py-2.5 bg-muted/50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Difficulty Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {levels.map((l) => (
                      <button
                        key={l.value}
                        onClick={() => setLevel(l.value)}
                        className={cn(
                          'p-4 rounded-lg border-2 text-left transition-colors',
                          level === l.value
                            ? 'border-primary bg-primary/5'
                            : 'border-transparent bg-muted/50 hover:bg-muted'
                        )}
                      >
                        <div className="font-medium">{l.label}</div>
                        <div className="text-sm text-muted-foreground">{l.description}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What will students learn?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {learningObjectives.map((objective, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => updateLearningObjective(index, e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-muted/50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      {learningObjectives.length > 1 && (
                        <button
                          onClick={() => removeLearningObjective(index)}
                          className="p-2.5 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addLearningObjective}
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Plus className="h-4 w-4" />
                    Add more
                  </button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={requirement}
                        onChange={(e) => updateRequirement(index, e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-muted/50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      {requirements.length > 1 && (
                        <button
                          onClick={() => removeRequirement(index)}
                          className="p-2.5 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addRequirement}
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Plus className="h-4 w-4" />
                    Add more
                  </button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Target Audience</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 bg-muted/50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Thumbnail</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Change thumbnail</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Course Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Status</span>
                    <StatusBadge status={status} />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Modules</span>
                    <span className="font-medium">{modules.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Lessons</span>
                    <span className="font-medium">{totalLessons}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Curriculum Tab */}
        {activeTab === 'curriculum' && (
          <div className="max-w-4xl space-y-4">
            {modules.map((module) => (
              <Card key={module.id}>
                <div className="p-4 border-b">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="p-1 hover:bg-muted rounded transition-colors"
                    >
                      {module.isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    <input
                      type="text"
                      value={module.title}
                      onChange={(e) => updateModuleTitle(module.id, e.target.value)}
                      className="flex-1 font-semibold bg-transparent border-0 focus:outline-none focus:ring-0"
                    />
                    <span className="text-sm text-muted-foreground">{module.lessons.length} lessons</span>
                    <button
                      onClick={() => deleteModule(module.id)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {module.isExpanded && (
                  <CardContent className="p-4 space-y-3">
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg group">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        <div className="p-2 rounded bg-background">
                          {lesson.type === 'video' ? (
                            <Play className="h-4 w-4 text-primary" />
                          ) : lesson.type === 'text' ? (
                            <FileText className="h-4 w-4 text-blue-500" />
                          ) : (
                            <FileText className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                          className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-sm"
                        />
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {lesson.duration}
                          </div>
                          <label className="flex items-center gap-1.5 text-xs">
                            <input
                              type="checkbox"
                              checked={lesson.isPreview}
                              onChange={(e) => updateLesson(module.id, lesson.id, { isPreview: e.target.checked })}
                              className="rounded border-muted-foreground/25"
                            />
                            Preview
                          </label>
                          <button
                            onClick={() => deleteLesson(module.id, lesson.id)}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => addLesson(module.id, 'video')}
                        className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-muted transition-colors"
                      >
                        <Video className="h-4 w-4" />
                        Video
                      </button>
                      <button
                        onClick={() => addLesson(module.id, 'text')}
                        className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-muted transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        Article
                      </button>
                      <button
                        onClick={() => addLesson(module.id, 'quiz')}
                        className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-muted transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        Quiz
                      </button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}

            <button
              onClick={addModule}
              className="w-full py-4 border-2 border-dashed rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Module
            </button>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Course Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <input
                    type="checkbox"
                    id="free-course"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="rounded border-muted-foreground/25"
                  />
                  <label htmlFor="free-course" className="flex-1 cursor-pointer">
                    <div className="font-medium">Free Course</div>
                    <div className="text-sm text-muted-foreground">Make this course available for free</div>
                  </label>
                </div>

                {!isFree && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Regular Price ($)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Discount Price ($)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                          type="number"
                          value={discountPrice}
                          onChange={(e) => setDiscountPrice(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">Certificate of Completion</div>
                    <div className="text-sm text-muted-foreground">Students receive a certificate upon completion</div>
                  </div>
                  <button
                    onClick={() => setCertificateEnabled(!certificateEnabled)}
                    className={cn(
                      'relative w-12 h-6 rounded-full transition-colors',
                      certificateEnabled ? 'bg-primary' : 'bg-muted'
                    )}
                  >
                    <span className={cn(
                      'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                      certificateEnabled ? 'left-7' : 'left-1'
                    )} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">Discussion Forum</div>
                    <div className="text-sm text-muted-foreground">Enable Q&A and discussions</div>
                  </div>
                  <button
                    onClick={() => setDiscussionEnabled(!discussionEnabled)}
                    className={cn(
                      'relative w-12 h-6 rounded-full transition-colors',
                      discussionEnabled ? 'bg-primary' : 'bg-muted'
                    )}
                  >
                    <span className={cn(
                      'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                      discussionEnabled ? 'left-7' : 'left-1'
                    )} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">Drip Content</div>
                    <div className="text-sm text-muted-foreground">Release content on a schedule</div>
                  </div>
                  <button
                    onClick={() => setDripContent(!dripContent)}
                    className={cn(
                      'relative w-12 h-6 rounded-full transition-colors',
                      dripContent ? 'bg-primary' : 'bg-muted'
                    )}
                  >
                    <span className={cn(
                      'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                      dripContent ? 'left-7' : 'left-1'
                    )} />
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Archive Course</div>
                    <div className="text-sm text-muted-foreground">Remove from catalog but keep content</div>
                  </div>
                  <button className="px-4 py-2 border border-amber-500 text-amber-500 rounded-lg text-sm hover:bg-amber-500/10 transition-colors">
                    Archive
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Delete Course</div>
                    <div className="text-sm text-muted-foreground">Permanently delete this course</div>
                  </div>
                  <button className="px-4 py-2 border border-destructive text-destructive rounded-lg text-sm hover:bg-destructive/10 transition-colors">
                    Delete
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
