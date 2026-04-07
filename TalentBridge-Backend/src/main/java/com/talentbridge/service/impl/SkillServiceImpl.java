package com.talentbridge.service.impl;

import com.talentbridge.dao.SkillDao;
import com.talentbridge.exception.CustomException;
import com.talentbridge.exception.ResourceNotFoundException;
import com.talentbridge.model.Skill;
import com.talentbridge.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SkillServiceImpl implements SkillService {
    
    @Autowired
    private SkillDao skillDao;
    
    @Override
    public List<Skill> getAllSkills() {
        return skillDao.findAll();
    }
    
    @Override
    public Skill getSkillById(Integer skillId) {
        Skill skill = skillDao.findById(skillId);
        if (skill == null) {
            throw new ResourceNotFoundException("Skill not found with id: " + skillId);
        }
        return skill;
    }
    
    @Override
    public Integer createSkill(Skill skill) {
        if (skillDao.findByName(skill.getName()) != null) {
            throw new CustomException("Skill already exists with name: " + skill.getName());
        }
        return skillDao.save(skill);
    }
    
    @Override
    public void updateSkill(Skill skill) {
        if (skillDao.findById(skill.getSkillId()) == null) {
            throw new ResourceNotFoundException("Skill not found");
        }
        skillDao.update(skill);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void deleteSkill(Integer skillId) {
        if (skillDao.findById(skillId) == null) {
            throw new ResourceNotFoundException("Skill not found with id: " + skillId);
        }
        skillDao.delete(skillId);
    }
}

