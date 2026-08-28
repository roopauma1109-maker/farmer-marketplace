import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sprout, Globe, Menu, X, User, LogOut, LayoutDashboard, HelpCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout, role } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/" className="nav-logo" onClick={closeMobile}>
          <div className="nav-logo-icon">
            <Sprout size={24} />
          </div>
          <span>{t('brandName')}</span>
        </Link>

        {/* Navigation Links */}
        <ul className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
          <li>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              {t('navHome')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/marketplace" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              {t('navMarketplace')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/market-prices" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              {t('navMarketPrices')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/assisted-access" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              <HelpCircle size={16} />
              {t('navAssistedAccess')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/ai-insights" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              <TrendingUp size={16} />
              <span>{t('navAIInsights')}</span>
            </NavLink>
          </li>

          {/* Authenticated Links in Mobile View */}
          {isAuthenticated && role === 'farmer' && (
            <li>
              <NavLink to="/farmer/dashboard" className="nav-link" onClick={closeMobile}>
                <LayoutDashboard size={16} />
                {t('navDashboard')}
              </NavLink>
            </li>
          )}
          {isAuthenticated && role === 'buyer' && (
            <li>
              <NavLink to="/buyer/profile" className="nav-link" onClick={closeMobile}>
                <User size={16} />
                {t('navProfile')}
              </NavLink>
            </li>
          )}
        </ul>

        {/* Action Buttons & Language Switcher */}
        <div className="nav-actions">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="lang-toggle-btn"
            title="Switch Language / மொழியை மாற்றுக"
            aria-label="Toggle language"
          >
            <Globe size={16} />
            <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {role === 'farmer' ? (
                <Link to="/farmer/dashboard" className="btn btn-sm btn-primary">
                  <LayoutDashboard size={16} />
                  <span>{t('navDashboard')}</span>
                </Link>
              ) : (
                <Link to="/buyer/profile" className="btn btn-sm btn-secondary">
                  <User size={16} />
                  <span>{user?.name?.split(' ')[0] || 'Buyer'}</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="btn btn-sm btn-danger"
                title={t('navLogout')}
                style={{ padding: '0.4rem 0.6rem' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/login" className="btn btn-sm btn-secondary">
                {t('navLogin')}
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                {t('getStarted')}
              </Link>
            </div>
          )}

          {/* Mobile menu hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};
