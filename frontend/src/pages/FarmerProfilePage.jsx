import React, { useState } from 'react';
import { MapPin, Calendar, Save, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { farmersAPI } from '../services/api';
import { Sidebar } from '../components/Sidebar';
import { ErrorMessage } from '../components/ErrorMessage';

export const FarmerProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    location: user?.location || ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      setSubmitting(true);
      const updatedUser = await farmersAPI.updateProfile(formData);
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
      <div className="dashboard-layout">
        <Sidebar />

        <div className="dashboard-main">
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
              {t('profileTitle')}
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              {t('farmerProfileSubtitle')}
            </p>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
            {/* Edit Profile Form */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
                {t('accountInfoHeading')}
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
                  <span className="form-hint">{t('mobileHint')}</span>
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
                    placeholder="e.g. Tambaram, Chengalpattu"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{ marginTop: '0.75rem' }}
                >
                  <Save size={18} />
                  <span>{submitting ? t('saving') : t('saveProfileChanges')}</span>
                </button>
              </form>
            </div>

            {/* Profile Overview Card */}
            <div className="card" style={{ padding: '2rem', height: 'fit-content' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#f0fdf4',
                  border: '2px solid #bbf7d0',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  margin: '0 auto 0.75rem auto'
                }}>
                  {user?.name?.[0] || 'F'}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{user?.name}</h3>
                <span className="badge badge-available" style={{ marginTop: '0.35rem' }}>
                  {t('verifiedFarmer')}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}>
                  <MapPin size={16} color="#16a34a" />
                  <span>{user?.location || 'Tamil Nadu'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}>
                  <Calendar size={16} color="#16a34a" />
                  <span>{t('joinedLabel')} {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'August 2026'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
