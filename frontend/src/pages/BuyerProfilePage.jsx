import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Save, CheckCircle, MessageSquare, ShoppingBag, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { buyersAPI, enquiriesAPI } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { getCropKey, getCropDisplayName } from '../utils/cropRegistry';

export const BuyerProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { t, language } = useLanguage();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    location: user?.location || ''
  });

  const [sentEnquiries, setSentEnquiries] = useState([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSentEnquiries = async () => {
      setLoadingEnquiries(true);
      try {
        const data = await enquiriesAPI.getBuyerEnquiries();
        setSentEnquiries(data);
      } catch (err) {
        console.warn('Could not load buyer enquiries:', err);
      } finally {
        setLoadingEnquiries(false);
      }
    };
    fetchSentEnquiries();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      setSubmitting(true);
      const updatedUser = await buyersAPI.updateProfile(formData);
      updateUser(updatedUser);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container main-content">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
            {t('buyerPortalTitle')}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            {t('buyerPortalSubtitle')}
          </p>
        </div>
        <Link to="/marketplace" className="btn btn-primary">
          <ShoppingBag size={18} />
          <span>{t('browseMarketplace')}</span>
        </Link>
      </div>

      {error && <ErrorMessage message={error} />}

      {success && (
        <div style={{
          backgroundColor: '#dcfce7',
          border: '1px solid #bbf7d0',
          color: '#15803d',
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle size={18} />
          <span>{t('profileUpdatedSuccess')}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '2.5rem' }}>
        {/* Profile Card & Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
              {t('buyerProfileDetailsHeading')}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">{t('fullName')}</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={submitting}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('mobileNumber')}</label>
                <input
                  type="tel"
                  name="mobile"
                  className="form-input"
                  value={formData.mobile}
                  onChange={handleChange}
                  disabled={submitting}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('emailAddress')}</label>
                <input
                  type="email"
                  className="form-input"
                  value={user?.email || ''}
                  disabled
                  style={{ backgroundColor: '#f8fafc', color: '#64748b' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('location')}</label>
                <input
                  type="text"
                  name="location"
                  className="form-input"
                  placeholder="e.g. Koyambedu Market, Chennai"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={submitting}
                style={{ marginTop: '0.75rem' }}
              >
                <Save size={18} />
                <span>{submitting ? t('saving') : t('updateDetails')}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Sent Enquiries Section */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {t('mySentEnquiriesHeading')}
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                {t('mySentEnquiriesSubtitle')}
              </p>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16a34a' }}>
              {sentEnquiries.length} {t('navEnquiries')}
            </span>
          </div>

          {loadingEnquiries ? (
            <LoadingSpinner message={t('loading')} />
          ) : sentEnquiries.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title={t('noSentEnquiries')}
              message={t('noSentEnquiriesDesc')}
              actionText={t('browseMarketplace')}
              onAction={() => window.location.href = '/marketplace'}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sentEnquiries.map((enq) => {
                const cropKey = getCropKey(enq.crop?.crop_name);
                const cropDisplayName = getCropDisplayName(cropKey, language) || enq.crop?.crop_name || 'Crop';

                return (
                  <div
                    key={enq.id}
                    style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className={`badge ${enq.status === 'Accepted' ? 'badge-available' : enq.status === 'Rejected' ? 'badge-sold' : 'badge-negotiation'}`}>
                          {enq.status === 'Accepted' ? t('enquiryStatusAccepted') : enq.status === 'Rejected' ? t('enquiryStatusRejected') : t('enquiryStatusPending')}
                        </span>
                        <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>
                          {cropDisplayName}
                        </strong>
                      </div>

                      {enq.crop && (
                        <Link to={`/crop/${enq.crop_id}`} className="btn btn-sm btn-secondary" style={{ fontSize: '0.78rem' }}>
                          <Eye size={13} />
                          <span>{t('viewCropBtn')}</span>
                        </Link>
                      )}
                    </div>

                    <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0 }}>
                      "{enq.message}"
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span>{t('farmerLabel')}: <strong>{enq.farmer?.name || 'Local Farmer'}</strong> ({enq.crop?.location || 'Tamil Nadu'})</span>
                      <span>{t('requestedQtyLabel')} <strong style={{ color: '#15803d' }}>{enq.required_quantity} {enq.crop?.unit || 'kg'}</strong></span>
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
