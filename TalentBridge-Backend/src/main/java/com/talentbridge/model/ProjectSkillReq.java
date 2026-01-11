package com.talentbridge.model;

public class ProjectSkillReq {
    private Integer id;
    private Integer projectId;
    private Integer skillId;
    private Integer desiredLevel;
    private Float weight;
    
    // For joining
    private String skillName;
    
    public ProjectSkillReq() {}
    
    public ProjectSkillReq(Integer id, Integer projectId, Integer skillId, 
                          Integer desiredLevel, Float weight) {
        this.id = id;
        this.projectId = projectId;
        this.skillId = skillId;
        this.desiredLevel = desiredLevel;
        this.weight = weight;
    }
    
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Integer getProjectId() { return projectId; }
    public void setProjectId(Integer projectId) { this.projectId = projectId; }
    
    public Integer getSkillId() { return skillId; }
    public void setSkillId(Integer skillId) { this.skillId = skillId; }
    
    public Integer getDesiredLevel() { return desiredLevel; }
    public void setDesiredLevel(Integer desiredLevel) { this.desiredLevel = desiredLevel; }
    
    public Float getWeight() { return weight; }
    public void setWeight(Float weight) { this.weight = weight; }
    
    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }
}
