import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginFetch } from '~/services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/verify-token', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
          }
        })
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = async (username, password, remember) => {
    try {
      const response = await loginFetch(username, password, remember);
      const data = response.data; // axios trả về JSON trong response.data
      if (response.status === 200 && data.token) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        return true;
      } else {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, handleLogin: handleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);