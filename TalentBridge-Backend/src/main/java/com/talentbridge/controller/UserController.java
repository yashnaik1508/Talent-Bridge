package com.talentbridge.controller;

import com.talentbridge.model.UserStats;
import java.util.Map;

import com.talentbridge.model.User;
import com.talentbridge.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(Authentication authentication) {
        Integer userId = (Integer) authentication.getPrincipal();
        User user = userService.getUserById(userId);
        user.setPasswordHash(null); // Don't expose password hash
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Integer userId) {
        User user = userService.getUserById(userId);
        user.setPasswordHash(null);
        return ResponseEntity.ok(user);
    }
    
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<User> users = userService.getAllUsers(page, size);
        users.forEach(u -> u.setPasswordHash(null));
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/inactive")
    public ResponseEntity<List<User>> getInactiveUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<User> users = userService.getInactiveUsers(page, size);
        users.forEach(u -> u.setPasswordHash(null));
        return ResponseEntity.ok(users);
    }
    
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Integer userId, @RequestBody User user) {
        user.setUserId(userId);
        userService.updateUser(user);
        return ResponseEntity.ok(Map.of("message", "User updated successfully"));
    }
    
    @PutMapping("/{userId}/reactivate")
    public ResponseEntity<?> reactivateUser(@PathVariable Integer userId) {
        userService.reactivateUser(userId);
        return ResponseEntity.ok(Map.of("message", "User reactivated successfully"));
    }
    
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }
    
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(userService.getUserStats());
    }

}