package com.talentbridge.service;

import com.talentbridge.model.Skill;
import java.util.List;  

public interface SkillService {
    List<Skill> getAllSkills();
    Skill getSkillById(Integer skillId);
    Integer createSkill(Skill skill);
    void updateSkill(Skill skill);
    void deleteSkill(Integer skillId);
}
