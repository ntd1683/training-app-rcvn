import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/route/protected-route';
import Layout from './components/layout/layout';
import LoadingSpinner from './components/ui/loading-spinner';

// Import non-lazy components
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import NotFound from './components/not-found';

import { routeConfig } from './data/route-config';

const AppRoutes = () => {
return (
  <Suspense 
    fallback={
      <div className="d-flex justify-content-center align-items-center vh-100">
        <LoadingSpinner />
      </div>
    }
  >
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        } 
      />

      {/* Special routes */}
      <Route 
        path="/logout" 
        element={
          <ProtectedRoute>
            <Logout />
          </ProtectedRoute>
        } 
      />

      {/* Dynamic routes from config */}
      {routeConfig.map((route, index) => {
        const { 
          path, 
          element: Component, 
          requireAuth, 
          layout, 
          permissions, 
          adminOnly,
        } = route;
        
        const routeElement = (
          <ProtectedRoute
            requireAuth={requireAuth}
            requiredPermissions={permissions}
            adminOnly={adminOnly}
          >
            {layout ? (
              <Layout>
                <Component />
              </Layout>
            ) : (
              <Component />
            )}
          </ProtectedRoute>
        );

        return (
          <Route
            key={index}
            path={path}
            element={routeElement}
          />
        );
      })}

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);
};

export default AppRoutes;