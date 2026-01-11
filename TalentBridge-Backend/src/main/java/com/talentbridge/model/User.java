package com.talentbridge.model;

import java.time.LocalDateTime;

// 1. User Model
public class User {
    private Integer userId;
    private String username;
    private String fullName;
    private String email;
    private String passwordHash;
    private String role;
    private String phone;
    private LocalDateTime createdAt;
    private Boolean isActive;
    
    public User() {}
    
    public User(Integer userId, String username, String fullName, String email, 
                String passwordHash, String role, String phone, 
                LocalDateTime createdAt, Boolean isActive) {
        this.userId = userId;
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.phone = phone;
        this.createdAt = createdAt;
        this.isActive = isActive;
    }
    
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}