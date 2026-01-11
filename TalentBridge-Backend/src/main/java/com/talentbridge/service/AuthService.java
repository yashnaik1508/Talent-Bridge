package com.talentbridge.service;

import com.talentbridge.model.User;

public interface AuthService {
    String login(String email, String password);
    Integer register(User user, String plainPassword);
    void forgotPassword(String email);
}
