-- Gamification System Migration
-- Badges, achievements, streaks, points, and leaderboards

-- ================================================================
-- ENUMS
-- ================================================================

-- Achievement categories
CREATE TYPE achievement_category AS ENUM (
  'learning',      -- Course completion, lessons watched
  'engagement',    -- Discussions, notes, bookmarks
  'consistency',   -- Streaks, daily login
  'mastery',       -- Quiz scores, certifications
  'social',        -- Helping others, upvotes received
  'milestone'      -- Platform milestones
);

-- Achievement rarity
CREATE TYPE achievement_rarity AS ENUM (
  'common',        -- Easy to get
  'uncommon',      -- Moderate effort
  'rare',          -- Significant effort
  'epic',          -- Major accomplishment
  'legendary'      -- Exceptional achievement
);

-- Point transaction types
CREATE TYPE point_transaction_type AS ENUM (
  'lesson_complete',
  'quiz_pass',
  'quiz_perfect',
  'course_complete',
  'streak_bonus',
  'achievement_unlock',
  'discussion_create',
  'discussion_reply',
  'discussion_upvote_received',
  'certificate_earned',
  'daily_login',
  'first_enrollment',
  'referral_bonus',
  'admin_adjustment'
);

-- ================================================================
-- TABLES
-- ================================================================

-- Achievements/Badges Definition
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category achievement_category NOT NULL,
  rarity achievement_rarity NOT NULL DEFAULT 'common',
  icon_url VARCHAR(500),
  points_reward INTEGER NOT NULL DEFAULT 0,

  -- Unlock criteria (JSON for flexibility)
  -- Example: { "type": "lesson_count", "threshold": 10 }
  -- Example: { "type": "streak_days", "threshold": 7 }
  -- Example: { "type": "quiz_score", "threshold": 100, "count": 5 }
  unlock_criteria JSONB NOT NULL DEFAULT '{}',

  -- Display order within category
  display_order INTEGER DEFAULT 0,

  -- Whether this achievement is currently active
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- Secret achievements are hidden until unlocked
  is_secret BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Achievements (unlocked badges)
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Optional context (e.g., which course triggered it)
  context JSONB DEFAULT '{}',

  -- Has the user seen this achievement?
  is_viewed BOOLEAN NOT NULL DEFAULT false,

  -- Can be featured on profile
  is_featured BOOLEAN NOT NULL DEFAULT false,

  UNIQUE(user_id, achievement_id)
);

-- User Points & Stats
CREATE TABLE user_gamification_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,

  -- Total points
  total_points INTEGER NOT NULL DEFAULT 0,

  -- Points earned this week (reset weekly)
  weekly_points INTEGER NOT NULL DEFAULT 0,
  weekly_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Points earned this month (reset monthly)
  monthly_points INTEGER NOT NULL DEFAULT 0,
  monthly_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Current streak
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,

  -- Achievement counts
  achievements_unlocked INTEGER NOT NULL DEFAULT 0,

  -- Learning stats for achievement tracking
  lessons_completed INTEGER NOT NULL DEFAULT 0,
  quizzes_passed INTEGER NOT NULL DEFAULT 0,
  perfect_quizzes INTEGER NOT NULL DEFAULT 0,
  courses_completed INTEGER NOT NULL DEFAULT 0,
  certificates_earned INTEGER NOT NULL DEFAULT 0,
  discussions_created INTEGER NOT NULL DEFAULT 0,
  discussions_replies INTEGER NOT NULL DEFAULT 0,
  upvotes_received INTEGER NOT NULL DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Point Transactions (audit trail)
CREATE TABLE point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transaction_type point_transaction_type NOT NULL,
  points INTEGER NOT NULL,

  -- Reference to what triggered this (lesson_id, quiz_id, etc.)
  reference_type VARCHAR(50),
  reference_id UUID,

  -- Description
  description TEXT,

  -- Running total after this transaction
  balance_after INTEGER NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Activity Log (for streak tracking)
CREATE TABLE user_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,

  -- Activity counts for the day
  lessons_viewed INTEGER NOT NULL DEFAULT 0,
  quizzes_taken INTEGER NOT NULL DEFAULT 0,
  discussions_participated INTEGER NOT NULL DEFAULT 0,
  notes_created INTEGER NOT NULL DEFAULT 0,

  -- Did this day count for streak?
  streak_qualified BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, activity_date)
);

-- Leaderboard Cache (refreshed periodically)
CREATE TABLE leaderboard_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leaderboard_type VARCHAR(50) NOT NULL, -- 'all_time', 'weekly', 'monthly'
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  points INTEGER NOT NULL,

  -- User snapshot for display
  user_name VARCHAR(255),
  user_avatar_url VARCHAR(500),

  cached_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(leaderboard_type, user_id)
);

-- ================================================================
-- INDEXES
-- ================================================================

-- Achievements
CREATE INDEX idx_achievements_category ON achievements(category);
CREATE INDEX idx_achievements_rarity ON achievements(rarity);
CREATE INDEX idx_achievements_active ON achievements(is_active) WHERE is_active = true;

-- User Achievements
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement ON user_achievements(achievement_id);
CREATE INDEX idx_user_achievements_unlocked ON user_achievements(unlocked_at DESC);
CREATE INDEX idx_user_achievements_unviewed ON user_achievements(user_id, is_viewed) WHERE is_viewed = false;

-- User Stats
CREATE INDEX idx_user_stats_total_points ON user_gamification_stats(total_points DESC);
CREATE INDEX idx_user_stats_weekly_points ON user_gamification_stats(weekly_points DESC);
CREATE INDEX idx_user_stats_streak ON user_gamification_stats(current_streak DESC);

-- Point Transactions
CREATE INDEX idx_point_transactions_user ON point_transactions(user_id);
CREATE INDEX idx_point_transactions_created ON point_transactions(created_at DESC);
CREATE INDEX idx_point_transactions_type ON point_transactions(transaction_type);

-- Activity Log
CREATE INDEX idx_activity_log_user_date ON user_activity_log(user_id, activity_date DESC);

-- Leaderboard
CREATE INDEX idx_leaderboard_type_rank ON leaderboard_cache(leaderboard_type, rank);

-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_gamification_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_cache ENABLE ROW LEVEL SECURITY;

-- Achievements: Public read (non-secret), admin write
CREATE POLICY "Anyone can view non-secret achievements"
  ON achievements FOR SELECT
  USING (is_active = true AND (is_secret = false OR EXISTS (
    SELECT 1 FROM user_achievements ua WHERE ua.achievement_id = achievements.id AND ua.user_id = auth.uid()
  )));

CREATE POLICY "Admins can manage achievements"
  ON achievements FOR ALL
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- User Achievements: Users see own + public view of others
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can view featured achievements"
  ON user_achievements FOR SELECT
  USING (is_featured = true);

CREATE POLICY "System can insert user achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own achievements"
  ON user_achievements FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- User Stats: Own stats + leaderboard visibility
CREATE POLICY "Users can view own stats"
  ON user_gamification_stats FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can view stats for leaderboard"
  ON user_gamification_stats FOR SELECT
  USING (true);

CREATE POLICY "System can manage stats"
  ON user_gamification_stats FOR ALL
  USING (true);

-- Point Transactions: Users see own
CREATE POLICY "Users can view own transactions"
  ON point_transactions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can insert transactions"
  ON point_transactions FOR INSERT
  WITH CHECK (true);

-- Activity Log: Users see own
CREATE POLICY "Users can view own activity"
  ON user_activity_log FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can manage activity"
  ON user_activity_log FOR ALL
  USING (true);

-- Leaderboard Cache: Public read
CREATE POLICY "Anyone can view leaderboard"
  ON leaderboard_cache FOR SELECT
  USING (true);

CREATE POLICY "System can manage leaderboard"
  ON leaderboard_cache FOR ALL
  USING (true);

-- ================================================================
-- FUNCTIONS
-- ================================================================

-- Initialize gamification stats for a user
CREATE OR REPLACE FUNCTION initialize_user_gamification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_gamification_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Award points to a user
CREATE OR REPLACE FUNCTION award_points(
  p_user_id UUID,
  p_transaction_type point_transaction_type,
  p_points INTEGER,
  p_reference_type VARCHAR DEFAULT NULL,
  p_reference_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  -- Update user stats
  UPDATE user_gamification_stats
  SET
    total_points = total_points + p_points,
    weekly_points = weekly_points + p_points,
    monthly_points = monthly_points + p_points,
    updated_at = NOW()
  WHERE user_id = p_user_id
  RETURNING total_points INTO v_new_balance;

  -- If no stats exist, create them
  IF v_new_balance IS NULL THEN
    INSERT INTO user_gamification_stats (user_id, total_points, weekly_points, monthly_points)
    VALUES (p_user_id, p_points, p_points, p_points)
    RETURNING total_points INTO v_new_balance;
  END IF;

  -- Record transaction
  INSERT INTO point_transactions (
    user_id, transaction_type, points, reference_type, reference_id, description, balance_after
  ) VALUES (
    p_user_id, p_transaction_type, p_points, p_reference_type, p_reference_id, p_description, v_new_balance
  );

  RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update streak for a user
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_last_activity DATE;
  v_today DATE := CURRENT_DATE;
  v_new_streak INTEGER;
BEGIN
  -- Get current stats
  SELECT last_activity_date, current_streak
  INTO v_last_activity, v_new_streak
  FROM user_gamification_stats
  WHERE user_id = p_user_id;

  IF v_last_activity IS NULL THEN
    -- First activity ever
    v_new_streak := 1;
  ELSIF v_last_activity = v_today THEN
    -- Already logged activity today, no change
    RETURN v_new_streak;
  ELSIF v_last_activity = v_today - 1 THEN
    -- Consecutive day, increment streak
    v_new_streak := COALESCE(v_new_streak, 0) + 1;
  ELSE
    -- Streak broken, reset to 1
    v_new_streak := 1;
  END IF;

  -- Update stats
  UPDATE user_gamification_stats
  SET
    current_streak = v_new_streak,
    longest_streak = GREATEST(longest_streak, v_new_streak),
    last_activity_date = v_today,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Log activity
  INSERT INTO user_activity_log (user_id, activity_date, streak_qualified)
  VALUES (p_user_id, v_today, true)
  ON CONFLICT (user_id, activity_date)
  DO UPDATE SET streak_qualified = true, updated_at = NOW();

  RETURN v_new_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Unlock achievement for a user
CREATE OR REPLACE FUNCTION unlock_achievement(
  p_user_id UUID,
  p_achievement_slug VARCHAR,
  p_context JSONB DEFAULT '{}'
)
RETURNS BOOLEAN AS $$
DECLARE
  v_achievement achievements%ROWTYPE;
  v_already_unlocked BOOLEAN;
BEGIN
  -- Get achievement
  SELECT * INTO v_achievement
  FROM achievements
  WHERE slug = p_achievement_slug AND is_active = true;

  IF v_achievement.id IS NULL THEN
    RETURN false;
  END IF;

  -- Check if already unlocked
  SELECT EXISTS(
    SELECT 1 FROM user_achievements
    WHERE user_id = p_user_id AND achievement_id = v_achievement.id
  ) INTO v_already_unlocked;

  IF v_already_unlocked THEN
    RETURN false;
  END IF;

  -- Unlock achievement
  INSERT INTO user_achievements (user_id, achievement_id, context)
  VALUES (p_user_id, v_achievement.id, p_context);

  -- Update stats
  UPDATE user_gamification_stats
  SET achievements_unlocked = achievements_unlocked + 1, updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Award points if any
  IF v_achievement.points_reward > 0 THEN
    PERFORM award_points(
      p_user_id,
      'achievement_unlock',
      v_achievement.points_reward,
      'achievement',
      v_achievement.id,
      'Unlocked: ' || v_achievement.name
    );
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check and unlock achievements based on current stats
CREATE OR REPLACE FUNCTION check_achievements(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_stats user_gamification_stats%ROWTYPE;
  v_achievement achievements%ROWTYPE;
  v_unlocked_count INTEGER := 0;
  v_criteria JSONB;
  v_threshold INTEGER;
  v_should_unlock BOOLEAN;
BEGIN
  -- Get user stats
  SELECT * INTO v_stats
  FROM user_gamification_stats
  WHERE user_id = p_user_id;

  IF v_stats.user_id IS NULL THEN
    RETURN 0;
  END IF;

  -- Check each active achievement
  FOR v_achievement IN
    SELECT * FROM achievements
    WHERE is_active = true
    AND NOT EXISTS (
      SELECT 1 FROM user_achievements
      WHERE user_id = p_user_id AND achievement_id = achievements.id
    )
  LOOP
    v_criteria := v_achievement.unlock_criteria;
    v_should_unlock := false;

    -- Check based on criteria type
    CASE v_criteria->>'type'
      WHEN 'lesson_count' THEN
        v_threshold := (v_criteria->>'threshold')::INTEGER;
        v_should_unlock := v_stats.lessons_completed >= v_threshold;

      WHEN 'quiz_pass_count' THEN
        v_threshold := (v_criteria->>'threshold')::INTEGER;
        v_should_unlock := v_stats.quizzes_passed >= v_threshold;

      WHEN 'perfect_quiz_count' THEN
        v_threshold := (v_criteria->>'threshold')::INTEGER;
        v_should_unlock := v_stats.perfect_quizzes >= v_threshold;

      WHEN 'course_count' THEN
        v_threshold := (v_criteria->>'threshold')::INTEGER;
        v_should_unlock := v_stats.courses_completed >= v_threshold;

      WHEN 'streak_days' THEN
        v_threshold := (v_criteria->>'threshold')::INTEGER;
        v_should_unlock := v_stats.current_streak >= v_threshold;

      WHEN 'longest_streak' THEN
        v_threshold := (v_criteria->>'threshold')::INTEGER;
        v_should_unlock := v_stats.longest_streak >= v_threshold;

      WHEN 'total_points' THEN
        v_threshold := (v_criteria->>'threshold')::INTEGER;
        v_should_unlock := v_stats.total_points >= v_threshold;

      WHEN 'discussions_count' THEN
        v_threshold := (v_criteria->>'threshold')::INTEGER;
        v_should_unlock := v_stats.discussions_created >= v_threshold;

      WHEN 'certificates_count' THEN
        v_threshold := (v_criteria->>'threshold')::INTEGER;
        v_should_unlock := v_stats.certificates_earned >= v_threshold;

      WHEN 'achievements_count' THEN
        v_threshold := (v_criteria->>'threshold')::INTEGER;
        v_should_unlock := v_stats.achievements_unlocked >= v_threshold;

      ELSE
        v_should_unlock := false;
    END CASE;

    IF v_should_unlock THEN
      PERFORM unlock_achievement(p_user_id, v_achievement.slug,
        jsonb_build_object('auto_checked', true, 'stats_snapshot', row_to_json(v_stats)));
      v_unlocked_count := v_unlocked_count + 1;
    END IF;
  END LOOP;

  RETURN v_unlocked_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reset weekly points (to be called by cron job)
CREATE OR REPLACE FUNCTION reset_weekly_points()
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE user_gamification_stats
  SET weekly_points = 0, weekly_reset_at = NOW()
  WHERE weekly_reset_at < NOW() - INTERVAL '7 days';

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reset monthly points (to be called by cron job)
CREATE OR REPLACE FUNCTION reset_monthly_points()
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE user_gamification_stats
  SET monthly_points = 0, monthly_reset_at = NOW()
  WHERE monthly_reset_at < NOW() - INTERVAL '30 days';

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Refresh leaderboard cache
CREATE OR REPLACE FUNCTION refresh_leaderboard_cache()
RETURNS void AS $$
BEGIN
  -- Clear old cache
  DELETE FROM leaderboard_cache;

  -- Insert all-time leaderboard (top 100)
  INSERT INTO leaderboard_cache (leaderboard_type, user_id, rank, points, user_name, user_avatar_url)
  SELECT
    'all_time',
    gs.user_id,
    ROW_NUMBER() OVER (ORDER BY gs.total_points DESC),
    gs.total_points,
    u.full_name,
    u.avatar_url
  FROM user_gamification_stats gs
  JOIN users u ON u.id = gs.user_id
  WHERE gs.total_points > 0
  ORDER BY gs.total_points DESC
  LIMIT 100;

  -- Insert weekly leaderboard (top 100)
  INSERT INTO leaderboard_cache (leaderboard_type, user_id, rank, points, user_name, user_avatar_url)
  SELECT
    'weekly',
    gs.user_id,
    ROW_NUMBER() OVER (ORDER BY gs.weekly_points DESC),
    gs.weekly_points,
    u.full_name,
    u.avatar_url
  FROM user_gamification_stats gs
  JOIN users u ON u.id = gs.user_id
  WHERE gs.weekly_points > 0
  ORDER BY gs.weekly_points DESC
  LIMIT 100;

  -- Insert monthly leaderboard (top 100)
  INSERT INTO leaderboard_cache (leaderboard_type, user_id, rank, points, user_name, user_avatar_url)
  SELECT
    'monthly',
    gs.user_id,
    ROW_NUMBER() OVER (ORDER BY gs.monthly_points DESC),
    gs.monthly_points,
    u.full_name,
    u.avatar_url
  FROM user_gamification_stats gs
  JOIN users u ON u.id = gs.user_id
  WHERE gs.monthly_points > 0
  ORDER BY gs.monthly_points DESC
  LIMIT 100;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- TRIGGERS
-- ================================================================

-- Auto-create gamification stats for new users
CREATE TRIGGER trigger_initialize_user_gamification
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_gamification();

-- Update timestamps
CREATE TRIGGER update_achievements_updated_at
  BEFORE UPDATE ON achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON user_gamification_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_activity_log_updated_at
  BEFORE UPDATE ON user_activity_log
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ================================================================
-- SEED DATA: Default Achievements
-- ================================================================

INSERT INTO achievements (name, slug, description, category, rarity, points_reward, unlock_criteria, display_order) VALUES
-- Learning achievements
('First Steps', 'first-lesson', 'Complete your first lesson', 'learning', 'common', 10, '{"type": "lesson_count", "threshold": 1}', 1),
('Dedicated Learner', 'ten-lessons', 'Complete 10 lessons', 'learning', 'common', 50, '{"type": "lesson_count", "threshold": 10}', 2),
('Knowledge Seeker', 'fifty-lessons', 'Complete 50 lessons', 'learning', 'uncommon', 200, '{"type": "lesson_count", "threshold": 50}', 3),
('Lesson Master', 'hundred-lessons', 'Complete 100 lessons', 'learning', 'rare', 500, '{"type": "lesson_count", "threshold": 100}', 4),
('Learning Legend', 'five-hundred-lessons', 'Complete 500 lessons', 'learning', 'legendary', 2000, '{"type": "lesson_count", "threshold": 500}', 5),

-- Course completion
('Graduate', 'first-course', 'Complete your first course', 'learning', 'uncommon', 100, '{"type": "course_count", "threshold": 1}', 10),
('Multi-Graduate', 'five-courses', 'Complete 5 courses', 'learning', 'rare', 500, '{"type": "course_count", "threshold": 5}', 11),
('Course Collector', 'ten-courses', 'Complete 10 courses', 'learning', 'epic', 1000, '{"type": "course_count", "threshold": 10}', 12),

-- Quiz mastery
('Quiz Taker', 'first-quiz', 'Pass your first quiz', 'mastery', 'common', 20, '{"type": "quiz_pass_count", "threshold": 1}', 20),
('Quiz Pro', 'ten-quizzes', 'Pass 10 quizzes', 'mastery', 'uncommon', 100, '{"type": "quiz_pass_count", "threshold": 10}', 21),
('Perfectionist', 'first-perfect', 'Score 100% on a quiz', 'mastery', 'uncommon', 50, '{"type": "perfect_quiz_count", "threshold": 1}', 22),
('Flawless', 'five-perfect', 'Score 100% on 5 quizzes', 'mastery', 'rare', 250, '{"type": "perfect_quiz_count", "threshold": 5}', 23),
('Quiz Master', 'twenty-perfect', 'Score 100% on 20 quizzes', 'mastery', 'epic', 1000, '{"type": "perfect_quiz_count", "threshold": 20}', 24),

-- Streaks
('Getting Started', 'three-day-streak', 'Maintain a 3-day learning streak', 'consistency', 'common', 30, '{"type": "streak_days", "threshold": 3}', 30),
('Week Warrior', 'seven-day-streak', 'Maintain a 7-day learning streak', 'consistency', 'uncommon', 100, '{"type": "streak_days", "threshold": 7}', 31),
('Two Week Champion', 'fourteen-day-streak', 'Maintain a 14-day learning streak', 'consistency', 'rare', 250, '{"type": "streak_days", "threshold": 14}', 32),
('Monthly Master', 'thirty-day-streak', 'Maintain a 30-day learning streak', 'consistency', 'epic', 750, '{"type": "streak_days", "threshold": 30}', 33),
('Unstoppable', 'ninety-day-streak', 'Maintain a 90-day learning streak', 'consistency', 'legendary', 3000, '{"type": "streak_days", "threshold": 90}', 34),

-- Engagement
('Conversationalist', 'first-discussion', 'Start your first discussion', 'engagement', 'common', 15, '{"type": "discussions_count", "threshold": 1}', 40),
('Active Participant', 'ten-discussions', 'Start 10 discussions', 'engagement', 'uncommon', 100, '{"type": "discussions_count", "threshold": 10}', 41),

-- Certifications
('Certified', 'first-cert', 'Earn your first certificate', 'mastery', 'uncommon', 200, '{"type": "certificates_count", "threshold": 1}', 50),
('Credential Collector', 'five-certs', 'Earn 5 certificates', 'mastery', 'rare', 750, '{"type": "certificates_count", "threshold": 5}', 51),
('Certificate Master', 'ten-certs', 'Earn 10 certificates', 'mastery', 'epic', 1500, '{"type": "certificates_count", "threshold": 10}', 52),

-- Points milestones
('Rising Star', 'thousand-points', 'Earn 1,000 total points', 'milestone', 'common', 0, '{"type": "total_points", "threshold": 1000}', 60),
('Point Collector', 'five-thousand-points', 'Earn 5,000 total points', 'milestone', 'uncommon', 0, '{"type": "total_points", "threshold": 5000}', 61),
('Point Master', 'twenty-five-thousand-points', 'Earn 25,000 total points', 'milestone', 'rare', 0, '{"type": "total_points", "threshold": 25000}', 62),
('Point Legend', 'hundred-thousand-points', 'Earn 100,000 total points', 'milestone', 'legendary', 0, '{"type": "total_points", "threshold": 100000}', 63),

-- Achievement meta
('Collector', 'ten-achievements', 'Unlock 10 achievements', 'milestone', 'uncommon', 100, '{"type": "achievements_count", "threshold": 10}', 70),
('Achievement Hunter', 'twenty-five-achievements', 'Unlock 25 achievements', 'milestone', 'rare', 500, '{"type": "achievements_count", "threshold": 25}', 71);

-- ================================================================
-- POINT VALUES CONFIGURATION
-- ================================================================

COMMENT ON TYPE point_transaction_type IS 'Point values (suggested):
- lesson_complete: 10 points
- quiz_pass: 25 points
- quiz_perfect: 50 points (bonus)
- course_complete: 100 points
- streak_bonus: 5 points per day of streak
- achievement_unlock: varies by achievement
- discussion_create: 5 points
- discussion_reply: 2 points
- discussion_upvote_received: 1 point
- certificate_earned: 200 points
- daily_login: 5 points
- first_enrollment: 20 points
- referral_bonus: 100 points';
