package com.talentbridge.dao.impl;

import com.talentbridge.dao.ProjectSkillReqDao;
import com.talentbridge.model.ProjectSkillReq;
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
public class ProjectSkillReqDaoImpl implements ProjectSkillReqDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<ProjectSkillReq> reqRowMapper = (rs, rowNum) -> {
        ProjectSkillReq req = new ProjectSkillReq();
        req.setId(rs.getInt("id"));
        req.setProjectId(rs.getInt("project_id"));
        req.setSkillId(rs.getInt("skill_id"));
        req.setDesiredLevel(rs.getInt("desired_level"));

        Object weightObj = rs.getObject("weight");
        if (weightObj != null) {
            req.setWeight(((Number) weightObj).floatValue());
        } else {
            req.setWeight(null);
        }

        try {
            req.setSkillName(rs.getString("skill_name"));
        } catch (Exception ignored) {}

        return req;
    };

    @Override
    public List<ProjectSkillReq> findByProjectId(Integer projectId) {
        String sql = "SELECT psr.*, s.name as skill_name FROM project_skill_requirements psr " +
                     "JOIN skills s ON psr.skill_id = s.skill_id WHERE psr.project_id = ?";
        return jdbcTemplate.query(sql, reqRowMapper, projectId);
    }

    @Override
    public Integer save(ProjectSkillReq req) {
        String sql = "INSERT INTO project_skill_requirements (project_id, skill_id, desired_level, weight) " +
                     "VALUES (?, ?, ?, ?) RETURNING id";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, req.getProjectId());
            ps.setInt(2, req.getSkillId());
            ps.setInt(3, req.getDesiredLevel());

            if (req.getWeight() != null) {
                ps.setFloat(4, req.getWeight());
            } else {
                ps.setNull(4, java.sql.Types.REAL);
            }

            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.intValue() : null;
    }

    @Override
    public void update(ProjectSkillReq req) {
        String sql = "UPDATE project_skill_requirements SET desired_level = ?, weight = ? WHERE id = ?";

        jdbcTemplate.update(sql,
                req.getDesiredLevel(),
                req.getWeight(),
                req.getId());
    }

    @Override
    public void delete(Integer id) {
        jdbcTemplate.update("DELETE FROM project_skill_requirements WHERE id = ?", id);
    }
}
