package com.knowledgebase.backend.dto;

import java.util.Set;

public class AuthResponse {
    private String id;
    private String username;
    private Set<String> roles;
    private String message;
    
    public AuthResponse(String id, String username, Set<String> roles, String message) {
        this.id = id;
        this.username = username;
        this.roles = roles;
        this.message = message;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}