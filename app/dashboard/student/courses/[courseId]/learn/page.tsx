'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
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
  Flag,
  Bookmark,
  BookmarkCheck,
  ThumbsUp,
  ArrowLeft,
  Menu,
  X,
  Shield,
  ListChecks,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import ProtectedVideoPlayer from '@/components/protected-video-player';
import { useContentProtection, useVideoProgress } from '@/hooks/use-content-protection';

interface Lesson {
  id: string;
  title: string;
  type: string;
  duration: number;
  completed: boolean;
  current: boolean;
  isFreePreview: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CurrentLesson {
  id: string;
  title: string;
  description: string;
  type: string;
  videoUrl: string | null;
  duration: number | null;
  articleContent: string | null;
  moduleId: string;
  resources: Array<{ id: string; title: string; type: string; url: string; file_size: string }>;
  chapters: Array<{ id: string; title: string; start_time_seconds: number }>;
  quiz: unknown;
  progress: { completed: boolean; progress_percent: number; last_position_seconds: number } | null;
}

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string | null;
  instructor: { id: string; name: string; avatar: string | null } | null;
  totalLessons: number;
  completedLessons: number;
  totalDuration: number;
  progress: number;
}

interface LearningData {
  course: Course;
  modules: Module[];
  currentLesson: CurrentLesson | null;
  enrollment: { id: string; status: string; progress: number };
  user: { id: string; email: string };
}

export default function CourseLearnPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const lessonIdParam = searchParams.get('lesson');

  const [data, setData] = useState<LearningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'notes' | 'discussions'>('overview');
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Fetch course data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const url = lessonIdParam
          ? `/api/learn/${courseId}?lessonId=${lessonIdParam}`
          : `/api/learn/${courseId}`;

        const response = await fetch(url);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to load course');
        }

        const result = await response.json();
        setData(result);

        // Expand the section containing the current lesson
        if (result.currentLesson) {
          const currentModuleId = result.currentLesson.moduleId;
          setExpandedSections([currentModuleId]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [courseId, lessonIdParam]);

  // Content protection
  useContentProtection({
    userId: data?.user?.id || '',
    contentId: data?.currentLesson?.id || '',
    onSecurityViolation: (type, details) => {
      console.warn('Security violation:', type, details);
    },
  });

  // Video progress
  const { progress, updateProgress } = useVideoProgress(
    data?.currentLesson?.id || '',
    data?.user?.id || ''
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const navigateToLesson = (lessonId: string) => {
    router.push(`/dashboard/student/courses/${courseId}/learn?lesson=${lessonId}`);
    setMobileSidebarOpen(false);
  };

  const getLessonIcon = (type: string, completed: boolean, locked: boolean) => {
    if (locked) return <Lock className="w-4 h-4 text-gray-400" />;
    if (completed) return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (type === 'video') return <Play className="w-4 h-4 text-indigo-500" />;
    if (type === 'quiz') return <HelpCircle className="w-4 h-4 text-amber-500" />;
    if (type === 'assignment') return <FileText className="w-4 h-4 text-blue-500" />;
    return <Circle className="w-4 h-4 text-gray-400" />;
  };

  // Find next/previous lessons
  const allLessons = data?.modules?.flatMap(m => m.lessons) || [];
  const currentIndex = allLessons.findIndex(l => l.current);
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Format duration
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Unable to Load Course</h2>
          <p className="text-gray-400 mb-6">{error || 'Something went wrong'}</p>
          <Link
            href="/dashboard/student/courses"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const { course, modules, currentLesson, user } = data;
  const courseProgress = course.progress || Math.round((course.completedLessons / course.totalLessons) * 100);

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
              {course.title}
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
          {/* Video/Content Player */}
          <div className="bg-black">
            <div className="max-w-6xl mx-auto">
              {currentLesson?.type === 'video' && currentLesson?.videoUrl ? (
                <ProtectedVideoPlayer
                  src={currentLesson.videoUrl}
                  title={currentLesson.title}
                  userId={user.id}
                  userEmail={user.email || ''}
                  contentId={currentLesson.id}
                  onProgress={(time, duration) => updateProgress(time, duration)}
                  onComplete={() => {
                    console.log('Lesson completed!');
                  }}
                  initialProgress={progress}
                  watermarkEnabled={true}
                />
              ) : currentLesson?.type === 'video' ? (
                <div className="aspect-video bg-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Video content not available</p>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    {currentLesson?.type === 'quiz' ? (
                      <HelpCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    ) : (
                      <FileText className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                    )}
                    <p className="text-xl font-semibold text-white mb-2">
                      {currentLesson?.type === 'quiz' ? 'Quiz' : 'Assignment'}
                    </p>
                    <p className="text-gray-400">{currentLesson?.title}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lesson Info */}
          <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Lesson Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <span>Lesson {currentIndex + 1} of {allLessons.length}</span>
                  <span>•</span>
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(currentLesson?.duration || 0)}</span>
                </div>
                <h2 className="text-2xl font-bold text-white">{currentLesson?.title}</h2>
                {course.instructor && (
                  <div className="flex items-center gap-3 mt-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {course.instructor.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{course.instructor.name}</p>
                      <p className="text-xs text-gray-400">Instructor</p>
                    </div>
                  </div>
                )}
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
                  <p className="text-gray-300 whitespace-pre-line">
                    {currentLesson?.description || 'No description available for this lesson.'}
                  </p>
                </div>

                {/* Article content displayed as text */}
                {currentLesson?.articleContent && (
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <h4 className="text-md font-semibold text-white mb-2">Lesson Content</h4>
                    <p className="text-gray-300 whitespace-pre-line">
                      {currentLesson.articleContent}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-4">
                {currentLesson?.resources && currentLesson.resources.length > 0 ? (
                  <>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-start gap-3">
                      <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-400">Protected Resources</p>
                        <p className="text-xs text-amber-400/70 mt-1">
                          Resources are for personal educational use only.
                        </p>
                      </div>
                    </div>

                    {currentLesson.resources.map((resource) => (
                      <div
                        key={resource.id}
                        className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-indigo-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{resource.title}</p>
                            <p className="text-xs text-gray-400">
                              {resource.type.toUpperCase()} • {resource.file_size}
                            </p>
                          </div>
                        </div>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                        >
                          View
                        </a>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Download className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No resources for this lesson</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Notes feature coming soon</p>
                <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                  + Add Note
                </button>
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
              <button
                onClick={() => previousLesson && navigateToLesson(previousLesson.id)}
                disabled={!previousLesson}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  previousLesson
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous Lesson</span>
              </button>
              <button
                onClick={() => nextLesson && navigateToLesson(nextLesson.id)}
                disabled={!nextLesson}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  nextLesson
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                }`}
              >
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
                {course.completedLessons}/{course.totalLessons} completed
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
            {modules.map((module) => (
              <div key={module.id}>
                <button
                  onClick={() => toggleSection(module.id)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {expandedSections.includes(module.id) ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-sm font-medium text-white text-left">
                      {module.title}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {module.lessons.filter(l => l.completed).length}/{module.lessons.length}
                  </span>
                </button>

                {expandedSections.includes(module.id) && (
                  <div className="pb-2">
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => navigateToLesson(lesson.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          lesson.current
                            ? 'bg-indigo-600/20 border-l-2 border-indigo-500'
                            : 'hover:bg-gray-800/50'
                        }`}
                      >
                        <div className="ml-4">
                          {getLessonIcon(lesson.type, lesson.completed, false)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${
                            lesson.current ? 'text-indigo-400 font-medium' : 'text-gray-300'
                          }`}>
                            {lesson.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {lesson.duration ? `${lesson.duration} min` : lesson.type}
                          </p>
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
                    {course.completedLessons}/{course.totalLessons} completed
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
                {modules.map((module) => (
                  <div key={module.id}>
                    <button
                      onClick={() => toggleSection(module.id)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {expandedSections.includes(module.id) ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm font-medium text-white text-left">
                          {module.title}
                        </span>
                      </div>
                    </button>

                    {expandedSections.includes(module.id) && (
                      <div className="pb-2">
                        {module.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => navigateToLesson(lesson.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                              lesson.current
                                ? 'bg-indigo-600/20 border-l-2 border-indigo-500'
                                : 'hover:bg-gray-800/50'
                            }`}
                          >
                            <div className="ml-4">
                              {getLessonIcon(lesson.type, lesson.completed, false)}
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
