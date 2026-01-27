-- Video Storage System Migration
-- Creates video_library and video_upload_sessions tables for AWS S3-based video management

-- ============================================================================
-- VIDEO LIBRARY TABLE
-- Central catalog for all videos (uploaded, AI-generated, external)
-- ============================================================================

CREATE TABLE IF NOT EXISTS video_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Basic metadata
    title TEXT NOT NULL,
    description TEXT,
    slug TEXT UNIQUE,

    -- File information
    original_filename TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    duration_seconds INTEGER,

    -- Video dimensions
    width INTEGER,
    height INTEGER,
    resolution TEXT, -- e.g., '1080p', '720p', '4K'

    -- Storage details
    storage_provider TEXT NOT NULL DEFAULT 's3'
        CHECK (storage_provider IN ('s3', 'supabase', 'bunnycdn')),
    storage_bucket TEXT NOT NULL,
    storage_key TEXT NOT NULL,
    cdn_url TEXT,

    -- Thumbnail
    thumbnail_url TEXT,
    thumbnail_key TEXT,

    -- Workflow status
    workflow_status TEXT NOT NULL DEFAULT 'draft'
        CHECK (workflow_status IN ('draft', 'review', 'approved', 'published')),

    -- Organization (course hierarchy)
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    module_id UUID REFERENCES modules(id) ON DELETE SET NULL,
    lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,

    -- Tags for discoverability
    tags TEXT[] DEFAULT '{}',

    -- Source tracking
    source_type TEXT NOT NULL DEFAULT 'upload'
        CHECK (source_type IN ('upload', 'ai_generated', 'external', 'imported')),
    source_reference TEXT, -- e.g., heygen_video_id for AI videos

    -- Access control
    visibility TEXT NOT NULL DEFAULT 'private'
        CHECK (visibility IN ('private', 'internal', 'public')),

    -- Audit fields
    uploaded_by UUID NOT NULL REFERENCES users(id),
    reviewed_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,

    -- Processing status (for transcoding, etc.)
    processing_status TEXT DEFAULT 'completed'
        CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    processing_error TEXT,

    -- Extensible metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for video_library
CREATE INDEX IF NOT EXISTS idx_video_library_workflow_status ON video_library(workflow_status);
CREATE INDEX IF NOT EXISTS idx_video_library_course_id ON video_library(course_id);
CREATE INDEX IF NOT EXISTS idx_video_library_module_id ON video_library(module_id);
CREATE INDEX IF NOT EXISTS idx_video_library_lesson_id ON video_library(lesson_id);
CREATE INDEX IF NOT EXISTS idx_video_library_uploaded_by ON video_library(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_video_library_source_type ON video_library(source_type);
CREATE INDEX IF NOT EXISTS idx_video_library_created_at ON video_library(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_video_library_tags ON video_library USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_video_library_storage_key ON video_library(storage_key);

-- ============================================================================
-- VIDEO UPLOAD SESSIONS TABLE
-- Tracks multipart/resumable uploads for large video files
-- ============================================================================

CREATE TABLE IF NOT EXISTS video_upload_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- S3 multipart upload tracking
    upload_id TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),

    -- Target assignment (optional - can be set after upload)
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    module_id UUID REFERENCES modules(id) ON DELETE SET NULL,
    lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,

    -- File metadata
    filename TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    title TEXT, -- User-provided title (optional)

    -- Upload progress
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'uploading', 'processing', 'completed', 'failed', 'cancelled')),
    parts_completed INTEGER DEFAULT 0,
    total_parts INTEGER,
    bytes_uploaded BIGINT DEFAULT 0,

    -- S3 details
    bucket_name TEXT NOT NULL,
    object_key TEXT NOT NULL,

    -- Presigned URL tracking (stored as JSON array)
    presigned_urls JSONB DEFAULT '[]'::jsonb,
    presigned_urls_expire_at TIMESTAMPTZ,

    -- Completed video reference
    video_library_id UUID REFERENCES video_library(id) ON DELETE SET NULL,

    -- Error tracking
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
    completed_at TIMESTAMPTZ
);

-- Indexes for video_upload_sessions
CREATE INDEX IF NOT EXISTS idx_upload_sessions_user ON video_upload_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_upload_sessions_status ON video_upload_sessions(status);
CREATE INDEX IF NOT EXISTS idx_upload_sessions_expires ON video_upload_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_upload_sessions_upload_id ON video_upload_sessions(upload_id);
CREATE INDEX IF NOT EXISTS idx_upload_sessions_created_at ON video_upload_sessions(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on both tables
ALTER TABLE video_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_upload_sessions ENABLE ROW LEVEL SECURITY;

-- VIDEO LIBRARY POLICIES

-- Admins have full access
CREATE POLICY "Admins have full access to video_library"
    ON video_library FOR ALL
    USING (EXISTS (
        SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    ));

-- Instructors can manage videos they uploaded or in their courses
CREATE POLICY "Instructors can manage own videos and course videos"
    ON video_library FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'instructor'
        )
        AND (
            uploaded_by = auth.uid()
            OR EXISTS (
                SELECT 1 FROM courses
                WHERE courses.id = video_library.course_id
                AND courses.instructor_id = auth.uid()
            )
        )
    );

-- Students can view published videos in enrolled courses
CREATE POLICY "Students can view published videos in enrolled courses"
    ON video_library FOR SELECT
    USING (
        workflow_status = 'published'
        AND (
            visibility = 'public'
            OR EXISTS (
                SELECT 1 FROM enrollments
                WHERE enrollments.user_id = auth.uid()
                AND enrollments.course_id = video_library.course_id
                AND enrollments.is_active = true
            )
        )
    );

-- VIDEO UPLOAD SESSIONS POLICIES

-- Users can manage their own upload sessions
CREATE POLICY "Users can manage own upload sessions"
    ON video_upload_sessions FOR ALL
    USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Updated_at trigger for video_library
CREATE TRIGGER update_video_library_updated_at
    BEFORE UPDATE ON video_library
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Updated_at trigger for video_upload_sessions
CREATE TRIGGER update_video_upload_sessions_updated_at
    BEFORE UPDATE ON video_upload_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to generate a slug from title
CREATE OR REPLACE FUNCTION generate_video_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL THEN
        NEW.slug := lower(regexp_replace(
            regexp_replace(NEW.title, '[^a-zA-Z0-9\s-]', '', 'g'),
            '\s+', '-', 'g'
        )) || '-' || substring(NEW.id::text, 1, 8);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate slug
CREATE TRIGGER generate_video_library_slug
    BEFORE INSERT ON video_library
    FOR EACH ROW
    EXECUTE FUNCTION generate_video_slug();

-- Function to cleanup expired upload sessions
CREATE OR REPLACE FUNCTION cleanup_expired_upload_sessions()
RETURNS void AS $$
BEGIN
    UPDATE video_upload_sessions
    SET status = 'cancelled'
    WHERE status IN ('pending', 'uploading')
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE video_library IS 'Central video catalog for all course videos';
COMMENT ON TABLE video_upload_sessions IS 'Tracks multipart upload sessions for resumable uploads';

COMMENT ON COLUMN video_library.workflow_status IS 'Video approval workflow: draft -> review -> approved -> published';
COMMENT ON COLUMN video_library.source_type IS 'How the video was created: upload, ai_generated, external, imported';
COMMENT ON COLUMN video_library.storage_key IS 'Full path/key in the storage bucket';

COMMENT ON COLUMN video_upload_sessions.upload_id IS 'S3 multipart upload ID for resumable uploads';
COMMENT ON COLUMN video_upload_sessions.presigned_urls IS 'JSON array of presigned URLs for each upload part';
