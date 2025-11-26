package com.knowledgebase.backend.controllers;

import com.knowledgebase.backend.models.Doc;
import com.knowledgebase.backend.repositories.DocumentRepository;
import com.knowledgebase.backend.services.VersionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:3000")
public class DocumentController {
    
    @Autowired
    private DocumentRepository repo;
    
    @Autowired
    private VersionService versionService;
    
    private static final String UPLOAD_DIR = "uploads/";
    private static final String VERSION_DIR = "uploads/versions/";
    
    @GetMapping
    public List<Doc> getAll() { 
        return repo.findAll(); 
    }
    
    @GetMapping("/{id}")
    public Optional<Doc> getById(@PathVariable String id) { 
        return repo.findById(id); 
    }
    
    @GetMapping("/search")
    public List<Doc> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String tag) {
        
       
        if (keyword != null && !keyword.trim().isEmpty() && 
            category != null && !category.trim().isEmpty()) {
            return repo.searchByKeywordAndCategory(keyword, category);
        }
        
      
        if (keyword != null && !keyword.trim().isEmpty() && 
            tag != null && !tag.trim().isEmpty()) {
            return repo.searchByKeywordAndTag(keyword, tag);
        }
        
        //keyword
        if (keyword != null && !keyword.trim().isEmpty()) {
            return repo.searchDocuments(keyword);
        }
        
        //category
        if (category != null && !category.trim().isEmpty()) {
            return repo.findByCategory(category);
        }
        
        //tag
        if (tag != null && !tag.trim().isEmpty()) {
            return repo.findByTagsContaining(tag);
        }
        
        return repo.findAll();
    }
    
    @GetMapping("/category/{category}")
    public List<Doc> getByCategory(@PathVariable String category) {
        return repo.findByCategory(category);
    }
    
    @GetMapping("/tag/{tag}")
    public List<Doc> getByTag(@PathVariable String tag) {
        return repo.findByTagsContaining(tag);
    }
    
    @PostMapping
    public Doc create(@RequestBody Doc doc) {
        doc.setCreatedAt(LocalDateTime.now());
        doc.setUpdatedAt(LocalDateTime.now());
        doc.setCurrentVersion(1);
        Doc savedDoc = repo.save(doc);
        
        
        versionService.createVersion(savedDoc, doc.getUploadedBy());
        return savedDoc;
    }
    
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("category") String category,
            @RequestParam("uploadedBy") String uploadedBy,
            @RequestParam(value = "tags", required = false) String tags) {
        try {
            
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }
            File versionDir = new File(VERSION_DIR);
            if (!versionDir.exists()) {
                versionDir.mkdirs();
            }
            
           
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Files.write(filePath, file.getBytes());
            
            
            Doc doc = new Doc();
            doc.setTitle(title);
            doc.setContent("File: " + fileName);
            doc.setCategory(category);
            doc.setUploadedBy(uploadedBy);
            doc.setCurrentVersion(1);
            
            if (tags != null && !tags.isEmpty()) {
                doc.setTags(List.of(tags.split(",")));
            }
            
            Doc savedDoc = repo.save(doc);
            
            
            versionService.createVersionWithFile(savedDoc, uploadedBy, UPLOAD_DIR + fileName);
            
            return ResponseEntity.ok(savedDoc);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Upload failed: " + e.getMessage());
        }
    }
    
    @PostMapping("/upload/{id}")
    public ResponseEntity<?> updateWithFile(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("category") String category,
            @RequestParam("uploadedBy") String uploadedBy,
            @RequestParam(value = "tags", required = false) String tags) {
        try {
            Optional<Doc> existing = repo.findById(id);
            if (!existing.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Doc existingDoc = existing.get();
            
         
            String oldContent = existingDoc.getContent();
            String oldFileName = null;
            if (oldContent != null && oldContent.startsWith("File: ")) {
                oldFileName = oldContent.substring(6);
                Path oldFilePath = Paths.get(UPLOAD_DIR + oldFileName);
                if (Files.exists(oldFilePath)) {
                    
                    String versionFileName = "v" + existingDoc.getCurrentVersion() + "_" + oldFileName;
                    Path versionPath = Paths.get(VERSION_DIR + versionFileName);
                    Files.copy(oldFilePath, versionPath);
                    
                 
                    versionService.createVersionWithFile(existingDoc, uploadedBy, VERSION_DIR + versionFileName);
                }
            }
            
            
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Files.write(filePath, file.getBytes());
            
           
            existingDoc.setTitle(title);
            existingDoc.setContent("File: " + fileName);
            existingDoc.setCategory(category);
            existingDoc.setUpdatedAt(LocalDateTime.now());
            existingDoc.setCurrentVersion(existingDoc.getCurrentVersion() + 1);
            
            if (tags != null && !tags.isEmpty()) {
                existingDoc.setTags(List.of(tags.split(",")));
            }
            
            Doc updatedDoc = repo.save(existingDoc);
            
           
            if (oldFileName != null) {
                Path oldFilePath = Paths.get(UPLOAD_DIR + oldFileName);
                Files.deleteIfExists(oldFilePath);
            }
            
            return ResponseEntity.ok(updatedDoc);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Update failed: " + e.getMessage());
        }
    }
    
    @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }
                
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, 
                                "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/download/version/{filename}")
    public ResponseEntity<Resource> downloadVersionFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(VERSION_DIR).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }
                
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, 
                                "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/view/{filename}")
    public ResponseEntity<Resource> viewFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }
                
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, 
                                "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/view/version/{filename}")
    public ResponseEntity<Resource> viewVersionFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(VERSION_DIR).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }
                
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, 
                                "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public Doc update(@PathVariable String id, @RequestBody Doc doc) {
        Optional<Doc> existing = repo.findById(id);
        if (existing.isPresent()) {
            Doc existingDoc = existing.get();
            
    
            boolean contentChanged = !existingDoc.getContent().equals(doc.getContent());
            
            if (contentChanged) {
                // Increment version FIRST
                int newVersion = existingDoc.getCurrentVersion() + 1;
                
                // Save OLD state
                versionService.createVersion(existingDoc, doc.getUploadedBy());
         
                doc.setId(id);
                doc.setCreatedAt(existingDoc.getCreatedAt());
                doc.setUpdatedAt(LocalDateTime.now());
                doc.setCurrentVersion(newVersion);
            } else {
             
                doc.setId(id);
                doc.setCreatedAt(existingDoc.getCreatedAt());
                doc.setUpdatedAt(LocalDateTime.now());
                doc.setCurrentVersion(existingDoc.getCurrentVersion());
            }
            
            return repo.save(doc);
        }
        return null;
    }
    
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) { 
        repo.deleteById(id); 
    }
}