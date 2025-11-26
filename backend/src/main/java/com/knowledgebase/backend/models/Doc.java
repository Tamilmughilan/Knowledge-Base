package com.knowledgebase.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "documents")
public class Doc {
    @Id
    private String id;
    private String title;
    private String content;
    private String category;
    private List<String> tags = new ArrayList<>();
    private String uploadedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int currentVersion = 1;
    
    //Constructors
    public Doc() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public Doc(String title, String content, String category) {
        this();
        this.title = title;
        this.content = content;
        this.category = category;
    }
    
    //getters and setters
    public String getId() { return id; }
    
    public void setId(String id) { this.id = id; }
    
    
    public String getTitle() { return title; }
    
    public void setTitle(String title) { this.title = title; }
    
    public String getContent() { return content; }
    
    public void setContent(String content) { this.content = content; }
    
    
    public String getCategory() { return category; }
    
    public void setCategory(String category) { this.category = category; }
    
    
    public List<String> getTags() { return tags; }
    
    public void setTags(List<String> tags) { this.tags = tags; }
    
    
    public String getUploadedBy() { return uploadedBy; }
    
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }
    
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    
    public int getCurrentVersion() { return currentVersion; }
    
    public void setCurrentVersion(int currentVersion) { this.currentVersion = currentVersion; }
}