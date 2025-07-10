import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginFetch, logout as logoutFetch, verifyToken } from '~/services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await verifyToken();
          if (response.success) {
            const userData = response.data;
            setUser(userData);
            setPermissions(userData.permissions || []);
            setIsAuthenticated(true);
            
            localStorage.setItem('permissions', JSON.stringify(userData.permissions || []));
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            console.error('Token verification failed:', response.data.message);
            clearAuthData();
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          clearAuthData();
        }
      } else {
        const cachedPermissions = localStorage.getItem('permissions');
        const cachedUser = localStorage.getItem('user');
        if (cachedPermissions && cachedUser) {
          try {
            const parsedUser = JSON.parse(cachedUser);
            const parsedPermissions = JSON.parse(cachedPermissions);
            
            setUser(parsedUser);
            setPermissions(parsedPermissions);
            setIsAuthenticated(true);
          } catch (error) {
            console.error('Error parsing cached data:', error);
            clearAuthData();
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('permissions');
    localStorage.removeItem('user');
    setUser(null);
    setPermissions([]);
    setIsAuthenticated(false);
  };

  const handleLogin = async (email, password, remember) => {
    try {
      const response = await loginFetch(email, password, remember);
      const data = response.data;
      if (response.status && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('permissions', JSON.stringify(data.user.permissions || []));
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setUser(data.user);
        setPermissions(data.user.permissions || []);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    }
  };

  const handleLogout = async () => {
    try {
      await logoutFetch();
    } catch (error) {
      console.error('Logout API failed:', error);
      clearAuthData();
      throw ('Logout failed:', error);
    } finally {
    }
  };

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissionList) => {
    return permissionList.some(permission => permissions.includes(permission));
  };

  const hasAllPermissions = (permissionList) => {
    return permissionList.every(permission => permissions.includes(permission));
  };

  const isAdmin = () => {
    return user && user.group_role === 'Admin';
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      user,
      permissions,
      isAdmin,
      handleLogin,
      handleLogout,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);