package com.talentbridge.model;

import java.sql.Timestamp;

public class Task {
    private Integer taskId;
    private Integer teamId;
    private Integer assignedTo;
    private Integer createdBy;
    private String title;
    private String description;
    private String status; // PENDING, COMPLETED
    private String completedWork;
    private String pendingWork;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    // Transient fields for UI
    private String assignedToName;
    private String createdByName;
    private String teamName;

    public Task() {}

    public Integer getTaskId() { return taskId; }
    public void setTaskId(Integer taskId) { this.taskId = taskId; }

    public Integer getTeamId() { return teamId; }
    public void setTeamId(Integer teamId) { this.teamId = teamId; }

    public Integer getAssignedTo() { return assignedTo; }
    public void setAssignedTo(Integer assignedTo) { this.assignedTo = assignedTo; }

    public Integer getCreatedBy() { return createdBy; }
    public void setCreatedBy(Integer createdBy) { this.createdBy = createdBy; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCompletedWork() { return completedWork; }
    public void setCompletedWork(String completedWork) { this.completedWork = completedWork; }

    public String getPendingWork() { return pendingWork; }
    public void setPendingWork(String pendingWork) { this.pendingWork = pendingWork; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }

    public String getAssignedToName() { return assignedToName; }
    public void setAssignedToName(String assignedToName) { this.assignedToName = assignedToName; }

    public String getCreatedByName() { return createdByName; }
    public void setCreatedByName(String createdByName) { this.createdByName = createdByName; }

    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }
}
