package com.talentbridge.service;

import com.talentbridge.model.*;
import java.util.List;

public interface EmployeeSkillService {
    List<EmployeeSkill> getEmployeeSkills(Integer userId);
    List<EmployeeSkill> getAllEmployeeSkills();
    Integer addEmployeeSkill(EmployeeSkill employeeSkill);
    void updateEmployeeSkill(EmployeeSkill employeeSkill);
    void deleteEmployeeSkill(Integer id);
}