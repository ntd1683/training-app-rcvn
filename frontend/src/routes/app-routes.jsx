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
      // Load admin CSS với dynamic import
      import('../assets/css/admin/core.css');
      import('../assets/css/admin/layout.css'); 
      import('../assets/css/admin/custom-toast.css');
    } else {
      // Load user CSS với dynamic import
      import('../assets/css/user/main.css');
      import('../assets/css/user/line-icon.css');
      import('../assets/css/user/pre-loader.css');
      import('../assets/css/user/search.css');
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