package com.talentbridge.dao;

import com.talentbridge.model.*;
import java.util.List;

public interface SkillDao {
    List<Skill> findAll();
    Skill findById(Integer skillId);
    Skill findByName(String name);
    Integer save(Skill skill);
    void update(Skill skill);
    void delete(Integer skillId);
}