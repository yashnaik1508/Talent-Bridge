package com.talentbridge.dao;

import com.talentbridge.model.EmployeeSkill;
import java.util.List;

public interface EmployeeSkillDao {
    List<EmployeeSkill> findByUserId(Integer userId);
    List<EmployeeSkill> findAll();
    EmployeeSkill findById(Integer id);
    Integer save(EmployeeSkill employeeSkill);
    void update(EmployeeSkill employeeSkill);
    void delete(Integer id);
    boolean exists(Integer userId, Integer skillId);
}
