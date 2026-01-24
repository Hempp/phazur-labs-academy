-- Video Generations Table
-- Tracks AI-generated videos from HeyGen and other services

CREATE TABLE video_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    heygen_video_id TEXT NOT NULL,
    title TEXT NOT NULL,
    script TEXT NOT NULL,
    avatar_id TEXT NOT NULL,
    voice_id TEXT,
    lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    video_url TEXT,
    thumbnail_url TEXT,
    duration_seconds INTEGER,
    error_message TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX idx_video_generations_heygen_id ON video_generations(heygen_video_id);
CREATE INDEX idx_video_generations_lesson_id ON video_generations(lesson_id);
CREATE INDEX idx_video_generations_status ON video_generations(status);
CREATE INDEX idx_video_generations_created_by ON video_generations(created_by);
CREATE INDEX idx_video_generations_created_at ON video_generations(created_at DESC);

-- Row Level Security
ALTER TABLE video_generations ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins have full access to video_generations"
    ON video_generations
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Instructors can view and create videos
CREATE POLICY "Instructors can manage their video generations"
    ON video_generations
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'instructor'
        )
        AND created_by = auth.uid()
    );

-- Comments
COMMENT ON TABLE video_generations IS 'Tracks AI-generated videos from HeyGen';
COMMENT ON COLUMN video_generations.heygen_video_id IS 'Video ID from HeyGen API';
COMMENT ON COLUMN video_generations.script IS 'Full script text used for video generation';
COMMENT ON COLUMN video_generations.avatar_id IS 'HeyGen avatar ID used';
COMMENT ON COLUMN video_generations.voice_id IS 'Voice ID used for text-to-speech';
COMMENT ON COLUMN video_generations.lesson_id IS 'Associated lesson if assigned';
COMMENT ON COLUMN video_generations.status IS 'Generation status: pending, processing, completed, failed';
COMMENT ON COLUMN video_generations.video_url IS 'Final video URL from HeyGen or Supabase storage';
COMMENT ON COLUMN video_generations.metadata IS 'Additional metadata like aspect ratio, background settings';
