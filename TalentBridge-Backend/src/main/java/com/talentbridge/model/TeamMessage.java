package com.talentbridge.model;

import java.time.LocalDateTime;

public class TeamMessage {
    private Integer messageId;
    private Integer teamId;
    private Integer userId;
    private String message;
    private LocalDateTime createdAt;

    // Transient fields
    private String userName;
    private String userRole;

    public TeamMessage() {}

    public TeamMessage(Integer teamId, Integer userId, String message) {
        this.teamId = teamId;
        this.userId = userId;
        this.message = message;
    }

    public Integer getMessageId() { return messageId; }
    public void setMessageId(Integer messageId) { this.messageId = messageId; }

    public Integer getTeamId() { return teamId; }
    public void setTeamId(Integer teamId) { this.teamId = teamId; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }
}
