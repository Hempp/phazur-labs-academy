'use client'

import { useState } from 'react'
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  DollarSign,
  Layout,
  Eye,
  Plus,
  Trash2,
  GripVertical,
  Video,
  FileText,
  Image as ImageIcon,
  X
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const steps = [
  { id: 1, name: 'Basic Info', description: 'Course details' },
  { id: 2, name: 'Pricing', description: 'Set pricing options' },
  { id: 3, name: 'Curriculum', description: 'Add content' },
  { id: 4, name: 'Review', description: 'Final check' }
]

const categories = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'DevOps',
  'Cloud Computing',
  'Cybersecurity',
  'UI/UX Design'
]

const instructors = [
  { id: 1, name: 'Sarah Johnson', role: 'Senior Developer' },
  { id: 2, name: 'Michael Chen', role: 'Tech Lead' },
  { id: 3, name: 'Emily Davis', role: 'Principal Engineer' },
  { id: 4, name: 'James Wilson', role: 'DevOps Architect' }
]

const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

interface Lesson {
  id: string
  title: string
  type: 'video' | 'text' | 'quiz'
  duration: string
}

export default function CreateCoursePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Basic Info
  const [basicInfo, setBasicInfo] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: '',
    difficulty: '',
    instructor: '',
    thumbnail: null as File | null,
    thumbnailPreview: ''
  })

  // Pricing
  const [pricing, setPricing] = useState({
    type: 'paid',
    price: '',
    originalPrice: '',
    currency: 'USD',
    accessType: 'lifetime'
  })

  // Curriculum
  const [modules, setModules] = useState<Module[]>([
    { id: '1', title: 'Introduction', lessons: [{ id: '1-1', title: 'Welcome to the Course', type: 'video', duration: '5:00' }] }
  ])

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBasicInfo({
        ...basicInfo,
        thumbnail: file,
        thumbnailPreview: URL.createObjectURL(file)
      })
    }
  }

  const addModule = () => {
    const newModule: Module = {
      id: Date.now().toString(),
      title: `Module ${modules.length + 1}`,
      lessons: []
    }
    setModules([...modules, newModule])
  }

  const addLesson = (moduleId: string) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: [...m.lessons, {
            id: `${moduleId}-${m.lessons.length + 1}`,
            title: 'New Lesson',
            type: 'video' as const,
            duration: '0:00'
          }]
        }
      }
      return m
    }))
  }

  const updateModule = (moduleId: string, title: string) => {
    setModules(modules.map(m => m.id === moduleId ? { ...m, title } : m))
  }

  const updateLesson = (moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l)
        }
      }
      return m
    }))
  }

  const deleteModule = (moduleId: string) => {
    setModules(modules.filter(m => m.id !== moduleId))
  }

  const deleteLesson = (moduleId: string, lessonId: string) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }
      }
      return m
    }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return basicInfo.title && basicInfo.description && basicInfo.category && basicInfo.difficulty
      case 2:
        return pricing.type === 'free' || (pricing.price && Number(pricing.price) > 0)
      case 3:
        return modules.length > 0 && modules.every(m => m.lessons.length > 0)
      default:
        return true
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    toast.success('Course created successfully!')
  }

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/courses"
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create New Course</h1>
          <p className="text-muted-foreground">Fill in the details to create your course</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                    currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : currentStep === step.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.name}
                  </p>
                  <p className="text-xs text-muted-foreground hidden sm:block">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-full h-1 mx-4 rounded ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-muted'
                  }`}
                  style={{ minWidth: '60px' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-card border border-border rounded-xl p-6">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={basicInfo.title}
                    onChange={(e) => setBasicInfo({ ...basicInfo, title: e.target.value })}
                    placeholder="e.g., Advanced React Patterns"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={basicInfo.shortDescription}
                    onChange={(e) => setBasicInfo({ ...basicInfo, shortDescription: e.target.value })}
                    placeholder="A brief one-line description"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Full Description *
                  </label>
                  <textarea
                    value={basicInfo.description}
                    onChange={(e) => setBasicInfo({ ...basicInfo, description: e.target.value })}
                    rows={5}
                    placeholder="Detailed course description..."
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Category *
                    </label>
                    <select
                      value={basicInfo.category}
                      onChange={(e) => setBasicInfo({ ...basicInfo, category: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Difficulty *
                    </label>
                    <select
                      value={basicInfo.difficulty}
                      onChange={(e) => setBasicInfo({ ...basicInfo, difficulty: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select level</option>
                      {difficultyLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Instructor
                  </label>
                  <select
                    value={basicInfo.instructor}
                    onChange={(e) => setBasicInfo({ ...basicInfo, instructor: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select instructor</option>
                    {instructors.map((inst) => (
                      <option key={inst.id} value={inst.id}>{inst.name} - {inst.role}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Thumbnail
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-4">
                  {basicInfo.thumbnailPreview ? (
                    <div className="relative">
                      <img
                        src={basicInfo.thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full aspect-video object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setBasicInfo({ ...basicInfo, thumbnail: null, thumbnailPreview: '' })}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center py-8 cursor-pointer">
                      <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                      <span className="text-sm font-medium text-foreground">Upload thumbnail</span>
                      <span className="text-xs text-muted-foreground">1280x720 recommended</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleThumbnailChange}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Pricing */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Pricing Options</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: 'free', label: 'Free', description: 'No charge for enrollment' },
                { value: 'paid', label: 'One-time Payment', description: 'Single purchase price' },
                { value: 'subscription', label: 'Subscription', description: 'Part of membership' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPricing({ ...pricing, type: option.value })}
                  className={`p-4 border rounded-xl text-left transition-colors ${
                    pricing.type === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <p className="font-medium text-foreground">{option.label}</p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </button>
              ))}
            </div>

            {pricing.type === 'paid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Price *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="number"
                      value={pricing.price}
                      onChange={(e) => setPricing({ ...pricing, price: e.target.value })}
                      placeholder="99"
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Original Price (for discounts)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="number"
                      value={pricing.originalPrice}
                      onChange={(e) => setPricing({ ...pricing, originalPrice: e.target.value })}
                      placeholder="149"
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Access Duration
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { value: 'lifetime', label: 'Lifetime Access' },
                  { value: '1year', label: '1 Year' },
                  { value: '6months', label: '6 Months' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPricing({ ...pricing, accessType: option.value })}
                    className={`px-4 py-3 border rounded-lg transition-colors ${
                      pricing.accessType === option.value
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Curriculum */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Course Curriculum</h2>
              <button
                onClick={addModule}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Add Module
              </button>
            </div>

            <div className="space-y-4">
              {modules.map((module, moduleIndex) => (
                <div key={module.id} className="border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center gap-3 p-4 bg-accent/50">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Module {moduleIndex + 1}
                    </span>
                    <input
                      type="text"
                      value={module.title}
                      onChange={(e) => updateModule(module.id, e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={() => addLesson(module.id)}
                      className="p-2 text-primary hover:bg-primary/10 rounded"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteModule(module.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="divide-y divide-border">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div key={lesson.id} className="flex items-center gap-3 p-3 pl-12">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                        <span className="text-sm text-muted-foreground w-8">
                          {moduleIndex + 1}.{lessonIndex + 1}
                        </span>
                        <select
                          value={lesson.type}
                          onChange={(e) => updateLesson(module.id, lesson.id, { type: e.target.value as 'video' | 'text' | 'quiz' })}
                          className="px-2 py-1 border border-border rounded bg-background text-sm"
                        >
                          <option value="video">Video</option>
                          <option value="text">Text</option>
                          <option value="quiz">Quiz</option>
                        </select>
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                          className="flex-1 px-3 py-1.5 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                        <input
                          type="text"
                          value={lesson.duration}
                          onChange={(e) => updateLesson(module.id, lesson.id, { duration: e.target.value })}
                          placeholder="5:00"
                          className="w-20 px-2 py-1.5 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm text-center"
                        />
                        <button
                          onClick={() => deleteLesson(module.id, lesson.id)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {module.lessons.length === 0 && (
                      <div className="p-4 pl-12 text-sm text-muted-foreground">
                        No lessons yet. Click + to add a lesson.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Review Your Course</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-accent/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-3">Basic Information</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Title</dt>
                      <dd className="font-medium text-foreground">{basicInfo.title || '-'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Category</dt>
                      <dd className="text-foreground">{basicInfo.category || '-'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Difficulty</dt>
                      <dd className="text-foreground">{basicInfo.difficulty || '-'}</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-accent/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-3">Pricing</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Type</dt>
                      <dd className="font-medium text-foreground capitalize">{pricing.type}</dd>
                    </div>
                    {pricing.type === 'paid' && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Price</dt>
                        <dd className="font-medium text-foreground">${pricing.price}</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Access</dt>
                      <dd className="text-foreground capitalize">{pricing.accessType.replace('1year', '1 Year').replace('6months', '6 Months')}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="bg-accent/50 rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-3">Curriculum Summary</h3>
                <div className="flex items-center gap-6 mb-4">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{modules.length}</p>
                    <p className="text-sm text-muted-foreground">Modules</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{totalLessons}</p>
                    <p className="text-sm text-muted-foreground">Lessons</p>
                  </div>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {modules.map((module, i) => (
                    <div key={module.id} className="text-sm">
                      <p className="font-medium text-foreground">{i + 1}. {module.title}</p>
                      <p className="text-muted-foreground pl-4">{module.lessons.length} lessons</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </button>

        {currentStep < 4 ? (
          <button
            onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Create Course
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
