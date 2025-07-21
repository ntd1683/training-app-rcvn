import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectIsAuthenticated,
    selectUser,
    selectPermissions,
    selectAuthLoading,
    selectAuthErrors,
    selectIsAdmin,
} from '../redux/selectors/auth-selector';
import {
    initializeAuth,
    loginUser,
    logoutUser,
} from '../redux/slices/auth-slice';

export const useAuth = () => {
    const dispatch = useDispatch();

    // Selectors
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);
    const permissions = useSelector(selectPermissions);
    const loading = useSelector(selectAuthLoading);
    const errors = useSelector(selectAuthErrors);
    const isAdmin = useSelector(selectIsAdmin);

    // Actions
    const initialize = useCallback(() => {
        dispatch(initializeAuth());
    }, [dispatch]);

    const handleLogin = useCallback(async (email, password, remember) => {
        const result = await dispatch(loginUser({ email, password, remember }));
        return {
            success: loginUser.fulfilled.match(result),
            message: result.payload?.message || (loginUser.rejected.match(result) ? result.payload : null)
        };
    }, [dispatch]);

    const handleLogout = useCallback(async () => {
        await dispatch(logoutUser());
    }, [dispatch]);

    // Permission helpers
    const hasPermission = useCallback((permission) => {
        return permissions.includes(permission);
    }, [permissions]);

    const hasAnyPermission = useCallback((permissionList) => {
        return permissionList.some(permission => permissions.includes(permission));
    }, [permissions]);

    const hasAllPermissions = useCallback((permissionList) => {
        return permissionList.every(permission => permissions.includes(permission));
    }, [permissions]);

    return {
        // State
        isAuthenticated,
        user,
        permissions,
        isAdmin,
        ...loading,
        ...errors,

        // Actions
        initialize,
        handleLogin,
        handleLogout,

        // Permission helpers
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
    };
};

export const usePermissions = () => {
const permissions = useSelector(selectPermissions);

return useMemo(() => ({
  permissions,
  hasPermission: (permission) => permissions.includes(permission),
  hasAnyPermission: (permissionList) => permissionList.some(permission => permissions.includes(permission)),
  hasAllPermissions: (permissionList) => permissionList.every(permission => permissions.includes(permission)),
}), [permissions]);
};

export const useUserInfo = () => {
    const user = useSelector(selectUser);
    const isAdmin = useSelector(selectIsAdmin);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    return useMemo(() => ({
        user,
        isAdmin,
        isAuthenticated,
    }), [user, isAdmin, isAuthenticated]);
};