import { Route, Navigate, Outlet } from 'react-router-dom';
import Login from '../pages/auth/login';
import ManageUsers from '../pages/users/manage-users';
import NoPermission from '../pages/no-permission';
import { useAuth } from '../context/auth-context';

const ProtectedRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoutes = () => {
  return <Outlet />;
};

const routes = (
  <>
    <Route element={<PublicRoutes />}>
      {/* <Route element={<PublicLayout />}> */}
        <Route path="/login" element={<Login />} />
      {/* </Route> */}
    </Route>

    <Route element={<ProtectedRoutes />}>
      <Route path="/users" element={<ManageUsers />} />
    </Route>
    <Route path="*" element={<NoPermission />} />
  </>
);

export default routes;