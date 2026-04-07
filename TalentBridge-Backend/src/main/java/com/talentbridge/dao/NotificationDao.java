package com.talentbridge.dao;

import com.talentbridge.model.Notification;
import java.util.List;

public interface NotificationDao {
    Integer save(Notification notification);
    List<Notification> findByUserId(Integer userId);
    List<Notification> findUnreadByUserId(Integer userId);
    void markAsRead(Integer notificationId);
    void markAllAsReadByUserId(Integer userId);
    int deleteOlderThanDays(int days);
    int countUnreadByUserId(Integer userId);
}
