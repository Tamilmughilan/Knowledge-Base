package com.knowledgebase.backend.services;

import com.knowledgebase.backend.models.Doc;
import com.knowledgebase.backend.models.Version;
import com.knowledgebase.backend.repositories.VersionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VersionService {
    @Autowired
    private VersionRepository versionRepository;
    
    public Version createVersion(Doc doc, String modifiedBy) {
        Version version = new Version();
        version.setDocumentId(doc.getId());
        version.setVersionNumber(doc.getCurrentVersion());
        version.setTitle(doc.getTitle());
        version.setContent(doc.getContent());
        version.setCategory(doc.getCategory());
        version.setModifiedBy(modifiedBy);
        return versionRepository.save(version);
    }
    
    public Version createVersionWithFile(Doc doc, String modifiedBy, String filePath) {
        Version version = new Version();
        version.setDocumentId(doc.getId());
        version.setVersionNumber(doc.getCurrentVersion());
        version.setTitle(doc.getTitle());
        version.setContent(doc.getContent());
        version.setCategory(doc.getCategory());
        version.setFilePath(filePath);
        version.setModifiedBy(modifiedBy);
        return versionRepository.save(version);
    }
    
    public List<Version> getVersionsByDocumentId(String documentId) {
        return versionRepository.findByDocumentIdOrderByVersionNumberDesc(documentId);
    }

    public void deleteVersion(String versionId) {
        versionRepository.deleteById(versionId);
    }
}