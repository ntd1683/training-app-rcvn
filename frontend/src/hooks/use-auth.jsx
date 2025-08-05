import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectIsAuthenticated,
    selectIsLoginAdmin,
    selectUser,
    selectPermissions,
    selectAuthLoading,
    selectAuthErrors,
    selectIsAdmin,
} from '../redux/selectors/auth-selector';
import {
    initializeAuth,
    loginUser,
    registerUser,
    logoutUser,
    verifyEmailCustomer,
    resetPasswordCustomer,
    changeResetPasswordCustomer,
} from '../redux/slices/auth-slice';

export const useAuth = () => {
    const dispatch = useDispatch();

    // Selectors
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isLoginAdmin = useSelector(selectIsLoginAdmin);
    const user = useSelector(selectUser);
    const permissions = useSelector(selectPermissions);
    const loading = useSelector(selectAuthLoading);
    const errors = useSelector(selectAuthErrors);
    const isAdmin = useSelector(selectIsAdmin);

    // Actions
    const initialize = useCallback(() => {
        dispatch(initializeAuth());
    }, [dispatch]);

    const handleLogin = useCallback(async (email, password, remember, isAdmin) => {
        const result = await dispatch(loginUser({ email, password, remember, isAdmin }));
        return {
            success: loginUser.fulfilled.match(result),
            message: result.payload?.message || (loginUser.rejected.match(result) ? result.payload : null)
        };
    }, [dispatch]);

    const handleRegister = useCallback(async (fullName, email, password, rePassword) => {
        const result = await dispatch(registerUser({ fullName, email, password, rePassword }));
        return {
            success: registerUser.fulfilled.match(result),
            message: result.payload?.message || (registerUser.rejected.match(result) ? result.payload : null)
        };
    }, [dispatch]);

    const handleVerifyEmailCustomer = useCallback(async (token) => {
        const result = await dispatch(verifyEmailCustomer({ token }));

        return {
            success: verifyEmailCustomer.fulfilled.match(result),
            message: result.payload?.message || (verifyEmailCustomer.rejected.match(result) ? result.payload : null)
        };
    }, [dispatch]);

    const handleResetPassword = useCallback(async (email) => {
        const result = await dispatch(resetPasswordCustomer({ email }));

        return {
            success: resetPasswordCustomer.fulfilled.match(result),
            message: result.payload?.message || (resetPasswordCustomer.rejected.match(result) ? result.payload : null)
        };
    }, [dispatch]);

    const handleChangeResetPassword = useCallback(async (email, password, rePassword, token) => {
        const result = await dispatch(changeResetPasswordCustomer({ email, password, rePassword, token }));

        return {
            success: changeResetPasswordCustomer.fulfilled.match(result),
            message: result.payload?.message || (changeResetPasswordCustomer.rejected.match(result) ? result.payload : null)
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
        isLoginAdmin,
        user,
        permissions,
        isAdmin,
        ...loading,
        ...errors,

        // Actions
        initialize,
        handleLogin,
        handleRegister,
        handleVerifyEmailCustomer,
        handleResetPassword,
        handleChangeResetPassword,
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
    const isLoginAdmin = useSelector(selectIsLoginAdmin);

    return useMemo(() => ({
        user,
        isAdmin,
        isAuthenticated,
        isLoginAdmin,
    }), [user, isAdmin, isAuthenticated, isLoginAdmin]);
};