import React from 'react';

const ErrorHandler = ({ error }) => {
  if (!error) {
    return null;
  }

  return (
    <div className="error-handler">
      <span style={{ fontSize: '1.1rem' }}>⚠️</span>
      <span>{error}</span>
    </div>
  );
};

export default ErrorHandler;