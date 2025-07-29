import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/route/protected-route';
// import Layout from '../components/layout/layout';
// import LoadingSpinner from '../components/ui/loading-spinner';
// import Logout from '../components/auth/logout';
import NotFound from '../components/not-found';
import { userRoutesConfig } from '../data/user-routes-config';
import PreLoader from '../components/user/ui/pre-loader';
import Layout from '../components/user/layout/layout';
import '../assets/css/user/main.css'
import '../assets/css/user/line-icon.css';


const UserRoutes = () => {
  return (
    <Suspense
      fallback={
        <PreLoader />
      }
    >
      <Routes>
        {/* <Route
          path="/login"
          element={
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          }
        /> */}
        {/* <Route path="/logout" element={<Logout />} /> */}

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