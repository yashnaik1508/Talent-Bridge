package com.talentbridge.dao.impl;

import com.talentbridge.dao.TaskDao;
import com.talentbridge.model.Task;
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
public class TaskDaoImpl implements TaskDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Task> taskRowMapper = (rs, rowNum) -> {
        Task task = new Task();
        task.setTaskId(rs.getInt("task_id"));
        task.setTeamId(rs.getInt("team_id"));
        task.setAssignedTo(rs.getInt("assigned_to"));
        task.setCreatedBy(rs.getInt("created_by"));
        task.setTitle(rs.getString("title"));
        task.setDescription(rs.getString("description"));
        task.setStatus(rs.getString("status"));
        task.setCompletedWork(rs.getString("completed_work"));
        task.setPendingWork(rs.getString("pending_work"));
        task.setCreatedAt(rs.getTimestamp("created_at"));
        task.setUpdatedAt(rs.getTimestamp("updated_at"));
        
        // Joined fields
        try { task.setAssignedToName(rs.getString("assigned_to_name")); } catch (Exception e) {}
        try { task.setCreatedByName(rs.getString("created_by_name")); } catch (Exception e) {}
        try { task.setTeamName(rs.getString("team_name")); } catch (Exception e) {}
        
        return task;
    };

    @Override
    public Integer save(Task task) {
        String sql = "INSERT INTO tasks (team_id, assigned_to, created_by, title, description, status) VALUES (?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, task.getTeamId());
            ps.setInt(2, task.getAssignedTo());
            ps.setInt(3, task.getCreatedBy());
            ps.setString(4, task.getTitle());
            ps.setString(5, task.getDescription());
            ps.setString(6, task.getStatus() != null ? task.getStatus() : "PENDING");
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        return key != null ? key.intValue() : null;
    }

    @Override
    public void update(Task task) {
        String sql = "UPDATE tasks SET assigned_to = ?, title = ?, description = ?, status = ?, completed_work = ?, pending_work = ?, updated_at = CURRENT_TIMESTAMP WHERE task_id = ?";
        jdbcTemplate.update(sql, task.getAssignedTo(), task.getTitle(), task.getDescription(), task.getStatus(), 
                           task.getCompletedWork(), task.getPendingWork(), task.getTaskId());
    }

    @Override
    public void updateStatus(Integer taskId, String status, String completedWork, String pendingWork) {
        String sql = "UPDATE tasks SET status = ?, completed_work = ?, pending_work = ?, updated_at = CURRENT_TIMESTAMP WHERE task_id = ?";
        jdbcTemplate.update(sql, status, completedWork, pendingWork, taskId);
    }

    @Override
    public Task findById(Integer taskId) {
        String sql = "SELECT t.*, u1.full_name as assigned_to_name, u2.full_name as created_by_name, tm.name as team_name " +
                     "FROM tasks t " +
                     "JOIN users u1 ON t.assigned_to = u1.user_id " +
                     "JOIN users u2 ON t.created_by = u2.user_id " +
                     "JOIN teams tm ON t.team_id = tm.team_id " +
                     "WHERE t.task_id = ?";
        List<Task> tasks = jdbcTemplate.query(sql, taskRowMapper, taskId);
        return tasks.isEmpty() ? null : tasks.get(0);
    }

    @Override
    public List<Task> findByTeamId(Integer teamId) {
        String sql = "SELECT t.*, u1.full_name as assigned_to_name, u2.full_name as created_by_name, tm.name as team_name " +
                     "FROM tasks t " +
                     "JOIN users u1 ON t.assigned_to = u1.user_id " +
                     "JOIN users u2 ON t.created_by = u2.user_id " +
                     "JOIN teams tm ON t.team_id = tm.team_id " +
                     "WHERE t.team_id = ? ORDER BY t.created_at DESC";
        return jdbcTemplate.query(sql, taskRowMapper, teamId);
    }

    @Override
    public List<Task> findByAssignedTo(Integer userId) {
        String sql = "SELECT t.*, u1.full_name as assigned_to_name, u2.full_name as created_by_name, tm.name as team_name " +
                     "FROM tasks t " +
                     "JOIN users u1 ON t.assigned_to = u1.user_id " +
                     "JOIN users u2 ON t.created_by = u2.user_id " +
                     "JOIN teams tm ON t.team_id = tm.team_id " +
                     "WHERE t.assigned_to = ? ORDER BY t.created_at DESC";
        return jdbcTemplate.query(sql, taskRowMapper, userId);
    }

    @Override
    public void delete(Integer taskId) {
        jdbcTemplate.update("DELETE FROM tasks WHERE task_id = ?", taskId);
    }
}
