package com.talentbridge.model;

import java.time.LocalDateTime;

public class Team {
    private Integer teamId;
    private String name;
    private Integer projectId;
    private Integer createdBy;
    private LocalDateTime createdAt;

    // Transient fields
    private String projectName;
    private String creatorName;
    private Integer memberCount;

    public Team() {}

    public Team(Integer teamId, String name, Integer projectId, Integer createdBy, LocalDateTime createdAt) {
        this.teamId = teamId;
        this.name = name;
        this.projectId = projectId;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    public Integer getTeamId() { return teamId; }
    public void setTeamId(Integer teamId) { this.teamId = teamId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getProjectId() { return projectId; }
    public void setProjectId(Integer projectId) { this.projectId = projectId; }

    public Integer getCreatedBy() { return createdBy; }
    public void setCreatedBy(Integer createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }

    public String getCreatorName() { return creatorName; }
    public void setCreatorName(String creatorName) { this.creatorName = creatorName; }

    public Integer getMemberCount() { return memberCount; }
    public void setMemberCount(Integer memberCount) { this.memberCount = memberCount; }
}
