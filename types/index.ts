// ============================================================================
// Core User Types
// ============================================================================

export type UserRole = 'student' | 'instructor' | 'admin'

export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: UserRole
  bio?: string
  created_at: string
  updated_at: string
  is_active: boolean
  email_verified: boolean
  profile_completed: boolean
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  email_notifications: boolean
  course_reminders: boolean
  marketing_emails: boolean
  language: string
  timezone: string
  playback_speed: number
  autoplay_videos: boolean
  show_captions: boolean
}

export interface InstructorProfile extends User {
  title?: string
  expertise: string[]
  social_links: SocialLinks
  total_students: number
  total_courses: number
  average_rating: number
  verified: boolean
}

export interface SocialLinks {
  website?: string
  twitter?: string
  linkedin?: string
  github?: string
  youtube?: string
}

// ============================================================================
// Course Types
// ============================================================================

export type CourseStatus = 'draft' | 'published' | 'archived'
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'all-levels'

export interface Course {
  id: string
  slug: string
  title: string
  subtitle?: string
  description: string
  thumbnail_url: string
  preview_video_url?: string
  instructor_id: string
  instructor?: InstructorProfile
  category_id: string
  category?: Category
  subcategory_id?: string
  subcategory?: Category
  tags: string[]
  level: CourseLevel
  language: string
  price: number
  sale_price?: number
  currency: string
  is_free: boolean
  is_featured: boolean
  is_bestseller: boolean
  is_new: boolean
  status: CourseStatus
  requirements: string[]
  what_you_will_learn: string[]
  target_audience: string[]
  total_duration_minutes: number
  total_lessons: number
  total_quizzes: number
  total_resources: number
  average_rating: number
  total_ratings: number
  total_enrollments: number
  created_at: string
  updated_at: string
  published_at?: string
  modules: Module[]
}

export interface Category {
  id: string
  slug: string
  name: string
  description?: string
  icon?: string
  parent_id?: string
  course_count: number
  order: number
}

export interface Module {
  id: string
  course_id: string
  title: string
  description?: string
  order: number
  is_free_preview: boolean
  lessons: Lesson[]
  quizzes: Quiz[]
}

export interface Lesson {
  id: string
  module_id: string
  title: string
  description?: string
  content_type: LessonContentType
  video_url?: string
  video_duration_seconds?: number
  article_content?: string
  order: number
  is_free_preview: boolean
  resources: Resource[]
  chapters: VideoChapter[]
  // Video placeholder fields
  video_status?: VideoStatus
  video_type?: VideoType
  estimated_duration_seconds?: number
  video_description?: string
  expected_ready_date?: string
}

export type LessonContentType = 'video' | 'article' | 'quiz' | 'assignment' | 'live'
export type VideoStatus = 'ready' | 'in_production' | 'scheduled' | 'coming_soon' | 'placeholder'
export type VideoType = 'lecture' | 'demonstration' | 'interview' | 'walkthrough' | 'summary' | 'introduction' | 'recap'

export interface VideoChapter {
  id: string
  lesson_id: string
  title: string
  start_time_seconds: number
}

export interface Resource {
  id: string
  lesson_id: string
  title: string
  type: ResourceType
  url: string
  file_size?: number
  order: number
}

export type ResourceType = 'pdf' | 'zip' | 'link' | 'code' | 'image' | 'document'

// ============================================================================
// Quiz Types
// ============================================================================

export interface Quiz {
  id: string
  module_id?: string
  course_id: string
  title: string
  description?: string
  time_limit_minutes?: number
  passing_score: number
  max_attempts?: number
  show_correct_answers: boolean
  shuffle_questions: boolean
  shuffle_answers: boolean
  questions: Question[]
  order: number
}

export interface Question {
  id: string
  quiz_id: string
  type: QuestionType
  question_text: string
  explanation?: string
  points: number
  order: number
  answers: Answer[]
  correct_answer_ids: string[]
  fill_blank_answers?: string[]
  matching_pairs?: MatchingPair[]
}

export type QuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'true_false'
  | 'fill_blank'
  | 'matching'
  | 'short_answer'
  | 'code'

export interface Answer {
  id: string
  question_id: string
  answer_text: string
  is_correct: boolean
  order: number
}

export interface MatchingPair {
  id: string
  left_text: string
  right_text: string
}

export interface QuizAttempt {
  id: string
  quiz_id: string
  user_id: string
  started_at: string
  completed_at?: string
  score: number
  passed: boolean
  answers: QuizAttemptAnswer[]
  time_spent_seconds: number
}

export interface QuizAttemptAnswer {
  question_id: string
  selected_answer_ids: string[]
  text_answer?: string
  is_correct: boolean
  points_earned: number
}

// ============================================================================
// Enrollment & Progress Types
// ============================================================================

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  enrolled_at: string
  completed_at?: string
  progress_percentage: number
  last_accessed_at: string
  is_active: boolean
  payment_id?: string
  expires_at?: string
}

export interface LessonProgress {
  id: string
  user_id: string
  lesson_id: string
  course_id: string
  started_at: string
  completed_at?: string
  watch_time_seconds: number
  last_position_seconds: number
  is_completed: boolean
  notes?: string
}

export interface CourseProgress {
  enrollment_id: string
  course_id: string
  total_lessons: number
  completed_lessons: number
  total_quizzes: number
  passed_quizzes: number
  total_watch_time_seconds: number
  progress_percentage: number
  current_lesson_id?: string
  streak_days: number
  last_activity_at: string
}

// ============================================================================
// Certificate Types
// ============================================================================

export interface Certificate {
  id: string
  user_id: string
  course_id: string
  certificate_number: string
  issued_at: string
  expires_at?: string
  grade?: string
  pdf_url: string
  verification_url: string
}

// ============================================================================
// Discussion Types
// ============================================================================

export interface Discussion {
  id: string
  course_id: string
  lesson_id?: string
  user_id: string
  user?: User
  title: string
  content: string
  is_pinned: boolean
  is_resolved: boolean
  upvotes: number
  replies_count: number
  created_at: string
  updated_at: string
}

export interface DiscussionReply {
  id: string
  discussion_id: string
  user_id: string
  user?: User
  content: string
  is_instructor_reply: boolean
  is_answer: boolean
  upvotes: number
  created_at: string
  updated_at: string
}

// ============================================================================
// Review Types
// ============================================================================

export interface Review {
  id: string
  course_id: string
  user_id: string
  user?: User
  rating: number
  title?: string
  content: string
  is_featured: boolean
  instructor_response?: string
  instructor_responded_at?: string
  helpful_count: number
  created_at: string
  updated_at: string
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface CourseAnalytics {
  course_id: string
  total_enrollments: number
  active_learners: number
  completion_rate: number
  average_rating: number
  total_revenue: number
  engagement_metrics: EngagementMetrics
  completion_by_module: ModuleCompletion[]
  revenue_by_period: RevenuePeriod[]
}

export interface EngagementMetrics {
  average_watch_time_minutes: number
  average_quiz_score: number
  discussion_posts: number
  lesson_completions_per_day: number[]
}

export interface ModuleCompletion {
  module_id: string
  module_title: string
  completion_rate: number
  average_score: number
}

export interface RevenuePeriod {
  period: string
  revenue: number
  enrollments: number
}

export interface StudentAnalytics {
  user_id: string
  total_courses_enrolled: number
  total_courses_completed: number
  total_watch_time_hours: number
  total_quizzes_passed: number
  average_quiz_score: number
  certificates_earned: number
  current_streak: number
  longest_streak: number
  learning_goals: LearningGoal[]
  activity_heatmap: ActivityDay[]
}

export interface LearningGoal {
  id: string
  user_id: string
  type: 'weekly_hours' | 'courses_per_month' | 'lessons_per_day'
  target: number
  current: number
  period_start: string
  period_end: string
}

export interface ActivityDay {
  date: string
  minutes_learned: number
  lessons_completed: number
}

// ============================================================================
// Notification Types
// ============================================================================

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  action_url?: string
  is_read: boolean
  created_at: string
}

export type NotificationType =
  | 'course_update'
  | 'new_lesson'
  | 'quiz_result'
  | 'certificate_issued'
  | 'discussion_reply'
  | 'announcement'
  | 'reminder'
  | 'achievement'

// ============================================================================
// Payment Types
// ============================================================================

export interface Payment {
  id: string
  user_id: string
  course_id: string
  amount: number
  currency: string
  status: PaymentStatus
  payment_method: string
  stripe_payment_intent_id?: string
  created_at: string
  completed_at?: string
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}

export interface ApiError {
  message: string
  code: string
  details?: Record<string, string[]>
}

// ============================================================================
// Form Types
// ============================================================================

export interface CourseFormData {
  title: string
  subtitle?: string
  description: string
  category_id: string
  subcategory_id?: string
  level: CourseLevel
  language: string
  price: number
  is_free: boolean
  requirements: string[]
  what_you_will_learn: string[]
  target_audience: string[]
  tags: string[]
}

export interface LessonFormData {
  title: string
  description?: string
  content_type: LessonContentType
  video_url?: string
  article_content?: string
  is_free_preview: boolean
}

export interface QuizFormData {
  title: string
  description?: string
  time_limit_minutes?: number
  passing_score: number
  max_attempts?: number
  show_correct_answers: boolean
  shuffle_questions: boolean
  questions: QuestionFormData[]
}

export interface QuestionFormData {
  type: QuestionType
  question_text: string
  explanation?: string
  points: number
  answers: AnswerFormData[]
}

export interface AnswerFormData {
  answer_text: string
  is_correct: boolean
}

// ============================================================================
// Filter & Search Types
// ============================================================================

export interface CourseFilters {
  category?: string
  subcategory?: string
  level?: CourseLevel
  price_range?: {
    min: number
    max: number
  }
  rating?: number
  duration?: 'short' | 'medium' | 'long'
  is_free?: boolean
  language?: string
  sort_by?: 'popular' | 'newest' | 'rating' | 'price_low' | 'price_high'
}

export interface SearchParams {
  query: string
  filters?: CourseFilters
  page?: number
  per_page?: number
}
