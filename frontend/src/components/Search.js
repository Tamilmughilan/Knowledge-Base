import { useState } from "react";
import axios from "axios";
import DocumentList from "./DocumentList";
import "../styles/styles.css";

const API_URL = "http://localhost:8080/api";

function Search({ user, onEdit, onDelete, canEdit, isAdmin }) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [docs, setDocs] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (searchKeyword.trim()) {
        res = await axios.get(`${API_URL}/documents/search?keyword=${searchKeyword}`);
      } else if (category.trim()) {
        res = await axios.get(`${API_URL}/documents/category/${category}`);
      } else if (tag.trim()) {
        res = await axios.get(`${API_URL}/documents/tag/${tag}`);
      } else {
        res = await axios.get(`${API_URL}/documents`);
      }
      setDocs(res.data);
      setSearched(true);
    } catch (err) {
      alert("Search error: " + err.message);
    }
    finally{
      setLoading(false); 
    }
  };

  const handleClear = () => {
    setSearchKeyword("");
    setCategory("");
    setTag("");
    setDocs([]);
    setSearched(false);
  };

  return (
    <div>
      <h3>Search Documents</h3>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-row">
          <input
            className="input"
            placeholder="Search by keyword..."
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
          />
        </div>
        
        <div className="search-row">
          <input
            className="input"
            placeholder="Filter by category (HR, IT, Finance...)"
            value={category}
            onChange={e => setCategory(e.target.value)}
          />
        </div>
        
        <div className="search-row">
          <input
            className="input"
            placeholder="Filter by tag..."
            value={tag}
            onChange={e => setTag(e.target.value)}
          />
        </div>
        
        <div className="button-row">
          <button type="submit" className="search-btn">Search</button>
          <button type="button" onClick={handleClear} className="clear-btn">Clear</button>
        </div>
      </form>

      {searched && (
        <div className="search-results">
          <h4>Search Results ({docs.length})</h4>
          {docs.length === 0 ? (
            <p>No documents found.</p>
          ) : (
            <DocumentList 
              docs={docs}
              onEdit={onEdit}
              onDelete={onDelete}
              canEdit={canEdit}
              isAdmin={isAdmin}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Search;