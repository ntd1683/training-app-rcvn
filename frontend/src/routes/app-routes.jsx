import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import UserRoutes from './user-routes';
import AdminRoutes from './admin-routes';
import { loadCSS, removeCSS } from '../utils/cssLoader';

const AppRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    const isAdminRoute = location.pathname.startsWith('/admin');
    if (isAdminRoute) {
      // Load admin CSS
      loadCSS('/src/assets/css/admin/core.css');
      loadCSS('/src/assets/css/admin/layout.css');
      loadCSS('/src/assets/css/admin/custom-toast.css');

      // Remove user CSS
      removeCSS('/src/assets/css/user/main.css');
      removeCSS('/src/assets/css/user/line-icon.css');
      removeCSS('/src/assets/css/user/pre-loader.css');
    } else {
      // Load user CSS
      loadCSS('/src/assets/css/user/main.css');
      loadCSS('/src/assets/css/user/line-icon.css');
      loadCSS('/src/assets/css/user/pre-loader.css');

      // Remove admin CSS
      removeCSS('/src/assets/css/admin/core.css');
      removeCSS('/src/assets/css/admin/layout.css');
      removeCSS('/src/assets/css/admin/custom-toast.css');
    }
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/*" element={<UserRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
};

export default AppRoutes;