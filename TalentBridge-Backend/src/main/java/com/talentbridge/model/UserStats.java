package com.talentbridge.model;

import java.util.Map;

public class UserStats {

    private Integer totalUsers;
    private Map<String, Integer> countByRole;
    private Map<String, Integer> countByStatus;

    public Integer getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Integer totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Map<String, Integer> getCountByRole() {
        return countByRole;
    }

    public void setCountByRole(Map<String, Integer> countByRole) {
        this.countByRole = countByRole;
    }

    public Map<String, Integer> getCountByStatus() {
        return countByStatus;
    }

    public void setCountByStatus(Map<String, Integer> countByStatus) {
        this.countByStatus = countByStatus;
    }
}
