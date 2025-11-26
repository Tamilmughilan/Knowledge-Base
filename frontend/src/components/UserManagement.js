import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api";

function UserManagement({ isAdmin }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      setUsers(res.data);
    } catch (err) {
      alert("Error fetching users: " + err.message);
    }
  };

  const handleDelete = async (id, username) => {
    if (username === "admin") {
      alert("Cannot delete default admin user");
      return;
    }
    
    if (window.confirm(`Delete user ${username}?`)) {
      try {
        await axios.delete(`${API_URL}/users/${id}`);
        fetchUsers();
        alert("User deleted!");
      } catch (err) {
        alert("Error deleting user: " + err.message);
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`${API_URL}/users/${userId}/roles`, {
        roles: [newRole]
      });
      fetchUsers();
      alert("Role updated!");
    } catch (err) {
      alert("Error updating role: " + err.message);
    }
  };

  if (!isAdmin) {
    return <div>Access Denied</div>;
  }

  return (
    <div>
      <h3>User Management ({users.length} users)</h3>
      <div style={styles.userList}>
        {users.map(user => (
          <div key={user.id} style={styles.userCard}>
            <div style={styles.userInfo}>
              <strong>{user.username}</strong>
              <span style={styles.roleBadge}>
                {user.roles.join(", ")}
              </span>
            </div>
            <div style={styles.actions}>
              <select 
                value={user.roles[0]} 
                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                style={styles.select}>
                <option value="EMPLOYEE">Employee</option>
                <option value="CONTRIBUTOR">Contributor</option>
                <option value="ADMIN">Admin</option>
              </select>
              {user.username !== "admin" && (
                <button 
                  onClick={() => handleDelete(user.id, user.username)}
                  style={styles.deleteBtn}>
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  userList: {
    display: "grid",
    gap: "10px",
    marginTop: "20px"
  },
  userCard: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  userInfo: {
    display: "flex",
    gap: "15px",
    alignItems: "center"
  },
  roleBadge: {
    padding: "5px 10px",
    background: "#e9ecef",
    borderRadius: "4px",
    fontSize: "12px"
  },
  actions: {
    display: "flex",
    gap: "10px"
  },
  select: {
    padding: "5px 10px",
    border: "1px solid #ddd",
    borderRadius: "4px"
  },
  deleteBtn: {
    padding: "5px 15px",
    background: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  }
};

export default UserManagement;