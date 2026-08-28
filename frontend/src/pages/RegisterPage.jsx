import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Sprout, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ErrorMessage } from '../components/ErrorMessage';

export const RegisterPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    location: '',
    role: 'farmer'
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Required field validation
    if (
      !formData.name.trim() ||
      !formData.mobile.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setSubmitting(true);

      // Authentication will be added later.
      // For now, directly navigate based on selected role.

      setTimeout(() => {
        if (formData.role === 'farmer') {
          navigate('/farmer/dashboard');
        } else {
          navigate('/marketplace');
        }

        setSubmitting(false);
      }, 500);

    } catch (err) {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div
      className="container"
      style={{
        maxWidth: '540px',
        padding: '3rem 1.5rem'
      }}
    >
      <div
        className="card"
        style={{
          padding: '2.25rem'
        }}
      >

        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '1.75rem'
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              backgroundColor: '#f0fdf4',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem auto'
            }}
          >
            <UserPlus size={26} />
          </div>

          <h2
            style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: '#0f172a',
              marginBottom: '0.35rem'
            }}
          >
            {t('registerTitle')}
          </h2>

          <p
            style={{
              fontSize: '0.88rem',
              color: '#64748b'
            }}
          >
            {t('registerSubtitle')}
          </p>
        </div>

        {/* Error Message */}
        {error && <ErrorMessage message={error} />}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Role Selection */}
          <div
            className="form-group"
            style={{
              marginBottom: '1.5rem'
            }}
          >
            <label className="form-label">
              {t('role')}
            </label>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem'
              }}
            >

              {/* Farmer */}
              <button
                type="button"
                className={`btn ${
                  formData.role === 'farmer'
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
                onClick={() =>
                  setFormData({
                    ...formData,
                    role: 'farmer'
                  })
                }
                style={{
                  padding: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}
              >
                <Sprout size={20} />

                <span
                  style={{
                    fontSize: '0.9rem'
                  }}
                >
                  {t('roleFarmer')}
                </span>
              </button>

              {/* Buyer */}
              <button
                type="button"
                className={`btn ${
                  formData.role === 'buyer'
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
                onClick={() =>
                  setFormData({
                    ...formData,
                    role: 'buyer'
                  })
                }
                style={{
                  padding: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}
              >
                <ShoppingBag size={20} />

                <span
                  style={{
                    fontSize: '0.9rem'
                  }}
                >
                  {t('roleBuyer')}
                </span>
              </button>

            </div>
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">
              {t('fullName')} *
            </label>

            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. Kumar Velusamy"
              value={formData.name}
              onChange={handleChange}
              disabled={submitting}
              required
            />
          </div>

          {/* Mobile + Email */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}
          >

            {/* Mobile */}
            <div className="form-group">
              <label className="form-label">
                {t('mobileNumber')} *
              </label>

              <input
                type="tel"
                name="mobile"
                className="form-input"
                placeholder="10-digit mobile number"
                value={formData.mobile}
                onChange={handleChange}
                disabled={submitting}
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">
                {t('emailAddress')} *
              </label>

              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={submitting}
                required
              />
            </div>

          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label">
              {t('location')}
            </label>

            <input
              type="text"
              name="location"
              className="form-input"
              placeholder="e.g. Tambaram, Chengalpattu / Madurai"
              value={formData.location}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">
              {t('password')} *
            </label>

            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              disabled={submitting}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={submitting}
            style={{
              marginTop: '0.75rem'
            }}
          >
            {submitting
              ? t('creatingAccount')
              : t('navRegister')}
          </button>

        </form>

        {/* Login Link */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            fontSize: '0.88rem',
            color: '#64748b'
          }}
        >
          <span>
            {t('alreadyHaveAccount')}{' '}
          </span>

          <Link
            to="/login"
            style={{
              color: '#16a34a',
              fontWeight: 700
            }}
          >
            {t('navLogin')}
          </Link>
        </div>

      </div>
    </div>
  );
};