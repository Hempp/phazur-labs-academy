-- ============================================================================
-- Lesson Bookmarks Schema
-- Allows users to bookmark lessons for quick access
-- ============================================================================

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS lesson_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Prevent duplicate bookmarks
    UNIQUE(user_id, lesson_id)
);

-- Index for fast lookup by user
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON lesson_bookmarks(user_id);

-- Index for course-scoped queries
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_course ON lesson_bookmarks(user_id, course_id);

-- Enable RLS
ALTER TABLE lesson_bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own bookmarks" ON lesson_bookmarks
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own bookmarks" ON lesson_bookmarks
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own bookmarks" ON lesson_bookmarks
    FOR DELETE USING (user_id = auth.uid());

-- Grant permissions
GRANT ALL ON lesson_bookmarks TO authenticated;
