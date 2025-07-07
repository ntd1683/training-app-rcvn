import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginFetch, logout as logoutFetch } from '~/services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [groupRole, setGroupRole] = useState(localStorage.getItem('group_role') || '');

  useEffect(() => {
    const mount = true;
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/verify-token', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (!mount) return;
          if (response.ok) {
            setIsAuthenticated(true);
            setGroupRole(localStorage.getItem('group_role') || '');
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('group_role');
            setGroupRole('');
          }
        })
        .catch(() => {
          if (mount) {
            localStorage.removeItem('token');
            localStorage.removeItem('group_role');
            setGroupRole('');
          }
        })
        .finally(() => {
          if (mount) setIsLoading(false);
        });
    } else {
      setGroupRole('');
      setIsLoading(false);
    }
  }, []);

  const handleLogin = async (username, password, remember) => {
    try {
      const response = await loginFetch(username, password, remember);
      const data = response.data;
      if (response.status === 200 && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('group_role', data.user.group_role);
        localStorage.setItem('user_id', data.user.id);
        localStorage.setItem('name', data.user.name);
        localStorage.setItem('last_login_at', data.user.last_login_at);
        setIsAuthenticated(true);
        setGroupRole(data.user.group_role);
        return true;
      } else {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await logoutFetch();
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('group_role');
      localStorage.removeItem('user_id');
      localStorage.removeItem('name');
      localStorage.removeItem('last_login_at');
      setIsAuthenticated(false);
      setGroupRole('');
    } catch (error) {
      console.error('Logout failed:', error);
      throw ('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, groupRole, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);