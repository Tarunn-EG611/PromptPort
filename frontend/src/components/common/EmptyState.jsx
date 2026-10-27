import React from 'react';

const EmptyState = ({ message, actionText, onAction }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">📂</div>
      <p>{message || 'No prompts found in the library.'}</p>
      {actionText && (
        <button className="btn-primary" onClick={onAction} style={{ marginTop: '8px' }}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;