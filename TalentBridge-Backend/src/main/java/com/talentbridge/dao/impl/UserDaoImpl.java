package com.talentbridge.dao.impl;

import com.talentbridge.dao.UserDao;
import com.talentbridge.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.*;

@Repository
public class UserDaoImpl implements UserDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<User> userRowMapper = (rs, rowNum) -> {
        User user = new User();
        user.setUserId(rs.getInt("user_id"));
        user.setUsername(rs.getString("username"));
        user.setFullName(rs.getString("full_name"));
        user.setEmail(rs.getString("email"));
        user.setPasswordHash(rs.getString("password_hash"));
        user.setRole(rs.getString("role"));
        user.setPhone(rs.getString("phone"));
        user.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        user.setIsActive(rs.getBoolean("is_active"));
        return user;
    };

    @Override
    public User findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ? AND is_active = TRUE";
        List<User> users = jdbcTemplate.query(sql, userRowMapper, email);
        return users.isEmpty() ? null : users.get(0);
    }

    @Override
    public User findById(Integer userId) {
        String sql = "SELECT * FROM users WHERE user_id = ?";
        List<User> users = jdbcTemplate.query(sql, userRowMapper, userId);
        return users.isEmpty() ? null : users.get(0);
    }

    @Override
    public List<User> findAll(int offset, int limit) {
        String sql = "SELECT * FROM users WHERE is_active = TRUE ORDER BY created_at DESC LIMIT ? OFFSET ?";
        return jdbcTemplate.query(sql, userRowMapper, limit, offset);
    }

    @Override
    public Integer save(User user) {
        String sql = "INSERT INTO users (username, full_name, email, password_hash, role, phone, is_active) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING user_id";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.getUsername());
            ps.setString(2, user.getFullName());
            ps.setString(3, user.getEmail());
            ps.setString(4, user.getPasswordHash());
            ps.setString(5, user.getRole());
            ps.setString(6, user.getPhone());
            ps.setBoolean(7, user.getIsActive() != null ? user.getIsActive() : true);
            return ps;
        }, keyHolder);

        return (Integer) keyHolder.getKeys().get("user_id");
    }

    @Override
    public void update(User user) {
        String sql = "UPDATE users SET username = ?, full_name = ?, phone = ?, role = ? WHERE user_id = ?";
        jdbcTemplate.update(sql, user.getUsername(), user.getFullName(), user.getPhone(), user.getRole(), user.getUserId());
    }

    @Override
    public void delete(Integer userId) {
        String sql = "UPDATE users SET is_active = FALSE WHERE user_id = ?";
        jdbcTemplate.update(sql, userId);
    }

    @Override
    public List<User> findByRole(String role) {
        String sql = "SELECT * FROM users WHERE role = ? AND is_active = TRUE";
        return jdbcTemplate.query(sql, userRowMapper, role);
    }

    @Override
    public int count() {
        String sql = "SELECT COUNT(*) FROM users";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }

    @Override
    public Map<String, Integer> countByRole() {
        String sql = "SELECT role, COUNT(*) as cnt FROM users WHERE is_active = TRUE GROUP BY role";
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);

        Map<String, Integer> map = new HashMap<>();
        for (Map<String, Object> row : rows) {
            map.put((String) row.get("role"), ((Number) row.get("cnt")).intValue());
        }
        return map;
    }

    @Override
    public Map<String, Integer> countByStatus() {
        String sql = "SELECT is_active, COUNT(*) as cnt FROM users GROUP BY is_active";
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);

        Map<String, Integer> map = new HashMap<>();
        for (Map<String, Object> row : rows) {
            Boolean active = (Boolean) row.get("is_active");
            map.put(active ? "ACTIVE" : "INACTIVE", ((Number) row.get("cnt")).intValue());
        }

        map.putIfAbsent("ACTIVE", 0);
        map.putIfAbsent("INACTIVE", 0);

        return map;
    }

    @Override
    public List<User> findInactive(int offset, int limit) {
        String sql = "SELECT * FROM users WHERE is_active = FALSE ORDER BY created_at DESC LIMIT ? OFFSET ?";
        return jdbcTemplate.query(sql, userRowMapper, limit, offset);
    }

    @Override
    public void reactivate(Integer userId) {
        String sql = "UPDATE users SET is_active = TRUE WHERE user_id = ?";
        jdbcTemplate.update(sql, userId);
    }
}
