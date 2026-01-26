-- Notifications System Migration
-- In-app notifications for achievements, announcements, and alerts

-- ================================================================
-- ENUMS
-- ================================================================

-- Notification types
CREATE TYPE notification_type AS ENUM (
  'achievement_unlocked',
  'streak_at_risk',
  'streak_broken',
  'streak_milestone',
  'course_completed',
  'certificate_earned',
  'quiz_results',
  'new_course_available',
  'course_update',
  'team_invitation',
  'team_joined',
  'discussion_reply',
  'discussion_mention',
  'live_training_reminder',
  'live_training_starting',
  'announcement',
  'system'
);

-- Notification priority
CREATE TYPE notification_priority AS ENUM (
  'low',
  'normal',
  'high',
  'urgent'
);

-- ================================================================
-- TABLES
-- ================================================================

-- User notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  priority notification_priority NOT NULL DEFAULT 'normal',

  -- Content
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,

  -- Optional rich content
  icon_url VARCHAR(500),
  image_url VARCHAR(500),

  -- Action URL (where clicking notification takes user)
  action_url VARCHAR(500),
  action_label VARCHAR(100),

  -- Related entity (for context)
  reference_type VARCHAR(50), -- 'achievement', 'course', 'discussion', etc.
  reference_id UUID,

  -- Additional data (JSON for flexibility)
  metadata JSONB DEFAULT '{}',

  -- Status
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  archived_at TIMESTAMPTZ,

  -- Delivery tracking
  email_sent BOOLEAN NOT NULL DEFAULT false,
  push_sent BOOLEAN NOT NULL DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ -- Auto-delete after this date
);

-- Notification preferences per user
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,

  -- In-app notifications (always on by default)
  in_app_enabled BOOLEAN NOT NULL DEFAULT true,

  -- Email notifications
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  email_achievements BOOLEAN NOT NULL DEFAULT true,
  email_course_updates BOOLEAN NOT NULL DEFAULT true,
  email_discussions BOOLEAN NOT NULL DEFAULT false,
  email_marketing BOOLEAN NOT NULL DEFAULT true,
  email_digest_frequency VARCHAR(20) DEFAULT 'daily', -- 'instant', 'daily', 'weekly', 'never'

  -- Push notifications (for future mobile app)
  push_enabled BOOLEAN NOT NULL DEFAULT true,
  push_achievements BOOLEAN NOT NULL DEFAULT true,
  push_streaks BOOLEAN NOT NULL DEFAULT true,
  push_live_training BOOLEAN NOT NULL DEFAULT true,

  -- Quiet hours
  quiet_hours_enabled BOOLEAN NOT NULL DEFAULT false,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  timezone VARCHAR(50) DEFAULT 'UTC',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Announcement broadcasts (for admin-created notifications)
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Content
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'info', -- 'info', 'warning', 'success', 'promotion'

  -- Targeting
  target_audience VARCHAR(50) NOT NULL DEFAULT 'all', -- 'all', 'students', 'instructors', 'enrolled', 'course_specific'
  target_course_id UUID REFERENCES courses(id) ON DELETE SET NULL,

  -- Display options
  is_banner BOOLEAN NOT NULL DEFAULT false, -- Show as site-wide banner
  is_dismissible BOOLEAN NOT NULL DEFAULT true,
  action_url VARCHAR(500),
  action_label VARCHAR(100),

  -- Scheduling
  publish_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,

  -- Status
  is_published BOOLEAN NOT NULL DEFAULT false,

  -- Creator
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Track which users have seen/dismissed announcements
CREATE TABLE announcement_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  dismissed_at TIMESTAMPTZ,

  UNIQUE(announcement_id, user_id)
);

-- ================================================================
-- INDEXES
-- ================================================================

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_expires ON notifications(expires_at) WHERE expires_at IS NOT NULL;

-- Notification preferences
CREATE INDEX idx_notification_prefs_user ON notification_preferences(user_id);

-- Announcements
CREATE INDEX idx_announcements_published ON announcements(is_published, publish_at, expires_at);
CREATE INDEX idx_announcements_target ON announcements(target_audience, target_course_id);

-- Announcement views
CREATE INDEX idx_announcement_views_user ON announcement_views(user_id);
CREATE INDEX idx_announcement_views_announcement ON announcement_views(announcement_id);

-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_views ENABLE ROW LEVEL SECURITY;

-- Notifications: Users see own notifications only
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (user_id = auth.uid());

-- Notification preferences: Users manage own
CREATE POLICY "Users can view own preferences"
  ON notification_preferences FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own preferences"
  ON notification_preferences FOR ALL
  USING (user_id = auth.uid());

-- Announcements: Anyone can view published, admins can manage
CREATE POLICY "Anyone can view published announcements"
  ON announcements FOR SELECT
  USING (is_published = true AND publish_at <= NOW() AND (expires_at IS NULL OR expires_at > NOW()));

CREATE POLICY "Admins can manage announcements"
  ON announcements FOR ALL
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Announcement views: Users manage own
CREATE POLICY "Users can view own announcement views"
  ON announcement_views FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own views"
  ON announcement_views FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own views"
  ON announcement_views FOR UPDATE
  USING (user_id = auth.uid());

-- ================================================================
-- FUNCTIONS
-- ================================================================

-- Create a notification for a user
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type notification_type,
  p_title VARCHAR(255),
  p_message TEXT,
  p_priority notification_priority DEFAULT 'normal',
  p_action_url VARCHAR DEFAULT NULL,
  p_action_label VARCHAR DEFAULT NULL,
  p_reference_type VARCHAR DEFAULT NULL,
  p_reference_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
  v_prefs notification_preferences%ROWTYPE;
BEGIN
  -- Check user preferences
  SELECT * INTO v_prefs
  FROM notification_preferences
  WHERE user_id = p_user_id;

  -- Skip if in-app notifications are disabled
  IF v_prefs.id IS NOT NULL AND NOT v_prefs.in_app_enabled THEN
    RETURN NULL;
  END IF;

  -- Create the notification
  INSERT INTO notifications (
    user_id, type, priority, title, message,
    action_url, action_label, reference_type, reference_id, metadata
  ) VALUES (
    p_user_id, p_type, p_priority, p_title, p_message,
    p_action_url, p_action_label, p_reference_type, p_reference_id, p_metadata
  ) RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Notify user of achievement unlock
CREATE OR REPLACE FUNCTION notify_achievement_unlocked()
RETURNS TRIGGER AS $$
DECLARE
  v_achievement achievements%ROWTYPE;
BEGIN
  -- Get achievement details
  SELECT * INTO v_achievement
  FROM achievements
  WHERE id = NEW.achievement_id;

  -- Create notification
  PERFORM create_notification(
    NEW.user_id,
    'achievement_unlocked',
    'Achievement Unlocked: ' || v_achievement.name,
    v_achievement.description,
    CASE
      WHEN v_achievement.rarity IN ('epic', 'legendary') THEN 'high'::notification_priority
      ELSE 'normal'::notification_priority
    END,
    '/dashboard/student/achievements',
    'View Achievements',
    'achievement',
    NEW.achievement_id,
    jsonb_build_object(
      'rarity', v_achievement.rarity,
      'points', v_achievement.points_reward,
      'category', v_achievement.category
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Initialize notification preferences for new users
CREATE OR REPLACE FUNCTION initialize_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Clean up expired notifications (to be called by cron)
CREATE OR REPLACE FUNCTION cleanup_expired_notifications()
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  DELETE FROM notifications
  WHERE expires_at IS NOT NULL AND expires_at < NOW();

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get unread notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM notifications
    WHERE user_id = p_user_id AND is_read = false AND is_archived = false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- TRIGGERS
-- ================================================================

-- Notify on achievement unlock
CREATE TRIGGER trigger_notify_achievement_unlocked
  AFTER INSERT ON user_achievements
  FOR EACH ROW
  EXECUTE FUNCTION notify_achievement_unlocked();

-- Initialize notification preferences for new users
CREATE TRIGGER trigger_initialize_notification_preferences
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_notification_preferences();

-- Update timestamps
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
