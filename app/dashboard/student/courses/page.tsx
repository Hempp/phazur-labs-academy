'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Clock,
  Play,
  CheckCircle2,
  Filter,
  Search,
  Grid3X3,
  List,
  Trophy,
  Calendar,
  ArrowRight,
  MoreVertical,
  Download,
  Share2,
  ExternalLink,
  Lock,
  Flame,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { StarRating } from '@/components/ui/star-rating';

// Types for course data
interface CourseData {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string | null;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  totalDuration: string;
  timeRemaining: string;
  lastAccessed: Date | null;
  status: 'in_progress' | 'completed' | 'not_started';
  level: string;
  rating: number;
  nextLesson: string | null;
  category: string;
  certificate?: boolean;
  slug?: string;
}

interface DashboardStats {
  streakDays: number;
  totalHoursLearned: number;
  certificatesCount: number;
}

// Fallback mock data when API unavailable
const mockEnrolledCourses: CourseData[] = [
  {
    id: 'course-1',
    title: 'Advanced React Patterns & Best Practices',
    instructor: 'Sarah Johnson',
    thumbnail: null,
    progress: 65,
    totalLessons: 48,
    completedLessons: 31,
    totalDuration: '12h 45m',
    timeRemaining: '4h 30m',
    lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: 'in_progress',
    level: 'Advanced',
    rating: 4.9,
    nextLesson: 'Building Reusable Data Fetchers',
    category: 'Web Development',
  },
  {
    id: 'course-2',
    title: 'TypeScript Masterclass: Zero to Hero',
    instructor: 'Michael Chen',
    thumbnail: null,
    progress: 42,
    totalLessons: 56,
    completedLessons: 24,
    totalDuration: '16h 20m',
    timeRemaining: '9h 25m',
    lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'in_progress',
    level: 'Intermediate',
    rating: 4.8,
    nextLesson: 'Generic Constraints & Type Guards',
    category: 'Programming Languages',
  },
  {
    id: 'course-3',
    title: 'Node.js Backend Development',
    instructor: 'Emma Wilson',
    thumbnail: null,
    progress: 23,
    totalLessons: 62,
    completedLessons: 14,
    totalDuration: '18h 15m',
    timeRemaining: '14h 05m',
    lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 48),
    status: 'in_progress',
    level: 'Intermediate',
    rating: 4.7,
    nextLesson: 'Express Middleware Deep Dive',
    category: 'Backend Development',
  },
  {
    id: 'course-4',
    title: 'JavaScript Fundamentals',
    instructor: 'David Park',
    thumbnail: null,
    progress: 100,
    totalLessons: 38,
    completedLessons: 38,
    totalDuration: '8h 30m',
    timeRemaining: '0h',
    lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    status: 'completed',
    level: 'Beginner',
    rating: 4.9,
    nextLesson: null,
    category: 'Programming Languages',
    certificate: true,
  },
  {
    id: 'course-5',
    title: 'CSS & Tailwind Mastery',
    instructor: 'Lisa Anderson',
    thumbnail: null,
    progress: 100,
    totalLessons: 44,
    completedLessons: 44,
    totalDuration: '10h 15m',
    timeRemaining: '0h',
    lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    status: 'completed',
    level: 'Intermediate',
    rating: 4.8,
    nextLesson: null,
    category: 'Web Development',
    certificate: true,
  },
  {
    id: 'course-6',
    title: 'Docker & Kubernetes Essentials',
    instructor: 'Robert Taylor',
    thumbnail: null,
    progress: 0,
    totalLessons: 52,
    completedLessons: 0,
    totalDuration: '14h 40m',
    timeRemaining: '14h 40m',
    lastAccessed: null,
    status: 'not_started',
    level: 'Advanced',
    rating: 4.6,
    nextLesson: 'Introduction to Containers',
    category: 'DevOps',
  },
];

// Transform API enrollment data to component format
function transformEnrollment(enrollment: {
  id: string;
  course_id: string;
  progress_percentage: number;
  status: string;
  enrolled_at: string;
  completed_at: string | null;
  last_accessed_at: string | null;
  course: {
    id: string;
    title: string;
    slug?: string;
    thumbnail_url: string | null;
    category: string;
    level: string;
    instructor: { full_name: string; avatar_url: string | null } | null;
  } | null;
  completed_lessons: number;
  total_lessons: number;
}, hasCertificate: boolean): CourseData {
  const course = enrollment.course;
  const remainingLessons = enrollment.total_lessons - enrollment.completed_lessons;
  // Estimate ~10 minutes per lesson for time remaining
  const remainingMinutes = remainingLessons * 10;
  const totalMinutes = enrollment.total_lessons * 10;

  // Map API status to component status
  let status: 'in_progress' | 'completed' | 'not_started' = 'in_progress';
  if (enrollment.status === 'completed' || enrollment.progress_percentage === 100) {
    status = 'completed';
  } else if (enrollment.progress_percentage === 0 && !enrollment.last_accessed_at) {
    status = 'not_started';
  }

  return {
    id: enrollment.course_id,
    title: course?.title || 'Untitled Course',
    instructor: course?.instructor?.full_name || 'Unknown Instructor',
    thumbnail: course?.thumbnail_url || null,
    progress: Math.round(enrollment.progress_percentage),
    totalLessons: enrollment.total_lessons,
    completedLessons: enrollment.completed_lessons,
    totalDuration: formatMinutes(totalMinutes),
    timeRemaining: formatMinutes(remainingMinutes),
    lastAccessed: enrollment.last_accessed_at ? new Date(enrollment.last_accessed_at) : null,
    status,
    level: course?.level || 'Beginner',
    rating: 4.5 + Math.random() * 0.5, // Placeholder rating
    nextLesson: status !== 'completed' ? 'Continue Learning' : null,
    category: course?.category || 'General',
    certificate: hasCertificate,
    slug: course?.slug,
  };
}

function formatMinutes(minutes: number): string {
  if (minutes === 0) return '0h';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

type FilterStatus = 'all' | 'in_progress' | 'completed' | 'not_started';
type SortOption = 'recent' | 'progress' | 'alphabetical';

export default function StudentCoursesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Data state
  const [courses, setCourses] = useState<CourseData[]>(mockEnrolledCourses);
  const [stats, setStats] = useState<DashboardStats>({ streakDays: 7, totalHoursLearned: 0, certificatesCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    async function fetchDashboard() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/student/dashboard');

        if (!response.ok) {
          if (response.status === 401) {
            // Not authenticated - use mock data
            setCourses(mockEnrolledCourses);
            return;
          }
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();

        // Get certificate course IDs
        const certificateCourseIds = new Set(
          (data.certificates || []).map((cert: { course_id: string }) => cert.course_id)
        );

        // Transform enrollments to course data
        const transformedCourses = (data.enrollments || []).map((enrollment: Parameters<typeof transformEnrollment>[0]) =>
          transformEnrollment(enrollment, certificateCourseIds.has(enrollment.course_id))
        );

        if (transformedCourses.length > 0) {
          setCourses(transformedCourses);
        } else {
          // No enrollments - keep mock for demo
          setCourses(mockEnrolledCourses);
        }

        // Set stats
        setStats({
          streakDays: data.student?.streak_days || data.analytics?.current_streak || 0,
          totalHoursLearned: data.student?.total_hours_learned || data.analytics?.total_hours_learned || 0,
          certificatesCount: data.certificates?.length || 0,
        });

      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setError(err instanceof Error ? err.message : 'Failed to load courses');
        // Keep mock data on error
        setCourses(mockEnrolledCourses);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  const categories = ['all', ...new Set(courses.map(c => c.category))];

  // Filter and sort courses
  const filteredCourses = courses
    .filter(course => {
      if (filterStatus !== 'all' && course.status !== filterStatus) return false;
      if (selectedCategory !== 'all' && course.category !== selectedCategory) return false;
      if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          const aTime = a.lastAccessed?.getTime() || 0;
          const bTime = b.lastAccessed?.getTime() || 0;
          return bTime - aTime;
        case 'progress':
          return b.progress - a.progress;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const inProgressCount = courses.filter(c => c.status === 'in_progress').length;
  const completedCount = courses.filter(c => c.status === 'completed').length;

  const formatLastAccessed = (date: Date | null) => {
    if (!date) return 'Not started';
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full">In Progress</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">Completed</span>;
      case 'not_started':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-500/20 text-gray-400 rounded-full">Not Started</span>;
    }
  };

  const getLevelBadge = (level: string) => {
    const colors = {
      Beginner: 'bg-green-500/20 text-green-400',
      Intermediate: 'bg-amber-500/20 text-amber-400',
      Advanced: 'bg-red-500/20 text-red-400',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[level as keyof typeof colors]}`}>
        {level}
      </span>
    );
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 w-48 bg-gray-700 rounded"></div>
          <div className="h-4 w-32 bg-gray-700 rounded mt-2"></div>
        </div>
        <div className="h-10 w-40 bg-gray-700 rounded-lg"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
              <div>
                <div className="h-6 w-8 bg-gray-700 rounded mb-1"></div>
                <div className="h-3 w-16 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
            <div className="aspect-video bg-gray-700"></div>
            <div className="p-4 space-y-3">
              <div className="h-5 w-3/4 bg-gray-700 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
              <div className="h-2 w-full bg-gray-700 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-sm text-red-400">{error}</p>
            <p className="text-xs text-gray-400 mt-1">Showing demo data instead</p>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Courses</h1>
          <p className="text-gray-400 mt-1">
            {inProgressCount} in progress • {completedCount} completed
          </p>
        </div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Browse More Courses
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{inProgressCount}</p>
              <p className="text-xs text-gray-400">In Progress</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{completedCount}</p>
              <p className="text-xs text-gray-400">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.certificatesCount || completedCount}</p>
              <p className="text-xs text-gray-400">Certificates</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.streakDays}</p>
              <p className="text-xs text-gray-400">Day Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search your courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="not_started">Not Started</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="recent">Recently Accessed</option>
            <option value="progress">Progress</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
          <div className="flex bg-gray-800 border border-gray-700 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Course Grid/List */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No courses found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your filters or search query</p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-gray-600 transition-all group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-gray-600" />
                </div>
                <div className="absolute top-3 left-3">
                  {getLevelBadge(course.level)}
                </div>
                <div className="absolute top-3 right-3">
                  {getStatusBadge(course.status)}
                </div>
                {course.certificate && (
                  <div className="absolute bottom-3 right-3">
                    <div className="flex items-center gap-1 bg-amber-500/90 px-2 py-1 rounded-full">
                      <Trophy className="w-3 h-3 text-white" />
                      <span className="text-xs font-medium text-white">Certified</span>
                    </div>
                  </div>
                )}
                <Link
                  href={`/dashboard/student/courses/${course.id}/learn`}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-indigo-600 ml-1" />
                  </div>
                </Link>
              </div>

              {/* Content */}
              <div className="p-4">
                <Link
                  href={`/dashboard/student/courses/${course.id}/learn`}
                  className="block"
                >
                  <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                </Link>
                <p className="text-sm text-gray-400 mt-1">{course.instructor}</p>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">
                      {course.completedLessons}/{course.totalLessons} lessons
                    </span>
                    <span className="font-medium text-white">{course.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        course.progress === 100
                          ? 'bg-green-500'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                      }`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">{course.timeRemaining} left</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">{formatLastAccessed(course.lastAccessed)}</span>
                  </div>
                </div>

                {/* Next Lesson */}
                {course.nextLesson && (
                  <Link
                    href={`/dashboard/student/courses/${course.id}/learn`}
                    className="flex items-center justify-between mt-4 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm text-gray-300 truncate max-w-[180px]">
                        {course.nextLesson}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-all"
            >
              <div className="flex gap-4">
                {/* Thumbnail */}
                <div className="relative w-48 h-28 flex-shrink-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-gray-600" />
                  </div>
                  {course.certificate && (
                    <div className="absolute bottom-2 right-2">
                      <Trophy className="w-5 h-5 text-amber-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getLevelBadge(course.level)}
                        {getStatusBadge(course.status)}
                      </div>
                      <Link
                        href={`/dashboard/student/courses/${course.id}/learn`}
                        className="text-lg font-semibold text-white hover:text-indigo-400 transition-colors"
                      >
                        {course.title}
                      </Link>
                      <p className="text-sm text-gray-400 mt-1">{course.instructor}</p>
                    </div>
                    <StarRating rating={course.rating} showValue size="sm" />
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-400">
                        {course.completedLessons}/{course.totalLessons} lessons • {course.timeRemaining} remaining
                      </span>
                      <span className="font-medium text-white">{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          course.progress === 100 ? 'bg-green-500' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">
                      Last accessed: {formatLastAccessed(course.lastAccessed)}
                    </span>
                    <Link
                      href={`/dashboard/student/courses/${course.id}/learn`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      {course.status === 'not_started' ? 'Start Course' : 'Continue'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
