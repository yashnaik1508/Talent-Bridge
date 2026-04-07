package com.talentbridge.service;

import com.talentbridge.model.Notification;
import java.util.List;

public interface NotificationService {
    Integer createNotification(Integer userId, String message, String type);
    List<Notification> getUserNotifications(Integer userId);
    List<Notification> getUnreadNotifications(Integer userId);
    void markAsRead(Integer notificationId);
    void markAllAsRead(Integer userId);
    int getUnreadCount(Integer userId);
    int cleanupOldNotifications(int days);
}
