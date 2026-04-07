-- =============================================
-- V1: TalentBridge — Complete Initial Schema
-- =============================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    user_id       SERIAL PRIMARY KEY,
    username      VARCHAR(100),
    full_name     VARCHAR(200) NOT NULL,
    email         VARCHAR(200) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(50)  NOT NULL DEFAULT 'EMPLOYEE',
    phone         VARCHAR(20),
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_users_email     ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role      ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users (is_active);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
    project_id         SERIAL PRIMARY KEY,
    name               VARCHAR(255) NOT NULL,
    description        TEXT,
    start_date         DATE,
    end_date           DATE,
    required_headcount INTEGER      DEFAULT 0,
    status             VARCHAR(50)  NOT NULL DEFAULT 'OPEN',
    created_by         INTEGER      REFERENCES users (user_id) ON DELETE SET NULL,
    created_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_status     ON projects (status);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects (created_by);

-- 3. SKILLS TABLE
CREATE TABLE IF NOT EXISTS skills (
    skill_id   SERIAL PRIMARY KEY,
    name       VARCHAR(200) NOT NULL UNIQUE,
    category   VARCHAR(100),
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_skills_name     ON skills (name);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills (category);

-- 4. EMPLOYEE_SKILLS TABLE (junction: users ↔ skills)
CREATE TABLE IF NOT EXISTS employee_skills (
    id               SERIAL PRIMARY KEY,
    user_id          INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    skill_id         INTEGER NOT NULL REFERENCES skills (skill_id) ON DELETE CASCADE,
    level            INTEGER NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 5),
    years_experience INTEGER NOT NULL DEFAULT 0,
    last_used_year   INTEGER,
    UNIQUE (user_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_employee_skills_user  ON employee_skills (user_id);
CREATE INDEX IF NOT EXISTS idx_employee_skills_skill ON employee_skills (skill_id);

-- 5. PROJECT_SKILL_REQUIREMENTS TABLE
CREATE TABLE IF NOT EXISTS project_skill_requirements (
    id            SERIAL PRIMARY KEY,
    project_id    INTEGER NOT NULL REFERENCES projects (project_id) ON DELETE CASCADE,
    skill_id      INTEGER NOT NULL REFERENCES skills (skill_id) ON DELETE CASCADE,
    desired_level INTEGER NOT NULL DEFAULT 3 CHECK (desired_level BETWEEN 1 AND 5),
    weight        REAL,
    UNIQUE (project_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_psr_project ON project_skill_requirements (project_id);
CREATE INDEX IF NOT EXISTS idx_psr_skill   ON project_skill_requirements (skill_id);

-- 6. ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS assignments (
    assignment_id   SERIAL PRIMARY KEY,
    project_id      INTEGER     NOT NULL REFERENCES projects (project_id) ON DELETE CASCADE,
    user_id         INTEGER     NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    role_on_project VARCHAR(100) DEFAULT 'Developer',
    assigned_at     TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    release_date    DATE,
    status          VARCHAR(50) NOT NULL DEFAULT 'ASSIGNED'
);

CREATE INDEX IF NOT EXISTS idx_assignments_project ON assignments (project_id);
CREATE INDEX IF NOT EXISTS idx_assignments_user    ON assignments (user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status  ON assignments (status);

-- 7. MATCHES TABLE (Matching Algorithm Runs)
CREATE TABLE IF NOT EXISTS matches (
    match_id     SERIAL PRIMARY KEY,
    project_id   INTEGER     NOT NULL REFERENCES projects (project_id) ON DELETE CASCADE,
    requested_by INTEGER     REFERENCES users (user_id) ON DELETE SET NULL,
    status       VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_matches_project ON matches (project_id);

-- 8. MATCH_RESULTS TABLE (Individual Candidate Scores)
CREATE TABLE IF NOT EXISTS match_results (
    result_id          SERIAL PRIMARY KEY,
    match_id           INTEGER NOT NULL REFERENCES matches (match_id) ON DELETE CASCADE,
    user_id            INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    total_score        REAL    NOT NULL DEFAULT 0,
    skill_score        REAL    NOT NULL DEFAULT 0,
    experience_score   REAL    NOT NULL DEFAULT 0,
    availability_score REAL    NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_match_results_match ON match_results (match_id);
CREATE INDEX IF NOT EXISTS idx_match_results_user  ON match_results (user_id);

-- 9. EMPLOYEE_AVAILABILITY TABLE
CREATE TABLE IF NOT EXISTS employee_availability (
    id                SERIAL PRIMARY KEY,
    user_id           INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    percent_available INTEGER NOT NULL DEFAULT 100 CHECK (percent_available BETWEEN 0 AND 100),
    from_date         DATE    NOT NULL DEFAULT CURRENT_DATE,
    to_date           DATE,
    notes             TEXT
);

CREATE INDEX IF NOT EXISTS idx_emp_avail_user ON employee_availability (user_id);
CREATE INDEX IF NOT EXISTS idx_emp_avail_date ON employee_availability (from_date, to_date);
