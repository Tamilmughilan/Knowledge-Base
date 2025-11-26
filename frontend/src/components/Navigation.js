import "../styles/styles.css";

function Navigation({ currentPage, onNavigate, canEdit, isAdmin }) {
  return (
    <nav style={styles.nav}>
      <button 
        onClick={() => onNavigate('documents')}
        style={{
          ...styles.navBtn,
          ...(currentPage === 'documents' ? styles.activeBtn : {})
        }}
      >
        Documents
      </button>

      <button 
        onClick={() => onNavigate('search')}
        style={{
          ...styles.navBtn,
          ...(currentPage === 'search' ? styles.activeBtn : {})
        }}
      >
        Search
      </button>

      {canEdit && (
        <button 
          onClick={() => onNavigate('upload')}
          style={{
            ...styles.navBtn,
            ...(currentPage === 'upload' ? styles.activeBtn : {})
          }}
        >
          Upload
        </button>
      )}

      {isAdmin && (
        <button 
          onClick={() => onNavigate('users')}
          style={{
            ...styles.navBtn,
            ...(currentPage === 'users' ? styles.activeBtn : {})
          }}
        >
          User Management
        </button>
      )}
    </nav>
  );
}
const styles = {
  nav: {
    display: "flex",
    gap: "10px",
    padding: "20px 0",
    borderBottom: "2px solid #e9ecef",
    marginBottom: "20px"
  },
  navBtn: {
    padding: "10px 20px",
    background: "white",
    border: "1px solid #ddd",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s",
    color: "#495057"
  },
  activeBtn: {
    background: "#765dc2",
    color: "white",
    borderColor: "#e0e0e0"
  }
};

export default Navigation;