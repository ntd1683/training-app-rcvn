import { Route, Navigate, Outlet } from 'react-router-dom';
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import ManageUsers from './components/manage-users/manage-users';
import CreateOrEditUser from './components/create-user/create-or-edit-user';
import NoPermission from './components/no-permission';
import Layout from './components/layout/layout';
import { useAuth } from './contexts/auth-context';
import { ROLES } from './constants/roles';

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, isLoading, groupRole } = useAuth();

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(groupRole)) {
    return <Navigate to="/no-permission" replace />;
  }

  return children;
};

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

const PublicRoutes = () => {
  return <Outlet />;
};

const roleProtectedRoutes = [
  {
    path: '/users',
    element: <ManageUsers />,
    allowedRoles: [ROLES.ADMIN],
  },
  {
    path: '/users/add',
    element: <CreateOrEditUser />,
    allowedRoles: [ROLES.ADMIN, ROLES.EDITOR],
  },
  {
    path: '/users/edit/:id',
    element: <CreateOrEditUser />,
    allowedRoles: [ROLES.ADMIN, ROLES.EDITOR],
  },
];

const authProtectedRoutes = [
  {
    path: '/logout',
    element: <Logout />,
  },
];

const routes = (
  <>
    <Route element={<PublicRoutes />}>
        <Route path="/login" element={<Login />} />
    </Route>

    <Route element={<Layout />}>

    </Route>

      <Route element={<Layout />}>
        {roleProtectedRoutes.map(({ path, element, allowedRoles }) => (
          <Route
            key={path}
            path={path}
            element={<RoleProtectedRoute allowedRoles={allowedRoles}>{element}</RoleProtectedRoute>}
          />
        ))}
      </Route>

      <Route element={<AuthProtectedRoute />}>
        {authProtectedRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>
    <Route path="*" element={<NoPermission />} />
  </>
);

export default routes;