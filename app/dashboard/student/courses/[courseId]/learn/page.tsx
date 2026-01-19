'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Play,
  CheckCircle2,
  Circle,
  Lock,
  FileText,
  HelpCircle,
  Clock,
  BookOpen,
  MessageSquare,
  Download,
  Share2,
  Flag,
  Bookmark,
  BookmarkCheck,
  ThumbsUp,
  ArrowLeft,
  Menu,
  X,
  Shield,
  Award,
  Flame,
  ListChecks,
} from 'lucide-react';
import ProtectedVideoPlayer from '@/components/protected-video-player';
import { useContentProtection, useVideoProgress } from '@/hooks/use-content-protection';

// Mock user data
const mockUser = {
  id: 'user-123',
  email: 'alex.johnson@example.com',
  name: 'Alex Johnson',
};

// Mock course data
const mockCourse = {
  id: 'course-1',
  title: 'Advanced React Patterns & Best Practices',
  instructor: {
    name: 'Sarah Johnson',
    avatar: null,
    title: 'Senior React Developer',
  },
  totalDuration: '12h 45m',
  totalLessons: 48,
  completedLessons: 21,
  sections: [
    {
      id: 'section-1',
      title: 'Introduction to Advanced Patterns',
      lessons: [
        { id: 'lesson-1', title: 'Course Overview', type: 'video', duration: '8:24', completed: true, locked: false },
        { id: 'lesson-2', title: 'Setting Up the Development Environment', type: 'video', duration: '15:30', completed: true, locked: false },
        { id: 'lesson-3', title: 'React Fundamentals Refresher', type: 'video', duration: '22:15', completed: true, locked: false },
      ],
    },
    {
      id: 'section-2',
      title: 'Compound Components Pattern',
      lessons: [
        { id: 'lesson-4', title: 'Understanding Compound Components', type: 'video', duration: '18:45', completed: true, locked: false },
        { id: 'lesson-5', title: 'Building a Flexible Tab Component', type: 'video', duration: '25:10', completed: true, locked: false },
        { id: 'lesson-6', title: 'Compound Components Quiz', type: 'quiz', duration: '10 questions', completed: true, locked: false },
        { id: 'lesson-7', title: 'Practice: Build an Accordion', type: 'assignment', duration: 'Assignment', completed: false, locked: false },
      ],
    },
    {
      id: 'section-3',
      title: 'Render Props Pattern',
      lessons: [
        { id: 'lesson-8', title: 'What are Render Props?', type: 'video', duration: '16:20', completed: true, locked: false },
        { id: 'lesson-9', title: 'Building Reusable Data Fetchers', type: 'video', duration: '28:45', completed: false, locked: false, current: true },
        { id: 'lesson-10', title: 'Render Props vs Hooks', type: 'video', duration: '19:30', completed: false, locked: false },
        { id: 'lesson-11', title: 'Render Props Quiz', type: 'quiz', duration: '8 questions', completed: false, locked: false },
      ],
    },
    {
      id: 'section-4',
      title: 'Custom Hooks Pattern',
      lessons: [
        { id: 'lesson-12', title: 'Creating Powerful Custom Hooks', type: 'video', duration: '24:15', completed: false, locked: true },
        { id: 'lesson-13', title: 'Hook Composition Strategies', type: 'video', duration: '21:40', completed: false, locked: true },
        { id: 'lesson-14', title: 'Testing Custom Hooks', type: 'video', duration: '18:55', completed: false, locked: true },
        { id: 'lesson-15', title: 'Custom Hooks Project', type: 'assignment', duration: 'Project', completed: false, locked: true },
      ],
    },
  ],
};

// Current lesson mock
const mockCurrentLesson = {
  id: 'lesson-9',
  title: 'Building Reusable Data Fetchers',
  type: 'video' as const,
  videoUrl: '/videos/sample-lecture.mp4',
  duration: '28:45',
  description: `In this lesson, you'll learn how to build powerful, reusable data fetching components using the render props pattern. We'll cover:

• Creating a flexible data fetcher component
• Handling loading, error, and success states
• Implementing caching strategies
• Composing multiple data fetchers
• Real-world examples and best practices`,
  resources: [
    { name: 'Lesson Slides', type: 'pdf', size: '2.4 MB' },
    { name: 'Code Examples', type: 'zip', size: '156 KB' },
    { name: 'Cheat Sheet', type: 'pdf', size: '890 KB' },
  ],
  transcript: `[00:00] Welcome back to the course. In this lesson, we're going to dive deep into building reusable data fetchers using the render props pattern.

[00:15] First, let's understand why we might want to create a reusable data fetching component. In most React applications, you'll find yourself writing similar data fetching logic over and over again...

[02:30] Now let's look at the basic structure of our DataFetcher component. We'll start with a simple implementation and then enhance it with more features...`,
  notes: [
    { time: 120, text: 'Key concept: Inversion of control' },
    { time: 450, text: 'Remember to handle the error boundary' },
  ],
};

export default function CourseLearnPage() {
  const params = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['section-3']);
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'notes' | 'discussions'>('overview');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  // Content protection
  const { isProtected, session, reportViolation } = useContentProtection({
    userId: mockUser.id,
    contentId: mockCurrentLesson.id,
    onSecurityViolation: (type, details) => {
      console.warn('Security violation:', type, details);
    },
  });

  // Video progress
  const { progress, updateProgress, getProgressPercentage, isComplete } = useVideoProgress(
    mockCurrentLesson.id,
    mockUser.id
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getLessonIcon = (type: string, completed: boolean, locked: boolean) => {
    if (locked) return <Lock className="w-4 h-4 text-gray-400" />;
    if (completed) return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (type === 'video') return <Play className="w-4 h-4 text-indigo-500" />;
    if (type === 'quiz') return <HelpCircle className="w-4 h-4 text-amber-500" />;
    if (type === 'assignment') return <FileText className="w-4 h-4 text-blue-500" />;
    return <Circle className="w-4 h-4 text-gray-400" />;
  };

  const courseProgress = Math.round((mockCourse.completedLessons / mockCourse.totalLessons) * 100);

  return (
    <div className="min-h-screen bg-gray-950 protected-content">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/student/courses"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Courses</span>
            </Link>
            <div className="hidden md:block h-6 w-px bg-gray-700" />
            <h1 className="hidden md:block text-sm font-medium text-white truncate max-w-md">
              {mockCourse.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                  style={{ width: `${courseProgress}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">{courseProgress}%</span>
            </div>

            {/* Protection Badge */}
            <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 px-2.5 py-1 rounded-full">
              <Shield className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Protected</span>
            </div>

            {/* Toggle Sidebar */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ListChecks className="w-4 h-4" />
              <span>Contents</span>
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:mr-80' : ''}`}>
          {/* Video Player */}
          <div className="bg-black">
            <div className="max-w-6xl mx-auto">
              <ProtectedVideoPlayer
                src={mockCurrentLesson.videoUrl}
                title={mockCurrentLesson.title}
                userId={mockUser.id}
                userEmail={mockUser.email}
                contentId={mockCurrentLesson.id}
                onProgress={(time, duration) => updateProgress(time, duration)}
                onComplete={() => {
                  console.log('Lesson completed!');
                }}
                initialProgress={progress}
                watermarkEnabled={true}
              />
            </div>
          </div>

          {/* Lesson Info */}
          <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Lesson Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <span>Section 3</span>
                  <span>•</span>
                  <span>Lesson 9</span>
                  <span>•</span>
                  <Clock className="w-4 h-4" />
                  <span>{mockCurrentLesson.duration}</span>
                </div>
                <h2 className="text-2xl font-bold text-white">{mockCurrentLesson.title}</h2>
                <div className="flex items-center gap-3 mt-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">SJ</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{mockCourse.instructor.name}</p>
                    <p className="text-xs text-gray-400">{mockCourse.instructor.title}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isBookmarked
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                  <span className="text-sm">Bookmark</span>
                </button>
                <button className="p-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button className="p-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors">
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-800 mb-6">
              <div className="flex gap-6">
                {[
                  { id: 'overview', label: 'Overview', icon: BookOpen },
                  { id: 'resources', label: 'Resources', icon: Download },
                  { id: 'notes', label: 'Notes', icon: FileText },
                  { id: 'discussions', label: 'Discussions', icon: MessageSquare },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-white'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">About this lesson</h3>
                  <p className="text-gray-300 whitespace-pre-line">{mockCurrentLesson.description}</p>
                </div>

                {/* Transcript Toggle */}
                <div>
                  <button
                    onClick={() => setShowTranscript(!showTranscript)}
                    className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    {showTranscript ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
                    </span>
                  </button>
                  {showTranscript && (
                    <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-sm text-gray-300 whitespace-pre-line">
                        {mockCurrentLesson.transcript}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-4">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-400">Protected Resources</p>
                    <p className="text-xs text-amber-400/70 mt-1">
                      Resources are for personal educational use only. Downloading and redistribution is prohibited.
                    </p>
                  </div>
                </div>

                {mockCurrentLesson.resources.map((resource, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{resource.name}</p>
                        <p className="text-xs text-gray-400">{resource.type.toUpperCase()} • {resource.size}</p>
                      </div>
                    </div>
                    <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Your notes for this lesson</p>
                  <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                    + Add Note
                  </button>
                </div>
                {mockCurrentLesson.notes.map((note, index) => (
                  <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <Clock className="w-3 h-3" />
                      <span>{Math.floor(note.time / 60)}:{(note.time % 60).toString().padStart(2, '0')}</span>
                    </div>
                    <p className="text-sm text-gray-300">{note.text}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'discussions' && (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No discussions yet</p>
                <button className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                  Start a discussion
                </button>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors">
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous Lesson</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors">
                <span className="hidden sm:inline">Next Lesson</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>

        {/* Course Contents Sidebar */}
        <aside
          className={`fixed top-14 right-0 bottom-0 w-80 bg-gray-900 border-l border-gray-800 overflow-y-auto transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          } hidden lg:block`}
        >
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">Course Content</h3>
              <span className="text-xs text-gray-400">
                {mockCourse.completedLessons}/{mockCourse.totalLessons} completed
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                style={{ width: `${courseProgress}%` }}
              />
            </div>
          </div>

          <div className="py-2">
            {mockCourse.sections.map((section) => (
              <div key={section.id}>
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {expandedSections.includes(section.id) ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-sm font-medium text-white text-left">
                      {section.title}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {section.lessons.filter(l => l.completed).length}/{section.lessons.length}
                  </span>
                </button>

                {expandedSections.includes(section.id) && (
                  <div className="pb-2">
                    {section.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          lesson.current
                            ? 'bg-indigo-600/20 border-l-2 border-indigo-500'
                            : lesson.locked
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-gray-800/50'
                        }`}
                        disabled={lesson.locked}
                      >
                        <div className="ml-4">
                          {getLessonIcon(lesson.type, lesson.completed, lesson.locked)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${
                            lesson.current ? 'text-indigo-400 font-medium' : 'text-gray-300'
                          }`}>
                            {lesson.title}
                          </p>
                          <p className="text-xs text-gray-500">{lesson.duration}</p>
                        </div>
                        {lesson.current && (
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {mobileSidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <aside className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] z-50 bg-gray-900 overflow-y-auto lg:hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <h3 className="font-semibold text-white">Course Content</h3>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">
                    {mockCourse.completedLessons}/{mockCourse.totalLessons} completed
                  </span>
                  <span className="text-xs font-medium text-indigo-400">{courseProgress}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    style={{ width: `${courseProgress}%` }}
                  />
                </div>
              </div>

              <div className="py-2">
                {mockCourse.sections.map((section) => (
                  <div key={section.id}>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {expandedSections.includes(section.id) ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm font-medium text-white text-left">
                          {section.title}
                        </span>
                      </div>
                    </button>

                    {expandedSections.includes(section.id) && (
                      <div className="pb-2">
                        {section.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => !lesson.locked && setMobileSidebarOpen(false)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                              lesson.current
                                ? 'bg-indigo-600/20 border-l-2 border-indigo-500'
                                : lesson.locked
                                ? 'opacity-50'
                                : 'hover:bg-gray-800/50'
                            }`}
                          >
                            <div className="ml-4">
                              {getLessonIcon(lesson.type, lesson.completed, lesson.locked)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm truncate ${
                                lesson.current ? 'text-indigo-400 font-medium' : 'text-gray-300'
                              }`}>
                                {lesson.title}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  );
}
