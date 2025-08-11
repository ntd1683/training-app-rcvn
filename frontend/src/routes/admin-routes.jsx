import React, { Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../hooks/admin/use-auth';
import ProtectedRoute from '../components/admin/route/protected-route';
import Layout from '../components/admin/layout/layout';
import LoadingSpinner from '../components/admin/ui/loading-spinner';
import NotFound from '../components/not-found';
import { adminRoutesConfig } from '../data/admin-routes-config';
import Login from '../components/admin/auth/login';
import Logout from '../components/admin/auth/logout';

const AdminRoutes = () => {
    const { initialize } = useAuth();
    useEffect(() => {
        initialize();
    }, [initialize]);

    return (
        <Suspense
            fallback={
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <LoadingSpinner />
                </div>
            }
        >
            <Routes>
                <Route
                    path="/login"
                    element={
                        <ProtectedRoute requireAuth={false}>
                            <Login />
                        </ProtectedRoute>
                    }
                />

                <Route path="/logout" element={<Logout />} />
                {adminRoutesConfig.map((route, index) => {
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

export default AdminRoutes;