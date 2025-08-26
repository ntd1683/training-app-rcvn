import { lazy } from 'react';

const Dashboard = lazy(() => import('../components/admin/dashboard'));
const ManageUsers = lazy(() => import('../components/admin/manage-users/manage-users'));
const CreateOrEditUser = lazy(() => import('../components/admin/create-or-edit-user/create-or-edit-user'));
const Roles = lazy(() => import('../components/admin/roles/roles'));
const CreateOrEditRole = lazy(() => import('../components/admin/create-or-edit-role/create-or-edit-role'));
const Permissions = lazy(() => import('../components/admin/permissions/permissions'));
const CreateOrEditPermission = lazy(() => import('../components/admin/create-or-edit-permission/create-or-edit-permission'));
const ManageProducts = lazy(() => import('../components/admin/manage-products/manage-products'));
const CreateOrEditProduct = lazy(() => import('../components/admin/create-or-edit-product/create-or-edit-product'));
const NoPermission = lazy(() => import('../components/no-permission'));
const ManageCustomers = lazy(() => import('../components/admin/manage-customers'));
const CreateOrEditCustomer = lazy(() => import('../components/admin/create-or-edit-customer'));

export const adminRoutesConfig = [
    {
        path: '/',
        element: Dashboard,
        requireAuth: true,
        layout: true,
        title: 'Dashboard',
    },

    // User Management
    {
        path: '/users',
        element: ManageUsers,
        requireAuth: true,
        layout: true,
        permissions: ['users.index'],
        title: 'Quản lý người dùng',
    },
    {
        path: '/users/add',
        element: CreateOrEditUser,
        requireAuth: true,
        layout: true,
        permissions: ['users.store'],
        title: 'Thêm người dùng',
    },
    {
        path: '/users/edit/:id',
        element: CreateOrEditUser,
        requireAuth: true,
        layout: true,
        permissions: ['users.edit'],
        title: 'Sửa người dùng',
    },

    // Role Management
    {
        path: '/roles',
        element: Roles,
        requireAuth: true,
        layout: true,
        permissions: ['roles.index'],
        title: 'Quản lý vai trò',
    },
    {
        path: '/roles/add',
        element: CreateOrEditRole,
        requireAuth: true,
        layout: true,
        permissions: ['roles.store'],
        title: 'Thêm vai trò',
    },
    {
        path: '/roles/edit/:role',
        element: CreateOrEditRole,
        requireAuth: true,
        layout: true,
        permissions: ['roles.edit'],
        title: 'Sửa vai trò',
    },

    // Permission Management
    {
        path: '/permissions',
        element: Permissions,
        requireAuth: true,
        layout: true,
        permissions: ['permissions.index'],
        title: 'Quản lý quyền',
    },
    {
        path: '/permissions/add',
        element: CreateOrEditPermission,
        requireAuth: true,
        layout: true,
        permissions: ['permissions.store'],
        title: 'Thêm quyền',
    },
    {
        path: '/permissions/edit/:id',
        element: CreateOrEditPermission,
        requireAuth: true,
        layout: true,
        permissions: ['permissions.edit'],
        title: 'Sửa quyền',
    },

    // Product Management
    {
        path: '/products',
        element: ManageProducts,
        requireAuth: true,
        layout: true,
        permissions: ['products.index'],
        title: 'Quản lý sản phẩm',
    },
    {
        path: '/products/add',
        element: CreateOrEditProduct,
        requireAuth: true,
        layout: true,
        permissions: ['products.store'],
        title: 'Thêm sản phẩm',
    },
    {
        path: '/products/edit/:id',
        element: CreateOrEditProduct,
        requireAuth: true,
        layout: true,
        permissions: ['products.edit'],
        title: 'Sửa sản phẩm',
    },
    {
        path: '/customers',
        element: ManageCustomers,
        requireAuth: true,
        layout: true,
        permissions: ['customers.index'],
        title: 'Quản lý khách hàng',
    },
    {
        path: '/customers/add',
        element: CreateOrEditCustomer,
        requireAuth: true,
        layout: true,
        permissions: ['customers.store'],
        title: 'Thêm khách hàng',
    },
    {
        path: '/customers/edit/:id',
        element: CreateOrEditCustomer,
        requireAuth: true,
        layout: true,
        permissions: ['customers.edit'],
        title: 'Sửa khách hàng',
    },
    // Other routes
    {
        path: '/no-permission',
        element: NoPermission,
        requireAuth: true,
        layout: true,
        title: 'Không có quyền truy cập',
    },
];