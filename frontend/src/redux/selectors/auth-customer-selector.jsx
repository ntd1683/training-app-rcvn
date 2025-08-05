import { createSelector } from '@reduxjs/toolkit';

const selectAuthState = (state) => state.auth_customer;

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

export const selectAuthInfo = createSelector(
    [selectIsAuthenticated, selectUser, selectPermissions, selectAuthLoading],
    (isAuthenticated, user, permissions, loading) => ({
        isAuthenticated,
        user,
        permissions,
        ...loading,
    })
);

export const selectIsVerifiedEmail = createSelector(
    [selectUser],
    (user) => user && user.email_verified_at !== null
);

export const selectTotalProducts = createSelector(
    [selectUser],
    (user) => user && user.total_products ? user.total_products : 0
);

export const selectTotalPrice = createSelector(
    [selectUser],
    (user) => user && user.total_price ? user.total_price : 0
);