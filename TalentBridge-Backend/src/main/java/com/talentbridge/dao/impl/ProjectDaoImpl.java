package com.talentbridge.dao.impl;

import com.talentbridge.dao.ProjectDao;
import com.talentbridge.model.Project;
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
public class ProjectDaoImpl implements ProjectDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Project> projectRowMapper = (rs, rowNum) -> {
        Project project = new Project();
        project.setProjectId(rs.getInt("project_id"));
        project.setName(rs.getString("name"));
        project.setDescription(rs.getString("description"));
        project.setStartDate(rs.getDate("start_date") != null ? rs.getDate("start_date").toLocalDate() : null);
        project.setEndDate(rs.getDate("end_date") != null ? rs.getDate("end_date").toLocalDate() : null);
        project.setRequiredHeadcount(rs.getInt("required_headcount"));
        project.setStatus(rs.getString("status"));
        // created_by might be nullable
        try {
            project.setCreatedBy(rs.getInt("created_by"));
        } catch (Exception ignored) {}
        // created_at might be nullable — guard against NPE
        if (rs.getTimestamp("created_at") != null) {
            project.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        }
        return project;
    };

    @Override
    public List<Project> findAll(int offset, int limit) {
        String sql = "SELECT * FROM projects ORDER BY created_at DESC LIMIT ? OFFSET ?";
        return jdbcTemplate.query(sql, projectRowMapper, limit, offset);
    }

    @Override
    public Project findById(Integer projectId) {
        String sql = "SELECT * FROM projects WHERE project_id = ?";
        List<Project> projects = jdbcTemplate.query(sql, projectRowMapper, projectId);
        return projects.isEmpty() ? null : projects.get(0);
    }

    @Override
    public Integer save(Project project) {
        String sql = "INSERT INTO projects (name, description, start_date, end_date, required_headcount, status, created_by) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING project_id";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, project.getName());
            ps.setString(2, project.getDescription());
            ps.setDate(3, project.getStartDate() != null ? java.sql.Date.valueOf(project.getStartDate()) : null);
            ps.setDate(4, project.getEndDate() != null ? java.sql.Date.valueOf(project.getEndDate()) : null);
            // requiredHeadcount may be null; set default 0 if null (adjust as needed)
            ps.setInt(5, project.getRequiredHeadcount() != null ? project.getRequiredHeadcount() : 0);
            ps.setString(6, project.getStatus() != null ? project.getStatus() : "OPEN");
            if (project.getCreatedBy() != null) {
                ps.setInt(7, project.getCreatedBy());
            } else {
                ps.setNull(7, java.sql.Types.INTEGER);
            }
            return ps;
        }, keyHolder);

        // safer to use keyHolder.getKey()
        Number key = keyHolder.getKey();
        return key != null ? key.intValue() : null;
    }

    @Override
    public void update(Project project) {
        String sql = "UPDATE projects SET name = ?, description = ?, start_date = ?, end_date = ?, " +
                "required_headcount = ?, status = ? WHERE project_id = ?";

        jdbcTemplate.update(sql,
                project.getName(),
                project.getDescription(),
                project.getStartDate() != null ? java.sql.Date.valueOf(project.getStartDate()) : null,
                project.getEndDate() != null ? java.sql.Date.valueOf(project.getEndDate()) : null,
                project.getRequiredHeadcount() != null ? project.getRequiredHeadcount() : 0,
                project.getStatus(),
                project.getProjectId()
        );
    }

    @Override
    public void delete(Integer projectId) {
        jdbcTemplate.update("DELETE FROM projects WHERE project_id = ?", projectId);
    }

    @Override
    public List<Project> findByStatus(String status) {
        return jdbcTemplate.query("SELECT * FROM projects WHERE status = ? ORDER BY created_at DESC",
                projectRowMapper, status);
    }

    @Override
    public int count() {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM projects", Integer.class);
    }
}
