package com.talentbridge.service;

import com.talentbridge.model.User;
import java.util.List;
import java.util.Map;

public interface UserService {
    User getUserById(Integer userId);
    User getUserByEmail(String email);
    List<User> getAllUsers(int page, int size);
    void updateUser(User user);
    void deleteUser(Integer userId);
    List<User> getUsersByRole(String role);

    // ✅ NEW for Employee Strength
    Map<String, Object> getUserStats();
    List<User> getInactiveUsers(int page, int size);
    void reactivateUser(Integer userId);
}
