package com.knowledgebase.backend.repositories;

import com.knowledgebase.backend.models.Version;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface VersionRepository extends MongoRepository<Version, String> {
    List<Version> findByDocumentIdOrderByVersionNumberDesc(String documentId);
}