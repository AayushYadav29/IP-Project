import React from 'react';

/**
 * Full-screen loading overlay.
 */
const LoadingOverlay = ({ message = 'Processing...', visible = false }) => {
  return (
    <div className={`loading-overlay ${visible ? 'loading-overlay--visible' : ''}`} role="alert" aria-live="polite">
      <div className="loading-spinner" />
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingOverlay;
