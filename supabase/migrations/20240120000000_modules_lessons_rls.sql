-- ============================================================================
-- RLS Policies for Modules and Lessons
-- These were missing from the initial schema, causing empty results for students
-- ============================================================================

-- ============================================================================
-- MODULES POLICIES
-- ============================================================================

-- Published courses' modules are viewable by everyone (for course previews)
CREATE POLICY "Modules are viewable for published courses"
    ON modules
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM courses
            WHERE courses.id = modules.course_id
            AND (courses.status = 'published' OR courses.instructor_id = auth.uid())
        )
    );

-- Instructors can manage modules for their courses
CREATE POLICY "Instructors can manage their course modules"
    ON modules
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM courses
            WHERE courses.id = modules.course_id
            AND courses.instructor_id = auth.uid()
        )
    );

-- ============================================================================
-- LESSONS POLICIES
-- ============================================================================

-- Lessons are viewable for published courses (enrolled students and free previews)
CREATE POLICY "Lessons are viewable for published courses"
    ON lessons
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM modules
            JOIN courses ON courses.id = modules.course_id
            WHERE modules.id = lessons.module_id
            AND (courses.status = 'published' OR courses.instructor_id = auth.uid())
        )
    );

-- Instructors can manage lessons for their courses
CREATE POLICY "Instructors can manage their course lessons"
    ON lessons
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM modules
            JOIN courses ON courses.id = modules.course_id
            WHERE modules.id = lessons.module_id
            AND courses.instructor_id = auth.uid()
        )
    );

-- ============================================================================
-- RESOURCES POLICIES (also missing)
-- ============================================================================

-- Resources are viewable with lessons
CREATE POLICY "Resources are viewable for published courses"
    ON resources
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM lessons
            JOIN modules ON modules.id = lessons.module_id
            JOIN courses ON courses.id = modules.course_id
            WHERE lessons.id = resources.lesson_id
            AND (courses.status = 'published' OR courses.instructor_id = auth.uid())
        )
    );

-- Instructors can manage resources
CREATE POLICY "Instructors can manage their course resources"
    ON resources
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM lessons
            JOIN modules ON modules.id = lessons.module_id
            JOIN courses ON courses.id = modules.course_id
            WHERE lessons.id = resources.lesson_id
            AND courses.instructor_id = auth.uid()
        )
    );

-- ============================================================================
-- VIDEO_CHAPTERS POLICIES (also missing)
-- ============================================================================

-- Video chapters are viewable with lessons
CREATE POLICY "Video chapters are viewable for published courses"
    ON video_chapters
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM lessons
            JOIN modules ON modules.id = lessons.module_id
            JOIN courses ON courses.id = modules.course_id
            WHERE lessons.id = video_chapters.lesson_id
            AND (courses.status = 'published' OR courses.instructor_id = auth.uid())
        )
    );

-- Instructors can manage video chapters
CREATE POLICY "Instructors can manage their video chapters"
    ON video_chapters
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM lessons
            JOIN modules ON modules.id = lessons.module_id
            JOIN courses ON courses.id = modules.course_id
            WHERE lessons.id = video_chapters.lesson_id
            AND courses.instructor_id = auth.uid()
        )
    );

-- ============================================================================
-- QUIZZES POLICIES (also missing)
-- ============================================================================

-- Quizzes are viewable for published courses
CREATE POLICY "Quizzes are viewable for published courses"
    ON quizzes
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM lessons
            JOIN modules ON modules.id = lessons.module_id
            JOIN courses ON courses.id = modules.course_id
            WHERE lessons.id = quizzes.lesson_id
            AND (courses.status = 'published' OR courses.instructor_id = auth.uid())
        )
    );

-- Instructors can manage quizzes
CREATE POLICY "Instructors can manage their quizzes"
    ON quizzes
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM lessons
            JOIN modules ON modules.id = lessons.module_id
            JOIN courses ON courses.id = modules.course_id
            WHERE lessons.id = quizzes.lesson_id
            AND courses.instructor_id = auth.uid()
        )
    );

-- ============================================================================
-- QUESTIONS POLICIES (also missing)
-- ============================================================================

-- Questions are viewable with quizzes
CREATE POLICY "Questions are viewable for published courses"
    ON questions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM quizzes
            JOIN lessons ON lessons.id = quizzes.lesson_id
            JOIN modules ON modules.id = lessons.module_id
            JOIN courses ON courses.id = modules.course_id
            WHERE quizzes.id = questions.quiz_id
            AND (courses.status = 'published' OR courses.instructor_id = auth.uid())
        )
    );

-- Instructors can manage questions
CREATE POLICY "Instructors can manage their questions"
    ON questions
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM quizzes
            JOIN lessons ON lessons.id = quizzes.lesson_id
            JOIN modules ON modules.id = lessons.module_id
            JOIN courses ON courses.id = modules.course_id
            WHERE quizzes.id = questions.quiz_id
            AND courses.instructor_id = auth.uid()
        )
    );

-- ============================================================================
-- ANSWERS POLICIES (also missing)
-- ============================================================================

-- Answers are viewable with questions
CREATE POLICY "Answers are viewable for published courses"
    ON answers
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM questions
            JOIN quizzes ON quizzes.id = questions.quiz_id
            JOIN lessons ON lessons.id = quizzes.lesson_id
            JOIN modules ON modules.id = lessons.module_id
            JOIN courses ON courses.id = modules.course_id
            WHERE questions.id = answers.question_id
            AND (courses.status = 'published' OR courses.instructor_id = auth.uid())
        )
    );

-- Instructors can manage answers
CREATE POLICY "Instructors can manage their answers"
    ON answers
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM questions
            JOIN quizzes ON quizzes.id = questions.quiz_id
            JOIN lessons ON lessons.id = quizzes.lesson_id
            JOIN modules ON modules.id = lessons.module_id
            JOIN courses ON courses.id = modules.course_id
            WHERE questions.id = answers.question_id
            AND courses.instructor_id = auth.uid()
        )
    );
