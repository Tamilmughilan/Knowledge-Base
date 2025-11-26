import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/styles.css";

const API_URL = "http://localhost:8080/api";

function Upload({ user, onSuccess, editDoc }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);
  const [uploadMode, setUploadMode] = useState("text");
  const [isEditingFile, setIsEditingFile] = useState(false);

  useEffect(() => {
    if (editDoc) {
      setTitle(editDoc.title || "");
      setContent(editDoc.content || "");
      setCategory(editDoc.category || "");
      setTags(editDoc.tags ? editDoc.tags.join(", ") : "");
      
      // Check if editing a file document
      if (editDoc.content && editDoc.content.startsWith("File: ")) {
        setIsEditingFile(true);
        setUploadMode("file");
      } else {
        setIsEditingFile(false);
        setUploadMode("text");
      }
    }
  }, [editDoc]);

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
    alert("Title is required");
    return;
  }
  
  if (title.length > 200) {
    alert("Title must be less than 200 characters");
    return;
  }
  
  if (!category.trim()) {
    alert("Category is required");
    return;
  }
  
  if (!content.trim()) {
    alert("Content is required");
    return;
  }
  
  if (content.length > 50000) {
    alert("Content must be less than 50,000 characters");
    return;
  }
    try {
      const doc = {
        title,
        content,
        category,
        tags: tags ? tags.split(",").map(t => t.trim()) : [],
        uploadedBy: user.username
      };

      if (editDoc) {
        await axios.put(`${API_URL}/documents/${editDoc.id}`, doc);
        alert("Document updated!");
      } else {
        await axios.post(`${API_URL}/documents`, doc);
        alert("Document created!");
      }
      
      resetForm();
      onSuccess();
    } catch (err) {
      alert("Error saving document: " + err.message);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    // If editing and no new file selected, just update metadata
    if (isEditingFile && !file) {
      return handleFileMetadataUpdate();
    }
    
    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("category", category);
      formData.append("tags", tags);
      formData.append("uploadedBy", user.username);

      if (isEditingFile && editDoc) {
        // Update existing file document
        await axios.post(`${API_URL}/documents/upload/${editDoc.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("File updated successfully!");
      } else {
        // Create new file document
        await axios.post(`${API_URL}/documents/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("File uploaded successfully!");
      }
      
      resetForm();
      onSuccess();
    } catch (err) {
      alert("Error with file: " + err.message);
    }
  };

  const handleFileMetadataUpdate = async () => {
    try {
      const doc = {
        title,
        content: editDoc.content, // Keep existing file reference
        category,
        tags: tags ? tags.split(",").map(t => t.trim()) : [],
        uploadedBy: user.username
      };

      await axios.put(`${API_URL}/documents/${editDoc.id}`, doc);
      alert("Document metadata updated!");
      resetForm();
      onSuccess();
    } catch (err) {
      alert("Error updating metadata: " + err.message);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategory("");
    setTags("");
    setFile(null);
    setIsEditingFile(false);
  };

  const extractFilename = (content) => {
    if (content && content.startsWith("File: ")) {
      return content.substring(6);
    }
    return null;
  };

  const currentFilename = isEditingFile && editDoc ? extractFilename(editDoc.content) : null;

  return (
    <div>
      <h3>{editDoc ? "Edit Document" : "Create New Document"}</h3>
      
      {!editDoc && (
        <div className="tab-container">
          <button 
            onClick={() => setUploadMode("text")}
            className={`tab ${uploadMode === "text" ? "active" : ""}`}>
            Text Document
          </button>
          <button 
            onClick={() => setUploadMode("file")}
            className={`tab ${uploadMode === "file" ? "active" : ""}`}>
            Upload File
          </button>
        </div>
      )}

      {uploadMode === "file" || isEditingFile ? (
        <form onSubmit={handleFileUpload} className="form form-section">
          {isEditingFile && currentFilename && (
            <div className="current-file-info">
              <p><strong>Current File:</strong> {currentFilename}</p>
              <p><small>Upload a new file to replace it, or leave empty to keep current file</small></p>
            </div>
          )}
          
          <input
            className={`input ${!title.trim() && 'error'}`}
            placeholder="Title *"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            maxLength={200}
          />
          <input
            className="input"
            placeholder="Category (HR, IT, Finance, etc.)"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          />
          <input
            className="input"
            placeholder="Tags (comma-separated: leave-policy, onboarding)"
            value={tags}
            onChange={e => setTags(e.target.value)}
          />
          <input
            type="file"
            className="input"
            onChange={e => setFile(e.target.files[0])}
            accept=".pdf,.doc,.docx,.txt"
            required={!isEditingFile}
          />
          <div>
            <button type="submit" className="button">
              {isEditingFile ? (file ? "Update File" : "Update Info") : "Upload File"}
            </button>
            {editDoc && (
              <button type="button" onClick={() => { resetForm(); onSuccess(); }} className="cancel-btn">
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <form onSubmit={handleTextSubmit} className="form form-section">
          <input
            className="input"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <input
            className="input"
            placeholder="Category (HR, IT, Finance, etc.)"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          />
          <input
            className="input"
            placeholder="Tags (comma-separated: leave-policy, onboarding)"
            value={tags}
            onChange={e => setTags(e.target.value)}
          />
          <textarea
            className="textarea"
            placeholder="Content"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
          <div>
            <button type="submit" className="button">
              {editDoc ? "Update" : "Create"} Document
            </button>
            {editDoc && (
              <button type="button" onClick={() => { resetForm(); onSuccess(); }} className="cancel-btn">
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

export default Upload;