import React from 'react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LoadingSpinner = ({ message }) => {
  const { t } = useLanguage();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3.5rem 1rem', gap: '0.75rem' }}>
      <Loader2 style={{ animation: 'spin 1s linear infinite', color: '#16a34a' }} size={38} />
      <p style={{ color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>
        {message || t('loading')}
      </p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

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

export const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div style={{
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#dc2626',
      padding: '1rem 1.25rem',
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
