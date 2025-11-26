import { useEffect, useState } from "react";
import axios from "axios";
import Auth from "./components/Auth";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Documents from "./components/Documents";
import Search from "./components/Search";
import Upload from "./components/Upload";
import UserManagement from "./components/UserManagement";
import "./styles/styles.css";

const API_URL = "http://localhost:8080/api";

function App() {
  const [user, setUser] = useState(null);
  const [docs, setDocs] = useState([]);
  const [currentPage, setCurrentPage] = useState("documents");
  const [editDoc, setEditDoc] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user && currentPage === "documents") {
      fetchDocs();
    }
  }, [user, currentPage]);

  const fetchDocs = async () => {
    try {
      const res = await axios.get(`${API_URL}/documents`);
      setDocs(res.data);
    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setDocs([]);
    setCurrentPage("documents");
  };

  const handleEdit = (doc) => {
    if (!canEdit()) {
      alert("You don't have permission to edit documents");
      return;
    }
    setEditDoc(doc);
    setCurrentPage("upload");
  };

  const handleDelete = async (id) => {
    if (!isAdmin()) {
      alert("Only admins can delete documents");
      return;
    }
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await axios.delete(`${API_URL}/documents/${id}`);
        fetchDocs();
        alert("Document deleted!");
      } catch (err) {
        alert("Error deleting document: " + err.message);
      }
    }
  };

  const handleUploadSuccess = () => {
    setEditDoc(null);
    setCurrentPage("documents");
    fetchDocs();
  };

  const isAdmin = () => user && user.roles.includes("ADMIN");
  const canEdit = () => user && (user.roles.includes("ADMIN") || user.roles.includes("CONTRIBUTOR"));

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="container">
      <Header user={user} onLogout={handleLogout} />
      <Navigation 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        canEdit={canEdit()} 
        isAdmin={isAdmin()}
      />
      
      <div className="content">
        {currentPage === "documents" && (
          <Documents 
            docs={docs}
            onEdit={handleEdit}
            onDelete={handleDelete}
            canEdit={canEdit()}
            isAdmin={isAdmin()}
          />
        )}
        {currentPage === "search" && (
          <Search 
            user={user}
            onEdit={handleEdit}
            onDelete={handleDelete}
            canEdit={canEdit()}
            isAdmin={isAdmin()}
          />
        )}
        {currentPage === "upload" && canEdit() && (
          <Upload 
            user={user}
            onSuccess={handleUploadSuccess}
            editDoc={editDoc}
          />
        )}
        {currentPage === "users" && isAdmin() && (
          <UserManagement isAdmin={isAdmin()} />
        )}
      </div>
    </div>
  );
}

export default App;
