import { lazy } from 'react';

const Dashboard = lazy(() => import('../components/dashboard'));
const NoPermission = lazy(() => import('../components/no-permission'));

export const userRoutesConfig = [
    {
        path: '/',
        element: Dashboard,
        requireAuth: true,
        layout: true,
        title: 'Dashboard',
    },
    {
        path: '/no-permission',
        element: NoPermission,
        requireAuth: true,
        layout: true,
        title: 'Không có quyền truy cập',
    },
];