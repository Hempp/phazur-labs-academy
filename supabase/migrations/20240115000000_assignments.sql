-- ============================================================================
-- Assignments System Migration
-- Adds tables for course assignments and student submissions
-- ============================================================================

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE assignment_submission_status AS ENUM ('pending', 'submitted', 'graded', 'resubmit');
CREATE TYPE submission_type AS ENUM ('file', 'url', 'text');

-- ============================================================================
-- ASSIGNMENTS TABLE
-- ============================================================================

CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    instructions TEXT NOT NULL,
    due_days_after_enrollment INTEGER DEFAULT 7,
    max_score INTEGER DEFAULT 100,
    submission_types submission_type[] DEFAULT '{file}',
    allowed_file_types TEXT[] DEFAULT '{.pdf,.doc,.docx,.zip}',
    max_file_size_mb INTEGER DEFAULT 10,
    rubric JSONB DEFAULT '[]',
    resources JSONB DEFAULT '[]',
    is_required BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ASSIGNMENT SUBMISSIONS TABLE
-- ============================================================================

CREATE TABLE assignment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    submission_type submission_type NOT NULL,
    -- Content fields (one will be populated based on submission_type)
    file_url TEXT,
    file_name TEXT,
    file_size INTEGER,
    url_link TEXT,
    text_content TEXT,
    -- Grading fields
    status assignment_submission_status DEFAULT 'submitted',
    score INTEGER,
    feedback TEXT,
    rubric_scores JSONB DEFAULT '[]',
    -- Timestamps
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    graded_at TIMESTAMPTZ,
    graded_by UUID REFERENCES users(id),
    -- Allow resubmissions
    attempt_number INTEGER DEFAULT 1,
    previous_submission_id UUID REFERENCES assignment_submissions(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Assignments
CREATE INDEX idx_assignments_course ON assignments(course_id);
CREATE INDEX idx_assignments_lesson ON assignments(lesson_id);
CREATE INDEX idx_assignments_order ON assignments(course_id, display_order);

-- Assignment Submissions
CREATE INDEX idx_assignment_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX idx_assignment_submissions_user ON assignment_submissions(user_id);
CREATE INDEX idx_assignment_submissions_enrollment ON assignment_submissions(enrollment_id);
CREATE INDEX idx_assignment_submissions_status ON assignment_submissions(status);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;

-- Assignment policies
CREATE POLICY "Assignments are viewable by enrolled students" ON assignments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM enrollments
            WHERE enrollments.course_id = assignments.course_id
            AND enrollments.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM courses
            WHERE courses.id = assignments.course_id
            AND courses.instructor_id = auth.uid()
        )
    );

CREATE POLICY "Instructors can manage assignments" ON assignments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM courses
            WHERE courses.id = assignments.course_id
            AND courses.instructor_id = auth.uid()
        )
    );

-- Assignment Submissions policies
CREATE POLICY "Users can view their own submissions" ON assignment_submissions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can submit assignments" ON assignment_submissions
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their pending submissions" ON assignment_submissions
    FOR UPDATE USING (
        user_id = auth.uid()
        AND status IN ('pending', 'resubmit')
    );

CREATE POLICY "Instructors can view submissions for their courses" ON assignment_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM assignments
            JOIN courses ON courses.id = assignments.course_id
            WHERE assignments.id = assignment_submissions.assignment_id
            AND courses.instructor_id = auth.uid()
        )
    );

CREATE POLICY "Instructors can grade submissions" ON assignment_submissions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM assignments
            JOIN courses ON courses.id = assignments.course_id
            WHERE assignments.id = assignment_submissions.assignment_id
            AND courses.instructor_id = auth.uid()
        )
    );

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER update_assignments_updated_at
    BEFORE UPDATE ON assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_assignment_submissions_updated_at
    BEFORE UPDATE ON assignment_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- SAMPLE ASSIGNMENT DATA
-- ============================================================================

-- Note: This will be inserted after courses are created
-- Uncomment and modify when you have actual course IDs

-- INSERT INTO assignments (course_id, title, description, instructions, max_score, submission_types, rubric) VALUES
-- (
--     'YOUR_COURSE_ID',
--     'Build a Portfolio Website',
--     'Create a personal portfolio website showcasing your skills',
--     'Build a responsive portfolio website using HTML, CSS, and JavaScript. Include:\n\n1. A hero section with your name and tagline\n2. An about section\n3. A projects section with at least 3 projects\n4. A contact form\n5. Responsive design for mobile devices',
--     100,
--     '{url,file}',
--     '[
--         {"criteria": "Design & Layout", "description": "Clean, professional design with good visual hierarchy", "max_points": 25},
--         {"criteria": "Responsiveness", "description": "Works well on mobile, tablet, and desktop", "max_points": 25},
--         {"criteria": "Code Quality", "description": "Clean, well-organized, semantic HTML/CSS", "max_points": 25},
--         {"criteria": "Functionality", "description": "All links work, contact form functional", "max_points": 25}
--     ]'
-- );
