import { lazy } from 'react';

const NoPermission = lazy(() => import('../components/no-permission'));

export const userRoutesConfig = [
    {
        path: '/no-permission',
        element: NoPermission,
        requireAuth: true,
        layout: true,
        title: 'Không có quyền truy cập',
    },
];