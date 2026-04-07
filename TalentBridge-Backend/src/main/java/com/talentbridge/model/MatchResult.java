package com.talentbridge.model;

public class MatchResult {
    private Integer matchId;
    private Integer userId;

    private float totalScore;
    private float skillScore;
    private float experienceScore;
    private float availabilityScore;

    private String employeeName;
    private String employeeEmail;

    public MatchResult() {}

    public Integer getMatchId() { return matchId; }
    public void setMatchId(Integer matchId) { this.matchId = matchId; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public float getTotalScore() { return totalScore; }
    public void setTotalScore(float totalScore) { this.totalScore = totalScore; }

    public float getSkillScore() { return skillScore; }
    public void setSkillScore(float skillScore) { this.skillScore = skillScore; }

    public float getExperienceScore() { return experienceScore; }
    public void setExperienceScore(float experienceScore) { this.experienceScore = experienceScore; }

    public float getAvailabilityScore() { return availabilityScore; }
    public void setAvailabilityScore(float availabilityScore) { this.availabilityScore = availabilityScore; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getEmployeeEmail() { return employeeEmail; }
    public void setEmployeeEmail(String employeeEmail) { this.employeeEmail = employeeEmail; }
}
