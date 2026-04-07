package com.talentbridge.dao.impl;

import com.talentbridge.dao.AssignmentDao;
import com.talentbridge.model.Assignment;
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
public class AssignmentDaoImpl implements AssignmentDao {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    private final RowMapper<Assignment> assignmentRowMapper = (rs, rowNum) -> {
        Assignment assignment = new Assignment();
        assignment.setAssignmentId(rs.getInt("assignment_id"));
        assignment.setProjectId(rs.getInt("project_id"));
        assignment.setUserId(rs.getInt("user_id"));
        assignment.setRoleOnProject(rs.getString("role_on_project"));
        assignment.setAssignedAt(rs.getTimestamp("assigned_at").toLocalDateTime());
        assignment.setReleaseDate(rs.getDate("release_date") != null ? rs.getDate("release_date").toLocalDate() : null);
        assignment.setStatus(rs.getString("status"));
        try {
            assignment.setProjectName(rs.getString("project_name"));
            assignment.setEmployeeName(rs.getString("employee_name"));
        } catch (Exception e) {}
        return assignment;
    };
    
    @Override
    public List<Assignment> findByProjectId(Integer projectId) {
        String sql = "SELECT a.*, u.full_name as employee_name, p.name as project_name " +
                    "FROM assignments a " +
                    "JOIN users u ON a.user_id = u.user_id " +
                    "JOIN projects p ON a.project_id = p.project_id " +
                    "WHERE a.project_id = ? AND a.status = 'ASSIGNED'";
        return jdbcTemplate.query(sql, assignmentRowMapper, projectId);
    }
    
    @Override
    public List<Assignment> findByUserId(Integer userId) {
        String sql = "SELECT a.*, u.full_name as employee_name, p.name as project_name " +
                    "FROM assignments a " +
                    "JOIN users u ON a.user_id = u.user_id " +
                    "JOIN projects p ON a.project_id = p.project_id " +
                    "WHERE a.user_id = ? AND a.status = 'ASSIGNED'";
        return jdbcTemplate.query(sql, assignmentRowMapper, userId);
    }
    
    @Override
    public Assignment findById(Integer assignmentId) {
        String sql = "SELECT a.*, u.full_name as employee_name, p.name as project_name " +
                    "FROM assignments a " +
                    "JOIN users u ON a.user_id = u.user_id " +
                    "JOIN projects p ON a.project_id = p.project_id " +
                    "WHERE a.assignment_id = ?";
        List<Assignment> assignments = jdbcTemplate.query(sql, assignmentRowMapper, assignmentId);
        return assignments.isEmpty() ? null : assignments.get(0);
    }
    
    @Override
    public Integer save(Assignment assignment) {
        String sql = "INSERT INTO assignments (project_id, user_id, role_on_project, status) " +
                    "VALUES (?, ?, ?, ?) RETURNING assignment_id";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, assignment.getProjectId());
            ps.setInt(2, assignment.getUserId());
            ps.setString(3, assignment.getRoleOnProject());
            ps.setString(4, assignment.getStatus() != null ? assignment.getStatus() : "ASSIGNED");
            return ps;
        }, keyHolder);
        
        return (Integer) keyHolder.getKeys().get("assignment_id");
    }
    
    @Override
    public void update(Assignment assignment) {
        String sql = "UPDATE assignments SET role_on_project = ?, release_date = ?, status = ? WHERE assignment_id = ?";
        jdbcTemplate.update(sql, assignment.getRoleOnProject(), assignment.getReleaseDate(), 
                           assignment.getStatus(), assignment.getAssignmentId());
    }
    
    @Override
    public void releaseAssignment(Integer assignmentId) {
        String sql = "UPDATE assignments SET status = 'RELEASED', release_date = CURRENT_DATE WHERE assignment_id = ?";
        jdbcTemplate.update(sql, assignmentId);
    }
    
    @Override
    public List<Assignment> findAll() {
        String sql = "SELECT a.*, u.full_name as employee_name, p.name as project_name " +
                    "FROM assignments a " +
                    "JOIN users u ON a.user_id = u.user_id " +
                    "JOIN projects p ON a.project_id = p.project_id " +
                    "ORDER BY a.assigned_at DESC";
        return jdbcTemplate.query(sql, assignmentRowMapper);
    }

    @Override
    public boolean isUserAssigned(Integer userId, Integer projectId) {
        String sql = "SELECT COUNT(*) FROM assignments WHERE user_id = ? AND project_id = ? AND status = 'ASSIGNED'";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userId, projectId);
        return count != null && count > 0;
    }
}
