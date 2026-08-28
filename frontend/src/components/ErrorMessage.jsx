import React from 'react';

export const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;
  return (
    <div style={{
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#dc2626',
      padding: '0.85rem 1.25rem',
      borderRadius: '10px',
      margin: '1rem 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem'
    }}>
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{message}</span>
      {onRetry && (
        <button
          className="btn btn-sm btn-danger"
          style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none' }}
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
