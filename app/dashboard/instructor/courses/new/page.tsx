'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type CourseLevel = 'beginner' | 'intermediate' | 'advanced'
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

export default function CreateCoursePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'basic' | 'curriculum' | 'pricing' | 'settings'>('basic')
  const [isSaving, setIsSaving] = useState(false)

  // Basic Info State
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [level, setLevel] = useState<CourseLevel>('beginner')
  const [language, setLanguage] = useState('English')
  const [learningObjectives, setLearningObjectives] = useState<string[]>([''])
  const [requirements, setRequirements] = useState<string[]>([''])
  const [targetAudience, setTargetAudience] = useState('')

  // Curriculum State
  const [modules, setModules] = useState<Module[]>([
    {
      id: '1',
      title: 'Introduction',
      isExpanded: true,
      lessons: [
        { id: 'l1', title: 'Welcome to the Course', type: 'video', duration: '5:00', isPreview: true },
      ],
    },
  ])

  // Pricing State
  const [price, setPrice] = useState('')
  const [discountPrice, setDiscountPrice] = useState('')
  const [isFree, setIsFree] = useState(false)

  // Settings State
  const [certificateEnabled, setCertificateEnabled] = useState(true)
  const [discussionEnabled, setDiscussionEnabled] = useState(true)
  const [dripContent, setDripContent] = useState(false)

  const handleSave = async (publish = false) => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
    if (publish) {
      router.push('/dashboard/instructor/courses')
    }
  }

  const addLearningObjective = () => {
    setLearningObjectives([...learningObjectives, ''])
  }

  const updateLearningObjective = (index: number, value: string) => {
    const updated = [...learningObjectives]
    updated[index] = value
    setLearningObjectives(updated)
  }

  const removeLearningObjective = (index: number) => {
    setLearningObjectives(learningObjectives.filter((_, i) => i !== index))
  }

  const addRequirement = () => {
    setRequirements([...requirements, ''])
  }

  const updateRequirement = (index: number, value: string) => {
    const updated = [...requirements]
    updated[index] = value
    setRequirements(updated)
  }

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index))
  }

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
          return {
            ...m,
            lessons: m.lessons.filter((l) => l.id !== lessonId),
          }
        }
        return m
      })
    )
  }

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
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/instructor/courses"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
            <div className="hidden sm:block">
              <h1 className="font-semibold">{title || 'New Course'}</h1>
              <p className="text-xs text-muted-foreground">Draft</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {}}
              className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-muted transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-muted transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save Draft'}</span>
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Publish
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
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
              {/* Course Details */}
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
                      placeholder="e.g., Complete Web Development Bootcamp"
                      className="w-full px-4 py-2.5 bg-muted/50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subtitle</label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="A brief tagline for your course"
                      className="w-full px-4 py-2.5 bg-muted/50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what students will learn in this course..."
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
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
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
                        <option value="German">German</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Level Selection */}
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

              {/* Learning Objectives */}
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
                        placeholder="e.g., Build responsive websites from scratch"
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

              {/* Requirements */}
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
                        placeholder="e.g., Basic understanding of HTML"
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

              {/* Target Audience */}
              <Card>
                <CardHeader>
                  <CardTitle>Target Audience</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Who is this course for? Describe your ideal student..."
                    rows={4}
                    className="w-full px-4 py-2.5 bg-muted/50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Thumbnail */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Thumbnail</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Upload thumbnail</p>
                    <p className="text-xs text-muted-foreground">1280x720 recommended</p>
                  </div>
                </CardContent>
              </Card>

              {/* Promo Video */}
              <Card>
                <CardHeader>
                  <CardTitle>Promo Video</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer">
                    <Video className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Upload preview video</p>
                    <p className="text-xs text-muted-foreground">Optional</p>
                  </div>
                </CardContent>
              </Card>

              {/* Course Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Current Status</span>
                    <Badge variant="outline">Draft</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Curriculum Tab */}
        {activeTab === 'curriculum' && (
          <div className="max-w-4xl">
            <div className="mb-6">
              <p className="text-muted-foreground">
                Organize your course content into modules and lessons. Drag to reorder.
              </p>
            </div>

            <div className="space-y-4">
              {modules.map((module, moduleIndex) => (
                <Card key={module.id}>
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="p-1 hover:bg-muted rounded transition-colors"
                      >
                        {module.isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      <input
                        type="text"
                        value={module.title}
                        onChange={(e) => updateModuleTitle(module.id, e.target.value)}
                        className="flex-1 font-semibold bg-transparent border-0 focus:outline-none focus:ring-0"
                        placeholder="Module title"
                      />
                      <span className="text-sm text-muted-foreground">
                        {module.lessons.length} lessons
                      </span>
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
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg group"
                        >
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
                            onChange={(e) =>
                              updateLesson(module.id, lesson.id, { title: e.target.value })
                            }
                            className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-sm"
                            placeholder="Lesson title"
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
                                onChange={(e) =>
                                  updateLesson(module.id, lesson.id, { isPreview: e.target.checked })
                                }
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
                    <div className="text-sm text-muted-foreground">
                      Make this course available for free
                    </div>
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
                          placeholder="49.99"
                          className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Discount Price ($) <span className="text-muted-foreground font-normal">Optional</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                          type="number"
                          value={discountPrice}
                          onChange={(e) => setDiscountPrice(e.target.value)}
                          placeholder="29.99"
                          className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Set a promotional price to attract more students
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-4">Price Preview</h4>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    {isFree ? (
                      <div className="text-2xl font-bold text-emerald-500">Free</div>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        {discountPrice && (
                          <>
                            <span className="text-2xl font-bold">${discountPrice}</span>
                            <span className="text-lg text-muted-foreground line-through">
                              ${price}
                            </span>
                          </>
                        )}
                        {!discountPrice && price && (
                          <span className="text-2xl font-bold">${price}</span>
                        )}
                        {!price && !discountPrice && (
                          <span className="text-muted-foreground">Set a price</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
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
                    <div className="text-sm text-muted-foreground">
                      Students receive a certificate upon course completion
                    </div>
                  </div>
                  <button
                    onClick={() => setCertificateEnabled(!certificateEnabled)}
                    className={cn(
                      'relative w-12 h-6 rounded-full transition-colors',
                      certificateEnabled ? 'bg-primary' : 'bg-muted'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                        certificateEnabled ? 'left-7' : 'left-1'
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">Discussion Forum</div>
                    <div className="text-sm text-muted-foreground">
                      Enable Q&A and discussions for this course
                    </div>
                  </div>
                  <button
                    onClick={() => setDiscussionEnabled(!discussionEnabled)}
                    className={cn(
                      'relative w-12 h-6 rounded-full transition-colors',
                      discussionEnabled ? 'bg-primary' : 'bg-muted'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                        discussionEnabled ? 'left-7' : 'left-1'
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">Drip Content</div>
                    <div className="text-sm text-muted-foreground">
                      Release content on a schedule instead of all at once
                    </div>
                  </div>
                  <button
                    onClick={() => setDripContent(!dripContent)}
                    className={cn(
                      'relative w-12 h-6 rounded-full transition-colors',
                      dripContent ? 'bg-primary' : 'bg-muted'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                        dripContent ? 'left-7' : 'left-1'
                      )}
                    />
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
                    <div className="text-sm text-muted-foreground">
                      Remove from catalog but keep content
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-amber-500 text-amber-500 rounded-lg text-sm hover:bg-amber-500/10 transition-colors">
                    Archive
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Delete Course</div>
                    <div className="text-sm text-muted-foreground">
                      Permanently delete this course and all content
                    </div>
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
