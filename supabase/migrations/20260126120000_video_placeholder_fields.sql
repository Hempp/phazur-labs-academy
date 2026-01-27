-- Add video placeholder metadata fields to lessons table
-- Allows courses to show professional placeholders for videos still in production

-- Video production status
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS video_status TEXT DEFAULT 'ready';

-- Video content type for appropriate iconography
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS video_type TEXT DEFAULT 'lecture';

-- Estimated duration for placeholder display (when actual video not yet uploaded)
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS estimated_duration_seconds INTEGER;

-- Preview description for placeholder
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS video_description TEXT;

-- Internal production notes (admin only)
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS production_notes TEXT;

-- Expected availability date
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS expected_ready_date DATE;

-- Add constraints for valid enum values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'lessons_video_status_check'
  ) THEN
    ALTER TABLE lessons ADD CONSTRAINT lessons_video_status_check
      CHECK (video_status IS NULL OR video_status IN ('ready', 'in_production', 'scheduled', 'coming_soon', 'placeholder'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'lessons_video_type_check'
  ) THEN
    ALTER TABLE lessons ADD CONSTRAINT lessons_video_type_check
      CHECK (video_type IS NULL OR video_type IN ('lecture', 'demonstration', 'interview', 'walkthrough', 'summary', 'introduction', 'recap'));
  END IF;
END $$;

-- Index for filtering lessons by status (useful for admin dashboards)
CREATE INDEX IF NOT EXISTS idx_lessons_video_status ON lessons(video_status) WHERE video_status != 'ready';

COMMENT ON COLUMN lessons.video_status IS 'Production status: ready, in_production, scheduled, coming_soon, placeholder';
COMMENT ON COLUMN lessons.video_type IS 'Content type for placeholder display: lecture, demonstration, interview, etc.';
COMMENT ON COLUMN lessons.estimated_duration_seconds IS 'Estimated video duration for placeholder (used when video_url is null)';
COMMENT ON COLUMN lessons.video_description IS 'Description text shown in video placeholder';
COMMENT ON COLUMN lessons.production_notes IS 'Internal notes about video production (admin only)';
COMMENT ON COLUMN lessons.expected_ready_date IS 'Expected date when video will be available';
