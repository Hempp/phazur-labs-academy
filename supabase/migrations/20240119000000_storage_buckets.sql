-- Storage Buckets for Course Videos
-- Creates and configures storage buckets for video content delivery

-- Create the course-videos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'course-videos',
    'course-videos',
    true,  -- Public bucket for CDN delivery
    524288000,  -- 500MB max file size
    ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'image/jpeg', 'image/png']::text[]
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create thumbnails bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'video-thumbnails',
    'video-thumbnails',
    true,  -- Public for fast thumbnail loading
    5242880,  -- 5MB max for thumbnails
    ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Policies for course-videos bucket

-- Allow public read access (for video streaming)
CREATE POLICY "Public can view course videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-videos');

-- Admins can upload, update, delete videos
CREATE POLICY "Admins can manage course videos"
ON storage.objects FOR ALL
USING (
    bucket_id = 'course-videos'
    AND EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
    )
);

-- Instructors can upload to their lesson folders
CREATE POLICY "Instructors can upload course videos"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'course-videos'
    AND EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role = 'instructor'
    )
);

-- Storage Policies for video-thumbnails bucket

-- Public read access for thumbnails
CREATE POLICY "Public can view video thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'video-thumbnails');

-- Admins and instructors can manage thumbnails
CREATE POLICY "Staff can manage video thumbnails"
ON storage.objects FOR ALL
USING (
    bucket_id = 'video-thumbnails'
    AND EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'instructor')
    )
);

-- Comments
COMMENT ON TABLE storage.buckets IS 'Storage buckets for course content';
