package com.knowledgebase.backend.controllers;

import com.knowledgebase.backend.models.Version;
import com.knowledgebase.backend.services.VersionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/versions")
@CrossOrigin(origins = "http://localhost:3000")
public class VersionController {
    
    @Autowired
    private VersionService versionService;
    
    @GetMapping("/{documentId}")
    public List<Version> getVersions(@PathVariable String documentId) {
        return versionService.getVersionsByDocumentId(documentId);
    }
}