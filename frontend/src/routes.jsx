import { Route, Navigate, Outlet } from 'react-router-dom';
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import DashBoard from './components/dashboard';
import ManageUsers from './components/manage-users/manage-users';
import CreateOrEditUser from './components/create-or-edit-user/create-or-edit-user';
import Roles from './components/roles/roles';
import Permissions from './components/permissions/permissions';
import CreateOrEditRole from './components/create-or-edit-role/create-or-edit-role';
import CreateOrEditPermission from './components/create-or-edit-permission/create-or-edit-permission';
import ManageProducts from './components/manage-products/manage-products';
import CreateOrEditProduct from './components/create-or-edit-product/create-or-edit-product';
import Test from './components/test';
import NoPermission from './components/no-permission';
import NotFound from './components/not-found';
import Layout from './components/layout/layout';
import { useAuth } from './contexts/auth-context';

const AuthProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const PermissionProtectedRoute = ({ requiredPermission, requiredAnyPermissions, children }) => {
  const { isAuthenticated, isLoading, isAdmin, hasPermission, hasAnyPermission } = useAuth();

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin()) {
    return children;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/no-permission" replace />;
  }

  if (requiredAnyPermissions && !hasAnyPermission(requiredAnyPermissions)) {
    return <Navigate to="/no-permission" replace />;
  }

  return children;
};

const PublicRoutes = () => {
  return <Outlet />;
};

const permissionProtectedRoutes = [
  {
    path: '/users',
    element: <ManageUsers />,
    requiredPermission: 'users.index',
  },
  {
    path: '/users/add',
    element: <CreateOrEditUser />,
    requiredPermission: 'users.store',
  },
  {
    path: '/users/edit/:id',
    element: <CreateOrEditUser />,
    requiredPermission: 'users.edit',
  },
  {
    path: '/roles',
    element: <Roles />,
    requiredPermission: 'roles.index',
  },
  {
    path: '/roles/add',
    element: <CreateOrEditRole />,
    requiredPermission: 'roles.store',
  },
  {
    path: '/roles/edit/:role',
    element: <CreateOrEditRole />,
    requiredPermission: 'roles.edit',
  },
  {
    path: '/permissions',
    element: <Permissions />,
    requiredPermission: 'permissions.index',
  },
  {
    path: '/permissions/add',
    element: <CreateOrEditPermission />,
    requiredPermission: 'permissions.store',
  },
  {
    path: '/permissions/edit/:id',
    element: <CreateOrEditPermission />,
    requiredPermission: 'permissions.edit',
  },
  {
    path: '/products',
    element: <ManageProducts />,
    requiredPermission: 'products.index',
  },
  {
    path: '/products/add',
    element: <CreateOrEditProduct />,
    requiredPermission: 'products.store',
  },
  {
    path: '/products/edit/:id',
    element: <CreateOrEditProduct />,
    requiredPermission: 'products.edit',
  }
];

const authProtectedRoutes = [
  {
    path: '/logout',
    element: <Logout />,
  },
  {
    path: '/no-permission',
    element: <NoPermission />,
  },
  {
    path: '/test',
    element: <Test />,
  }
];

const routes = (
  <>
    <Route element={<PublicRoutes />}>
      <Route path="/login" element={<Login />} />
    </Route>

    <Route element={<Layout />}>
      {permissionProtectedRoutes.map(({ path, element, requiredPermission, requiredAnyPermissions }) => (
        <Route
          key={path}
          path={path}
          element={
            <PermissionProtectedRoute
              requiredPermission={requiredPermission}
              requiredAnyPermissions={requiredAnyPermissions}
            >
              {element}
            </PermissionProtectedRoute>
          }
        />
      ))}
    </Route>

    <Route element={<AuthProtectedRoute />}>
      <Route element={<Layout />}>
        <Route path="/" element={<DashBoard />}></Route>
      </Route>
      {authProtectedRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
    </Route>
    <Route path="*" element={<NotFound />} />
  </>
);

export default routes;