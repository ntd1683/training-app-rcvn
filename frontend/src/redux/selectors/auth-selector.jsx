import { createSelector } from '@reduxjs/toolkit';
import RoleMain from '~/constants/role-main';

const selectAuthState = (state) => state.auth;

export const selectIsAuthenticated = createSelector(
    [selectAuthState],
    (auth) => auth.isAuthenticated
);

export const selectUser = createSelector(
    [selectAuthState],
    (auth) => auth.user
);

export const selectPermissions = createSelector(
    [selectAuthState],
    (auth) => auth.permissions
);

export const selectAuthLoading = createSelector(
    [selectAuthState],
    (auth) => ({
        isLoading: auth.isLoading,
        isLoginLoading: auth.isLoginLoading,
        isLogoutLoading: auth.isLogoutLoading,
    })
);

export const selectAuthErrors = createSelector(
    [selectAuthState],
    (auth) => ({
        errorEmail: auth.errorEmail,
        errorPassword: auth.errorPassword,
        authError: auth.authError,
    })
);

export const selectHasPermission = createSelector(
    [selectPermissions, (_, permission) => permission],
    (permissions, permission) => permissions.includes(permission)
);

export const selectHasAnyPermission = createSelector(
    [selectPermissions, (_, permissionList) => permissionList],
    (permissions, permissionList) =>
        permissionList.some(permission => permissions.includes(permission))
);

export const selectHasAllPermissions = createSelector(
    [selectPermissions, (_, permissionList) => permissionList],
    (permissions, permissionList) =>
        permissionList.every(permission => permissions.includes(permission))
);

export const selectIsLoginAdmin = createSelector(
    [selectAuthState],
    (auth) => auth.isLoginAdmin
);

export const selectIsAdmin = createSelector(
    [selectUser],
    (user) => user && RoleMain.getValue(user.group_role) >= RoleMain.Admin
);

export const selectAuthInfo = createSelector(
    [selectIsAuthenticated, selectUser, selectPermissions, selectAuthLoading],
    (isAuthenticated, user, permissions, loading) => ({
        isAuthenticated,
        user,
        permissions,
        ...loading,
    })
);

export const isVerifiedEmail = createSelector(
    [selectUser],
    (user) => user && user.email_verified_at !== null
);