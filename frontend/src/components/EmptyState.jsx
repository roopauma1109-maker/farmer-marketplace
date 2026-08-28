import React from 'react';

export const EmptyState = ({ title, message, actionText, onAction, icon: Icon }) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '3.5rem 1.5rem',
      backgroundColor: '#ffffff',
      borderRadius: '14px',
      border: '1px dashed #cbd5e1',
      margin: '1.5rem 0'
    }}>
      {Icon && (
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          backgroundColor: '#f0fdf4',
          color: '#16a34a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem auto'
        }}>
          <Icon size={28} />
        </div>
      )}
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>{title}</h3>
      <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.25rem auto' }}>{message}</p>
      {actionText && onAction && (
        <button className="btn btn-primary btn-sm" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
