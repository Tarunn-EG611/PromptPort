import React from 'react';

const EmptyState = ({ message, actionText, onAction }) => {
  return (
    <div className="empty-state">
      <span role="img" aria-label="empty">📁</span>
      <p>{message || 'No prompts found in the library.'}</p>
      {actionText && (
        <button className="btn-primary" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;