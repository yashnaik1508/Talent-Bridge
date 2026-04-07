-- =============================================
-- V2: Notifications System
-- =============================================

CREATE TABLE IF NOT EXISTS notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id         INTEGER      NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    message         TEXT         NOT NULL,
    type            VARCHAR(50)  NOT NULL DEFAULT 'INFO',
    is_read         BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_notifications_user       ON notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read    ON notifications (user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications (created_at);
