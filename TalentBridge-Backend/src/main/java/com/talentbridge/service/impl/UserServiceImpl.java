package com.talentbridge.service.impl;

import com.talentbridge.dao.UserDao;
import com.talentbridge.exception.ResourceNotFoundException;
import com.talentbridge.model.User;
import com.talentbridge.service.UserService;
import com.talentbridge.util.PagingUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserDao userDao;
    
    @Override
    public User getUserById(Integer userId) {
        User user = userDao.findById(userId);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        return user;
    }
    
    @Override
    public User getUserByEmail(String email) {
        User user = userDao.findByEmail(email);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with email: " + email);
        }
        return user;
    }
    
    @Override
    public List<User> getAllUsers(int page, int size) {
        page = PagingUtil.validatePage(page);
        size = PagingUtil.validateSize(size);
        int offset = PagingUtil.calculateOffset(page, size);
        return userDao.findAll(offset, size);
    }
    
    @Override
    public void updateUser(User user) {
        if (userDao.findById(user.getUserId()) == null) {
            throw new ResourceNotFoundException("User not found");
        }
        userDao.update(user);
    }
    
    @Override
    public void deleteUser(Integer userId) {
        if (userDao.findById(userId) == null) {
            throw new ResourceNotFoundException("User not found");
        }
        userDao.delete(userId);
    }
    
    @Override
    public List<User> getUsersByRole(String role) {
        return userDao.findByRole(role);
    }

    // ✅ NEW — required by controller and removes red error
    @Override
    public Map<String, Object> getUserStats() {
        Map<String, Integer> roleStats = userDao.countByRole();
        Map<String, Integer> statusStats = userDao.countByStatus();
        int total = userDao.count();

        Map<String, Object> result = new HashMap<>();
        result.put("totalUsers", total);
        result.put("countByRole", roleStats);
        result.put("countByStatus", statusStats);

        return result;
    }

    @Override
    public List<User> getInactiveUsers(int page, int size) {
        page = PagingUtil.validatePage(page);
        size = PagingUtil.validateSize(size);
        int offset = PagingUtil.calculateOffset(page, size);
        return userDao.findInactive(offset, size);
    }

    @Override
    public void reactivateUser(Integer userId) {
        if (userDao.findById(userId) == null) {
            throw new ResourceNotFoundException("User not found");
        }
        userDao.reactivate(userId);
    }
}
