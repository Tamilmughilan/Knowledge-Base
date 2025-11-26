import { useState } from "react";
import axios from "axios";
import "../styles/styles.css";

const API_URL = "http://localhost:8080/api";

function Auth({ onLogin }) {
  const [authMode, setAuthMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EMPLOYEE");

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (authMode === "login") {
        const res = await axios.post(`${API_URL}/auth/login`, { username, password });
        const userData = res.data;
        localStorage.setItem("user", JSON.stringify(userData));
        onLogin(userData);
        alert("Login successful!");
      } else {
        await axios.post(`${API_URL}/auth/register`, {
          username,
          password,
          roles: [role]
        });
        alert("Registration successful! Please login.");
        setAuthMode("login");
      }
      setUsername("");
      setPassword("");
    } catch (err) {
      alert(err.response?.data || "Authentication failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Knowledge Base</h2>
        <div className="auth-toggle">
          <button 
            onClick={() => setAuthMode("login")}
            className={`toggle-btn ${authMode === "login" ? "active" : ""}`}>
            Login
          </button>
          <button 
            onClick={() => setAuthMode("register")}
            className={`toggle-btn ${authMode === "register" ? "active" : ""}`}>
            Register
          </button>
        </div>
        
        <form onSubmit={handleAuth} className="form">
          <input
            className="input"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          
          {authMode === "register" && (
            <select className="input" value={role} onChange={e => setRole(e.target.value)}>
              <option value="EMPLOYEE">Employee (View Only)</option>
              <option value="CONTRIBUTOR">Contributor (Can Edit)</option>
              <option value="ADMIN">Admin</option>
            </select>
          )}
          
          <button type="submit" className="button">
            {authMode === "login" ? "Login" : "Register"}
          </button>
        </form>
        

      </div>
    </div>
  );
}

export default Auth;