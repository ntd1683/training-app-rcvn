import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '~/hooks/use-auth';
import LoadingSpinner from '../admin/ui/loading-spinner';
import { getUrlPrefix } from '../../utils/common';

const ProtectedRoute = ({
    children,
    requireAuth = true,
    requiredPermissions = [],
    requireAllPermissions = false,
    adminOnly = false,
    requireLoginAdmin = false
}) => {
    const {
        isAuthenticated,
        isLoginAdmin,
        isLoading,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        isAdmin
    } = useAuth();
    const location = useLocation();
    const urlPrefix = getUrlPrefix(location) === 'admin' ? '/admin' : '';

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <LoadingSpinner />
            </div>
        );
    }

    if (requireAuth && requireLoginAdmin && !isLoginAdmin) {
        return <Navigate to={`${urlPrefix}/login`} state={{ from: location, error: "Bạn chưa đăng nhập với tư cách quản trị viên." }} replace />;
    }

    if (location.pathname !== `${urlPrefix}/logout` && requireAuth && !isAuthenticated) {
        return <Navigate to={`${urlPrefix}/login`} state={{ from: location, error: "Bạn chưa đăng nhập." }} replace />;
    }

    if (!requireAuth && isAuthenticated && location.pathname === `${urlPrefix}/login`) {
        return <Navigate to={`${urlPrefix}`} state={{ error: "Bạn đang đăng nhập rồi." }} replace />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to={`${urlPrefix}/no-permission`} state={{ error: "Bạn không có quyền vô trang này." }} replace />;
    }

    if (requiredPermissions.length > 0) {
        const hasRequiredPermissions = requireAllPermissions
            ? hasAllPermissions(requiredPermissions)
            : hasAnyPermission(requiredPermissions);

        if (!hasRequiredPermissions && !isAdmin) {
            return <Navigate to={`${urlPrefix}/no-permission`} state={{ error: "Bạn không có quyền vô trang này." }} replace />;
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