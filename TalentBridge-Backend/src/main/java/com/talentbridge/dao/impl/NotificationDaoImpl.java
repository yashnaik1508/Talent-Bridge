package com.talentbridge.dao.impl;

import com.talentbridge.dao.NotificationDao;
import com.talentbridge.model.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class NotificationDaoImpl implements NotificationDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Notification> notificationRowMapper = (rs, rowNum) -> {
        Notification n = new Notification();
        n.setNotificationId(rs.getInt("notification_id"));
        n.setUserId(rs.getInt("user_id"));
        n.setMessage(rs.getString("message"));
        n.setType(rs.getString("type"));
        n.setIsRead(rs.getBoolean("is_read"));
        n.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return n;
    };

    @Override
    public Integer save(Notification notification) {
        String sql = "INSERT INTO notifications (user_id, message, type, is_read) " +
                     "VALUES (?, ?, ?, ?) RETURNING notification_id";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, notification.getUserId());
            ps.setString(2, notification.getMessage());
            ps.setString(3, notification.getType() != null ? notification.getType() : "INFO");
            ps.setBoolean(4, notification.getIsRead() != null ? notification.getIsRead() : false);
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.intValue() : null;
    }

    @Override
    public List<Notification> findByUserId(Integer userId) {
        String sql = "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, notificationRowMapper, userId);
    }

    @Override
    public List<Notification> findUnreadByUserId(Integer userId) {
        String sql = "SELECT * FROM notifications WHERE user_id = ? AND is_read = FALSE ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, notificationRowMapper, userId);
    }

    @Override
    public void markAsRead(Integer notificationId) {
        jdbcTemplate.update("UPDATE notifications SET is_read = TRUE WHERE notification_id = ?", notificationId);
    }

    @Override
    public void markAllAsReadByUserId(Integer userId) {
        jdbcTemplate.update("UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE", userId);
    }

    @Override
    public int deleteOlderThanDays(int days) {
        String sql = "DELETE FROM notifications WHERE created_at < CURRENT_TIMESTAMP - CAST(? || ' days' AS INTERVAL)";
        return jdbcTemplate.update(sql, String.valueOf(days));
    }

    @Override
    public int countUnreadByUserId(Integer userId) {
        String sql = "SELECT COUNT(*) FROM notifications WHERE user_id = ? AND is_read = FALSE";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userId);
        return count != null ? count : 0;
    }
}
