import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  TrendingUp,
  MessageSquare,
  User,
  LogOut,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'F';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <aside className="sidebar">
      {/* Farmer Mini Profile */}
      <div className="sidebar-user">
        <div className="sidebar-avatar">
          {getInitials(user?.name)}
        </div>
        <div className="sidebar-user-info">
          <h4>{user?.name || 'Farmer'}</h4>
          <p>{user?.location || 'Tamil Nadu'}</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <NavLink to="/farmer/dashboard" end className={({ isActive }) => isActive ? 'active' : ''}>
            <LayoutDashboard size={18} />
            <span>{t('navDashboard')}</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink to="/farmer/crops" className={({ isActive }) => isActive ? 'active' : ''}>
            <Package size={18} />
            <span>{t('navMyCrops')}</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink to="/farmer/add-crop" className={({ isActive }) => isActive ? 'active' : ''}>
            <PlusCircle size={18} />
            <span>{t('navAddCrop')}</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink to="/farmer/enquiries" className={({ isActive }) => isActive ? 'active' : ''}>
            <MessageSquare size={18} />
            <span>{t('navEnquiries')}</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink to="/market-prices" className={({ isActive }) => isActive ? 'active' : ''}>
            <TrendingUp size={18} />
            <span>{t('navMarketPrices')}</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink to="/marketplace" className={({ isActive }) => isActive ? 'active' : ''}>
            <ShoppingBag size={18} />
            <span>{t('navMarketplace')}</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink to="/farmer/profile" className={({ isActive }) => isActive ? 'active' : ''}>
            <User size={18} />
            <span>{t('navProfile')}</span>
          </NavLink>
        </li>
        <li className="sidebar-item" style={{ marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
          <button onClick={handleLogout} style={{ color: '#dc2626' }}>
            <LogOut size={18} />
            <span>{t('navLogout')}</span>
          </button>
        </li>
      </ul>
    </aside>
  );
};
