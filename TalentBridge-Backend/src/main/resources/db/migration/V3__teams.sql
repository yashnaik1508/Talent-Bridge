-- =============================================
-- V3: Teams Module
-- =============================================

-- 1. TEAMS TABLE
CREATE TABLE IF NOT EXISTS teams (
    team_id    SERIAL PRIMARY KEY,
    name       VARCHAR(200) NOT NULL,
    project_id INTEGER      NOT NULL REFERENCES projects (project_id) ON DELETE CASCADE,
    created_by INTEGER      NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_teams_project    ON teams (project_id);
CREATE INDEX IF NOT EXISTS idx_teams_created_by ON teams (created_by);

-- 2. TEAM_MEMBERS TABLE
CREATE TABLE IF NOT EXISTS team_members (
    id      SERIAL PRIMARY KEY,
    team_id INTEGER      NOT NULL REFERENCES teams (team_id) ON DELETE CASCADE,
    user_id INTEGER      NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    role    VARCHAR(100) NOT NULL DEFAULT 'MEMBER',
    UNIQUE (team_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members (team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members (user_id);

-- 3. TEAM_MESSAGES TABLE (Team Updates / Chat)
CREATE TABLE IF NOT EXISTS team_messages (
    message_id SERIAL PRIMARY KEY,
    team_id    INTEGER   NOT NULL REFERENCES teams (team_id) ON DELETE CASCADE,
    user_id    INTEGER   NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    message    TEXT      NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_team_messages_team    ON team_messages (team_id);
CREATE INDEX IF NOT EXISTS idx_team_messages_created ON team_messages (created_at);
