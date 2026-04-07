package com.talentbridge.service;

import com.talentbridge.model.User;

public interface AuthService {
    String login(String email, String password);
    String googleLogin(String email, String name);
    Integer register(User user, String plainPassword);
    void forgotPassword(String email);
}
