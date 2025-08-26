import { createSelector } from '@reduxjs/toolkit';

const selectAuthState = (state) => state.auth_customer;

export const selectIsAuthenticated = createSelector(
    [selectAuthState],
    (auth) => auth.isAuthenticated
);

export const selectCustomer = createSelector(
    [selectAuthState],
    (auth) => auth.customer
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
        isUpdateLoading: auth.isUpdateLoading,
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
    [selectIsAuthenticated, selectCustomer, selectPermissions, selectAuthLoading],
    (isAuthenticated, customer, permissions, loading) => ({
        isAuthenticated,
        customer,
        permissions,
        ...loading,
    })
);

export const selectIsVerifiedEmail = createSelector(
    [selectCustomer],
    (customer) => customer && customer.email_verified_at !== null
);

export const selectTotalProducts = createSelector(
    [selectCustomer],
    (customer) => customer && customer.total_orders ? customer.total_orders : 0
);

export const selectTotalSpent = createSelector(
    [selectCustomer],
    (customer) => customer && customer.total_spent ? customer.total_spent : 0
);