import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectIsAuthenticated,
    selectCustomer,
    selectIsVerifiedEmail,
    selectAuthLoading,
    selectAuthErrors,
} from '../../redux/selectors/auth-customer-selector';
import {
    initializeAuth,
    loginUser,
    registerUser,
    logoutUser,
    verifyEmailCustomer,
    sendVerifyEmailCustomer,
    resetPasswordCustomer,
    changeResetPasswordCustomer,
    getProfile,
    updateProfile,
    oauth2TokenVerify,
} from '../../redux/slices/auth-customer-slice';

export const useAuth = () => {
    const dispatch = useDispatch();

    // Selectors
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const customer = useSelector(selectCustomer);
    const isVerifiedEmail = useSelector(selectIsVerifiedEmail);
    const loading = useSelector(selectAuthLoading);
    const errors = useSelector(selectAuthErrors);

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

    const handleVerifyTokenOauth2 = useCallback(async (idToken) => {
        const result = await dispatch(oauth2TokenVerify(idToken));
        dispatch(initializeAuth());
        return {
            success: oauth2TokenVerify.fulfilled.match(result),
            message: result.payload?.message || (oauth2TokenVerify.rejected.match(result) ? result.payload : null)
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

    const handleGetProfile = useCallback(async () => {
        await dispatch(getProfile());
    }, [dispatch]);

    const handleUpdateProfile = useCallback(async (data) => {
        const result = await dispatch(updateProfile({data}));
        return {
            success: updateProfile.fulfilled.match(result),
            message: result.payload?.message || (updateProfile.rejected.match(result) ? result.payload : null)
        };
    }, [dispatch]);

    const handleSendVerificationEmail = useCallback(async () => {
        const result = await dispatch(sendVerifyEmailCustomer());

        return {
            success: sendVerifyEmailCustomer.fulfilled.match(result),
            message: result.payload?.message || (sendVerifyEmailCustomer.rejected.match(result) ? result.payload : null)
        };
    }, [dispatch]);

    return {
        // State
        isAuthenticated,
        customer,
        isVerifiedEmail,
        ...loading,
        ...errors,

        // Actions
        initialize,
        handleLogin,
        handleVerifyTokenOauth2,
        handleRegister,
        handleVerifyEmailCustomer,
        handleResetPassword,
        handleChangeResetPassword,
        handleGetProfile,
        handleUpdateProfile,
        handleSendVerificationEmail,
        handleLogout,
    };
};

export const useUserInfo = () => {
    const customer = useSelector(selectCustomer);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    return useMemo(() => ({
        customer,
        isAuthenticated,
    }), [
        customer, isAuthenticated
    ]);
};