import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

export const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, isAuthenticated, loading, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    // If a buyer tries to visit farmer dashboard, or vice versa, redirect appropriately
    if (role === 'farmer') {
      return <Navigate to="/farmer/dashboard" replace />;
    } else {
      return <Navigate to="/marketplace" replace />;
    }
  }

  return children;
};
