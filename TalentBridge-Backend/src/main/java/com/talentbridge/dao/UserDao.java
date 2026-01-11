
package com.talentbridge.dao;

import com.talentbridge.model.*;
import java.util.List;
import java.util.Map;

// DAO Interfaces
public interface UserDao {
    User findByEmail(String email);
    User findById(Integer userId);
    List<User> findAll(int offset, int limit);
    Integer save(User user);
    void update(User user);
    void delete(Integer userId);
    List<User> findByRole(String role);
    int count();

    // NEW
    Map<String, Integer> countByRole();
    Map<String, Integer> countByStatus();
    List<User> findInactive(int offset, int limit);
    void reactivate(Integer userId);
}
