import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserRoutes from './user-routes';
import AdminRoutes from './admin-routes';


const AppRoutes = () => {
return (
    <Routes>
      <Route path="/*" element={<UserRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
);
};

export default AppRoutes;