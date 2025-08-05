import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '~/hooks/user/use-auth';
import PreLoader from '../ui/pre-loader';

const ProtectedRoute = ({
    children,
    requireAuth = true,
    isVerified = false,
}) => {
    const {
        isVerifiedEmail,
        isAuthenticated,
        isLoading,
    } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <PreLoader />;
    }

    if (location.pathname !== "/dang-xuat" && requireAuth && !isAuthenticated) {
        return <Navigate to="/dang-nhap" state={{ from: location, error: "Bạn chưa đăng nhập." }} replace />;
    }

    if (!requireAuth && isAuthenticated && location.pathname === "/dang-nhap") {
        return <Navigate to="/" state={{ error: "Bạn đang đăng nhập rồi." }} replace />;
    }

    if (requireAuth && isVerified && isVerifiedEmail) {
        return <Navigate to="/khong-co-quyen" state={{ error: "Bạn không có quyền vô trang này." }} replace />;
    }

    return children;
};

export default ProtectedRoute;