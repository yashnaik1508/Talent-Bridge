CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    team_id INT NOT NULL,
    assigned_to INT NOT NULL,
    created_by INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED')),
    completed_work TEXT,
    pending_work TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_team FOREIGN KEY (team_id)
        REFERENCES teams(team_id) ON DELETE CASCADE,
    CONSTRAINT fk_assigned FOREIGN KEY (assigned_to)
        REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_created FOREIGN KEY (created_by)
        REFERENCES users(user_id) ON DELETE CASCADE
);
