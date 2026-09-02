import React from 'react';

const ErrorHandler = ({ error }) => {
  if (!error) {
    return null;
  }

  return (
    <div className="error-handler">
      <p>{error}</p>
    </div>
  );
};

export default ErrorHandler;