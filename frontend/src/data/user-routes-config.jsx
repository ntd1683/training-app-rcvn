import { lazy } from 'react';

const NoPermission = lazy(() => import('../components/no-permission'));
const Home = lazy(() => import('../components/user/home'));
const Login = lazy(() => import('../components/user/auth/login'))
const Register = lazy(() => import('../components/user/auth/register'));
const VerifyEmail = lazy(() => import('../components/user/auth/verify-email'));
const ForgotPassword = lazy(() => import('../components/user/auth/forgot-password'));
const ChangeResetPassword = lazy(() => import('../components/user/auth/change-reset-password'));

export const userRoutesConfig = [
    {
        path: '/',
        element: Home,
        requireAuth: false,
        layout: true,
        title: 'Trang Chủ',
    },
    {
        path: '/dang-nhap',
        element: Login,
        requireAuth: false,
        layout: true,
        title: 'Đăng Nhập',
    },
    {
        path: '/dang-ky',
        element: Register,
        requireAuth: false,
        layout: true,
        title: 'Đăng Ký',
    },
    {
        path: '/xac-thuc-email/:token',
        element: VerifyEmail,
        requireAuth: false,
        layout: true,
        title: 'Xác Thực Email',
    },
    {
        path: '/quen-mat-khau',
        element: ForgotPassword,
        requireAuth: false,
        layout: true,
        title: 'Quên Mật Khẩu',
    },
    {
        path: '/khoi-phuc-mat-khau/:token',
        element: ChangeResetPassword,
        requireAuth: false,
        layout: true,
        title: 'Khôi Phục Mật Khẩu',
    },
    {
        path: '/no-permission',
        element: NoPermission,
        requireAuth: true,
        layout: true,
        title: 'Không có quyền truy cập',
    },
];