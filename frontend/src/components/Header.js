import "../styles/styles.css";

function Header({ user, onLogout }) {
  return (
    <div className="header">
      <h2>Knowledge Base - Welcome, {user.username}</h2>
      <div className="header-actions">
        <span className="role-badge">Role: {user.roles.join(", ")}</span>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
}

export default Header;