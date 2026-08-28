import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, LogIn, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ErrorMessage } from '../components/ErrorMessage';

export const LoginPage = () => {
  const { login, demoLogin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectUser = (userRole) => {
    const origin = location.state?.from?.pathname;
    if (origin) {
      navigate(origin, { replace: true });
    } else if (userRole === 'farmer') {
      navigate('/farmer/dashboard', { replace: true });
    } else {
      navigate('/marketplace', { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter your email/mobile number and password.');
      return;
    }

    try {
      setSubmitting(true);
      const user = await login(username.trim(), password);
      redirectUser(user.role);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoClick = async (role) => {
    setError('');
    try {
      setSubmitting(true);
      const user = await demoLogin(role);
      redirectUser(user.role);
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '480px', padding: '3rem 1.5rem' }}>
      <div className="card" style={{ padding: '2.25rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            backgroundColor: '#f0fdf4',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem auto'
          }}>
            <LogIn size={26} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
            {t('loginTitle')}
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
            {t('loginSubtitle')}
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('emailAddress')} / {t('mobileNumber')}</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. kumar.farmer@gmail.com or 9876543210"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('password')}</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={submitting}
            style={{ marginTop: '0.75rem' }}
          >
            {submitting ? t('authenticating') : t('navLogin')}
          </button>
        </form>

        {/* Demo Credentials Section */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', textAlign: 'center', marginBottom: '0.75rem' }}>
            {t('quickDemoLogin')}
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => handleDemoClick('farmer')}
              disabled={submitting}
            >
              <Sprout size={14} />
              <span>{t('loginAsDemoFarmer')}</span>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => handleDemoClick('buyer')}
              disabled={submitting}
            >
              <UserCheck size={14} />
              <span>{t('loginAsDemoBuyer')}</span>
            </button>
          </div>
        </div>

        {/* Registration Link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#64748b' }}>
          <span>{t('dontHaveAccount')} </span>
          <Link to="/register" style={{ color: '#16a34a', fontWeight: 700 }}>
            {t('navRegister')}
          </Link>
        </div>
      </div>
    </div>
  );
};
