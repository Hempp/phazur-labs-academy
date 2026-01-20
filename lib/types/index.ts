// Shared types for Phazur Labs Academy
// These types are used across admin and student dashboards

// User types
export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: 'student' | 'instructor' | 'admin'
  created_at: string
  updated_at: string
}

export interface Student extends User {
  role: 'student'
  enrollments: Enrollment[]
  certificates: Certificate[]
  streak_days: number
  total_hours_learned: number
}

export interface Instructor extends User {
  role: 'instructor'
  bio?: string
  expertise: string[]
  courses_created: string[]
  rating: number
  total_students: number
}

// Course types
export type CourseStatus = 'draft' | 'pending' | 'published' | 'archived'
export type CourseVisibility = 'public' | 'private' | 'unlisted'
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'

export interface Course {
  id: string
  title: string
  slug: string
  description: string
  thumbnail_url?: string
  instructor_id: string
  instructor: Instructor
  category: string
  level: CourseLevel
  status: CourseStatus
  visibility: CourseVisibility
  price: number
  discount_price?: number
  currency: string
  total_duration_minutes: number
  total_lessons: number
  total_videos: number
  rating: number
  reviews_count: number
  enrolled_students: number
  completion_rate: number
  revenue: number
  tags: string[]
  prerequisites: string[]
  learning_outcomes: string[]
  sections: CourseSection[]
  created_at: string
  updated_at: string
  published_at?: string
}

export interface CourseSection {
  id: string
  course_id: string
  title: string
  description?: string
  order: number
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  section_id: string
  title: string
  description?: string
  type: 'video' | 'text' | 'quiz' | 'assignment' | 'live'
  content_url?: string
  duration_minutes: number
  order: number
  is_preview: boolean
  resources: LessonResource[]
}

export interface LessonResource {
  id: string
  lesson_id: string
  title: string
  type: 'pdf' | 'link' | 'code' | 'download'
  url: string
}

// Enrollment types
export type EnrollmentStatus = 'active' | 'completed' | 'expired' | 'refunded'

export interface Enrollment {
  id: string
  student_id: string
  student: Student
  course_id: string
  course: Course
  status: EnrollmentStatus
  progress_percentage: number
  completed_lessons: string[]
  last_accessed_at?: string
  enrolled_at: string
  completed_at?: string
  expires_at?: string
  certificate_id?: string
}

// Progress types
export interface LessonProgress {
  id: string
  enrollment_id: string
  lesson_id: string
  completed: boolean
  watch_time_seconds: number
  completed_at?: string
  notes?: string
}

export interface QuizAttempt {
  id: string
  enrollment_id: string
  quiz_id: string
  score: number
  max_score: number
  passed: boolean
  answers: QuizAnswer[]
  started_at: string
  completed_at?: string
}

export interface QuizAnswer {
  question_id: string
  selected_option_id: string
  is_correct: boolean
}

export interface AssignmentSubmission {
  id: string
  enrollment_id: string
  assignment_id: string
  submission_url: string
  feedback?: string
  grade?: number
  status: 'pending' | 'graded' | 'resubmit'
  submitted_at: string
  graded_at?: string
}

// Certificate types
export interface Certificate {
  id: string
  student_id: string
  course_id: string
  course_title: string
  student_name: string
  issue_date: string
  certificate_number: string
  verification_url: string
  pdf_url: string
}

// Live Training types
export type LiveTrainingPlatform = 'zoom' | 'google_meet' | 'teams'
export type LiveTrainingStatus = 'scheduled' | 'live' | 'completed' | 'cancelled'

export interface LiveTraining {
  id: string
  course_id?: string
  course?: Course
  title: string
  description?: string
  instructor_id: string
  instructor: Instructor
  platform: LiveTrainingPlatform
  meeting_url: string
  meeting_id?: string
  meeting_password?: string
  scheduled_start: string
  scheduled_end: string
  actual_start?: string
  actual_end?: string
  status: LiveTrainingStatus
  max_participants?: number
  registered_participants: string[]
  attended_participants: string[]
  recording_url?: string
  is_recurring: boolean
  recurrence_rule?: string
  created_at: string
  updated_at: string
}

export interface LiveTrainingRegistration {
  id: string
  live_training_id: string
  student_id: string
  registered_at: string
  attended: boolean
  attended_at?: string
  attended_duration_minutes?: number
}

// Activity types
export type ActivityType =
  | 'enrollment'
  | 'completion'
  | 'certificate'
  | 'quiz'
  | 'assignment'
  | 'video_upload'
  | 'course_created'
  | 'live_training'

export interface Activity {
  id: string
  type: ActivityType
  message: string
  user_id?: string
  course_id?: string
  related_id?: string
  metadata?: Record<string, unknown>
  created_at: string
}

// Analytics types
export interface CourseAnalytics {
  course_id: string
  total_enrollments: number
  active_students: number
  completion_rate: number
  average_rating: number
  total_revenue: number
  enrollments_by_date: { date: string; count: number }[]
  completions_by_date: { date: string; count: number }[]
  revenue_by_date: { date: string; amount: number }[]
  popular_lessons: { lesson_id: string; views: number }[]
  drop_off_lessons: { lesson_id: string; drop_off_rate: number }[]
}

export interface StudentAnalytics {
  student_id: string
  total_courses_enrolled: number
  courses_completed: number
  certificates_earned: number
  total_hours_learned: number
  current_streak: number
  longest_streak: number
  average_quiz_score: number
  learning_by_day: { day: string; hours: number }[]
  category_distribution: { category: string; hours: number }[]
}

export interface AdminDashboardStats {
  total_students: number
  active_students: number
  total_courses: number
  published_courses: number
  total_enrollments: number
  total_completions: number
  total_revenue: number
  monthly_revenue: number
  average_completion_rate: number
  average_rating: number
}

// Notification types
export type NotificationType =
  | 'course_update'
  | 'live_training_reminder'
  | 'quiz_due'
  | 'assignment_due'
  | 'certificate_ready'
  | 'announcement'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  action_url?: string
  read: boolean
  created_at: string
}
