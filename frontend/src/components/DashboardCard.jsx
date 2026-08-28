import React from 'react';

export const DashboardCard = ({ title, value, icon: Icon, color = '#16a34a', bg = '#f0fdf4', subtitle }) => {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem' }}>
      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: '12px',
        backgroundColor: bg,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {Icon && <Icon size={26} />}
      </div>
      <div>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
          {title}
        </span>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginTop: '0.2rem' }}>
          {value}
        </h3>
        {subtitle && (
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
