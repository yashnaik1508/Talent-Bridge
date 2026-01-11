package com.talentbridge.model;

import java.time.LocalDateTime;

public class Skill {
    private Integer skillId;
    private String name;
    private String category;
    private LocalDateTime createdAt;
    
    private int strength; // Calculated field from employee_skills count
    
    public Skill() {}
    
    public Skill(Integer skillId, String name, String category, LocalDateTime createdAt) {
        this.skillId = skillId;
        this.name = name;
        this.category = category;
        this.createdAt = createdAt;
    }
    
    public Integer getSkillId() { return skillId; }
    public void setSkillId(Integer skillId) { this.skillId = skillId; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public int getStrength() { return strength; }
    public void setStrength(int strength) { this.strength = strength; }
}
