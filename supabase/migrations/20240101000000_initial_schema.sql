-- ============================================================================
-- Phazur Labs Academy - Database Schema
-- Enterprise-grade Learning Management System
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin');
CREATE TYPE course_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE course_level AS ENUM ('beginner', 'intermediate', 'advanced', 'all-levels');
CREATE TYPE lesson_content_type AS ENUM ('video', 'article', 'quiz', 'assignment', 'live');
CREATE TYPE resource_type AS ENUM ('pdf', 'zip', 'link', 'code', 'image', 'document');
CREATE TYPE question_type AS ENUM ('single_choice', 'multiple_choice', 'true_false', 'fill_blank', 'matching', 'short_answer', 'code');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE notification_type AS ENUM ('course_update', 'new_lesson', 'quiz_result', 'certificate_issued', 'discussion_reply', 'announcement', 'reminder', 'achievement');

-- ============================================================================
-- USERS TABLE
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'student',
    bio TEXT,
    title TEXT,
    expertise TEXT[] DEFAULT '{}',
    social_links JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    profile_completed BOOLEAN DEFAULT false,
    preferences JSONB DEFAULT '{
        "theme": "system",
        "email_notifications": true,
        "course_reminders": true,
        "marketing_emails": false,
        "language": "en",
        "timezone": "UTC",
        "playback_speed": 1,
        "autoplay_videos": true,
        "show_captions": false
    }'::JSONB,
    -- Instructor specific fields
    total_students INTEGER DEFAULT 0,
    total_courses INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    verified BOOLEAN DEFAULT false
);

-- ============================================================================
-- CATEGORIES TABLE
-- ============================================================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    course_count INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COURSES TABLE
-- ============================================================================

CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT NOT NULL,
    thumbnail_url TEXT,
    preview_video_url TEXT,
    instructor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    subcategory_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    level course_level DEFAULT 'all-levels',
    language TEXT DEFAULT 'en',
    price DECIMAL(10,2) DEFAULT 0,
    sale_price DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    is_free BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    status course_status DEFAULT 'draft',
    requirements TEXT[] DEFAULT '{}',
    what_you_will_learn TEXT[] DEFAULT '{}',
    target_audience TEXT[] DEFAULT '{}',
    total_duration_minutes INTEGER DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    total_quizzes INTEGER DEFAULT 0,
    total_resources INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    total_enrollments INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- ============================================================================
-- MODULES TABLE
-- ============================================================================

CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_free_preview BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- LESSONS TABLE
-- ============================================================================

CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content_type lesson_content_type DEFAULT 'video',
    video_url TEXT,
    video_duration_seconds INTEGER DEFAULT 0,
    article_content TEXT,
    display_order INTEGER DEFAULT 0,
    is_free_preview BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- VIDEO CHAPTERS TABLE
-- ============================================================================

CREATE TABLE video_chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    start_time_seconds INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- RESOURCES TABLE
-- ============================================================================

CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type resource_type NOT NULL,
    url TEXT NOT NULL,
    file_size INTEGER,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- QUIZZES TABLE
-- ============================================================================

CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    time_limit_minutes INTEGER,
    passing_score INTEGER DEFAULT 70,
    max_attempts INTEGER,
    show_correct_answers BOOLEAN DEFAULT true,
    shuffle_questions BOOLEAN DEFAULT false,
    shuffle_answers BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- QUESTIONS TABLE
-- ============================================================================

CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    type question_type NOT NULL,
    question_text TEXT NOT NULL,
    explanation TEXT,
    points INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    correct_answer_ids UUID[] DEFAULT '{}',
    fill_blank_answers TEXT[] DEFAULT '{}',
    matching_pairs JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ANSWERS TABLE
-- ============================================================================

CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ENROLLMENTS TABLE
-- ============================================================================

CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    payment_id UUID,
    expires_at TIMESTAMPTZ,
    UNIQUE(user_id, course_id)
);

-- ============================================================================
-- LESSON PROGRESS TABLE
-- ============================================================================

CREATE TABLE lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    watch_time_seconds INTEGER DEFAULT 0,
    last_position_seconds INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    notes TEXT,
    UNIQUE(user_id, lesson_id)
);

-- ============================================================================
-- QUIZ ATTEMPTS TABLE
-- ============================================================================

CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    score DECIMAL(5,2) DEFAULT 0,
    passed BOOLEAN DEFAULT false,
    answers JSONB DEFAULT '[]',
    time_spent_seconds INTEGER DEFAULT 0
);

-- ============================================================================
-- CERTIFICATES TABLE
-- ============================================================================

CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    certificate_number TEXT UNIQUE NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    grade TEXT,
    pdf_url TEXT,
    verification_url TEXT,
    UNIQUE(user_id, course_id)
);

-- ============================================================================
-- DISCUSSIONS TABLE
-- ============================================================================

CREATE TABLE discussions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    is_resolved BOOLEAN DEFAULT false,
    upvotes INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- DISCUSSION REPLIES TABLE
-- ============================================================================

CREATE TABLE discussion_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_instructor_reply BOOLEAN DEFAULT false,
    is_answer BOOLEAN DEFAULT false,
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- REVIEWS TABLE
-- ============================================================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    instructor_response TEXT,
    instructor_responded_at TIMESTAMPTZ,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, user_id)
);

-- ============================================================================
-- PAYMENTS TABLE
-- ============================================================================

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status payment_status DEFAULT 'pending',
    payment_method TEXT,
    stripe_payment_intent_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- LEARNING STREAKS TABLE
-- ============================================================================

CREATE TABLE learning_streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ============================================================================
-- ACTIVITY LOG TABLE
-- ============================================================================

CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    activity_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Courses
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_category ON courses(category_id);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_featured ON courses(is_featured) WHERE is_featured = true;

-- Modules
CREATE INDEX idx_modules_course ON modules(course_id);
CREATE INDEX idx_modules_order ON modules(course_id, display_order);

-- Lessons
CREATE INDEX idx_lessons_module ON lessons(module_id);
CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_lessons_order ON lessons(module_id, display_order);

-- Enrollments
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_active ON enrollments(user_id, is_active) WHERE is_active = true;

-- Lesson Progress
CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX idx_lesson_progress_course ON lesson_progress(course_id);

-- Quizzes
CREATE INDEX idx_quizzes_course ON quizzes(course_id);
CREATE INDEX idx_quizzes_module ON quizzes(module_id);

-- Quiz Attempts
CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);

-- Discussions
CREATE INDEX idx_discussions_course ON discussions(course_id);
CREATE INDEX idx_discussions_lesson ON discussions(lesson_id);
CREATE INDEX idx_discussions_user ON discussions(user_id);

-- Reviews
CREATE INDEX idx_reviews_course ON reviews(course_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- Activity Log
CREATE INDEX idx_activity_log_user ON activity_log(user_id);
CREATE INDEX idx_activity_log_date ON activity_log(created_at);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable" ON users
    FOR SELECT USING (true);

-- Courses policies
CREATE POLICY "Published courses are viewable by everyone" ON courses
    FOR SELECT USING (status = 'published' OR instructor_id = auth.uid());

CREATE POLICY "Instructors can manage their courses" ON courses
    FOR ALL USING (instructor_id = auth.uid());

-- Enrollments policies
CREATE POLICY "Users can view their enrollments" ON enrollments
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can enroll in courses" ON enrollments
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Lesson Progress policies
CREATE POLICY "Users can view their own progress" ON lesson_progress
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own progress" ON lesson_progress
    FOR ALL USING (user_id = auth.uid());

-- Quiz Attempts policies
CREATE POLICY "Users can view their own attempts" ON quiz_attempts
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create attempts" ON quiz_attempts
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Certificates policies
CREATE POLICY "Users can view their certificates" ON certificates
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Certificates are publicly verifiable" ON certificates
    FOR SELECT USING (true);

-- Notifications policies
CREATE POLICY "Users can view their notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_modules_updated_at
    BEFORE UPDATE ON modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_lessons_updated_at
    BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_quizzes_updated_at
    BEFORE UPDATE ON quizzes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_discussions_updated_at
    BEFORE UPDATE ON discussions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to update course stats
CREATE OR REPLACE FUNCTION update_course_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE courses SET
        total_lessons = (SELECT COUNT(*) FROM lessons WHERE course_id = NEW.course_id),
        total_duration_minutes = (SELECT COALESCE(SUM(video_duration_seconds), 0) / 60 FROM lessons WHERE course_id = NEW.course_id),
        updated_at = NOW()
    WHERE id = NEW.course_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_course_stats
    AFTER INSERT OR UPDATE OR DELETE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_course_stats();

-- Function to update enrollment progress
CREATE OR REPLACE FUNCTION update_enrollment_progress()
RETURNS TRIGGER AS $$
DECLARE
    total_lessons INTEGER;
    completed_lessons INTEGER;
    progress DECIMAL;
BEGIN
    SELECT COUNT(*) INTO total_lessons
    FROM lessons WHERE course_id = NEW.course_id;

    SELECT COUNT(*) INTO completed_lessons
    FROM lesson_progress
    WHERE user_id = NEW.user_id
    AND course_id = NEW.course_id
    AND is_completed = true;

    IF total_lessons > 0 THEN
        progress := (completed_lessons::DECIMAL / total_lessons::DECIMAL) * 100;
    ELSE
        progress := 0;
    END IF;

    UPDATE enrollments SET
        progress_percentage = progress,
        last_accessed_at = NOW(),
        completed_at = CASE WHEN progress >= 100 THEN NOW() ELSE completed_at END
    WHERE user_id = NEW.user_id AND course_id = NEW.course_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_enrollment_progress
    AFTER INSERT OR UPDATE ON lesson_progress
    FOR EACH ROW EXECUTE FUNCTION update_enrollment_progress();

-- Function to update course rating
CREATE OR REPLACE FUNCTION update_course_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE courses SET
        average_rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM reviews
            WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
        ),
        total_ratings = (
            SELECT COUNT(*)
            FROM reviews
            WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
        )
    WHERE id = COALESCE(NEW.course_id, OLD.course_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_course_rating
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_course_rating();

-- ============================================================================
-- SAMPLE DATA (for development)
-- ============================================================================

-- Insert sample categories
INSERT INTO categories (slug, name, description, icon, display_order) VALUES
    ('web-development', 'Web Development', 'Learn to build modern web applications', 'globe', 1),
    ('mobile-development', 'Mobile Development', 'Create apps for iOS and Android', 'smartphone', 2),
    ('data-science', 'Data Science', 'Master data analysis and machine learning', 'chart-bar', 3),
    ('cloud-computing', 'Cloud Computing', 'Learn AWS, Azure, and GCP', 'cloud', 4),
    ('devops', 'DevOps', 'CI/CD, containers, and infrastructure', 'settings', 5),
    ('cybersecurity', 'Cybersecurity', 'Protect systems and data', 'shield', 6),
    ('ai-machine-learning', 'AI & Machine Learning', 'Build intelligent systems', 'brain', 7),
    ('blockchain', 'Blockchain', 'Decentralized applications and crypto', 'blocks', 8);
