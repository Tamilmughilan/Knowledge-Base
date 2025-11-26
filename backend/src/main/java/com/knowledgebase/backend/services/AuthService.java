package com.knowledgebase.backend.services;

import com.knowledgebase.backend.models.User;
import com.knowledgebase.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    
    public User register(String username, String password, Set<String> roles) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }
        
        // In production, hash the password using BCrypt
        User user = new User(username, password, roles);
        return userRepository.save(user);
    }
    
    public Optional<User> login(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user;
        }
        return Optional.empty();
    }
    
    public User createDefaultAdmin() {
        if (!userRepository.existsByUsername("admin")) {
            Set<String> roles = new HashSet<>();
            roles.add("ADMIN");
            return register("admin", "admin123", roles);
        }
        return null;
    }
}