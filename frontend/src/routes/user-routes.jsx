import React, { Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/user/route/protected-route';
import NotFound from '../components/not-found';
import { userRoutesConfig } from '../data/user-routes-config';
import PreLoader from '../components/user/ui/pre-loader';
import Layout from '../components/user/layout/layout';
import Logout from '../components/user/auth/logout';
import '../assets/css/user/main.css'
import '../assets/css/user/line-icon.css';
import { useAuth } from '../hooks/user/use-auth';

const UserRoutes = () => {
  const { initialize } = useAuth();
  useEffect(() => {
    initialize();
  }, [initialize]);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 100);
  }, [pathname]);

  return (
    <Suspense
      fallback={
        <PreLoader />
      }
    >
      <Routes>
        <Route path="/dang-xuat" element={<Logout />} />

        {userRoutesConfig.map((route, index) => {
          const { path, element: Component, requireAuth, layout, permissions, adminOnly } = route;

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

          return <Route key={index} path={path} element={routeElement} />;
        })}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default UserRoutes;