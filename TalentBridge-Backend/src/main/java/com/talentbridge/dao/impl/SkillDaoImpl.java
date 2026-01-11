package com.talentbridge.dao.impl;

import com.talentbridge.dao.SkillDao;
import com.talentbridge.model.Skill;
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
public class SkillDaoImpl implements SkillDao {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    private final RowMapper<Skill> skillRowMapper = (rs, rowNum) -> {
        Skill skill = new Skill();
        skill.setSkillId(rs.getInt("skill_id"));
        skill.setName(rs.getString("name"));
        skill.setCategory(rs.getString("category"));
        skill.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        try {
            skill.setStrength(rs.getInt("strength"));
        } catch (Exception e) {
            skill.setStrength(0);
        }
        return skill;
    };
    
    @Override
    public List<Skill> findAll() {
        String sql = "SELECT s.*, COUNT(es.user_id) as strength " +
                     "FROM skills s " +
                     "LEFT JOIN employee_skills es ON s.skill_id = es.skill_id " +
                     "GROUP BY s.skill_id, s.name, s.category, s.created_at " +
                     "ORDER BY s.name";
        return jdbcTemplate.query(sql, skillRowMapper);
    }
    
    @Override
    public Skill findById(Integer skillId) {
        String sql = "SELECT s.*, COUNT(es.user_id) as strength " +
                     "FROM skills s " +
                     "LEFT JOIN employee_skills es ON s.skill_id = es.skill_id " +
                     "WHERE s.skill_id = ? " +
                     "GROUP BY s.skill_id, s.name, s.category, s.created_at";
        List<Skill> skills = jdbcTemplate.query(sql, skillRowMapper, skillId);
        return skills.isEmpty() ? null : skills.get(0);
    }
    
    @Override
    public Skill findByName(String name) {
        String sql = "SELECT s.*, COUNT(es.user_id) as strength " +
                     "FROM skills s " +
                     "LEFT JOIN employee_skills es ON s.skill_id = es.skill_id " +
                     "WHERE LOWER(s.name) = LOWER(?) " +
                     "GROUP BY s.skill_id, s.name, s.category, s.created_at";
        List<Skill> skills = jdbcTemplate.query(sql, skillRowMapper, name);
        return skills.isEmpty() ? null : skills.get(0);
    }
    
    @Override
    public Integer save(Skill skill) {
        String sql = "INSERT INTO skills (name, category) VALUES (?, ?) RETURNING skill_id";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, skill.getName());
            ps.setString(2, skill.getCategory());
            return ps;
        }, keyHolder);
        
        return (Integer) keyHolder.getKeys().get("skill_id");
    }
    
    @Override
    public void update(Skill skill) {
        String sql = "UPDATE skills SET name = ?, category = ? WHERE skill_id = ?";
        jdbcTemplate.update(sql, skill.getName(), skill.getCategory(), skill.getSkillId());
    }
    
    @Override
    public void delete(Integer skillId) {
        // Cascade delete: remove references first
        String sql1 = "DELETE FROM employee_skills WHERE skill_id = ?";
        jdbcTemplate.update(sql1, skillId);
        
        String sql2 = "DELETE FROM project_skill_requirements WHERE skill_id = ?";
        jdbcTemplate.update(sql2, skillId);
        
        // Finally delete the skill
        String sql3 = "DELETE FROM skills WHERE skill_id = ?";
        jdbcTemplate.update(sql3, skillId);
    }
}