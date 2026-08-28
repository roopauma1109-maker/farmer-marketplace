import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('agridirect_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('agridirect_token');
      const savedUser = localStorage.getItem('agridirect_user');

      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
          // Refresh user data from backend
          const freshUser = await authAPI.getMe();
          setUser(freshUser);
          localStorage.setItem('agridirect_user', JSON.stringify(freshUser));
        } catch (err) {
          console.warn('Session expired or invalid token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    const data = await authAPI.login(username, password);
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('agridirect_token', data.access_token);
    localStorage.setItem('agridirect_user', JSON.stringify(data.user));
    return data.user;
  };

  const register = async (userData) => {
    const data = await authAPI.register(userData);
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('agridirect_token', data.access_token);
    localStorage.setItem('agridirect_user', JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('agridirect_token');
    localStorage.removeItem('agridirect_user');
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('agridirect_user', JSON.stringify(updatedUserData));
  };

  const demoLogin = async (role = 'farmer') => {
    if (role === 'farmer') {
      return await login('kumar.farmer@gmail.com', 'farmer123');
    } else {
      return await login('anand.traders@gmail.com', 'buyer123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateUser,
        demoLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
