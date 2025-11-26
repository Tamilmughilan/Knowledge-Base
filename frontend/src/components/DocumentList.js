import { useState } from "react";
import axios from "axios";
import "../styles/styles.css";

const API_URL = "http://localhost:8080/api";

function DocumentList({ docs, onEdit, onDelete, canEdit, isAdmin }) {
  const [versions, setVersions] = useState([]);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [showVersions, setShowVersions] = useState(false);

  const handlePreview = (doc) => {
  setPreviewDoc(doc);
  };

  const viewVersions = async (docId) => {
    try {
      const res = await axios.get(`${API_URL}/versions/${docId}`);
      setVersions(res.data);
      setShowVersions(true);
    } catch (err) {
      alert("Error loading versions: " + err.message);
    }
  };

  const extractFilename = (content) => {
    if (content && content.startsWith("File: ")) {
      return content.substring(6);
    }
    return null;
  };

  const extractVersionFilename = (filePath) => {
    if (!filePath) return null;
    const parts = filePath.split('/');
    return parts[parts.length - 1];
  };

  const handleDownload = (filename) => {
    window.open(`${API_URL}/documents/download/${filename}`, '_blank');
  };

  const handleDownloadVersion = (filePath) => {
    const filename = extractVersionFilename(filePath);
    if (filename) {
      window.open(`${API_URL}/documents/download/version/${filename}`, '_blank');
    }
  };

  const handleView = (filename) => {
    window.open(`${API_URL}/documents/view/${filename}`, '_blank');
  };

  const handleViewVersion = (filePath) => {
    const filename = extractVersionFilename(filePath);
    if (filename) {
      window.open(`${API_URL}/documents/view/version/${filename}`, '_blank');
    }
  };

  return (
    <>
      <div className="doc-list">
        {docs.map(doc => {
          const filename = extractFilename(doc.content);
          const isFile = filename !== null;

          return (
            <div key={doc.id} className="doc-card">
              <div className="doc-header">
                <h4 className="doc-title">{doc.title}</h4>
                <div className="badges">
                  {isFile && <span className="file-badge">📄 File</span>}
                  <span className="version-badge">v{doc.currentVersion}</span>
                </div>
              </div>
              <div className="doc-metadata-details">
                <div className="metadata-item">
                  <span className="metadata-label">📅 Created:</span>
                  <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">✏️ Updated:</span>
                  <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">👤 Author:</span>
                  <span>{doc.uploadedBy || "Unknown"}</span>
                </div>
              </div>
                          
              <p className="doc-category">
                <strong>Category:</strong> {doc.category}
              </p>
              
              {doc.tags && doc.tags.length > 0 && (
                <div className="tags-container">
                  {doc.tags.map((tag, idx) => (
                    <span key={idx} className="tag">{tag}</span>
                  ))}
                </div>
              )}
              
              {isFile ? (
                <div className="file-info">
                  <p className="file-name">
                    <strong> Filename:</strong> {filename}
                  </p>
                  <div className="file-actions">
                    {filename.toLowerCase().endsWith('.pdf') && (
                      <button onClick={() => handleView(filename)} className="view-btn">
                         View PDF
                      </button>
                    )}
                    <button onClick={() => handleDownload(filename)} className="download-btn">
                       Download
                    </button>
                  </div>
                </div>
              ) : (
                <p className="doc-content">{doc.content}</p>
              )}
              
              <div className="doc-metadata">
                <small>By: {doc.uploadedBy || "Unknown"}</small>
                <small>Updated: {new Date(doc.updatedAt).toLocaleDateString()}</small>
              </div>
              
              <div className="doc-actions">
                {!isFile && (
                  <button onClick={() => handlePreview(doc)} className="action-btn">
                    👁️ Preview
                  </button>
                )}
                <button onClick={() => viewVersions(doc.id)} className="action-btn">
                  View History
                </button>
                {canEdit && (
                  <button onClick={() => onEdit(doc)} className="action-btn">
                    Edit
                  </button>
                )}
                {isAdmin && (
                  <button onClick={() => onDelete(doc.id)} className="delete-btn">
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {previewDoc && (
  <div className="modal" onClick={() => setPreviewDoc(null)}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <h3>{previewDoc.title}</h3>
        <button onClick={() => setPreviewDoc(null)} className="close-btn">×</button>
      </div>
      <div className="preview-content">
        <p><strong>Category:</strong> {previewDoc.category}</p>
        {previewDoc.tags && previewDoc.tags.length > 0 && (
          <p><strong>Tags:</strong> {previewDoc.tags.join(", ")}</p>
        )}
        <hr />
        <div className="content-preview">
          {previewDoc.content}
        </div>
      </div>
    </div>
  </div>
)}

      {showVersions && (
        <div className="modal" onClick={() => setShowVersions(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Version History</h3>
            <button onClick={() => setShowVersions(false)} className="close-btn">×</button>
            
            {versions.length === 0 ? (
              <p>No version history available.</p>
            ) : (
              <div className="version-list">
                {versions.map(version => {
                  const versionFilename = extractFilename(version.content);
                  const isVersionFile = versionFilename !== null;
                  const actualFilePath = version.filePath;

                  return (
                    <div key={version.id} className="version-card">
                      <div className="version-header">
                        <strong>Version {version.versionNumber}</strong>
                        <small>{new Date(version.createdAt).toLocaleString()}</small>
                      </div>
                      <p><strong>Title:</strong> {version.title}</p>
                      <p><strong>Category:</strong> {version.category}</p>
                      
                      {isVersionFile && actualFilePath ? (
                        <div className="file-info">
                          <p className="file-name">
                            <strong> File:</strong> {extractVersionFilename(actualFilePath)}
                          </p>
                          <div className="file-actions">
                            {extractVersionFilename(actualFilePath).toLowerCase().endsWith('.pdf') && (
                              <button 
                                onClick={() => handleViewVersion(actualFilePath)} 
                                className="view-btn">
                                 View PDF
                              </button>
                            )}
                            <button 
                              onClick={() => handleDownloadVersion(actualFilePath)} 
                              className="download-btn">
                               Download
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="version-content">{version.content}</p>
                      )}
                      
                      <small>Modified by: {version.modifiedBy}</small>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default DocumentList;