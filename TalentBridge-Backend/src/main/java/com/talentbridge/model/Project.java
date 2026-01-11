package com.talentbridge.model;

import java.time.LocalDateTime;
import java.time.LocalDate;

public class Project {
    private Integer projectId;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer requiredHeadcount;
    private String status;
    private Integer createdBy;
    private LocalDateTime createdAt;

    public Project() {}

    public Project(Integer projectId, String name, String description, LocalDate startDate,
                   LocalDate endDate, Integer requiredHeadcount, String status,
                   Integer createdBy, LocalDateTime createdAt) {
        this.projectId = projectId;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.requiredHeadcount = requiredHeadcount;
        this.status = status;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    public Integer getProjectId() { return projectId; }
    public void setProjectId(Integer projectId) { this.projectId = projectId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Integer getRequiredHeadcount() { return requiredHeadcount; }
    public void setRequiredHeadcount(Integer requiredHeadcount) { this.requiredHeadcount = requiredHeadcount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getCreatedBy() { return createdBy; }
    public void setCreatedBy(Integer createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
