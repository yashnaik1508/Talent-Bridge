package com.talentbridge.service.impl;

import com.talentbridge.dao.UserDao;
import com.talentbridge.exception.CustomException;
import com.talentbridge.exception.ResourceNotFoundException;
import com.talentbridge.model.User;
import com.talentbridge.service.AuthService;
import com.talentbridge.util.JwtUtil;
import com.talentbridge.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private PasswordUtil passwordUtil;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public String login(String email, String password) {

        User user = userDao.findByEmail(email);

        if (user == null) {
            throw new ResourceNotFoundException("User not found with email: " + email);
        }

        if (!passwordUtil.verifyPassword(password, user.getPasswordHash())) {
            throw new CustomException("Invalid credentials");
        }

        if (!user.getIsActive()) {
            throw new CustomException("User account is deactivated");
        }

        return jwtUtil.generateToken(
                user.getUserId(),
                user.getEmail(),
                user.getRole()
        );
    }

    @Override
    public Integer register(User user, String plainPassword) {

        if (userDao.findByEmail(user.getEmail()) != null) {
            throw new CustomException("Email already registered");
        }

        String hashedPassword = passwordUtil.hashPassword(plainPassword);

        user.setPasswordHash(hashedPassword);
        user.setIsActive(true);

        return userDao.save(user);
    }

    @Override
    public void forgotPassword(String email) {
        User user = userDao.findByEmail(email);
        if (user == null) {
            throw new CustomException("Invalid credentials");
        }
        // In a real app, we would generate a token and send an email here.
        // For now, we just validate the email exists.
    }
}
