import React, { useState, useEffect } from 'react';
import { MessageSquare, Check, X, Phone, Mail, Clock } from 'lucide-react';
import { enquiriesAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Sidebar } from '../components/Sidebar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { getCropKey, getCropDisplayName } from '../utils/cropRegistry';

export const FarmerEnquiriesPage = () => {
  const { t, language } = useLanguage();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await enquiriesAPI.getFarmerEnquiries();
      setEnquiries(data);
    } catch (err) {
      setError(err.message || 'Failed to load buyer enquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await enquiriesAPI.updateStatus(id, newStatus);
      setEnquiries(prev => prev.map(enq => enq.id === id ? { ...enq, status: newStatus } : enq));
    } catch (err) {
      alert(err.message || 'Could not update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="container main-content">
      <div className="dashboard-layout">
        <Sidebar />

        <div className="dashboard-main">
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
              {t('buyerEnquiriesTitle')}
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              {t('buyerEnquiriesSubtitle')}
            </p>
          </div>

          {error && <ErrorMessage message={error} onRetry={fetchEnquiries} />}

          {loading ? (
            <LoadingSpinner message={t('loading')} />
          ) : enquiries.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title={t('noEnquiriesFarmer')}
              message={t('noEnquiriesFarmerDesc')}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {enquiries.map((enq) => {
                const cropKey = getCropKey(enq.crop?.crop_name);
                const cropDisplayName = getCropDisplayName(cropKey, language) || enq.crop?.crop_name || 'Crop';

                return (
                  <div
                    key={enq.id}
                    className="card"
                    style={{
                      padding: '1.5rem',
                      borderLeft: enq.status === 'Accepted' ? '5px solid #16a34a' : enq.status === 'Rejected' ? '5px solid #dc2626' : '5px solid #d97706'
                    }}
                  >
                    {/* Top Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className={`badge ${enq.status === 'Accepted' ? 'badge-available' : enq.status === 'Rejected' ? 'badge-sold' : 'badge-negotiation'}`}>
                          {enq.status === 'Accepted' ? t('enquiryStatusAccepted') : enq.status === 'Rejected' ? t('enquiryStatusRejected') : t('enquiryStatusPending')}
                        </span>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                          {t('enquiryFor')} {cropDisplayName}
                        </h3>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                        <Clock size={14} />
                        <span>{t('receivedOn')} {new Date(enq.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Message body */}
                    <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
                      <p style={{ color: '#334155', fontSize: '0.92rem', lineHeight: 1.6 }}>
                        "{enq.message}"
                      </p>
                    </div>

                    {/* Details Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.88rem', color: '#64748b', marginBottom: '1.25rem' }}>
                      <div>
                        <span>{t('buyerName')}: </span>
                        <strong style={{ color: '#0f172a' }}>{enq.buyer?.name || 'Wholesale Buyer'}</strong>
                      </div>
                      <div>
                        <span>{t('requestedQtyLabel')} </span>
                        <strong style={{ color: '#15803d' }}>{enq.required_quantity} {enq.crop?.unit || 'kg'}</strong>
                      </div>
                      <div>
                        <span>{t('buyerLocationLabel')} </span>
                        <strong style={{ color: '#0f172a' }}>{enq.buyer?.location || 'Tamil Nadu'}</strong>
                      </div>
                    </div>

                    {/* Buyer Contact if Accepted */}
                    {enq.status === 'Accepted' && enq.buyer && (
                      <div style={{
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '8px',
                        padding: '0.75rem 1rem',
                        marginBottom: '1rem',
                        display: 'flex',
                        gap: '1.5rem',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        fontSize: '0.88rem'
                      }}>
                        <span style={{ fontWeight: 700, color: '#166534' }}>{t('directBuyerContactLabel')}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#14532d', fontWeight: 600 }}>
                          <Phone size={14} />
                          {enq.buyer.mobile}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#14532d' }}>
                          <Mail size={14} />
                          {enq.buyer.email}
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                      {enq.status !== 'Accepted' && (
                        <button
                          onClick={() => handleStatusChange(enq.id, 'Accepted')}
                          disabled={updatingId === enq.id}
                          className="btn btn-sm btn-primary"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <Check size={16} />
                          <span>{t('acceptEnquiry')}</span>
                        </button>
                      )}

                      {enq.status !== 'Rejected' && (
                        <button
                          onClick={() => handleStatusChange(enq.id, 'Rejected')}
                          disabled={updatingId === enq.id}
                          className="btn btn-sm btn-danger"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <X size={16} />
                          <span>{t('rejectEnquiry')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
