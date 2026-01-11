package com.talentbridge.dao.impl;

import com.talentbridge.dao.EmployeeSkillDao;
import com.talentbridge.model.EmployeeSkill;
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
public class EmployeeSkillDaoImpl implements EmployeeSkillDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<EmployeeSkill> employeeSkillRowMapper = (rs, rowNum) -> {
        EmployeeSkill es = new EmployeeSkill();
        es.setId(rs.getInt("id"));
        es.setUserId(rs.getInt("user_id"));
        es.setSkillId(rs.getInt("skill_id"));
        es.setLevel(rs.getInt("level"));
        es.setYearsExperience(rs.getInt("years_experience"));

        Object lastUsedObj = rs.getObject("last_used_year");
        if (lastUsedObj != null) {
            es.setLastUsedYear(((Number) lastUsedObj).intValue());
        } else {
            es.setLastUsedYear(null);
        }

        // optional join column
        try {
            es.setSkillName(rs.getString("skill_name"));
        } catch (Exception ignored) {}

        try {
            es.setUserName(rs.getString("user_name"));
        } catch (Exception ignored) {}

        return es;
    };

    @Override
    public List<EmployeeSkill> findByUserId(Integer userId) {
        String sql = "SELECT es.*, s.name as skill_name FROM employee_skills es " +
                     "JOIN skills s ON es.skill_id = s.skill_id WHERE es.user_id = ?";
        return jdbcTemplate.query(sql, employeeSkillRowMapper, userId);
    }

    @Override
    public List<EmployeeSkill> findAll() {
        String sql = "SELECT es.*, s.name as skill_name, u.full_name as user_name " +
                     "FROM employee_skills es " +
                     "JOIN skills s ON es.skill_id = s.skill_id " +
                     "JOIN users u ON es.user_id = u.user_id " +
                     "ORDER BY u.full_name";
        return jdbcTemplate.query(sql, employeeSkillRowMapper);
    }

    @Override
    public EmployeeSkill findById(Integer id) {
        String sql = "SELECT es.*, s.name as skill_name FROM employee_skills es " +
                     "JOIN skills s ON es.skill_id = s.skill_id WHERE es.id = ?";
        List<EmployeeSkill> skills = jdbcTemplate.query(sql, employeeSkillRowMapper, id);
        return skills.isEmpty() ? null : skills.get(0);
    }

    @Override
    public Integer save(EmployeeSkill employeeSkill) {
        String sql = "INSERT INTO employee_skills (user_id, skill_id, level, years_experience, last_used_year) " +
                     "VALUES (?, ?, ?, ?, ?) RETURNING id";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, employeeSkill.getUserId());
            ps.setInt(2, employeeSkill.getSkillId());
            ps.setInt(3, employeeSkill.getLevel());
            ps.setInt(4, employeeSkill.getYearsExperience());

            if (employeeSkill.getLastUsedYear() != null) {
                ps.setInt(5, employeeSkill.getLastUsedYear());
            } else {
                ps.setNull(5, java.sql.Types.INTEGER);
            }

            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.intValue() : null;
    }

    @Override
    public void update(EmployeeSkill employeeSkill) {
        String sql = "UPDATE employee_skills SET level = ?, years_experience = ?, last_used_year = ? WHERE id = ?";

        if (employeeSkill.getLastUsedYear() != null) {
            jdbcTemplate.update(sql,
                    employeeSkill.getLevel(),
                    employeeSkill.getYearsExperience(),
                    employeeSkill.getLastUsedYear(),
                    employeeSkill.getId());
        } else {
            jdbcTemplate.update(sql,
                    employeeSkill.getLevel(),
                    employeeSkill.getYearsExperience(),
                    null,
                    employeeSkill.getId());
        }
    }

    @Override
    public void delete(Integer id) {
        jdbcTemplate.update("DELETE FROM employee_skills WHERE id = ?", id);
    }

    @Override
    public boolean exists(Integer userId, Integer skillId) {
        String sql = "SELECT COUNT(*) FROM employee_skills WHERE user_id = ? AND skill_id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userId, skillId);
        return count != null && count > 0;
    }
}
