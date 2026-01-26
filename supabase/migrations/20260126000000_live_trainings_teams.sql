-- ============================================================================
-- Live Training Sessions & Team Management
-- ============================================================================

-- ============================================================================
-- LIVE TRAINING ENUMS
-- ============================================================================

CREATE TYPE live_training_platform AS ENUM ('zoom', 'google_meet', 'teams', 'custom');
CREATE TYPE live_training_status AS ENUM ('scheduled', 'live', 'completed', 'cancelled');

-- ============================================================================
-- LIVE TRAININGS TABLE
-- ============================================================================

CREATE TABLE live_trainings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    instructor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform live_training_platform DEFAULT 'zoom',
    meeting_url TEXT NOT NULL,
    meeting_id TEXT,
    meeting_password TEXT,
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    status live_training_status DEFAULT 'scheduled',
    max_participants INTEGER DEFAULT 100,
    recording_url TEXT,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_rule TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- LIVE TRAINING REGISTRATIONS TABLE
-- ============================================================================

CREATE TABLE live_training_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    live_training_id UUID NOT NULL REFERENCES live_trainings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    attended BOOLEAN DEFAULT false,
    attended_at TIMESTAMPTZ,
    attended_duration_minutes INTEGER DEFAULT 0,
    UNIQUE(live_training_id, user_id)
);

-- ============================================================================
-- TEAMS TABLE
-- ============================================================================

CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    max_members INTEGER DEFAULT 50,
    is_active BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{
        "allow_member_invites": false,
        "require_approval": true,
        "default_course_access": [],
        "allow_discussions": true
    }'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TEAM MEMBERS TABLE
-- ============================================================================

CREATE TYPE team_member_role AS ENUM ('owner', 'admin', 'member');
CREATE TYPE team_invite_status AS ENUM ('pending', 'accepted', 'declined', 'expired');

CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role team_member_role DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(team_id, user_id)
);

-- ============================================================================
-- TEAM INVITATIONS TABLE
-- ============================================================================

CREATE TABLE team_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role team_member_role DEFAULT 'member',
    status team_invite_status DEFAULT 'pending',
    invited_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ
);

-- ============================================================================
-- TEAM COURSE ACCESS TABLE
-- ============================================================================

CREATE TABLE team_course_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    granted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    expires_at TIMESTAMPTZ,
    UNIQUE(team_id, course_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Live trainings
CREATE INDEX idx_live_trainings_course ON live_trainings(course_id);
CREATE INDEX idx_live_trainings_instructor ON live_trainings(instructor_id);
CREATE INDEX idx_live_trainings_status ON live_trainings(status);
CREATE INDEX idx_live_trainings_scheduled ON live_trainings(scheduled_start);
CREATE INDEX idx_live_trainings_upcoming ON live_trainings(scheduled_start)
    WHERE status IN ('scheduled', 'live');

-- Registrations
CREATE INDEX idx_live_training_registrations_training ON live_training_registrations(live_training_id);
CREATE INDEX idx_live_training_registrations_user ON live_training_registrations(user_id);

-- Teams
CREATE INDEX idx_teams_owner ON teams(owner_id);
CREATE INDEX idx_teams_slug ON teams(slug);

-- Team members
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);

-- Team invitations
CREATE INDEX idx_team_invitations_team ON team_invitations(team_id);
CREATE INDEX idx_team_invitations_email ON team_invitations(email);
CREATE INDEX idx_team_invitations_token ON team_invitations(token);

-- Team course access
CREATE INDEX idx_team_course_access_team ON team_course_access(team_id);
CREATE INDEX idx_team_course_access_course ON team_course_access(course_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE live_trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_training_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_course_access ENABLE ROW LEVEL SECURITY;

-- Live trainings policies
CREATE POLICY "Live trainings are viewable by everyone" ON live_trainings
    FOR SELECT USING (status != 'cancelled');

CREATE POLICY "Instructors can manage their live trainings" ON live_trainings
    FOR ALL USING (instructor_id = auth.uid());

CREATE POLICY "Admins can manage all live trainings" ON live_trainings
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Registrations policies
CREATE POLICY "Users can view their registrations" ON live_training_registrations
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can register for trainings" ON live_training_registrations
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Instructors can view training registrations" ON live_training_registrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM live_trainings
            WHERE id = live_training_id AND instructor_id = auth.uid()
        )
    );

-- Teams policies
CREATE POLICY "Team members can view their teams" ON teams
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM team_members WHERE team_id = id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Owners can manage their teams" ON teams
    FOR ALL USING (owner_id = auth.uid());

-- Team members policies
CREATE POLICY "Team members can view other members" ON team_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM team_members tm WHERE tm.team_id = team_id AND tm.user_id = auth.uid()
        )
    );

CREATE POLICY "Team admins can manage members" ON team_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM team_members tm
            WHERE tm.team_id = team_id
            AND tm.user_id = auth.uid()
            AND tm.role IN ('owner', 'admin')
        )
    );

-- Team invitations policies
CREATE POLICY "Team admins can manage invitations" ON team_invitations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM team_members tm
            WHERE tm.team_id = team_id
            AND tm.user_id = auth.uid()
            AND tm.role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Invitees can view their invitations" ON team_invitations
    FOR SELECT USING (
        email = (SELECT email FROM users WHERE id = auth.uid())
    );

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at for live_trainings
CREATE TRIGGER update_live_trainings_updated_at
    BEFORE UPDATE ON live_trainings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Update updated_at for teams
CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to get registered count for a training
CREATE OR REPLACE FUNCTION get_training_registration_count(training_id UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER
        FROM live_training_registrations
        WHERE live_training_id = training_id
    );
END;
$$ LANGUAGE plpgsql;

-- Function to check if user is registered for training
CREATE OR REPLACE FUNCTION is_user_registered(training_id UUID, u_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM live_training_registrations
        WHERE live_training_id = training_id AND user_id = u_id
    );
END;
$$ LANGUAGE plpgsql;

-- Function to get team member count
CREATE OR REPLACE FUNCTION get_team_member_count(t_id UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER
        FROM team_members
        WHERE team_id = t_id
    );
END;
$$ LANGUAGE plpgsql;
