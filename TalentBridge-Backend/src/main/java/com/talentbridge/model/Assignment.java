package com.talentbridge.model;

import java.time.LocalDateTime;
import java.time.LocalDate;

public class Assignment {
    private Integer assignmentId;
    private Integer projectId;
    private Integer userId;
    private String roleOnProject;
    private LocalDateTime assignedAt;
    private LocalDate releaseDate;
    private String status;
    
    // For joining
    private String projectName;
    private String employeeName;
    
    public Assignment() {}
    
    public Assignment(Integer assignmentId, Integer projectId, Integer userId, 
                     String roleOnProject, LocalDateTime assignedAt, 
                     LocalDate releaseDate, String status) {
        this.assignmentId = assignmentId;
        this.projectId = projectId;
        this.userId = userId;
        this.roleOnProject = roleOnProject;
        this.assignedAt = assignedAt;
        this.releaseDate = releaseDate;
        this.status = status;
    }
    
    public Integer getAssignmentId() { return assignmentId; }
    public void setAssignmentId(Integer assignmentId) { this.assignmentId = assignmentId; }
    
    public Integer getProjectId() { return projectId; }
    public void setProjectId(Integer projectId) { this.projectId = projectId; }
    
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    
    public String getRoleOnProject() { return roleOnProject; }
    public void setRoleOnProject(String roleOnProject) { this.roleOnProject = roleOnProject; }
    
    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }
    
    public LocalDate getReleaseDate() { return releaseDate; }
    public void setReleaseDate(LocalDate releaseDate) { this.releaseDate = releaseDate; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
    
    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }
}