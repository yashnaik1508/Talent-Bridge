package com.talentbridge.model;

public class EmployeeSkill {
    private Integer id;
    private Integer userId;
    private Integer skillId;
    private Integer level;
    private Integer yearsExperience;
    private Integer lastUsedYear;
    
    // For joining with skill name
    private String skillName;
    private String userName; // For joining with user name
    
    public EmployeeSkill() {}
    
    public EmployeeSkill(Integer id, Integer userId, Integer skillId, Integer level, 
                        Integer yearsExperience, Integer lastUsedYear) {
        this.id = id;
        this.userId = userId;
        this.skillId = skillId;
        this.level = level;
        this.yearsExperience = yearsExperience;
        this.lastUsedYear = lastUsedYear;
    }
    
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    
    public Integer getSkillId() { return skillId; }
    public void setSkillId(Integer skillId) { this.skillId = skillId; }
    
    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }
    
    public Integer getYearsExperience() { return yearsExperience; }
    public void setYearsExperience(Integer yearsExperience) { this.yearsExperience = yearsExperience; }
    
    public Integer getLastUsedYear() { return lastUsedYear; }
    public void setLastUsedYear(Integer lastUsedYear) { this.lastUsedYear = lastUsedYear; }
    
    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
}
