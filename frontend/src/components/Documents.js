import DocumentList from "./DocumentList";
import "../styles/styles.css";

function Documents({ docs, onEdit, onDelete, canEdit, isAdmin }) {
  return (
    <div>
      <h3>All Documents ({docs.length})</h3>
      {docs.length === 0 ? (
        <div className="empty-state">
          <p>No documents available.</p>
          {canEdit && <p>Start by creating a new document!</p>}
        </div>
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
  );
}

export default Documents;