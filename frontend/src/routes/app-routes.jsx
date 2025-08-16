import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import UserRoutes from './user-routes';
import AdminRoutes from './admin-routes';

const AppRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    const isAdminRoute = location.pathname.startsWith('/admin');
    if (isAdminRoute) {
      import('../assets/css/admin/core.css');
      import('../assets/css/admin/layout.css'); 
      import('../assets/css/admin/custom-toast.css');
    } else {
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