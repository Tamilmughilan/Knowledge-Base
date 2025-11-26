package com.knowledgebase.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.util.HashSet;
import java.util.Set;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String username;
    
    private String password;
    
    private Set<String> roles = new HashSet<>();
    
    // Constructors
    public User() {}
    
    public User(String username, String password, Set<String> roles) {
        this.username = username;
        this.password = password;
        this.roles = roles;
    }
    
    //getters and setters
    public String getId() { return id; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public Set<String> getRoles() { return roles; }
    
    public void setId(String id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
}