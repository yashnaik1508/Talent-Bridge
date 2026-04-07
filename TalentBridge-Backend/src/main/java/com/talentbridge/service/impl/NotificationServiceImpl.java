package com.talentbridge.service.impl;

import com.talentbridge.dao.NotificationDao;
import com.talentbridge.model.Notification;
import com.talentbridge.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationDao notificationDao;

    @Override
    public Integer createNotification(Integer userId, String message, String type) {
        Notification notification = new Notification(userId, message, type);
        return notificationDao.save(notification);
    }

    @Override
    public List<Notification> getUserNotifications(Integer userId) {
        return notificationDao.findByUserId(userId);
    }

    @Override
    public List<Notification> getUnreadNotifications(Integer userId) {
        return notificationDao.findUnreadByUserId(userId);
    }

    @Override
    public void markAsRead(Integer notificationId) {
        notificationDao.markAsRead(notificationId);
    }

    @Override
    public void markAllAsRead(Integer userId) {
        notificationDao.markAllAsReadByUserId(userId);
    }

    @Override
    public int getUnreadCount(Integer userId) {
        return notificationDao.countUnreadByUserId(userId);
    }

    @Override
    public int cleanupOldNotifications(int days) {
        return notificationDao.deleteOlderThanDays(days);
    }
}
