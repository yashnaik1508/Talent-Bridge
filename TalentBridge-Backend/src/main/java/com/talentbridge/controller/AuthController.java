package com.talentbridge.controller;

import com.talentbridge.model.User;
import com.talentbridge.service.AuthService;
import com.talentbridge.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {

        String email = credentials.get("email");
        String password = credentials.get("password");

        String token = authService.login(email, password);

        // Extract role and userId from the token so frontend doesn't need to decode JWT
        String role = jwtUtil.extractRole(token);
        Integer userId = jwtUtil.extractUserId(token);

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "role", role,
                        "userId", userId,
                        "message", "Login successful"
                )
        );
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> userData) {

        User user = new User();
        user.setUsername(userData.get("username"));
        user.setFullName(userData.get("fullName"));
        user.setEmail(userData.get("email"));
        user.setRole(userData.get("role"));
        user.setPhone(userData.get("phone"));

        Integer userId = authService.register(user, userData.get("password"));

        return ResponseEntity.ok(
                Map.of(
                        "userId", userId,
                        "message", "Registration successful"
                )
        );
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        authService.forgotPassword(email);
        return ResponseEntity.ok(Map.of("message", "Password reset email sent"));
    }
}
