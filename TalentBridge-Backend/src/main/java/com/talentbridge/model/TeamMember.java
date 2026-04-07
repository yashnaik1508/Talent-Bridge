package com.talentbridge.model;

public class TeamMember {
    private Integer id;
    private Integer teamId;
    private Integer userId;
    private String role;

    // Transient fields
    private String userName;
    private String userEmail;
    private String systemRole; // EMPLOYEE/PM/ADMIN

    public TeamMember() {}

    public TeamMember(Integer teamId, Integer userId, String role) {
        this.teamId = teamId;
        this.userId = userId;
        this.role = role;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getTeamId() { return teamId; }
    public void setTeamId(Integer teamId) { this.teamId = teamId; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getSystemRole() { return systemRole; }
    public void setSystemRole(String systemRole) { this.systemRole = systemRole; }
}
