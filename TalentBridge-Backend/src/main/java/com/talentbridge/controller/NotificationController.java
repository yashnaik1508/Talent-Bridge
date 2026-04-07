package com.talentbridge.controller;

import com.talentbridge.model.Notification;
import com.talentbridge.model.User;
import com.talentbridge.service.NotificationService;
import com.talentbridge.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    /**
     * Create a notification (ADMIN/PM use).
     * Body: { "userId": 5, "message": "You've been assigned!", "type": "ASSIGNMENT" }
     */
    @PostMapping
    public ResponseEntity<?> createNotification(@RequestBody Map<String, Object> request) {
        Integer userId = ((Number) request.get("userId")).intValue();
        String message = (String) request.get("message");
        String type = request.getOrDefault("type", "INFO").toString();

        Integer id = notificationService.createNotification(userId, message, type);
        return ResponseEntity.ok(Map.of("notificationId", id, "message", "Notification created"));
    }

    /**
     * Get all notifications for the currently authenticated user.
     */
    @GetMapping("/my")
    public ResponseEntity<List<Notification>> getMyNotifications(Authentication authentication) {
        Integer userId = resolveUserId(authentication);
        if (userId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    /**
     * Get unread notifications for the currently authenticated user.
     */
    @GetMapping("/my/unread")
    public ResponseEntity<List<Notification>> getMyUnreadNotifications(Authentication authentication) {
        Integer userId = resolveUserId(authentication);
        if (userId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }

    /**
     * Get unread count for the currently authenticated user.
     */
    @GetMapping("/my/unread-count")
    public ResponseEntity<?> getUnreadCount(Authentication authentication) {
        Integer userId = resolveUserId(authentication);
        if (userId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount(userId)));
    }

    /**
     * Mark a single notification as read.
     */
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Integer notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }

    /**
     * Mark all notifications as read for the authenticated user.
     */
    @PutMapping("/my/read-all")
    public ResponseEntity<?> markAllAsRead(Authentication authentication) {
        Integer userId = resolveUserId(authentication);
        if (userId == null) return ResponseEntity.status(401).build();
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    /**
     * Get notifications for a specific user (ADMIN use).
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable Integer userId) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    // ── Helper ──────────────────────────────────────────────────────────────

    private Integer resolveUserId(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) return null;

        Object principal = authentication.getPrincipal();

        if (principal instanceof Integer) return (Integer) principal;
        if (principal instanceof Number) return ((Number) principal).intValue();

        if (principal instanceof String) {
            try {
                User user = userService.getUserByEmail((String) principal);
                return user != null ? user.getUserId() : null;
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }
}
