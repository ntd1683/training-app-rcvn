import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';
import LoadingSpinner from '../ui/loading-spinner';

const ProtectedRoute = ({
    children,
    requireAuth = true,
    requiredPermissions = [],
    requireAllPermissions = false,
    adminOnly = false
}) => {
    const {
        isAuthenticated,
        isLoading,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        isAdmin
    } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <LoadingSpinner />
            </div>
        );
    }

    if (location.pathname !== '/logout' && requireAuth && !isAuthenticated) {
        return <Navigate to="/login" state={{ from: location, error: "Bạn chưa đăng nhập." }} replace />;
    }

    if (!requireAuth && isAuthenticated && location.pathname === '/login') {
        return <Navigate to="/" state={{ error: "Bạn đang đăng nhập rồi." }} replace />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/no-permission" state={{ error: "Bạn không có quyền vô trang này." }} replace />;
    }

    if (requiredPermissions.length > 0) {
        const hasRequiredPermissions = requireAllPermissions
            ? hasAllPermissions(requiredPermissions)
            : hasAnyPermission(requiredPermissions);

        if (!hasRequiredPermissions && !isAdmin) {
            return <Navigate to="/no-permission" state={{ error: "Bạn không có quyền vô trang này." }} replace />;
        }
    }

    return children;
};

export const withAuth = (Component, options = {}) => {
    return (props) => (
        <ProtectedRoute {...options}>
            <Component {...props} />
        </ProtectedRoute>
    );
};

// Permission-based component wrapper
export const PermissionWrapper = ({
    children,
    permission,
    permissions = [],
    requireAll = false,
    fallback = null
}) => {
    const { hasPermission, hasAnyPermission, hasAllPermissions, isAdmin } = useAuth();

    let hasAccess = true;

    // Admin has all permissions
    if (isAdmin) {
        return children;
    }

    if (permission) {
        hasAccess = hasPermission(permission);
    } else if (permissions.length > 0) {
        hasAccess = requireAll
            ? hasAllPermissions(permissions)
            : hasAnyPermission(permissions);
    }

    return hasAccess ? children : fallback;
};

export default ProtectedRoute;