package com.talentbridge.service.impl;

import com.talentbridge.dao.EmployeeSkillDao;
import com.talentbridge.exception.CustomException;
import com.talentbridge.exception.ResourceNotFoundException;
import com.talentbridge.model.EmployeeSkill;
import com.talentbridge.service.EmployeeSkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeSkillServiceImpl implements EmployeeSkillService {

    @Autowired
    private EmployeeSkillDao employeeSkillDao;

    @Override
    public List<EmployeeSkill> getEmployeeSkills(Integer userId) {
        return employeeSkillDao.findByUserId(userId);
    }

    @Override
    public List<EmployeeSkill> getAllEmployeeSkills() {
        return employeeSkillDao.findAll();
    }

    @Override
    public Integer addEmployeeSkill(EmployeeSkill employeeSkill) {

        if (employeeSkillDao.exists(employeeSkill.getUserId(), employeeSkill.getSkillId())) {
            throw new CustomException("Employee already has this skill");
        }

        if (employeeSkill.getLevel() < 1 || employeeSkill.getLevel() > 5) {
            throw new CustomException("Skill level must be between 1 and 5");
        }

        return employeeSkillDao.save(employeeSkill);
    }

    @Override
    public void updateEmployeeSkill(EmployeeSkill employeeSkill) {

        if (employeeSkillDao.findById(employeeSkill.getId()) == null) {
            throw new ResourceNotFoundException("Employee skill not found");
        }

        if (employeeSkill.getLevel() < 1 || employeeSkill.getLevel() > 5) {
            throw new CustomException("Skill level must be between 1 and 5");
        }

        employeeSkillDao.update(employeeSkill);
    }

    @Override
    public void deleteEmployeeSkill(Integer id) {

        if (employeeSkillDao.findById(id) == null) {
            throw new ResourceNotFoundException("Employee skill not found");
        }

        employeeSkillDao.delete(id);
    }
}
