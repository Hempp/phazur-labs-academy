-- Add view_count column to discussions table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'discussions' AND column_name = 'view_count') THEN
        ALTER TABLE discussions ADD COLUMN view_count INTEGER DEFAULT 0;
    END IF;
END $$;
