package com.talentbridge.scheduler;

import com.talentbridge.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Scheduled task to clean up old notifications.
 * Runs daily at 2:00 AM and deletes notifications older than 90 days.
 */
@Component
public class NotificationCleanupScheduler {

    private static final Logger logger = LoggerFactory.getLogger(NotificationCleanupScheduler.class);

    private static final int RETENTION_DAYS = 90;

    @Autowired
    private NotificationService notificationService;

    /**
     * Runs every day at 2:00 AM server time.
     * Cron: second minute hour day-of-month month day-of-week
     */
    @Scheduled(cron = "0 0 2 * * *")
    public void cleanupOldNotifications() {
        logger.info("Starting scheduled notification cleanup (retention: {} days)...", RETENTION_DAYS);
        try {
            int deletedCount = notificationService.cleanupOldNotifications(RETENTION_DAYS);
            logger.info("Notification cleanup completed. Deleted {} old notifications.", deletedCount);
        } catch (Exception e) {
            logger.error("Notification cleanup failed: {}", e.getMessage(), e);
        }
    }
}
